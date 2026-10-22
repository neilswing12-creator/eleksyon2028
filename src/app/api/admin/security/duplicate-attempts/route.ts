import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    const admin = verifyAdminSession(token);

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(10, parseInt(searchParams.get("limit") || "25", 10)));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { ipAddress: { contains: search } },
        { attemptedName: { contains: search } },
        { rejectionReason: { contains: search } },
      ];
    }

    const [total, attempts] = await Promise.all([
      prisma.duplicateSubmissionAttempt.count({ where }),
      prisma.duplicateSubmissionAttempt.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      attempts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Duplicate attempts query error:", error);
    return NextResponse.json(
      { error: "Internal server error fetching duplicate attempts." },
      { status: 500 }
    );
  }
}
