import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword, signAdminSession, verifyAdminSession } from "@/lib/security";
import {
  getTrustedClientIp,
  isIpBlocked,
  checkRateLimit,
  logLoginAttempt,
} from "@/lib/ip-security";

export async function POST(req: NextRequest) {
  const clientIP = getTrustedClientIp(req.headers);
  const userAgent = req.headers.get("user-agent") || null;
  const requestId = req.headers.get("x-request-id") || `req_${Date.now()}`;

  try {
    // 1. Check if the originating IP address is currently blocked
    const { isBlocked, blockRecord } = await isIpBlocked(clientIP);
    if (isBlocked) {
      await logLoginAttempt({
        ipAddress: clientIP,
        attemptedIdentifier: "(blocked)",
        status: "BLOCKED",
        failureReason: "IP_BLOCKED",
        userAgent,
        requestId,
      });

      return NextResponse.json(
        {
          error: "Access denied. Your IP address has been restricted from administrative access.",
        },
        { status: 403 }
      );
    }

    // 2. Check rate limiting against brute-force attacks (5 failed attempts within 15 mins)
    const { isRateLimited, retryAfterSeconds } = await checkRateLimit(clientIP, 5, 15);
    if (isRateLimited) {
      await logLoginAttempt({
        ipAddress: clientIP,
        attemptedIdentifier: "(rate_limited)",
        status: "RATE_LIMITED",
        failureReason: "RATE_LIMITED",
        userAgent,
        requestId,
      });

      return NextResponse.json(
        {
          error: "Too many failed login attempts. Please try again later.",
          retryAfter: retryAfterSeconds,
        },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSeconds) },
        }
      );
    }

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      await logLoginAttempt({
        ipAddress: clientIP,
        attemptedIdentifier: "(malformed_json)",
        status: "FAILED",
        failureReason: "INVALID_INPUT",
        userAgent,
        requestId,
      });
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    const { email, password } = body;
    const identifier = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!identifier || !password) {
      await logLoginAttempt({
        ipAddress: clientIP,
        attemptedIdentifier: identifier || "(empty)",
        status: "FAILED",
        failureReason: "INVALID_INPUT",
        userAgent,
        requestId,
      });
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email: identifier },
    });

    if (!admin) {
      await logLoginAttempt({
        ipAddress: clientIP,
        attemptedIdentifier: identifier,
        status: "FAILED",
        failureReason: "INVALID_CREDENTIALS",
        userAgent,
        requestId,
      });
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const isValid = verifyPassword(password, admin.passwordHash);
    if (!isValid) {
      await logLoginAttempt({
        ipAddress: clientIP,
        attemptedIdentifier: identifier,
        userId: admin.id,
        status: "FAILED",
        failureReason: "INVALID_CREDENTIALS",
        userAgent,
        requestId,
      });
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // 3. Successful authentication: log attempt and issue session
    await logLoginAttempt({
      ipAddress: clientIP,
      attemptedIdentifier: identifier,
      userId: admin.id,
      status: "SUCCESS",
      userAgent,
      requestId,
    });

    const token = signAdminSession({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    // Record login in general audit log
    await prisma.adminAuditLog.create({
      data: {
        adminEmail: admin.email,
        action: "ADMIN_LOGIN",
        entityType: "AdminUser",
        entityId: admin.id,
        details: "Administrator authenticated successfully",
        ipAddress: clientIP,
      },
    });

    const response = NextResponse.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Admin auth login error:", error);
    await logLoginAttempt({
      ipAddress: clientIP,
      attemptedIdentifier: "(server_error)",
      status: "FAILED",
      failureReason: "UNKNOWN",
      userAgent,
      requestId,
    });
    return NextResponse.json({ error: "Authentication failed." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    let token = "";
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      token = req.cookies.get("admin_session")?.value || "";
    }

    const payload = verifyAdminSession(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized or session expired." }, { status: 401 });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!admin) {
      return NextResponse.json({ error: "User no longer exists." }, { status: 401 });
    }

    return NextResponse.json({ admin });
  } catch (error) {
    console.error("Admin auth verification error:", error);
    return NextResponse.json({ error: "Verification failed." }, { status: 500 });
  }
}
