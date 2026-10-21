import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminSession, getClientIP } from "@/lib/security";
import { PHILIPPINE_PROVINCES } from "@/lib/philippines-geo";
import { getStartOfManilaToday } from "@/lib/timezone";

export const dynamic = "force-dynamic";

function getAdmin(req: NextRequest | Request) {
  const authHeader = req.headers?.get("authorization");
  let token = "";
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else if ((req as any).cookies?.get) {
    token = (req as any).cookies.get("admin_session")?.value || "";
  }
  return verifyAdminSession(token);
}

export async function GET(req: NextRequest) {
  try {
    const admin = getAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const campaign = await prisma.surveyCampaign.findFirst({
      orderBy: { createdAt: "desc" },
    });

    const campaignId = campaign?.id;

    // 1. Calculate live, eligible active survey submissions
    const calculatedActiveSubmissions = await prisma.surveySubmission.count({
      where: {
        status: "ACTIVE",
        ...(campaignId ? { campaignId } : {}),
      },
    });

    const calculatedRetractedSubmissions = await prisma.surveySubmission.count({
      where: {
        status: "RETRACTED",
        ...(campaignId ? { campaignId } : {}),
      },
    });

    // 2. Calculate today's eligible submissions using Philippine calendar day (Asia/Manila, UTC+8)
    const startOfManilaToday = getStartOfManilaToday();
    const calculatedTodaySubmissions = await prisma.surveySubmission.count({
      where: {
        status: "ACTIVE",
        createdAt: { gte: startOfManilaToday },
        ...(campaignId ? { campaignId } : {}),
      },
    });

    // 3. Calculate distinct reporting provinces from active submissions
    const activeSubmissions = await prisma.surveySubmission.findMany({
      where: {
        status: "ACTIVE",
        ...(campaignId ? { campaignId } : {}),
      },
      select: {
        provinceId: true,
      },
    });

    const distinctReportingProvinceIds = new Set(
      activeSubmissions
        .map((s) => s.provinceId)
        .filter((pId): pId is string => Boolean(pId && PHILIPPINE_PROVINCES.some((p) => p.id === pId)))
    );

    const calculatedProvincesReporting = distinctReportingProvinceIds.size;
    const totalProvinces = PHILIPPINE_PROVINCES.length; // 82

    // 4. Stored manual adjustments and overrides
    const activeVotesAdjustment = campaign?.activeVotesAdjustment ?? 0;
    const todayVotesAdjustment = campaign?.todayVotesAdjustment ?? 0;
    const provincesReportingOverride = campaign?.provincesReportingOverride ?? null;

    // 5. Approved public displayed totals
    const displayedActiveVotes = Math.max(0, calculatedActiveSubmissions + activeVotesAdjustment);
    const displayedTodayVotes = Math.max(0, calculatedTodaySubmissions + todayVotesAdjustment);
    const displayedProvincesReporting =
      provincesReportingOverride !== null
        ? Math.min(totalProvinces, Math.max(0, provincesReportingOverride))
        : calculatedProvincesReporting;

    // 6. Fetch recent statistics audit history
    const auditLogs = await prisma.adminAuditLog.findMany({
      where: {
        action: { startsWith: "STATISTICS_" },
      },
      orderBy: { createdAt: "desc" },
      take: 25,
    });

    return NextResponse.json({
      success: true,
      statistics: {
        activeVotes: {
          calculated: calculatedActiveSubmissions,
          adjustment: activeVotesAdjustment,
          displayed: displayedActiveVotes,
          reason: campaign?.activeVotesReason || null,
          isAdjusted: activeVotesAdjustment !== 0,
        },
        todayVotes: {
          calculated: calculatedTodaySubmissions,
          adjustment: todayVotesAdjustment,
          displayed: displayedTodayVotes,
          reason: campaign?.todayVotesReason || null,
          isAdjusted: todayVotesAdjustment !== 0,
          timezone: "Asia/Manila (UTC+08:00)",
          startOfTodayManila: startOfManilaToday.toISOString(),
        },
        provincesReporting: {
          calculated: calculatedProvincesReporting,
          override: provincesReportingOverride,
          displayed: displayedProvincesReporting,
          total: totalProvinces,
          reason: campaign?.provincesReportingReason || null,
          isOverridden: provincesReportingOverride !== null,
        },
        metadata: {
          campaignId,
          campaignStatus: campaign?.status || "ACTIVE",
          retractedCount: calculatedRetractedSubmissions,
          statsLastAdjustedAt: campaign?.statsLastAdjustedAt || null,
          statsLastAdjustedBy: campaign?.statsLastAdjustedBy || null,
          lastUpdated: new Date().toISOString(),
        },
      },
      auditLogs,
    });
  } catch (error) {
    console.error("Admin statistics GET error:", error);
    return NextResponse.json({ error: "Failed to load survey statistics." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = getAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (admin.role !== "SUPER_ADMIN" && admin.role !== "SURVEY_MANAGER") {
      return NextResponse.json(
        { error: "Forbidden: Only Super Administrators and Survey Managers can configure survey statistics." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { statistic, action, adjustment, targetTotal, override, reason } = body;

    if (!statistic || !action) {
      return NextResponse.json({ error: "statistic and action are required." }, { status: 400 });
    }

    const trimmedReason = typeof reason === "string" ? reason.trim() : "";
    if (!trimmedReason || trimmedReason.length < 3) {
      return NextResponse.json(
        { error: "An audit reason (minimum 3 characters) is required for all adjustments." },
        { status: 400 }
      );
    }

    const campaign = await prisma.surveyCampaign.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Active survey campaign not found." }, { status: 404 });
    }

    const clientIP = getClientIP(req.headers);
    const now = new Date();

    // 1. System-calculated baselines
    const calculatedActive = await prisma.surveySubmission.count({
      where: { status: "ACTIVE", campaignId: campaign.id },
    });

    const startOfManilaToday = getStartOfManilaToday();
    const calculatedToday = await prisma.surveySubmission.count({
      where: {
        status: "ACTIVE",
        createdAt: { gte: startOfManilaToday },
        campaignId: campaign.id,
      },
    });

    const activeSubmissions = await prisma.surveySubmission.findMany({
      where: { status: "ACTIVE", campaignId: campaign.id },
      select: { provinceId: true },
    });
    const distinctReportingProvinceIds = new Set(
      activeSubmissions
        .map((s) => s.provinceId)
        .filter((pId): pId is string => Boolean(pId && PHILIPPINE_PROVINCES.some((p) => p.id === pId)))
    );
    const calculatedProvinces = distinctReportingProvinceIds.size;
    const totalProvinces = PHILIPPINE_PROVINCES.length; // 82

    let updateData: Record<string, any> = {
      statsLastAdjustedAt: now,
      statsLastAdjustedBy: admin.email,
    };
    let auditAction = "";
    let auditDetails = "";

    if (action === "RESET") {
      if (statistic === "ACTIVE_VOTES") {
        const prevAdj = campaign.activeVotesAdjustment;
        updateData.activeVotesAdjustment = 0;
        updateData.activeVotesReason = `Reset to calculated baseline (${trimmedReason})`;
        auditAction = "STATISTICS_ACTIVE_VOTES_RESET";
        auditDetails = `Active Verified Votes reset to calculated baseline ${calculatedActive} (Previous adjustment: ${prevAdj >= 0 ? `+${prevAdj}` : prevAdj} -> 0). Reason: ${trimmedReason}`;
      } else if (statistic === "TODAY_VOTES") {
        const prevAdj = campaign.todayVotesAdjustment;
        updateData.todayVotesAdjustment = 0;
        updateData.todayVotesReason = `Reset to calculated baseline (${trimmedReason})`;
        auditAction = "STATISTICS_TODAY_VOTES_RESET";
        auditDetails = `Votes Received Today reset to calculated baseline ${calculatedToday} (Previous adjustment: ${prevAdj >= 0 ? `+${prevAdj}` : prevAdj} -> 0). Reason: ${trimmedReason}`;
      } else if (statistic === "PROVINCES_REPORTING") {
        const prevOverride = campaign.provincesReportingOverride;
        updateData.provincesReportingOverride = null;
        updateData.provincesReportingReason = `Reset to calculated baseline (${trimmedReason})`;
        auditAction = "STATISTICS_PROVINCES_REPORTING_RESET";
        auditDetails = `Provinces Reporting reset to calculated baseline ${calculatedProvinces} / ${totalProvinces} (Previous override: ${prevOverride ?? "none"} -> null). Reason: ${trimmedReason}`;
      } else if (statistic === "ALL") {
        updateData.activeVotesAdjustment = 0;
        updateData.todayVotesAdjustment = 0;
        updateData.provincesReportingOverride = null;
        updateData.activeVotesReason = `Reset all to calculated (${trimmedReason})`;
        updateData.todayVotesReason = `Reset all to calculated (${trimmedReason})`;
        updateData.provincesReportingReason = `Reset all to calculated (${trimmedReason})`;
        auditAction = "STATISTICS_ALL_RESET";
        auditDetails = `All survey statistics reset to pure system-calculated values. Reason: ${trimmedReason}`;
      } else {
        return NextResponse.json({ error: "Invalid statistic specified." }, { status: 400 });
      }
    } else if (action === "ADJUST") {
      if (statistic === "ACTIVE_VOTES") {
        let finalAdjustment = 0;
        if (targetTotal !== undefined) {
          const parsedTarget = parseInt(String(targetTotal), 10);
          if (isNaN(parsedTarget) || parsedTarget < 0) {
            return NextResponse.json({ error: "Target total must be a non-negative number." }, { status: 400 });
          }
          finalAdjustment = parsedTarget - calculatedActive;
        } else if (adjustment !== undefined) {
          const parsedAdj = parseInt(String(adjustment), 10);
          if (isNaN(parsedAdj)) {
            return NextResponse.json({ error: "Adjustment must be a valid integer." }, { status: 400 });
          }
          finalAdjustment = parsedAdj;
        } else {
          return NextResponse.json({ error: "Either targetTotal or adjustment must be provided." }, { status: 400 });
        }

        const resultingDisplayed = calculatedActive + finalAdjustment;
        if (resultingDisplayed < 0) {
          return NextResponse.json(
            { error: `Adjustment would cause displayed total to be negative (${resultingDisplayed}). Minimum allowed displayed total is 0.` },
            { status: 400 }
          );
        }

        const prevAdj = campaign.activeVotesAdjustment;
        const prevDisplayed = Math.max(0, calculatedActive + prevAdj);
        updateData.activeVotesAdjustment = finalAdjustment;
        updateData.activeVotesReason = trimmedReason;
        auditAction = "STATISTICS_ACTIVE_VOTES_ADJUSTED";
        auditDetails = `Active Verified Votes adjusted: Calculated Baseline = ${calculatedActive}, Adjustment: ${prevAdj >= 0 ? `+${prevAdj}` : prevAdj} -> ${finalAdjustment >= 0 ? `+${finalAdjustment}` : finalAdjustment}, Displayed Total: ${prevDisplayed} -> ${resultingDisplayed}. Reason: ${trimmedReason}`;
      } else if (statistic === "TODAY_VOTES") {
        let finalAdjustment = 0;
        if (targetTotal !== undefined) {
          const parsedTarget = parseInt(String(targetTotal), 10);
          if (isNaN(parsedTarget) || parsedTarget < 0) {
            return NextResponse.json({ error: "Target total must be a non-negative number." }, { status: 400 });
          }
          finalAdjustment = parsedTarget - calculatedToday;
        } else if (adjustment !== undefined) {
          const parsedAdj = parseInt(String(adjustment), 10);
          if (isNaN(parsedAdj)) {
            return NextResponse.json({ error: "Adjustment must be a valid integer." }, { status: 400 });
          }
          finalAdjustment = parsedAdj;
        } else {
          return NextResponse.json({ error: "Either targetTotal or adjustment must be provided." }, { status: 400 });
        }

        const resultingDisplayed = calculatedToday + finalAdjustment;
        if (resultingDisplayed < 0) {
          return NextResponse.json(
            { error: `Adjustment would cause displayed total to be negative (${resultingDisplayed}). Minimum allowed displayed total is 0.` },
            { status: 400 }
          );
        }

        const prevAdj = campaign.todayVotesAdjustment;
        const prevDisplayed = Math.max(0, calculatedToday + prevAdj);
        updateData.todayVotesAdjustment = finalAdjustment;
        updateData.todayVotesReason = trimmedReason;
        auditAction = "STATISTICS_TODAY_VOTES_ADJUSTED";
        auditDetails = `Votes Received Today adjusted (Asia/Manila Day): Calculated Baseline = ${calculatedToday}, Adjustment: ${prevAdj >= 0 ? `+${prevAdj}` : prevAdj} -> ${finalAdjustment >= 0 ? `+${finalAdjustment}` : finalAdjustment}, Displayed Total: ${prevDisplayed} -> ${resultingDisplayed}. Reason: ${trimmedReason}`;
      } else if (statistic === "PROVINCES_REPORTING") {
        let finalOverride = 0;
        if (override !== undefined) {
          finalOverride = parseInt(String(override), 10);
        } else if (targetTotal !== undefined) {
          finalOverride = parseInt(String(targetTotal), 10);
        } else {
          return NextResponse.json({ error: "An override value is required for Provinces Reporting." }, { status: 400 });
        }

        if (isNaN(finalOverride) || finalOverride < 0 || finalOverride > totalProvinces) {
          return NextResponse.json(
            { error: `Provinces Reporting override must be between 0 and ${totalProvinces}.` },
            { status: 400 }
          );
        }

        const prevOverride = campaign.provincesReportingOverride;
        updateData.provincesReportingOverride = finalOverride;
        updateData.provincesReportingReason = trimmedReason;
        auditAction = "STATISTICS_PROVINCES_REPORTING_OVERRIDDEN";
        auditDetails = `Provinces Reporting coverage override applied: Calculated Baseline = ${calculatedProvinces} / ${totalProvinces}, Override: ${prevOverride !== null ? `${prevOverride} / ${totalProvinces}` : "None"} -> ${finalOverride} / ${totalProvinces}. Reason: ${trimmedReason}`;
      } else {
        return NextResponse.json({ error: "Invalid statistic specified." }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "Action must be either 'ADJUST' or 'RESET'." }, { status: 400 });
    }

    // Execute atomic update and audit logging in a database transaction
    const [updatedCampaign, auditRecord] = await prisma.$transaction([
      prisma.surveyCampaign.update({
        where: { id: campaign.id },
        data: updateData,
      }),
      prisma.adminAuditLog.create({
        data: {
          adminEmail: admin.email,
          action: auditAction,
          entityType: "SurveyStatistics",
          entityId: campaign.id,
          details: auditDetails,
          ipAddress: clientIP,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Survey statistics updated and audit logged successfully.",
      campaign: updatedCampaign,
      auditRecord,
    });
  } catch (error) {
    console.error("Admin statistics PUT error:", error);
    return NextResponse.json({ error: "Failed to update statistics." }, { status: 500 });
  }
}
