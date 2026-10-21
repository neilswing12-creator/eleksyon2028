import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/security";
import { importCandidateLegislativeRecords } from "@/lib/legislative-importer";

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

    const result = await importCandidateLegislativeRecords(id, admin.email);

    return NextResponse.json({
      success: true,
      message: `Successfully imported legislative records for ${result.candidateName}`,
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
