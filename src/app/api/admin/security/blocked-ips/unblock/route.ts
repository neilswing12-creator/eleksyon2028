import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/security";
import { unblockIp, normalizeIp } from "@/lib/ip-security";

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

export async function POST(req: NextRequest) {
  try {
    const admin = getAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (admin.role === "ANALYST") {
      return NextResponse.json(
        { error: "Forbidden: Analysts have read-only access and cannot unblock IP addresses." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { id, ipAddress, reason } = body;

    if (!id && !ipAddress) {
      return NextResponse.json({ error: "Either block ID or IP address is required." }, { status: 400 });
    }

    const unblocked = await unblockIp({
      id,
      ipAddress: ipAddress ? normalizeIp(ipAddress) : undefined,
      reason: reason?.trim() || "Manual unblock by administrator",
      adminEmail: admin.email,
    });

    if (!unblocked) {
      return NextResponse.json(
        { error: "No active block found matching the provided identifier." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "IP address has been successfully unblocked.",
    });
  } catch (error: any) {
    console.error("Admin unblock IP error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to unblock IP address." },
      { status: 500 }
    );
  }
}
