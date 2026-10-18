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

    const platforms = await prisma.candidatePlatform.findMany({
      include: {
        candidate: {
          select: { id: true, name: true, position: true, party: true, color: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ platforms });
  } catch (error) {
    console.error("Admin platforms GET error:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    if (admin.role === "ANALYST") return NextResponse.json({ error: "Forbidden." }, { status: 403 });

    const body = await req.json();
    const { candidateId, title, description, category, sourceUrl, verificationStatus } = body;

    if (!candidateId || !title || !description || !category) {
      return NextResponse.json({ error: "candidateId, title, description, and category are required." }, { status: 400 });
    }

    const platform = await prisma.candidatePlatform.create({
      data: {
        candidateId,
        title,
        description,
        category,
        sourceUrl: sourceUrl || null,
        verificationStatus: verificationStatus || "VERIFIED",
        verifiedAt: verificationStatus === "VERIFIED" ? new Date() : null,
      },
    });

    const clientIP = getClientIP(req.headers);
    await prisma.adminAuditLog.create({
      data: {
        adminEmail: admin.email,
        action: "PLATFORM_CREATED",
        entityType: "CandidatePlatform",
        entityId: platform.id,
        details: `Created platform '${platform.title}' for candidate ${candidateId}`,
        ipAddress: clientIP,
      },
    });

    return NextResponse.json({ success: true, platform }, { status: 201 });
  } catch (error) {
    console.error("Admin platform POST error:", error);
    return NextResponse.json({ error: "Failed to create platform." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = getAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    if (admin.role === "ANALYST") return NextResponse.json({ error: "Forbidden." }, { status: 403 });

    const body = await req.json();
    const { id, ...updateFields } = body;

    if (!id) return NextResponse.json({ error: "Platform ID required." }, { status: 400 });

    const updated = await prisma.candidatePlatform.update({
      where: { id },
      data: {
        ...updateFields,
        ...(updateFields.verificationStatus === "VERIFIED" ? { verifiedAt: new Date() } : {}),
      },
    });

    const clientIP = getClientIP(req.headers);
    await prisma.adminAuditLog.create({
      data: {
        adminEmail: admin.email,
        action: "PLATFORM_UPDATED",
        entityType: "CandidatePlatform",
        entityId: updated.id,
        details: `Updated platform '${updated.title}' (status: ${updated.verificationStatus})`,
        ipAddress: clientIP,
      },
    });

    return NextResponse.json({ success: true, platform: updated });
  } catch (error) {
    console.error("Admin platform PUT error:", error);
    return NextResponse.json({ error: "Failed to update platform." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = getAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    if (admin.role !== "SUPER_ADMIN" && admin.role !== "CANDIDATE_MANAGER") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required." }, { status: 400 });

    await prisma.candidatePlatform.delete({ where: { id } });

    const clientIP = getClientIP(req.headers);
    await prisma.adminAuditLog.create({
      data: {
        adminEmail: admin.email,
        action: "PLATFORM_DELETED",
        entityType: "CandidatePlatform",
        entityId: id,
        details: `Deleted candidate platform ${id}`,
        ipAddress: clientIP,
      },
    });

    return NextResponse.json({ success: true, message: "Platform deleted." });
  } catch (error) {
    console.error("Admin platform DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete platform." }, { status: 500 });
  }
}
