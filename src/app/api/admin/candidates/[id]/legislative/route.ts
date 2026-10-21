import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/security";

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

// GET all legislative records & jobs for a candidate
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = getAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = params;

    const [candidate, records, importJobs] = await Promise.all([
      prisma.candidate.findUnique({
        where: { id },
        select: { id: true, name: true, slug: true, position: true },
      }),
      prisma.candidateLegislativeRecord.findMany({
        where: { candidateId: id },
        orderBy: [{ congress: "desc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
      }),
      prisma.legislativeImportJob.findMany({
        where: { candidateId: id },
        orderBy: { startedAt: "desc" },
        take: 10,
      }),
    ]);

    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found." }, { status: 404 });
    }

    return NextResponse.json({
      candidate,
      records,
      importJobs,
      summary: {
        total: records.length,
        confirmed: records.filter((r) => r.reviewStatus === "CONFIRMED").length,
        needsReview: records.filter((r) => r.reviewStatus === "NEEDS_REVIEW").length,
        enacted: records.filter(
          (r) => r.status === "ENACTED_INTO_LAW" || r.status === "REPUBLIC_ACT"
        ).length,
      },
    });
  } catch (error: any) {
    console.error("GET legislative records error:", error);
    return NextResponse.json({ error: "Failed to fetch records." }, { status: 500 });
  }
}

// POST create a single legislative record manually
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
    const body = await req.json();

    const {
      chamber,
      congress,
      billNo,
      title,
      longTitle,
      role,
      status,
      republicActNo,
      filedDate,
      sourceInstitution,
      sourceUrl,
      pdfUrl,
      reviewStatus,
    } = body;

    if (!chamber || !congress || !billNo || !title || !role || !sourceUrl) {
      return NextResponse.json(
        { error: "Required fields: chamber, congress, billNo, title, role, sourceUrl." },
        { status: 400 }
      );
    }

    const record = await prisma.candidateLegislativeRecord.create({
      data: {
        candidateId: id,
        chamber: chamber.toUpperCase(),
        congress: parseInt(congress, 10),
        billNo: billNo.trim().toUpperCase(),
        title: title.trim(),
        longTitle: longTitle?.trim() || null,
        role: role.toUpperCase(),
        status: status?.toUpperCase() || "PENDING",
        republicActNo: republicActNo?.trim() || null,
        filedDate: filedDate ? new Date(filedDate) : null,
        sourceInstitution: sourceInstitution || (chamber === "HOUSE" ? "HOUSE_PH" : "SENATE_PH"),
        sourceUrl: sourceUrl.trim(),
        pdfUrl: pdfUrl?.trim() || null,
        reviewStatus: reviewStatus || "CONFIRMED",
        matchConfidence: 1.0,
      },
    });

    await prisma.adminAuditLog.create({
      data: {
        adminEmail: admin.email,
        action: "CREATE_LEGISLATIVE_RECORD",
        entityType: "CandidateLegislativeRecord",
        entityId: record.id,
        details: `Manually added ${billNo} (${title}) for candidate ${id}`,
      },
    });

    return NextResponse.json({ success: true, record });
  } catch (error: any) {
    console.error("POST legislative record error:", error);
    return NextResponse.json({ error: error?.message || "Failed to add record." }, { status: 500 });
  }
}

// PUT update review status or record details
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = getAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { recordId, reviewStatus, title, status, role, notes } = body;

    if (!recordId) {
      return NextResponse.json({ error: "recordId is required." }, { status: 400 });
    }

    const updated = await prisma.candidateLegislativeRecord.update({
      where: { id: recordId, candidateId: id },
      data: {
        ...(reviewStatus ? { reviewStatus } : {}),
        ...(title ? { title } : {}),
        ...(status ? { status } : {}),
        ...(role ? { role } : {}),
        ...(notes !== undefined ? { matchNotes: notes } : {}),
      },
    });

    await prisma.adminAuditLog.create({
      data: {
        adminEmail: admin.email,
        action: "UPDATE_LEGISLATIVE_RECORD",
        entityType: "CandidateLegislativeRecord",
        entityId: recordId,
        details: `Updated record ${updated.billNo} review status to ${reviewStatus || updated.reviewStatus}`,
      },
    });

    return NextResponse.json({ success: true, record: updated });
  } catch (error: any) {
    console.error("PUT legislative record error:", error);
    return NextResponse.json({ error: "Failed to update record." }, { status: 500 });
  }
}

// DELETE a legislative record
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = getAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = params;
    const { searchParams } = new URL(req.url);
    const recordId = searchParams.get("recordId");

    if (!recordId) {
      return NextResponse.json({ error: "recordId is required." }, { status: 400 });
    }

    await prisma.candidateLegislativeRecord.delete({
      where: { id: recordId, candidateId: id },
    });

    await prisma.adminAuditLog.create({
      data: {
        adminEmail: admin.email,
        action: "DELETE_LEGISLATIVE_RECORD",
        entityType: "CandidateLegislativeRecord",
        entityId: recordId,
        details: `Deleted legislative record ${recordId} from candidate ${id}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE legislative record error:", error);
    return NextResponse.json({ error: "Failed to delete record." }, { status: 500 });
  }
}
