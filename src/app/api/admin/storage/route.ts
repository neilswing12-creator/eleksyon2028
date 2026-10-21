import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/security";
import { auditStorageUsage, optimizeCandidateImages } from "@/lib/image-optimizer";

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
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const audit = auditStorageUsage();
    return NextResponse.json({
      success: true,
      audit,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to audit storage usage." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (admin.role === "ANALYST") {
      return NextResponse.json({ error: "Analyst role is read-only." }, { status: 403 });
    }

    const result = await optimizeCandidateImages();
    return NextResponse.json({
      success: true,
      result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to optimize candidate images." },
      { status: 500 }
    );
  }
}
