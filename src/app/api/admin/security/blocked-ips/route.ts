import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/security";
import { blockIp, normalizeIp } from "@/lib/ip-security";

export const dynamic = "force-dynamic";

function getAdmin(req: NextRequest) {
  const authHeader = req.headers?.get ? req.headers.get("authorization") : null;
  let token = "";
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else if (req.cookies?.get) {
    token = req.cookies.get("admin_session")?.value || "";
  }
  return verifyAdminSession(token);
}

export async function GET(req: NextRequest) {
  try {
    const admin = getAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "ALL";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(5, parseInt(searchParams.get("limit") || "25", 10)));
    const skip = (page - 1) * limit;

    // Automatically reconcile expired active temporary blocks
    const now = new Date();
    await prisma.blockedIpAddress.updateMany({
      where: {
        status: "ACTIVE",
        expiresAt: { lte: now },
      },
      data: { status: "EXPIRED" },
    });

    const where: any = {};

    if (search.trim()) {
      where.OR = [
        { ipAddress: { contains: search.trim() } },
        { reason: { contains: search.trim() } },
        { adminEmail: { contains: search.trim() } },
      ];
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    const [blockedIps, totalCount, activeCount] = await Promise.all([
      prisma.blockedIpAddress.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.blockedIpAddress.count({ where }),
      prisma.blockedIpAddress.count({ where: { status: "ACTIVE" } }),
    ]);

    return NextResponse.json({
      success: true,
      blockedIps,
      activeCount,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit) || 1,
      },
    });
  } catch (error) {
    console.error("Admin blocked IPs query error:", error);
    return NextResponse.json({ error: "Failed to load blocked IPs." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    // Role-based access control: Only Super Admin and Survey Manager can block IPs
    if (admin.role === "ANALYST") {
      return NextResponse.json(
        { error: "Forbidden: Analysts have read-only access and cannot modify IP blocks." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { ipAddress, reason, duration } = body;

    if (!ipAddress || typeof ipAddress !== "string") {
      return NextResponse.json({ error: "A valid IP address is required." }, { status: 400 });
    }

    const normalized = normalizeIp(ipAddress);
    if (normalized === "UNKNOWN") {
      return NextResponse.json(
        { error: "Invalid IP address format. Must be a valid IPv4 or IPv6 address." },
        { status: 400 }
      );
    }

    if (!reason || typeof reason !== "string" || !reason.trim()) {
      return NextResponse.json({ error: "A block reason is required for auditable enforcement." }, { status: 400 });
    }

    const blockRecord = await blockIp({
      ipAddress: normalized,
      reason: reason.trim(),
      duration: duration || "permanent",
      adminId: admin.id,
      adminEmail: admin.email,
    });

    return NextResponse.json({
      success: true,
      blockRecord,
      message: `Successfully blocked IP ${normalized}.`,
    });
  } catch (error: any) {
    console.error("Admin block IP error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to block IP address." },
      { status: 500 }
    );
  }
}
