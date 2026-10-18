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

export async function GET(req: NextRequest) {
  try {
    const admin = getAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const campaign = await prisma.surveyCampaign.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ campaign });
  } catch (error) {
    console.error("Admin campaign GET error:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = getAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    if (admin.role !== "SUPER_ADMIN" && admin.role !== "SURVEY_MANAGER") {
      return NextResponse.json(
        { error: "Forbidden: Only Super Admin and Survey Managers can modify campaign parameters." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { id, ...settings } = body;

    let targetCampaignId = id;
    if (!targetCampaignId) {
      const active = await prisma.surveyCampaign.findFirst({ orderBy: { createdAt: "desc" } });
      targetCampaignId = active?.id;
    }

    if (!targetCampaignId) {
      return NextResponse.json({ error: "Campaign ID required." }, { status: 400 });
    }

    const currentCampaign = await prisma.surveyCampaign.findUnique({
      where: { id: targetCampaignId },
    });

    const updated = await prisma.surveyCampaign.update({
      where: { id: targetCampaignId },
      data: {
        ...settings,
        ...(settings.minResponseThreshold !== undefined
          ? { minResponseThreshold: parseInt(settings.minResponseThreshold, 10) }
          : {}),
        ...(settings.maxSenatorSelections !== undefined
          ? { maxSenatorSelections: Math.min(12, Math.max(1, parseInt(settings.maxSenatorSelections, 10))) }
          : {}),
        ...(settings.startDate ? { startDate: new Date(settings.startDate) } : {}),
        ...(settings.endDate ? { endDate: new Date(settings.endDate) } : {}),
      },
    });

    // Detect specific consequential actions for the audit trail
    const auditDetails: string[] = [];
    if (currentCampaign && currentCampaign.status !== updated.status) {
      auditDetails.push(`Survey status transitioned from ${currentCampaign.status} to ${updated.status}`);
    }
    if (currentCampaign && currentCampaign.publicResultsVisible !== updated.publicResultsVisible) {
      auditDetails.push(`Public result visibility changed to ${updated.publicResultsVisible ? "ENABLED" : "DISABLED"}`);
    }
    if (currentCampaign && currentCampaign.geographicResultsVisible !== updated.geographicResultsVisible) {
      auditDetails.push(`Geographic results visibility changed to ${updated.geographicResultsVisible ? "ENABLED" : "DISABLED"}`);
    }
    if (currentCampaign && (currentCampaign.enablePresident !== updated.enablePresident || currentCampaign.enableVicePresident !== updated.enableVicePresident || currentCampaign.enableSenators !== updated.enableSenators)) {
      auditDetails.push(`Category participation toggled (Pres: ${updated.enablePresident}, VP: ${updated.enableVicePresident}, Sen: ${updated.enableSenators})`);
    }

    const summaryDetails =
      auditDetails.length > 0
        ? auditDetails.join("; ")
        : `Updated campaign parameters (status: ${updated.status}, minThreshold: ${updated.minResponseThreshold}, maxSenators: ${updated.maxSenatorSelections})`;

    const clientIP = getClientIP(req.headers);
    await prisma.adminAuditLog.create({
      data: {
        adminEmail: admin.email,
        action: currentCampaign?.status !== updated.status ? `SURVEY_STATUS_${updated.status}` : "CAMPAIGN_CONFIG_UPDATED",
        entityType: "SurveyCampaign",
        entityId: updated.id,
        details: summaryDetails,
        ipAddress: clientIP,
      },
    });

    return NextResponse.json({ success: true, campaign: updated });
  } catch (error) {
    console.error("Admin campaign PUT error:", error);
    return NextResponse.json({ error: "Failed to update campaign configuration." }, { status: 500 });
  }
}
