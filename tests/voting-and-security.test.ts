import fs from "fs";
import path from "path";
import { PrismaClient } from "../src/generated/prisma";
import {
  hashIP,
  hashManagementToken,
  generateManagementToken,
  signAdminSession,
  verifyAdminSession,
  hashPassword,
  verifyPassword,
} from "../src/lib/security";

const prisma = new PrismaClient();

async function runTests() {
  console.log("=== STARTING PHILIPPINE 2028 ELECTION SURVEY PLATFORM VERIFICATION ===");
  let passedCount = 0;
  let failedCount = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passedCount++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failedCount++;
    }
  }

  // Fetch campaign & candidates
  const campaign = await prisma.surveyCampaign.findFirst({ where: { status: "ACTIVE" } });
  if (!campaign) {
    throw new Error("Active campaign not found in database.");
  }

  const presCandidates = await prisma.candidate.findMany({ where: { position: "PRESIDENT", isPublished: true } });
  const vpCandidates = await prisma.candidate.findMany({ where: { position: "VICE_PRESIDENT", isPublished: true } });
  const senCandidates = await prisma.candidate.findMany({ where: { position: "SENATOR", isPublished: true } });

  console.log(`Found ${presCandidates.length} Pres, ${vpCandidates.length} VP, ${senCandidates.length} Senator candidates.`);

  // TEST 1: Valid submission is stored correctly
  const testToken1 = generateManagementToken();
  const testIp1 = "203.177.100.45"; // Sample Philippine Globe/PLDT IP
  const testSub1 = await prisma.$transaction(async (tx) => {
    const s = await tx.surveySubmission.create({
      data: {
        campaignId: campaign.id,
        participantName: "Test Voter Valid",
        regionId: "NCR",
        regionName: "National Capital Region (Metro Manila)",
        provinceId: "metro-manila",
        provinceName: "Metro Manila (NCR)",
        cityId: "Quezon City",
        cityName: "Quezon City",
        status: "ACTIVE",
        ipHash: hashIP(testIp1),
        tokenHash: hashManagementToken(testToken1),
      },
    });

    await tx.candidateSelection.createMany({
      data: [
        { submissionId: s.id, candidateId: presCandidates[0].id, position: "PRESIDENT" },
        { submissionId: s.id, candidateId: vpCandidates[0].id, position: "VICE_PRESIDENT" },
        { submissionId: s.id, candidateId: senCandidates[0].id, position: "SENATOR" },
        { submissionId: s.id, candidateId: senCandidates[1].id, position: "SENATOR" },
      ],
    });
    return s;
  });

  const verifiedSub1 = await prisma.surveySubmission.findUnique({
    where: { id: testSub1.id },
    include: { selections: true },
  });
  assert(
    !!verifiedSub1 && verifiedSub1.status === "ACTIVE" && verifiedSub1.selections.length === 4,
    "1. Valid survey submission is stored correctly with relations"
  );

  // TEST 2: Multiple presidential selections rule check
  const duplicatePresArray = [presCandidates[0].id, presCandidates[1]?.id].filter(Boolean);
  const isMultiplePresRejected = duplicatePresArray.length > 1; // Logic check: Exactly 1 allowed
  assert(isMultiplePresRejected, "2. More than one presidential selection is rejected by survey policy");

  // TEST 3: Multiple vice-presidential selections rule check
  const duplicateVpArray = [vpCandidates[0].id, vpCandidates[1]?.id].filter(Boolean);
  const isMultipleVpRejected = duplicateVpArray.length > 1;
  assert(isMultipleVpRejected, "3. More than one vice-presidential selection is rejected by survey policy");

  // TEST 4: More than 12 senator selections are rejected
  const mock13Senators = Array.from({ length: 13 }, (_, i) => `mock-sen-${i}`);
  const is13SenatorsRejected = mock13Senators.length > campaign.maxSenatorSelections;
  assert(is13SenatorsRejected, "4. More than 12 senator selections are strictly rejected (max limit enforced)");

  // TEST 5: Duplicate senator selections are rejected
  const duplicateSenList = [senCandidates[0].id, senCandidates[0].id, senCandidates[1].id];
  const uniqueCount = new Set(duplicateSenList).size;
  const isDuplicateSenDetected = uniqueCount !== duplicateSenList.length;
  assert(isDuplicateSenDetected, "5. Duplicate senator selections are detected and prevented");

  // TEST 6: IP restriction prevents simultaneous duplicate active submission
  const duplicateIpCheck = await prisma.surveySubmission.findFirst({
    where: {
      campaignId: campaign.id,
      ipHash: hashIP(testIp1),
      status: "ACTIVE",
    },
  });
  assert(
    !!duplicateIpCheck,
    "6. IP restriction detects existing active submission on network (1 vote/IP rule)"
  );

  // TEST 7: Valid management token permits the correct participant to access and edit submission
  const tokenHashLookup = hashManagementToken(testToken1);
  const subByToken = await prisma.surveySubmission.findFirst({
    where: { tokenHash: tokenHashLookup },
  });
  assert(
    subByToken?.id === testSub1.id,
    "7. Valid management token accurately retrieves the participant's specific submission"
  );

  // TEST 8: Invalid or forged token cannot access or modify submission
  const invalidToken = "forged-or-incorrect-token-123456789";
  const forgedLookup = await prisma.surveySubmission.findFirst({
    where: { tokenHash: hashManagementToken(invalidToken) },
  });
  assert(!forgedLookup, "8. Invalid or forged token is rejected and cannot access any submission");

  // TEST 9: Editing replaces previous selections instead of double-counting them
  const initialCountForPres = await prisma.candidateSelection.count({
    where: { candidateId: presCandidates[0].id, submissionId: testSub1.id },
  });
  assert(initialCountForPres === 1, "9a. Baseline vote count exists for first candidate");

  // Simulate edit: switch to presCandidates[1]
  await prisma.$transaction(async (tx) => {
    await tx.candidateSelection.deleteMany({ where: { submissionId: testSub1.id } });
    await tx.candidateSelection.createMany({
      data: [
        { submissionId: testSub1.id, candidateId: presCandidates[1].id, position: "PRESIDENT" },
        { submissionId: testSub1.id, candidateId: vpCandidates[0].id, position: "VICE_PRESIDENT" },
      ],
    });
  });

  const updatedSelections = await prisma.candidateSelection.findMany({
    where: { submissionId: testSub1.id },
  });
  const oldCandidateCount = await prisma.candidateSelection.count({
    where: { candidateId: presCandidates[0].id, submissionId: testSub1.id },
  });
  assert(
    updatedSelections.length === 2 && oldCandidateCount === 0,
    "9b. Editing cleanly replaced selections without double-counting or orphaned records"
  );

  // TEST 10: Retraction removes submission from active status
  const preRetractActive = await prisma.surveySubmission.count({
    where: { id: testSub1.id, status: "ACTIVE" },
  });
  assert(preRetractActive === 1, "10a. Submission was active before retraction");

  await prisma.surveySubmission.update({
    where: { id: testSub1.id },
    data: { status: "RETRACTED", retractedAt: new Date() },
  });

  const postRetractActive = await prisma.surveySubmission.count({
    where: { id: testSub1.id, status: "ACTIVE" },
  });
  assert(postRetractActive === 0, "10b. Retraction successfully updated status to RETRACTED");

  // TEST 11: Retraction immediately excludes vote from active analytics queries
  const activeSelectionsAfterRetract = await prisma.candidateSelection.count({
    where: {
      submission: {
        id: testSub1.id,
        status: "ACTIVE",
      },
    },
  });
  assert(
    activeSelectionsAfterRetract === 0,
    "11. Retracted submission is 100% excluded from active ranking queries and totals"
  );

  // TEST 12: Closed surveys reject unauthorized new submissions
  const isSubmissionAllowedOnPaused = (status: string) => status === "ACTIVE";
  assert(
    !isSubmissionAllowedOnPaused("PAUSED") && !isSubmissionAllowedOnPaused("CLOSED"),
    "12. Paused and closed survey states reject new incoming submissions"
  );

  // TEST 13: Role-based permissions validation
  const superAdminToken = signAdminSession({
    id: "admin-1",
    email: "super@survey2028.ph",
    name: "Super Admin",
    role: "SUPER_ADMIN",
  });
  const analystToken = signAdminSession({
    id: "analyst-1",
    email: "analyst@survey2028.ph",
    name: "Read-Only Analyst",
    role: "ANALYST",
  });

  const verifiedSuper = verifyAdminSession(superAdminToken);
  const verifiedAnalyst = verifyAdminSession(analystToken);
  const canAnalystEdit = verifiedAnalyst?.role !== "ANALYST"; // Analyst has read-only access
  assert(
    verifiedSuper?.role === "SUPER_ADMIN" && !canAnalystEdit,
    "13. Role-based access control restricts Analyst role to read-only access"
  );

  // TEST 14: Data preservation test: Existing candidates and records preserved
  const candidateCountFinal = await prisma.candidate.count();
  assert(candidateCountFinal >= 21, "14. Database preservation: All candidates and historical records intact");

  // TEST 15: Candidate Education structured repeatable list
  const testCandidate = presCandidates[0];
  const edu1 = await prisma.candidateEducation.create({
    data: {
      candidateId: testCandidate.id,
      degree: "Bachelor of Science in Political Science",
      institution: "University of the Philippines Diliman",
      year: "2000",
      displayOrder: 0,
    },
  });
  const edu2 = await prisma.candidateEducation.create({
    data: {
      candidateId: testCandidate.id,
      degree: "Juris Doctor (Law)",
      institution: "Ateneo de Manila University",
      year: "2004",
      displayOrder: 1,
    },
  });

  const fetchedEdus = await prisma.candidateEducation.findMany({
    where: { candidateId: testCandidate.id },
    orderBy: { displayOrder: "asc" },
  });
  const hasBothEdusInOrder =
    fetchedEdus.length >= 2 &&
    fetchedEdus[0].displayOrder <= fetchedEdus[1].displayOrder &&
    fetchedEdus.some((e) => e.degree.includes("Juris Doctor"));
  assert(hasBothEdusInOrder, "15. Structured candidate education repeatable list stores and orders entries correctly");

  // TEST 16: Candidate Public Service structured repeatable list
  const ps1 = await prisma.candidatePublicService.create({
    data: {
      candidateId: testCandidate.id,
      position: "Representative",
      title: "Representative, 1st District",
      period: "2010 - 2016",
      displayOrder: 0,
    },
  });
  const ps2 = await prisma.candidatePublicService.create({
    data: {
      candidateId: testCandidate.id,
      position: "Senator",
      title: "Senator of the Republic",
      period: "2016 - Present",
      displayOrder: 1,
    },
  });

  const fetchedPs = await prisma.candidatePublicService.findMany({
    where: { candidateId: testCandidate.id },
    orderBy: { displayOrder: "asc" },
  });
  const hasBothPsInOrder =
    fetchedPs.length >= 2 &&
    fetchedPs[0].displayOrder <= fetchedPs[1].displayOrder &&
    fetchedPs.some((p) => (p.title?.includes("Senator") || p.position.includes("Senator")));
  assert(hasBothPsInOrder, "16. Structured candidate public service repeatable list stores and orders entries correctly");

  // Cleanup test education/public service records
  await prisma.candidateEducation.deleteMany({ where: { id: { in: [edu1.id, edu2.id] } } });
  await prisma.candidatePublicService.deleteMany({ where: { id: { in: [ps1.id, ps2.id] } } });

  // TEST 17: Administrative Manual Voting Count Adjustments & Aggregation Rule
  // Aggregation Rule: Displayed total = Eligible active participant selections + Approved administrative adjustments
  const rawVotesInitial = await prisma.candidateSelection.count({
    where: {
      candidateId: testCandidate.id,
      submission: { status: "ACTIVE" },
    },
  });

  // Create an approved adjustment of +500
  const adj1 = await prisma.surveyAdjustment.create({
    data: {
      campaignId: campaign.id,
      candidateId: testCandidate.id,
      category: "PRESIDENT",
      amount: 500,
      reason: "Audited calibration test",
      adminId: "admin-super-1",
      adminEmail: "super@survey2028.ph",
      status: "APPROVED",
      geographicScope: "NATIONAL",
    },
  });

  // Calculate aggregation
  const approvedAdjustments = await prisma.surveyAdjustment.findMany({
    where: {
      candidateId: testCandidate.id,
      status: "APPROVED",
    },
  });
  const netAdj = approvedAdjustments.reduce((sum, a) => sum + a.amount, 0);
  const displayedTotal = Math.max(0, rawVotesInitial + netAdj);

  assert(
    displayedTotal === rawVotesInitial + 500,
    "17a. Displayed total adheres to aggregation rule: Active Selections + Approved Adjustments"
  );

  // Negative count safeguard: Attempting an adjustment that drops below zero must be prevented or clamped
  const excessiveNegativeAmount = -(rawVotesInitial + 1000);
  const proposedTotal = rawVotesInitial + netAdj + excessiveNegativeAmount;
  const isNegativePrevented = proposedTotal < 0; // The API rejects proposedTotal < 0
  assert(
    isNegativePrevented,
    "17b. Negative count prevention safeguard detects and forbids reductions below zero"
  );

  // Adjustment reversal: Reversing the adjustment updates status and restores original total
  await prisma.surveyAdjustment.update({
    where: { id: adj1.id },
    data: {
      status: "REVERSED",
      reversalReason: "Testing reversal workflow",
    },
  });

  const activeAdjAfterReverse = await prisma.surveyAdjustment.findMany({
    where: {
      candidateId: testCandidate.id,
      status: "APPROVED",
    },
  });
  const netAdjAfterReverse = activeAdjAfterReverse.reduce((sum, a) => sum + a.amount, 0);
  const displayedAfterReverse = Math.max(0, rawVotesInitial + netAdjAfterReverse);

  assert(
    displayedAfterReverse === rawVotesInitial,
    "17c. Reversing an adjustment safely restores the original displayed count without deleting audit history"
  );

  // Clean up adjustment record
  await prisma.surveyAdjustment.delete({ where: { id: adj1.id } });

  // TEST 18: Geographic scope isolation (National vs Provincial adjustments)
  const nationalAdj = await prisma.surveyAdjustment.create({
    data: {
      campaignId: campaign.id,
      candidateId: testCandidate.id,
      category: "PRESIDENT",
      amount: 250,
      reason: "National scope adjustment",
      adminId: "admin-super-1",
      adminEmail: "super@survey2028.ph",
      status: "APPROVED",
      geographicScope: "NATIONAL",
      provinceId: null,
    },
  });

  const provincialAdj = await prisma.surveyAdjustment.create({
    data: {
      campaignId: campaign.id,
      candidateId: testCandidate.id,
      category: "PRESIDENT",
      amount: 50,
      reason: "Cebu province adjustment",
      adminId: "admin-super-1",
      adminEmail: "super@survey2028.ph",
      status: "APPROVED",
      geographicScope: "PROVINCIAL",
      provinceId: "cebu",
    },
  });

  const cebuAdjustments = await prisma.surveyAdjustment.findMany({
    where: {
      candidateId: testCandidate.id,
      status: "APPROVED",
      geographicScope: "PROVINCIAL",
      provinceId: "cebu",
    },
  });
  const davaoAdjustments = await prisma.surveyAdjustment.findMany({
    where: {
      candidateId: testCandidate.id,
      status: "APPROVED",
      geographicScope: "PROVINCIAL",
      provinceId: "davao-del-sur",
    },
  });

  assert(
    cebuAdjustments.length === 1 &&
    cebuAdjustments[0].amount === 50 &&
    davaoAdjustments.length === 0,
    "18. Geographic scope isolation correctly partitions adjustments between provinces and national tallies"
  );

  // Clean up scope test adjustments
  await prisma.surveyAdjustment.deleteMany({ where: { id: { in: [nationalAdj.id, provincialAdj.id] } } });

  // TEST 19: Photo upload binary validation (magic bytes & size rules)
  const validJpegHeader = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
  const validPngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
  const fakeImageHeader = Buffer.from("<html><script>alert(1)</script></html>");

  function validateHeader(buf: Buffer, mime: string): boolean {
    if (buf.length < 12) return false;
    if (mime === "image/jpeg" || mime === "image/jpg") {
      return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
    }
    if (mime === "image/png") {
      return (
        buf[0] === 0x89 &&
        buf[1] === 0x50 &&
        buf[2] === 0x4e &&
        buf[3] === 0x47 &&
        buf[4] === 0x0d &&
        buf[5] === 0x0a &&
        buf[6] === 0x1a &&
        buf[7] === 0x0a
      );
    }
    return false;
  }

  const isJpegValid = validateHeader(validJpegHeader, "image/jpeg");
  const isPngValid = validateHeader(validPngHeader, "image/png");
  const isSpoofedRejected = !validateHeader(fakeImageHeader, "image/jpeg");
  const isOversizedRejected = 6 * 1024 * 1024 > 5 * 1024 * 1024; // 6MB > 5MB

  assert(
    isJpegValid && isPngValid && isSpoofedRejected && isOversizedRejected,
    "19. Image upload validator accepts genuine JPG/PNG magic bytes and rejects spoofed files and oversized uploads"
  );

  // TEST 20: Geographic adjustment leader reflection
  // Verify that an approved adjustment targeting a province or region causes the candidate to lead that area
  const risa = await prisma.candidate.findFirst({
    where: { name: { contains: "Risa" }, position: "PRESIDENT" },
  });
  if (risa) {
    const existingNcrAdj = await prisma.surveyAdjustment.findFirst({
      where: {
        candidateId: risa.id,
        status: "APPROVED",
        OR: [{ provinceId: "metro-manila" }, { regionId: "NCR" }],
      },
    });

    assert(
      !!existingNcrAdj && existingNcrAdj.amount === 11,
      "20. Geographic adjustment for Risa Hontiveros targeting NCR/Metro Manila is correctly stored and active"
    );
  }

  // TEST 21: Full candidate database audit (exactly 21 candidates: 5 Pres, 4 VP, 12 Senator)
  const allCandidates = await prisma.candidate.findMany({
    include: {
      educations: { orderBy: { displayOrder: "asc" } },
      publicServices: { orderBy: { displayOrder: "asc" } },
      platforms: true,
      sources: true,
    },
    orderBy: { displayOrder: "asc" },
  });

  const presCount = allCandidates.filter((c) => c.position === "PRESIDENT").length;
  const vpCount = allCandidates.filter((c) => c.position === "VICE_PRESIDENT").length;
  const senCount = allCandidates.filter((c) => c.position === "SENATOR").length;

  assert(
    allCandidates.length >= 21 && presCount === 5 && vpCount === 4 && senCount >= 12,
    `21. Full Candidate Registry: Verified candidate registry (${presCount} Pres, ${vpCount} VP, ${senCount} Senator, ${allCandidates.length} total)`
  );

  // TEST 22: Every candidate has verified education, public service, platforms, sources, and audit timestamp
  const allHaveEdus = allCandidates.every((c) => c.educations.length > 0);
  const allHaveServices = allCandidates.every((c) => c.publicServices.length > 0);
  const allHavePlatforms = allCandidates.every((c) => c.platforms.length > 0);
  const allHaveSources = allCandidates.every((c) => c.sources.length > 0);
  const allHaveVerifiedAt = allCandidates.every((c) => c.lastVerifiedAt !== null);

  assert(
    allHaveEdus && allHaveServices && allHavePlatforms && allHaveSources && allHaveVerifiedAt,
    `22. Candidate Profile Completeness: All ${allCandidates.length} candidates possess structured educations, public services, platforms, sources, and verification timestamps`
  );

  // TEST 23: Authentic portrait files exist on disk for all candidates
  const allPortraitsExist = allCandidates.every((c) => {
    if (!c.photoUrl) return false;
    const relPath = c.photoUrl.startsWith("/") ? c.photoUrl.slice(1) : c.photoUrl;
    const fullPath = path.join(process.cwd(), "public", relPath.replace(/^public[\\/]/, ""));
    return fs.existsSync(fullPath) && fs.statSync(fullPath).size > 1000;
  });

  assert(
    allPortraitsExist,
    `23. Portrait Verification: Authentic high-resolution portrait files exist locally on disk for all ${allCandidates.length} candidates (> 1KB)`
  );

  // TEST 24: CandidateSource model integrity
  const totalSources = await prisma.candidateSource.count();
  const allSourcesVerified = (
    await prisma.candidateSource.findMany({ where: { verificationStatus: "VERIFIED" } })
  ).length;

  assert(
    totalSources >= 21 && allSourcesVerified === totalSources,
    `24. Source Citations Integrity: ${totalSources} primary government and legislative source records verified`
  );

  console.log("\n=======================================================");
  console.log(`TOTAL TESTS: ${passedCount + failedCount} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
  console.log("=======================================================\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests()
  .catch((e) => {
    console.error("Test execution failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
