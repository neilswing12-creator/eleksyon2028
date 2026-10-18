import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminSession, getClientIP } from "@/lib/security";

export const dynamic = "force-dynamic";

function getAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  let token = "";
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    token = req.cookies.get("admin_session")?.value || "";
  }
  return verifyAdminSession(token);
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (admin.role === "ANALYST") {
      return NextResponse.json(
        { error: "Forbidden: Analysts have read-only access." },
        { status: 403 }
      );
    }

    const { adjustmentId, reason } = await req.json();

    if (!adjustmentId || !reason) {
      return NextResponse.json(
        { error: "Adjustment ID and reversal reason are required." },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch adjustment
      const existing = await tx.surveyAdjustment.findUnique({
        where: { id: adjustmentId },
        include: { candidate: true },
      });

      if (!existing) {
        throw new Error("Adjustment record not found.");
      }

      if (existing.status === "REVERSED") {
        throw new Error("This adjustment has already been reversed.");
      }

      // 2. Fetch current counts to ensure reversing won't result in negative count
      const rawCount = await tx.candidateSelection.count({
        where: {
          candidateId: existing.candidateId,
          submission: {
            status: "ACTIVE",
            campaignId: existing.campaignId,
          },
        },
      });

      const currentAdjustments = await tx.surveyAdjustment.findMany({
        where: {
          candidateId: existing.candidateId,
          campaignId: existing.campaignId,
          status: "APPROVED",
        },
      });

      const currentAdjustmentSum = currentAdjustments.reduce((acc, a) => acc + a.amount, 0);
      const currentDisplayedTotal = rawCount + currentAdjustmentSum;
      const proposedTotalAfterReversal = currentDisplayedTotal - existing.amount;

      if (proposedTotalAfterReversal < 0) {
        throw new Error(
          `Cannot reverse adjustment: resulting candidate count (${proposedTotalAfterReversal}) would become negative.`
        );
      }

      // 3. Mark original adjustment as REVERSED
      const updatedOriginal = await tx.surveyAdjustment.update({
        where: { id: adjustmentId },
        data: {
          status: "REVERSED",
          reversalReason: reason.trim(),
        },
      });

      // 4. Create an explicit compensating audit log
      const clientIP = getClientIP(req.headers);
      await tx.adminAuditLog.create({
        data: {
          adminEmail: admin.email,
          action: "VOTE_COUNT_ADJUSTMENT_REVERSED",
          entityType: "SurveyAdjustment",
          entityId: existing.id,
          details: `Reversed adjustment of ${existing.amount > 0 ? "+" + existing.amount : existing.amount} votes for ${
            existing.candidate.name
          } (${existing.category}). Restored count to ${proposedTotalAfterReversal}. Reason for reversal: ${reason.trim()}`,
          ipAddress: clientIP,
        },
      });

      return {
        reversedAdjustment: updatedOriginal,
        previousTotal: currentDisplayedTotal,
        restoredTotal: proposedTotalAfterReversal,
      };
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Adjustment reversal error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to reverse adjustment." },
      { status: 400 }
    );
  }
}
