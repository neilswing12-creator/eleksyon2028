import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/security";
import { importCandidateLegislativeRecords } from "@/lib/legislative-importer";
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

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Candidate ID is required." }, { status: 400 });
    }

    // Optional manual records payload (CSV/JSON fallback)
    let manualRecords: OfficialLegislativeRecord[] | undefined;
    try {
      const body = await req.json();
      if (body?.manualRecords && Array.isArray(body.manualRecords)) {
        manualRecords = body.manualRecords;
      }
    } catch {
      // Body is empty for regular 1-click import; ignore JSON parse error
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
