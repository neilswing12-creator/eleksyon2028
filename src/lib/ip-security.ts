import net from "net";
import prisma from "@/lib/prisma";

export type LoginAttemptStatus = "SUCCESS" | "FAILED" | "BLOCKED" | "RATE_LIMITED";
export type LoginFailureReason =
  | "INVALID_CREDENTIALS"
  | "INVALID_INPUT"
  | "IP_BLOCKED"
  | "RATE_LIMITED"
  | "ACCOUNT_LOCKED"
  | "UNKNOWN";

export type BlockDuration = "1h" | "24h" | "7d" | "permanent" | number;

/**
 * Normalizes an IPv4 or IPv6 address.
 * Strips ports, normalizes IPv4-mapped IPv6 addresses, and lowercases IPv6.
 */
export function normalizeIp(raw?: string | null): string {
  if (!raw || typeof raw !== "string") return "UNKNOWN";
  let ip = raw.trim();

  // Strip port if formatted as [2001:db8::1]:8080 or 192.168.1.1:8080
  if (ip.startsWith("[") && ip.includes("]")) {
    const endBracket = ip.indexOf("]");
    ip = ip.substring(1, endBracket);
  } else if (ip.includes(":") && !ip.includes("::") && ip.split(":").length === 2) {
    // IPv4 with port like 192.168.1.1:3000
    const [host] = ip.split(":");
    if (net.isIPv4(host)) {
      ip = host;
    }
  }

  // Normalize IPv4-mapped IPv6 address (e.g., "::ffff:192.168.1.1" -> "192.168.1.1")
  if (ip.toLowerCase().startsWith("::ffff:")) {
    const mapped = ip.substring(7);
    if (net.isIPv4(mapped)) {
      ip = mapped;
    }
  }

  // Validate format
  if (net.isIPv4(ip)) {
    return ip;
  }
  if (net.isIPv6(ip)) {
    return ip.toLowerCase();
  }

  return "UNKNOWN";
}

/**
 * Resolves the genuine client IP address from request headers.
 * Uses trusted reverse proxy hierarchy (Cloudflare, X-Real-IP, Leftmost X-Forwarded-For).
 */
export function getTrustedClientIp(headers: Headers): string {
  // 1. Cloudflare connecting IP (trusted when behind Cloudflare proxy)
  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp) {
    const norm = normalizeIp(cfIp);
    if (norm !== "UNKNOWN") return norm;
  }

  // 2. Nginx / reverse proxy explicit single client IP
  const realIp = headers.get("x-real-ip");
  if (realIp) {
    const norm = normalizeIp(realIp);
    if (norm !== "UNKNOWN") return norm;
  }

  // 3. X-Forwarded-For: take the leftmost client address
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",");
    for (const part of parts) {
      const norm = normalizeIp(part.trim());
      if (norm !== "UNKNOWN" && norm !== "127.0.0.1" && norm !== "::1") {
        return norm;
      }
    }
    // If all were loopback, return first valid
    const first = normalizeIp(parts[0].trim());
    if (first !== "UNKNOWN") return first;
  }

  return "127.0.0.1";
}

/**
 * Checks whether an IP address is actively blocked in the database.
 * Automatically marks expired temporary blocks as EXPIRED.
 */
export async function isIpBlocked(
  ip: string
): Promise<{ isBlocked: boolean; blockRecord?: any }> {
  try {
    const normalized = normalizeIp(ip);
    if (normalized === "UNKNOWN") {
      return { isBlocked: false };
    }

    const activeBlock = await prisma.blockedIpAddress.findFirst({
      where: {
        ipAddress: normalized,
        status: "ACTIVE",
      },
      orderBy: { createdAt: "desc" },
    });

    if (!activeBlock) {
      return { isBlocked: false };
    }

    // Check if temporary block has expired
    if (activeBlock.expiresAt && activeBlock.expiresAt <= new Date()) {
      try {
        await prisma.blockedIpAddress.update({
          where: { id: activeBlock.id },
          data: { status: "EXPIRED" },
        });
      } catch (e) {
        // Safe ignore
      }
      return { isBlocked: false };
    }

    return { isBlocked: true, blockRecord: activeBlock };
  } catch (err) {
    console.warn("isIpBlocked check failed (database schema may be syncing):", err);
    return { isBlocked: false };
  }
}

