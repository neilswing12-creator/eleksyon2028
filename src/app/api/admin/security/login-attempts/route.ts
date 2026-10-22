import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/security";

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
    const ip = searchParams.get("ip") || "";
    const identifier = searchParams.get("identifier") || "";
    const status = searchParams.get("status") || "ALL";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(5, parseInt(searchParams.get("limit") || "25", 10)));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (ip.trim()) {
      where.ipAddress = { contains: ip.trim() };
    }

    if (identifier.trim()) {
      where.attemptedIdentifier = { contains: identifier.trim().toLowerCase() };
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        // Include up to end of the day if just a date string is passed
        const end = new Date(endDate);
        if (endDate.length === 10) {
          end.setHours(23, 59, 59, 999);
        }
        where.createdAt.lte = end;
      }
    }

    const [attempts, totalCount, statsSuccess, statsFailed, statsBlocked, statsRateLimited] =
      await Promise.all([
        prisma.adminLoginAttempt.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.adminLoginAttempt.count({ where }),
        prisma.adminLoginAttempt.count({ where: { status: "SUCCESS" } }),
        prisma.adminLoginAttempt.count({ where: { status: "FAILED" } }),
        prisma.adminLoginAttempt.count({ where: { status: "BLOCKED" } }),
        prisma.adminLoginAttempt.count({ where: { status: "RATE_LIMITED" } }),
      ]);

    const totalAll = statsSuccess + statsFailed + statsBlocked + statsRateLimited;

    return NextResponse.json({
      success: true,
      attempts,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit) || 1,
      },
      stats: {
        total: totalAll,
        success: statsSuccess,
        failed: statsFailed,
        blocked: statsBlocked,
        rateLimited: statsRateLimited,
      },
    });
  } catch (error) {
    console.error("Admin login attempts query error:", error);
    return NextResponse.json({ error: "Failed to retrieve login attempts." }, { status: 500 });
  }
}
