import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminSession, getClientIP } from "@/lib/security";
import { PHILIPPINE_PROVINCES } from "@/lib/philippines-geo";

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

// GET all adjustments and candidate adjustment summary
export async function GET(req: NextRequest) {
  try {
    const admin = getAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const campaign = await prisma.surveyCampaign.findFirst({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    });

    const campaignId = campaign?.id;

    // 1. Fetch all adjustments
    const adjustments = await prisma.surveyAdjustment.findMany({
      where: campaignId ? { campaignId } : {},
      include: {
        candidate: {
          select: { id: true, name: true, position: true, party: true, color: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // 2. Fetch candidate stats with raw selections vs adjustments
    const candidates = await prisma.candidate.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        name: true,
        position: true,
        party: true,
        color: true,
      },
      orderBy: [{ position: "asc" }, { displayOrder: "asc" }],
    });

    // Get active participant selections per candidate
    const rawSelections = await prisma.candidateSelection.groupBy({
      by: ["candidateId"],
      where: {
        submission: {
          status: "ACTIVE",
          ...(campaignId ? { campaignId } : {}),
        },
      },
      _count: {
        _all: true,
      },
    });

    const rawVotesMap = new Map<string, number>();
    rawSelections.forEach((item) => {
      rawVotesMap.set(item.candidateId, item._count._all);
    });

    // Get net approved adjustments per candidate
    const approvedAdjustments = adjustments.filter((a) => a.status === "APPROVED");
    const adjustmentMap = new Map<string, number>();
    approvedAdjustments.forEach((adj) => {
      adjustmentMap.set(
        adj.candidateId,
        (adjustmentMap.get(adj.candidateId) || 0) + adj.amount
      );
    });

    // Build candidate breakdown
    const candidateSummaries = candidates.map((c) => {
      const rawVotes = rawVotesMap.get(c.id) || 0;
      const adjustmentAmount = adjustmentMap.get(c.id) || 0;
      const displayedTotal = Math.max(0, rawVotes + adjustmentAmount);
      return {
        id: c.id,
        name: c.name,
        position: c.position,
        party: c.party,
        color: c.color,
        rawVotes,
        adjustmentAmount,
        displayedTotal,
        hasAdjustments: adjustmentAmount !== 0,
      };
    });

    return NextResponse.json({
      success: true,
      adjustments,
      candidateSummaries,
      totalAdjustmentsCount: adjustments.length,
      activeAdjustmentsCount: approvedAdjustments.length,
    });
  } catch (error) {
    console.error("Error fetching adjustments:", error);
    return NextResponse.json({ error: "Failed to load adjustments." }, { status: 500 });
  }
}

// POST create manual voting adjustment
export async function POST(req: NextRequest) {
  try {
    const admin = getAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (admin.role === "ANALYST") {
      return NextResponse.json(
        { error: "Forbidden: Analysts have read-only access and cannot make adjustments." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      candidateId,
      campaignId: providedCampaignId,
      category,
      amount: rawAmount,
      reason,
      geographicScope = "NATIONAL",
      regionId,
      provinceId,
    } = body;

    const amount = parseInt(rawAmount, 10);

    if (!candidateId || !reason || isNaN(amount) || amount === 0) {
      return NextResponse.json(
        { error: "Candidate, a non-zero adjustment amount, and a justified reason are required." },
        { status: 400 }
      );
    }

    // Resolve campaign
    let campaignId = providedCampaignId;
    if (!campaignId) {
      const activeCampaign = await prisma.surveyCampaign.findFirst({
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
      });
      campaignId = activeCampaign?.id;
    }

    if (!campaignId) {
      return NextResponse.json(
        { error: "No active survey campaign found to associate adjustment." },
        { status: 400 }
      );
    }

    // Fetch candidate
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found." }, { status: 404 });
    }

    const finalCategory = category || candidate.position;

    // Execute atomic calculation and validation in transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Raw active participant votes
      const rawCount = await tx.candidateSelection.count({
        where: {
          candidateId,
          submission: {
            status: "ACTIVE",
            campaignId,
          },
        },
      });

      // 2. Existing approved adjustments
      const currentAdjustments = await tx.surveyAdjustment.findMany({
        where: {
          candidateId,
          campaignId,
          status: "APPROVED",
        },
      });

      const currentAdjustmentSum = currentAdjustments.reduce((acc, a) => acc + a.amount, 0);
      const currentDisplayedTotal = rawCount + currentAdjustmentSum;
      const proposedTotal = currentDisplayedTotal + amount;

      // 3. Negative count guard
      if (proposedTotal < 0) {
        throw new Error(
          `Adjustment cannot be applied: resulting count (${proposedTotal}) would be negative. Current displayed total is ${currentDisplayedTotal}.`
        );
      }

      // 4. Resolve geographic identifiers
      let finalRegionId = regionId || null;
      let finalProvinceId = provinceId || null;

      if (finalProvinceId && !finalRegionId) {
        const prov = PHILIPPINE_PROVINCES.find((p) => p.id === finalProvinceId);
        if (prov?.regionId) finalRegionId = prov.regionId;
      }
      if (finalRegionId && !finalProvinceId) {
        const provsInReg = PHILIPPINE_PROVINCES.filter((p) => p.regionId === finalRegionId);
        if (provsInReg.length === 1) finalProvinceId = provsInReg[0].id;
      }

      // 5. Create adjustment record
      const adjustment = await tx.surveyAdjustment.create({
        data: {
          campaignId,
          candidateId,
          category: finalCategory,
          amount,
          reason: reason.trim(),
          adminId: admin.id,
          adminEmail: admin.email,
          status: "APPROVED",
          geographicScope: geographicScope || "NATIONAL",
          regionId: finalRegionId,
          provinceId: finalProvinceId,
        },
        include: {
          candidate: { select: { id: true, name: true, position: true } },
        },
      });

      // 5. Create immutable audit log
      const clientIP = getClientIP(req.headers);
      await tx.adminAuditLog.create({
        data: {
          adminEmail: admin.email,
          action: "VOTE_COUNT_ADJUSTED",
          entityType: "SurveyAdjustment",
          entityId: adjustment.id,
          details: `Adjusted vote count for ${candidate.name} (${finalCategory}) by ${
            amount > 0 ? "+" + amount : amount
          } votes. Previous Total: ${currentDisplayedTotal}, New Total: ${proposedTotal}. Reason: ${reason.trim()}`,
          ipAddress: clientIP,
        },
      });

      return {
        adjustment,
        previousTotal: currentDisplayedTotal,
        newTotal: proposedTotal,
        rawVotes: rawCount,
      };
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Error creating adjustment:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create adjustment." },
      { status: 400 }
    );
  }
}