/**
 * Verifies if an IP address has exceeded rate limits for failed login attempts.
 * Default: 5 failed attempts within 15 minutes.
 */
export async function checkRateLimit(
  ip: string,
  maxAttempts = 5,
  windowMinutes = 15
): Promise<{ isRateLimited: boolean; failedCount: number; retryAfterSeconds: number }> {
  try {
    const normalized = normalizeIp(ip);
    if (normalized === "UNKNOWN") {
      return { isRateLimited: false, failedCount: 0, retryAfterSeconds: 0 };
    }

    const since = new Date(Date.now() - windowMinutes * 60 * 1000);

    const failedCount = await prisma.adminLoginAttempt.count({
      where: {
        ipAddress: normalized,
        status: { in: ["FAILED", "RATE_LIMITED"] },
        createdAt: { gte: since },
      },
    });

    if (failedCount >= maxAttempts) {
      return {
        isRateLimited: true,
        failedCount,
        retryAfterSeconds: windowMinutes * 60,
      };
    }

    return { isRateLimited: false, failedCount, retryAfterSeconds: 0 };
  } catch (err) {
    console.warn("checkRateLimit evaluation failed (table may be syncing):", err);
    return { isRateLimited: false, failedCount: 0, retryAfterSeconds: 0 };
  }
}

/**
 * Records an auditable login attempt in the database.
 * Passwords and secret credentials are NEVER recorded.
 */
export async function logLoginAttempt(data: {
  ipAddress: string;
  attemptedIdentifier: string;
  userId?: string | null;
  status: LoginAttemptStatus;
  failureReason?: LoginFailureReason | string | null;
  userAgent?: string | null;
  requestId?: string | null;
}): Promise<any> {
  try {
    const normalizedIp = normalizeIp(data.ipAddress);
    const identifier = (data.attemptedIdentifier || "").trim().toLowerCase().slice(0, 200);

    return await prisma.adminLoginAttempt.create({
      data: {
        ipAddress: normalizedIp,
        attemptedIdentifier: identifier || "(empty)",
        userId: data.userId || null,
        status: data.status,
        failureReason: data.failureReason || null,
        userAgent: data.userAgent ? data.userAgent.slice(0, 500) : null,
        requestId: data.requestId || null,
      },
    });
  } catch (err) {
    console.warn("logLoginAttempt failed to record login audit:", err);
    return null;
  }
}

/**
 * Blocks an IP address with a reason and expiration period.
 */
export async function blockIp(data: {
  ipAddress: string;
  reason: string;
  duration: BlockDuration;
  adminId: string;
  adminEmail: string;
}): Promise<any> {
  const normalized = normalizeIp(data.ipAddress);
  if (normalized === "UNKNOWN") {
    throw new Error("Cannot block an invalid or unknown IP address.");
  }

  let expiresAt: Date | null = null;
  const now = Date.now();

  if (data.duration === "1h") {
    expiresAt = new Date(now + 60 * 60 * 1000);
  } else if (data.duration === "24h") {
    expiresAt = new Date(now + 24 * 60 * 60 * 1000);
  } else if (data.duration === "7d") {
    expiresAt = new Date(now + 7 * 24 * 60 * 60 * 1000);
  } else if (typeof data.duration === "number" && data.duration > 0) {
    expiresAt = new Date(now + data.duration * 1000);
  } else {
    // "permanent" or null
    expiresAt = null;
  }

  // Deactivate any existing active blocks for this IP
  await prisma.blockedIpAddress.updateMany({
    where: { ipAddress: normalized, status: "ACTIVE" },
    data: { status: "EXPIRED" },
  });

  const record = await prisma.blockedIpAddress.create({
    data: {
      ipAddress: normalized,
      reason: data.reason.trim(),
      adminId: data.adminId,
      adminEmail: data.adminEmail,
      status: "ACTIVE",
      expiresAt,
    },
  });

  // Record audit log
  await prisma.adminAuditLog.create({
    data: {
      adminEmail: data.adminEmail,
      action: "BLOCK_IP",
      entityType: "BlockedIpAddress",
      entityId: record.id,
      details: `Blocked IP ${normalized}. Reason: ${data.reason}. Duration: ${
        expiresAt ? `Expires ${expiresAt.toISOString()}` : "Permanent"
      }`,
      ipAddress: normalized,
    },
  });

  return record;
}

