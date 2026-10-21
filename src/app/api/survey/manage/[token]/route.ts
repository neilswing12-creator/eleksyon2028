import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashManagementToken } from "@/lib/security";

export const dynamic = "force-dynamic";

// GET: Retrieve private submission
export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  try {
    const rawToken = params.token;
    if (!rawToken || rawToken.length < 16) {
      return NextResponse.json({ error: "Invalid management token format." }, { status: 400 });
    }

    const tokenHash = hashManagementToken(rawToken);

    const submission = await prisma.surveySubmission.findFirst({
      where: { tokenHash },
      include: {
        campaign: true,
        selections: {
          include: {
            candidate: {
              select: {
                id: true,
                name: true,
                slug: true,
                position: true,
                party: true,
                color: true,
                photoUrl: true,
              },
            },
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "No survey submission found matching this private management token." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      submission: {
        id: submission.id,
        participantName: submission.participantName,
        status: submission.status,
        residenceType: submission.residenceType || "DOMESTIC",
        countryCode: submission.countryCode,
        countryName: submission.countryName,
        overseasRegion: submission.overseasRegion,
        overseasCity: submission.overseasCity,
        regionName: submission.regionName,
        provinceName: submission.provinceName,
        cityName: submission.cityName,
        createdAt: submission.createdAt,
        retractedAt: submission.retractedAt,
        campaignStatus: submission.campaign.status,
        selections: submission.selections.map((s) => ({
          position: s.position,
          candidate: s.candidate,
        })),
      },
    });
  } catch (error) {
    console.error("Manage token GET error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// PUT: Edit existing submission selections
export async function PUT(req: NextRequest, { params }: { params: { token: string } }) {
  try {
    const rawToken = params.token;
    if (!rawToken) {
      return NextResponse.json({ error: "Missing management token." }, { status: 400 });
    }

    const tokenHash = hashManagementToken(rawToken);

    const submission = await prisma.surveySubmission.findFirst({
      where: { tokenHash },
      include: { campaign: true },
    });

    if (!submission) {
      return NextResponse.json({ error: "Submission not found." }, { status: 404 });
    }

    if (submission.campaign.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Survey edits are closed because the campaign is no longer active." },
        { status: 403 }
      );
    }

    if (submission.status === "RETRACTED") {
      return NextResponse.json(
        { error: "This survey response was retracted and cannot be edited. You may submit a new vote if the survey is still open." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { presidentialCandidateId, vicePresidentialCandidateId, senatorialCandidateIds } = body;

    // Validate Presidential
    if (presidentialCandidateId) {
      const pres = await prisma.candidate.findUnique({ where: { id: presidentialCandidateId } });
      if (!pres || pres.position !== "PRESIDENT" || !pres.isPublished) {
        return NextResponse.json({ error: "Invalid presidential candidate." }, { status: 400 });
      }
    }

    // Validate VP
    if (vicePresidentialCandidateId) {
      const vp = await prisma.candidate.findUnique({ where: { id: vicePresidentialCandidateId } });
      if (!vp || vp.position !== "VICE_PRESIDENT" || !vp.isPublished) {
        return NextResponse.json({ error: "Invalid vice-presidential candidate." }, { status: 400 });
      }
    }

    // Validate Senators
    const senatorIds: string[] = Array.isArray(senatorialCandidateIds) ? senatorialCandidateIds : [];
    const uniqueSenators = Array.from(new Set(senatorIds));
    if (uniqueSenators.length > submission.campaign.maxSenatorSelections) {
      return NextResponse.json(
        { error: `Maximum of ${submission.campaign.maxSenatorSelections} senatorial selections allowed.` },
        { status: 400 }
      );
    }

    if (uniqueSenators.length > 0) {
      const validSenators = await prisma.candidate.findMany({
        where: { id: { in: uniqueSenators }, position: "SENATOR", isPublished: true },
      });
      if (validSenators.length !== uniqueSenators.length) {
        return NextResponse.json({ error: "One or more invalid senatorial candidates." }, { status: 400 });
      }
    }

    // Atomically replace selections
    await prisma.$transaction(async (tx) => {
      // Delete existing selections for this submission
      await tx.candidateSelection.deleteMany({
        where: { submissionId: submission.id },
      });

      const newSelections = [];
      if (presidentialCandidateId) {
        newSelections.push({
          submissionId: submission.id,
          candidateId: presidentialCandidateId,
          position: "PRESIDENT",
        });
      }
      if (vicePresidentialCandidateId) {
        newSelections.push({
          submissionId: submission.id,
          candidateId: vicePresidentialCandidateId,
          position: "VICE_PRESIDENT",
        });
      }
      for (const sId of uniqueSenators) {
        newSelections.push({
          submissionId: submission.id,
          candidateId: sId,
          position: "SENATOR",
        });
      }

      if (newSelections.length > 0) {
        await tx.candidateSelection.createMany({
          data: newSelections,
        });
      }

      await tx.surveySubmission.update({
        where: { id: submission.id },
        data: { updatedAt: new Date() },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Your survey vote selections have been successfully updated.",
    });
  } catch (error) {
    console.error("Manage token PUT error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// DELETE: Retract submission
export async function DELETE(req: NextRequest, { params }: { params: { token: string } }) {
  try {
    const rawToken = params.token;
    if (!rawToken) {
      return NextResponse.json({ error: "Missing management token." }, { status: 400 });
    }

    const tokenHash = hashManagementToken(rawToken);

    const submission = await prisma.surveySubmission.findFirst({
      where: { tokenHash },
      include: { campaign: true },
    });

    if (!submission) {
      return NextResponse.json({ error: "Submission not found." }, { status: 404 });
    }

    if (submission.status === "RETRACTED") {
      return NextResponse.json({
        message: "This survey response has already been retracted.",
        retractedAt: submission.retractedAt,
      });
    }

    // Retract atomically
    const retracted = await prisma.surveySubmission.update({
      where: { id: submission.id },
      data: {
        status: "RETRACTED",
        retractedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Your survey vote has been successfully retracted. It is now excluded from all public rankings, map calculations, and live statistics.",
      retractedAt: retracted.retractedAt,
    });
  } catch (error) {
    console.error("Manage token DELETE error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
