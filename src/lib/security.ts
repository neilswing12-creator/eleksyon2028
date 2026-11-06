import crypto from "crypto";
import { getTrustedClientIp, normalizeIp } from "@/lib/ip-security";

/**
 * Reads a required secret. In production a missing secret is a hard error, because the
 * old hard-coded fallbacks are public in the repository and would let anyone forge
 * admin sessions. Development keeps a local-only fallback so `npm run dev` still works.
 */
function requireSecret(name: string, devFallback: string): string {
  const value = process.env[name];
  if (value && value.length >= 32) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error(`${name} must be set to a random value of at least 32 characters in production.`);
  }
  return value || devFallback;
}

const getHmacSecret = () => requireSecret("SURVEY_HMAC_SECRET", "dev-only-survey-hmac-secret-not-for-production");
const getJwtSecret = () => requireSecret("ADMIN_JWT_SECRET", "dev-only-admin-jwt-secret-not-for-production");

/**
 * Derives a privacy-preserving keyed identifier for an IP address using HMAC-SHA256.
 * The raw IP is normalized (resolving IPv4-mapped IPv6, stripping ports) before hashing.
 */
export function hashIP(ip: string): string {
  const normalized = normalizeIp(ip);
  return crypto.createHmac("sha256", getHmacSecret()).update(normalized).digest("hex");
}

/**
 * Every identifier this IP may already be stored under. After the HMAC secret is rotated,
 * older responses keep identifiers made with the previous secret (their raw IP was never
 * stored, so they cannot be re-keyed). SURVEY_HMAC_SECRET_PREVIOUS is used only to look
 * those up for the one-vote check; nothing new is ever stored with it.
 */
export function ipHashesForLookup(ip: string): string[] {
  const normalized = normalizeIp(ip);
  const hashes = [crypto.createHmac("sha256", getHmacSecret()).update(normalized).digest("hex")];
  const previous = process.env.SURVEY_HMAC_SECRET_PREVIOUS;
  if (previous) hashes.push(crypto.createHmac("sha256", previous).update(normalized).digest("hex"));
  return hashes;
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
    .createHmac("sha256", getJwtSecret())
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
      .createHmac("sha256", getJwtSecret())
      .update(`${header}.${payload}`)
      .digest("base64url");
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSignature);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) return null;

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
 * Extracts client IP from incoming Next.js Request using reverse proxy hierarchy.
 */
export function getClientIP(headers: Headers): string {
  return getTrustedClientIp(headers);
}
