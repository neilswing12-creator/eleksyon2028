import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/security";
import {
  importCandidateLegislativeRecords,
  parseAndValidateLegislativeData,
} from "@/lib/legislative-importer";
import { OfficialLegislativeRecord } from "@/lib/legislative-dataset";

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

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = getAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (admin.role === "ANALYST") {
      return NextResponse.json({ error: "Analyst role is read-only." }, { status: 403 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Candidate ID is required." }, { status: 400 });
    }

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Empty body for standard 1-click import
    }

    // Handle File Preview Mode
    if (body.action === "PREVIEW_FILE" && body.rawContent) {
      const format = body.fileFormat === "json" ? "json" : "csv";
      const validation = parseAndValidateLegislativeData(body.rawContent, format);
      return NextResponse.json({
        success: true,
        action: "PREVIEW_FILE",
        validation,
      });
    }

    // Manual records payload (from verified assisted file upload or manual form)
    let manualRecords: OfficialLegislativeRecord[] | undefined;
    if (body.manualRecords && Array.isArray(body.manualRecords)) {
      manualRecords = body.manualRecords;
    } else if (body.rawContent) {
      const format = body.fileFormat === "json" ? "json" : "csv";
      const validation = parseAndValidateLegislativeData(body.rawContent, format);
      if (validation.validRecords.length > 0) {
        manualRecords = validation.validRecords;
      }
    }

    const result = await importCandidateLegislativeRecords(id, admin.email, manualRecords);

    return NextResponse.json({
      success: true,
      message: `Legislative records processed for ${result.candidateName} (Status: ${result.status})`,
      result,
    });
  } catch (error: any) {
    console.error("Import legislative records error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to import legislative records." },
      { status: 500 }
    );
  }
}
