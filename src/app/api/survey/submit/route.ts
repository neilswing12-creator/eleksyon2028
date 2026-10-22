import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashIP, generateManagementToken, hashManagementToken } from "@/lib/security";
import { getTrustedClientIp, isIpBlocked, logDuplicateAttempt } from "@/lib/ip-security";
import { isValidCountryCode, getCountryByCode } from "@/lib/overseas-geo";

export async function POST(req: NextRequest) {
  let clientIP = "127.0.0.1";
  let ipHash = "";
  let currentCampaignId = "";
  let trimmedName = "";

  try {
    const body = await req.json();
    const {
      participantName,
      residenceType = "DOMESTIC",
      countryCode,
      overseasCity,
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
    trimmedName = (participantName || "").trim();
    if (!trimmedName || trimmedName.length < 2) {
      return NextResponse.json(
        { error: "Please provide your name (minimum 2 characters) to participate in the survey." },
        { status: 400 }
      );
    }

    // 1b. Location & Overseas validation
    const isOverseas = residenceType === "OVERSEAS";
    let resolvedResidenceType = "DOMESTIC";
    let resolvedCountryCode: string | null = "PH";
    let resolvedCountryName: string | null = "Philippines";
    let resolvedOverseasRegion: string | null = null;
    let resolvedOverseasCity: string | null = null;
    let resolvedRegionId: string | null = regionId || null;
    let resolvedRegionName: string | null = regionName || null;
    let resolvedProvinceId: string | null = provinceId || null;
    let resolvedProvinceName: string | null = provinceName || null;
    let resolvedCityId: string | null = cityId || null;
    let resolvedCityName: string | null = cityName || null;

    if (isOverseas) {
      if (!countryCode || !isValidCountryCode(countryCode)) {
        return NextResponse.json(
          { error: "Please select a valid country of residence outside the Philippines (OFW / Overseas Filipino)." },
          { status: 400 }
        );
      }
      const country = getCountryByCode(countryCode);
      resolvedResidenceType = "OVERSEAS";
      resolvedCountryCode = country ? country.code : countryCode.toUpperCase();
      resolvedCountryName = country ? country.name : countryCode;
      resolvedOverseasRegion = country ? country.region : "Other";
      resolvedOverseasCity = overseasCity ? String(overseasCity).trim().slice(0, 100) : null;
      resolvedRegionId = null;
      resolvedRegionName = null;
      resolvedProvinceId = null;
      resolvedProvinceName = null;
      resolvedCityId = null;
      resolvedCityName = null;
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
    currentCampaignId = campaign.id;

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

    // 4. IP restriction check with trusted proxy resolution & normalization
    clientIP = getTrustedClientIp(req.headers);
    ipHash = hashIP(clientIP);

    // Check if IP is actively blocked under security rules
    const blockCheck = await isIpBlocked(clientIP);
    if (blockCheck.isBlocked) {
      await logDuplicateAttempt({
        campaignId: campaign.id,
        ipAddress: clientIP,
        ipHash,
        attemptedName: trimmedName,
        rejectionReason: "IP_BLOCKED",
        userAgent: req.headers.get("user-agent") || undefined,
      });
      return NextResponse.json(
        {
          error:
            "Access from this network address is currently restricted under security integrity rules. Contact support or administration if you believe this is an error.",
        },
        { status: 403 }
      );
    }

    // Enforce 1 active response per public IP for the active campaign
    if (campaign.ipRestrictionEnabled) {
      const existingActiveSubmission = await prisma.surveySubmission.findFirst({
        where: {
          campaignId: campaign.id,
          ipHash,
          status: "ACTIVE",
        },
        select: {
          id: true,
          ipHash: true,
          status: true,
        },
      });

      if (existingActiveSubmission) {
        await logDuplicateAttempt({
          campaignId: campaign.id,
          ipAddress: clientIP,
          ipHash,
          attemptedName: trimmedName,
          rejectionReason: "DUPLICATE_ACTIVE_IP",
          existingSubmissionId: existingActiveSubmission.id,
          userAgent: req.headers.get("user-agent") || undefined,
        });

        return NextResponse.json(
          {
            error:
              "An active survey response has already been recorded from your public network (IP address) for this election poll. Under civic survey integrity standards, only one active response per public network is permitted for the duration of this poll. If you previously voted, use your private management link to modify or retract your selections.",
            isDuplicateIP: true,
          },
          { status: 409 }
        );
      }
    }

    // 5. Generate high-entropy management token
    const rawManagementToken = generateManagementToken();
    const tokenHash = hashManagementToken(rawManagementToken);

    // 6. Atomic database creation with concurrency check
    const submission = await prisma.$transaction(async (tx) => {
      // Re-verify inside atomic transaction to prevent simultaneous race conditions
      if (campaign.ipRestrictionEnabled) {
        const inTxDuplicate = await tx.surveySubmission.findFirst({
          where: {
            campaignId: campaign.id,
            ipHash,
            status: "ACTIVE",
          },
          select: {
            id: true,
          },
        });
        if (inTxDuplicate) {
          const err: any = new Error("CONCURRENT_DUPLICATE_IP");
          err.existingId = inTxDuplicate.id;
          throw err;
        }
      }

      let newSub;
      try {
        newSub = await tx.surveySubmission.create({
          data: {
            campaignId: campaign.id,
            participantName: trimmedName,
            residenceType: resolvedResidenceType,
            countryCode: resolvedCountryCode,
            countryName: resolvedCountryName,
            overseasRegion: resolvedOverseasRegion,
            overseasCity: resolvedOverseasCity,
            regionId: resolvedRegionId,
            regionName: resolvedRegionName,
            provinceId: resolvedProvinceId,
            provinceName: resolvedProvinceName,
            cityId: resolvedCityId,
            cityName: resolvedCityName,
            ageGroup: ageGroup || null,
            gender: gender || null,
            civilStatus: civilStatus || null,
            isFirstTimeVoter: Boolean(isFirstTimeVoter),
            status: "ACTIVE",
            ipAddress: clientIP,
            ipHash,
            tokenHash,
          },
        });
      } catch (createErr: any) {
        // Fallback if SQLite table SurveySubmission does not yet have ipAddress column
        if (
          createErr?.message?.includes("ipAddress") ||
          createErr?.code === "P2021" ||
          createErr?.code === "P2022"
        ) {
          newSub = await tx.surveySubmission.create({
            data: {
              campaignId: campaign.id,
              participantName: trimmedName,
              residenceType: resolvedResidenceType,
              countryCode: resolvedCountryCode,
              countryName: resolvedCountryName,
              overseasRegion: resolvedOverseasRegion,
              overseasCity: resolvedOverseasCity,
              regionId: resolvedRegionId,
              regionName: resolvedRegionName,
              provinceId: resolvedProvinceId,
              provinceName: resolvedProvinceName,
              cityId: resolvedCityId,
              cityName: resolvedCityName,
              ageGroup: ageGroup || null,
              gender: gender || null,
              civilStatus: civilStatus || null,
              isFirstTimeVoter: Boolean(isFirstTimeVoter),
              status: "ACTIVE",
              ipHash,
              tokenHash,
            },
          });
        } else {
          throw createErr;
        }
      }

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
        residenceType: submission.residenceType,
        countryCode: submission.countryCode,
        countryName: submission.countryName,
        overseasCity: submission.overseasCity,
        provinceName: submission.provinceName,
        message: "Your survey response has been successfully submitted.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error?.message === "CONCURRENT_DUPLICATE_IP") {
      if (currentCampaignId) {
        await logDuplicateAttempt({
          campaignId: currentCampaignId,
          ipAddress: clientIP,
          ipHash,
          attemptedName: trimmedName,
          rejectionReason: "CONCURRENT_DUPLICATE_IP",
          existingSubmissionId: error.existingId,
          userAgent: req.headers.get("user-agent") || undefined,
        });
      }
      return NextResponse.json(
        {
          error:
            "A concurrent survey response from your public network (IP address) was already recorded. Under survey integrity rules, only one active response per public network is permitted.",
          isDuplicateIP: true,
        },
        { status: 409 }
      );
    }

    console.error("Survey submission error:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred while processing your survey." },
      { status: 500 }
    );
  }
}
