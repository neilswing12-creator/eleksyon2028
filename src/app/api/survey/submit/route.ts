import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getClientIP, hashIP, generateManagementToken, hashManagementToken } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      participantName,
      regionId,
      regionName,
      provinceId,
      provinceName,
      cityId,
      cityName,
      ageGroup,
      gender,
      civilStatus,
      isFirstTimeVoter,
      presidentialCandidateId,
      vicePresidentialCandidateId,
      senatorialCandidateIds,
    } = body;

    // 1. Participant name validation
    const trimmedName = (participantName || "").trim();
    if (!trimmedName || trimmedName.length < 2) {
      return NextResponse.json(
        { error: "Please provide your name (minimum 2 characters) to participate in the survey." },
        { status: 400 }
      );
    }

    // 2. Check active survey campaign and schedule
    const campaign = await prisma.surveyCampaign.findFirst({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Survey submissions are currently paused or closed by the administrator." },
        { status: 403 }
      );
    }

    const now = new Date();
    if (campaign.startDate && now < new Date(campaign.startDate)) {
      return NextResponse.json(
        { error: `The survey is scheduled to open on ${new Date(campaign.startDate).toLocaleDateString()}.` },
        { status: 403 }
      );
    }

    if (campaign.endDate && now > new Date(campaign.endDate)) {
      return NextResponse.json(
        { error: `The survey closed on ${new Date(campaign.endDate).toLocaleDateString()}. Submissions are no longer accepted.` },
        { status: 403 }
      );
    }

    // 3. Selection rules validation
    // Presidential: exactly 1 if presidential category enabled
    if (campaign.enablePresident && presidentialCandidateId) {
      const presCand = await prisma.candidate.findUnique({
        where: { id: presidentialCandidateId },
      });
      if (!presCand || presCand.position !== "PRESIDENT" || !presCand.isPublished) {
        return NextResponse.json(
          { error: "Selected presidential candidate is invalid or inactive." },
          { status: 400 }
        );
      }
    }

    // Vice Presidential: exactly 1 if VP category enabled
    if (campaign.enableVicePresident && vicePresidentialCandidateId) {
      const vpCand = await prisma.candidate.findUnique({
        where: { id: vicePresidentialCandidateId },
      });
      if (!vpCand || vpCand.position !== "VICE_PRESIDENT" || !vpCand.isPublished) {
        return NextResponse.json(
          { error: "Selected vice-presidential candidate is invalid or inactive." },
          { status: 400 }
        );
      }
    }

    // Senatorial: up to 12 distinct candidates, no duplicates
    const senatorIds: string[] = Array.isArray(senatorialCandidateIds) ? senatorialCandidateIds : [];
    const uniqueSenatorIds = Array.from(new Set(senatorIds));

    if (uniqueSenatorIds.length !== senatorIds.length) {
      return NextResponse.json(
        { error: "Duplicate senatorial selections are not allowed." },
        { status: 400 }
      );
    }

    if (uniqueSenatorIds.length > campaign.maxSenatorSelections) {
      return NextResponse.json(
        {
          error: `You may select a maximum of ${campaign.maxSenatorSelections} senatorial candidates (selected: ${uniqueSenatorIds.length}).`,
        },
        { status: 400 }
      );
    }

    if (uniqueSenatorIds.length > 0) {
      const validSenators = await prisma.candidate.findMany({
        where: {
          id: { in: uniqueSenatorIds },
          position: "SENATOR",
          isPublished: true,
        },
      });

      if (validSenators.length !== uniqueSenatorIds.length) {
        return NextResponse.json(
          { error: "One or more selected senatorial candidates are invalid or inactive." },
          { status: 400 }
        );
      }
    }

    // 4. IP restriction check
    const clientIP = getClientIP(req.headers);
    const ipHash = hashIP(clientIP);

    if (campaign.ipRestrictionEnabled) {
      const existingActiveSubmission = await prisma.surveySubmission.findFirst({
        where: {
          campaignId: campaign.id,
          ipHash,
          status: "ACTIVE",
        },
      });

      if (existingActiveSubmission) {
        return NextResponse.json(
          {
            error:
              "An active survey response has already been recorded from your public network (IP address). Under survey integrity rules, only one active response per public IP is permitted. If you previously voted and wish to modify or retract your vote, please use your private management link.",
            isDuplicateIP: true,
          },
          { status: 409 }
        );
      }
    }

    // 5. Generate high-entropy management token
    const rawManagementToken = generateManagementToken();
    const tokenHash = hashManagementToken(rawManagementToken);

    // 6. Atomic database creation
    const submission = await prisma.$transaction(async (tx) => {
      const newSub = await tx.surveySubmission.create({
        data: {
          campaignId: campaign.id,
          participantName: trimmedName,
          regionId: regionId || null,
          regionName: regionName || null,
          provinceId: provinceId || null,
          provinceName: provinceName || null,
          cityId: cityId || null,
          cityName: cityName || null,
          ageGroup: ageGroup || null,
          gender: gender || null,
          civilStatus: civilStatus || null,
          isFirstTimeVoter: Boolean(isFirstTimeVoter),
          status: "ACTIVE",
          ipHash,
          tokenHash,
        },
      });

      const selectionsToCreate = [];

      if (presidentialCandidateId) {
        selectionsToCreate.push({
          submissionId: newSub.id,
          candidateId: presidentialCandidateId,
          position: "PRESIDENT",
        });
      }

      if (vicePresidentialCandidateId) {
        selectionsToCreate.push({
          submissionId: newSub.id,
          candidateId: vicePresidentialCandidateId,
          position: "VICE_PRESIDENT",
        });
      }

      for (const sId of uniqueSenatorIds) {
        selectionsToCreate.push({
          submissionId: newSub.id,
          candidateId: sId,
          position: "SENATOR",
        });
      }

      if (selectionsToCreate.length > 0) {
        await tx.candidateSelection.createMany({
          data: selectionsToCreate,
        });
      }

      return newSub;
    });

    return NextResponse.json(
      {
        success: true,
        submissionId: submission.id,
        managementToken: rawManagementToken,
        participantName: submission.participantName,
        message: "Your survey response has been successfully submitted.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Survey submission error:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred while processing your survey." },
      { status: 500 }
    );
  }
}
