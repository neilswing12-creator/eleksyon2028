import crypto from "crypto";

const HMAC_SECRET = process.env.SURVEY_HMAC_SECRET || "ph-2028-survey-hmac-keyed-secret-default";
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "ph-2028-admin-jwt-secret-default";

/**
 * Derives a privacy-preserving keyed identifier for an IP address using HMAC-SHA256.
 * The raw IP is never saved in the database or exposed.
 */
export function hashIP(ip: string): string {
  const normalized = (ip || "127.0.0.1").trim().toLowerCase();
  return crypto.createHmac("sha256", HMAC_SECRET).update(normalized).digest("hex");
}

/**
 * Generates a cryptographically strong, high-entropy 64-character token for the participant.
 */
export function generateManagementToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Hashes the management token with SHA-256 for safe database storage.
 */
export function hashManagementToken(token: string): string {
  return crypto.createHash("sha256").update(token.trim()).digest("hex");
}

/**
 * Secure password hashing using PBKDF2 with a random salt.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, combinedHash: string): boolean {
  try {
    const [salt, originalHash] = combinedHash.split(":");
    if (!salt || !originalHash) return false;
    const computedHash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
    return crypto.timingSafeEqual(Buffer.from(computedHash, "hex"), Buffer.from(originalHash, "hex"));
  } catch {
    return false;
  }
}

export interface AdminPayload {
  id: string;
  email: string;
  name: string;
  role: string;
  exp: number;
}

/**
 * Simple, tamper-proof signed session token using HMAC-SHA256.
 */
export function signAdminSession(admin: { id: string; email: string; name: string; role: string }): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payloadData: AdminPayload = {
    ...admin,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
  };
  const payload = Buffer.from(JSON.stringify(payloadData)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest("base64url");
  return `${header}.${payload}.${signature}`;
}

export function verifyAdminSession(token: string): AdminPayload | null {
  try {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, payload, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest("base64url");
    if (signature !== expectedSignature) return null;

    const data: AdminPayload = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    if (data.exp && data.exp < Math.floor(Date.now() / 1000)) {
      return null; // expired
    }
    return data;
  } catch {
    return null;
  }
}

/**
 * Extracts client IP from incoming Next.js Request
 */
export function getClientIP(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const list = forwarded.split(",");
    return list[0].trim();
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();
  return "127.0.0.1";
}