/**
 * Unblocks an IP address.
 */
export async function unblockIp(data: {
  id?: string;
  ipAddress?: string;
  reason?: string;
  adminEmail: string;
}): Promise<boolean> {
  let targetBlock: any = null;

  if (data.id) {
    targetBlock = await prisma.blockedIpAddress.findUnique({
      where: { id: data.id },
    });
  } else if (data.ipAddress) {
    const normalized = normalizeIp(data.ipAddress);
    targetBlock = await prisma.blockedIpAddress.findFirst({
      where: { ipAddress: normalized, status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    });
  }

  if (!targetBlock) {
    return false;
  }

  await prisma.blockedIpAddress.update({
    where: { id: targetBlock.id },
    data: {
      status: "UNBLOCKED",
      unblockedAt: new Date(),
      unblockedBy: data.adminEmail,
      unblockReason: data.reason?.trim() || "Manual unblock by administrator",
    },
  });

  // Also unblock any other active duplicate records for this IP
  if (targetBlock.ipAddress) {
    await prisma.blockedIpAddress.updateMany({
      where: {
        ipAddress: targetBlock.ipAddress,
        status: "ACTIVE",
        id: { not: targetBlock.id },
      },
      data: {
        status: "UNBLOCKED",
        unblockedAt: new Date(),
        unblockedBy: data.adminEmail,
        unblockReason: data.reason?.trim() || "Manual unblock by administrator",
      },
    });
  }

  // Record audit log
  await prisma.adminAuditLog.create({
    data: {
      adminEmail: data.adminEmail,
      action: "UNBLOCK_IP",
      entityType: "BlockedIpAddress",
      entityId: targetBlock.id,
      details: `Unblocked IP ${targetBlock.ipAddress}. Reason: ${
        data.reason?.trim() || "Manual unblock"
      }`,
      ipAddress: targetBlock.ipAddress,
    },
  });

  return true;
}

/**
 * Parse a user agent string into friendly browser and OS labels.
 */
export function parseUserAgent(ua?: string | null): { browser: string; os: string } {
  if (!ua) return { browser: "Unknown", os: "Unknown" };

  let browser = "Other";
  let os = "Other";

  if (ua.includes("Firefox/")) browser = "Firefox";
  else if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("Chrome/")) browser = "Chrome";
  else if (ua.includes("Safari/") && !ua.includes("Chrome/")) browser = "Safari";
  else if (ua.includes("PostmanRuntime")) browser = "Postman";
  else if (ua.includes("curl/")) browser = "cURL";

  if (ua.includes("Windows NT 10.0")) os = "Windows 10/11";
  else if (ua.includes("Windows NT")) os = "Windows";
  else if (ua.includes("Mac OS X")) os = "macOS";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Linux")) os = "Linux";

  return { browser, os };
}

export interface LogDuplicateAttemptParams {
  campaignId: string;
  ipAddress: string;
  ipHash: string;
  attemptedName?: string;
  rejectionReason: string; // DUPLICATE_ACTIVE_IP, CONCURRENT_DUPLICATE_IP, IP_BLOCKED, RATE_LIMITED
  existingSubmissionId?: string;
  userAgent?: string;
}

/**
 * Logs a duplicate survey submission attempt for authorized administrator auditing.
 */
export async function logDuplicateAttempt(params: LogDuplicateAttemptParams) {
  try {
    return await prisma.duplicateSubmissionAttempt.create({
      data: {
        campaignId: params.campaignId,
        ipAddress: normalizeIp(params.ipAddress),
        ipHash: params.ipHash,
        attemptedName: params.attemptedName ? params.attemptedName.slice(0, 150) : null,
        rejectionReason: params.rejectionReason,
        existingSubmissionId: params.existingSubmissionId || null,
        userAgent: params.userAgent ? params.userAgent.slice(0, 500) : null,
      },
    });
  } catch (err) {
    console.error("Failed to log duplicate submission attempt:", err);
    return null;
  }
}

