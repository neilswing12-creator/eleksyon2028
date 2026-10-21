import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PHILIPPINE_PROVINCES, PHILIPPINE_REGIONS, PHILIPPINE_VOTERS_DEMOGRAPHICS } from "@/lib/philippines-geo";
import { verifyAdminSession } from "@/lib/security";
import { getStartOfManilaToday } from "@/lib/timezone";
import { getCountryByCode } from "@/lib/overseas-geo";

export const dynamic = "force-dynamic";

function getAdmin(req: NextRequest | Request) {
  const authHeader = req.headers?.get("authorization");
  let token = "";
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else if ((req as any).cookies?.get) {
    token = (req as any).cookies.get("admin_session")?.value || "";
  }
  return verifyAdminSession(token);
}

export async function GET(req: NextRequest) {
  try {
    const campaign = await prisma.surveyCampaign.findFirst({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    });

    const campaignId = campaign?.id;
    const minThreshold = campaign?.minResponseThreshold ?? 1;
    const publicResultsVisible = campaign?.publicResultsVisible ?? true;
    const geographicResultsVisible = campaign?.geographicResultsVisible ?? true;

    const admin = getAdmin(req);
    // If public results are disabled and user is not an admin, return advisory
    if (!publicResultsVisible && !admin) {
      return NextResponse.json({
        publicResultsVisible: false,
        message: "Survey results are temporarily withheld by the survey administrator.",
        summary: {
          totalActiveSubmissions: await prisma.surveySubmission.count({
            where: { status: "ACTIVE", ...(campaignId ? { campaignId } : {}) },
          }),
          campaignStatus: campaign?.status || "ACTIVE",
          lastUpdated: new Date().toISOString(),
        },
        presidentialRankings: [],
        vicePresidentialRankings: [],
        senatorialRankings: [],
        provinces: [],
        regions: [],
      });
    }

    // 1. Overall counts (Single source of truth: active, eligible submissions)
    const activeSubmissionsCount = await prisma.surveySubmission.count({
      where: { status: "ACTIVE", ...(campaignId ? { campaignId } : {}) },
    });

    const retractedSubmissionsCount = await prisma.surveySubmission.count({
      where: { status: "RETRACTED", ...(campaignId ? { campaignId } : {}) },
    });

    // Calculate today's submissions strictly according to Philippine calendar day (Asia/Manila, UTC+08:00)
    const startOfManilaToday = getStartOfManilaToday();

    const todaySubmissionsCount = await prisma.surveySubmission.count({
      where: {
        status: "ACTIVE",
        createdAt: { gte: startOfManilaToday },
        ...(campaignId ? { campaignId } : {}),
      },
    });

    // Read administrative adjustments and overrides for official statistics
    const activeVotesAdjustment = campaign?.activeVotesAdjustment ?? 0;
    const todayVotesAdjustment = campaign?.todayVotesAdjustment ?? 0;
    const domesticVotesAdjustment = campaign?.domesticVotesAdjustment ?? 0;
    const overseasVotesAdjustment = campaign?.overseasVotesAdjustment ?? 0;
    const provincesReportingOverride = campaign?.provincesReportingOverride ?? null;

    const displayedActiveVotes = Math.max(0, activeSubmissionsCount + activeVotesAdjustment);
    const displayedTodayVotes = Math.max(0, todaySubmissionsCount + todayVotesAdjustment);

    // 2. Fetch all published candidates
    const candidates = await prisma.candidate.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        slug: true,
        name: true,
        position: true,
        party: true,
        color: true,
        photoUrl: true,
        displayOrder: true,
      },
      orderBy: { displayOrder: "asc" },
    });

    // 3. Fetch all active selections
    const activeSelections = await prisma.candidateSelection.findMany({
      where: {
        submission: {
          status: "ACTIVE",
          ...(campaignId ? { campaignId } : {}),
        },
      },
      select: {
        candidateId: true,
        position: true,
        submission: {
          select: {
            id: true,
            residenceType: true,
            regionId: true,
            provinceId: true,
            provinceName: true,
            cityId: true,
            cityName: true,
          },
        },
      },
    });

    // 4. Fetch Approved Administrative Adjustments
    const approvedAdjustments = await prisma.surveyAdjustment.findMany({
      where: {
        status: "APPROVED",
        ...(campaignId ? { campaignId } : {}),
      },
    });

    // Calculate total net adjustment amounts added manually by admin
    const totalAdjustmentAmount = approvedAdjustments.reduce((sum, adj) => sum + adj.amount, 0);
    const todayAdjustmentAmount = approvedAdjustments
      .filter((adj) => adj.createdAt >= startOfManilaToday)
      .reduce((sum, adj) => sum + adj.amount, 0);

    // National adjustments grouped by candidate & category
    const nationalAdjustmentMap: Record<string, number> = {};
    const provincialAdjustmentMap: Record<string, Record<string, number>> = {};
    const regionalAdjustmentMap: Record<string, Record<string, number>> = {};

    approvedAdjustments.forEach((adj) => {
      // National level accumulation (every approved adjustment adds to national tally)
      nationalAdjustmentMap[adj.candidateId] =
        (nationalAdjustmentMap[adj.candidateId] || 0) + adj.amount;

      // Province-level adjustment
      if (adj.provinceId) {
        if (!provincialAdjustmentMap[adj.provinceId]) {
          provincialAdjustmentMap[adj.provinceId] = {};
        }
        provincialAdjustmentMap[adj.provinceId][adj.candidateId] =
          (provincialAdjustmentMap[adj.provinceId][adj.candidateId] || 0) + adj.amount;

        // Auto-associate region if province has a region
        const prov = PHILIPPINE_PROVINCES.find((p) => p.id === adj.provinceId);
        const rId = adj.regionId || prov?.regionId;
        if (rId) {
          if (!regionalAdjustmentMap[rId]) {
            regionalAdjustmentMap[rId] = {};
          }
          regionalAdjustmentMap[rId][adj.candidateId] =
            (regionalAdjustmentMap[rId][adj.candidateId] || 0) + adj.amount;
        }
      } else if (adj.regionId) {
        // Direct Region-level adjustment
        if (!regionalAdjustmentMap[adj.regionId]) {
          regionalAdjustmentMap[adj.regionId] = {};
        }
        regionalAdjustmentMap[adj.regionId][adj.candidateId] =
          (regionalAdjustmentMap[adj.regionId][adj.candidateId] || 0) + adj.amount;

        // Map to provinces in this region (e.g. NCR -> metro-manila)
        const provsInRegion = PHILIPPINE_PROVINCES.filter((p) => p.regionId === adj.regionId);
        if (provsInRegion.length === 1) {
          const pId = provsInRegion[0].id;
          if (!provincialAdjustmentMap[pId]) provincialAdjustmentMap[pId] = {};
          provincialAdjustmentMap[pId][adj.candidateId] =
            (provincialAdjustmentMap[pId][adj.candidateId] || 0) + adj.amount;
        } else if (provsInRegion.length > 1) {
          const pId = provsInRegion[0].id;
          if (!provincialAdjustmentMap[pId]) provincialAdjustmentMap[pId] = {};
          provincialAdjustmentMap[pId][adj.candidateId] =
            (provincialAdjustmentMap[pId][adj.candidateId] || 0) + adj.amount;
        }
      }
    });

    // 5. Calculate National Rankings for each position
    // Formula: Displayed total = Eligible active participant selections + Approved administrative adjustments
    
    // --- President ---
    const presSelections = activeSelections.filter((s) => s.position === "PRESIDENT");
    const rawPresMap: Record<string, number> = {};
    presSelections.forEach((s) => {
      rawPresMap[s.candidateId] = (rawPresMap[s.candidateId] || 0) + 1;
    });

    let totalPresDisplayedVotes = 0;
    const presidentialCandidateList = candidates
      .filter((c) => c.position === "PRESIDENT")
      .map((c) => {
        const rawVotes = rawPresMap[c.id] || 0;
        const adj = nationalAdjustmentMap[c.id] || 0;
        const displayedVotes = Math.max(0, rawVotes + adj);
        totalPresDisplayedVotes += displayedVotes;
        return {
          ...c,
          rawVotes,
          adjustmentAmount: adj,
          hasAdjustments: adj !== 0,
          votes: displayedVotes,
        };
      });

    const presidentialRankings = presidentialCandidateList
      .map((c) => {
        const percentage =
          totalPresDisplayedVotes > 0
            ? Number(((c.votes / totalPresDisplayedVotes) * 100).toFixed(1))
            : 0;
        return {
          ...c,
          percentage,
        };
      })
      .sort((a, b) => b.votes - a.votes);

    // --- Vice President ---
    const vpSelections = activeSelections.filter((s) => s.position === "VICE_PRESIDENT");
    const rawVpMap: Record<string, number> = {};
    vpSelections.forEach((s) => {
      rawVpMap[s.candidateId] = (rawVpMap[s.candidateId] || 0) + 1;
    });

    let totalVpDisplayedVotes = 0;
    const vicePresidentialCandidateList = candidates
      .filter((c) => c.position === "VICE_PRESIDENT")
      .map((c) => {
        const rawVotes = rawVpMap[c.id] || 0;
        const adj = nationalAdjustmentMap[c.id] || 0;
        const displayedVotes = Math.max(0, rawVotes + adj);
        totalVpDisplayedVotes += displayedVotes;
        return {
          ...c,
          rawVotes,
          adjustmentAmount: adj,
          hasAdjustments: adj !== 0,
          votes: displayedVotes,
        };
      });

    const vicePresidentialRankings = vicePresidentialCandidateList
      .map((c) => {
        const percentage =
          totalVpDisplayedVotes > 0
            ? Number(((c.votes / totalVpDisplayedVotes) * 100).toFixed(1))
            : 0;
        return {
          ...c,
          percentage,
        };
      })
      .sort((a, b) => b.votes - a.votes);

    // --- Senatorial ---
    const senSelections = activeSelections.filter((s) => s.position === "SENATOR");
    const rawSenMap: Record<string, number> = {};
    senSelections.forEach((s) => {
      rawSenMap[s.candidateId] = (rawSenMap[s.candidateId] || 0) + 1;
    });

    const totalActiveVotes = Math.max(1, displayedActiveVotes);

    const senatorialRankings = candidates
      .filter((c) => c.position === "SENATOR")
      .map((c) => {
        const rawVotes = rawSenMap[c.id] || 0;
        const adj = nationalAdjustmentMap[c.id] || 0;
        const displayedVotes = Math.max(0, rawVotes + adj);
        const voterPercentage =
          totalActiveVotes > 0
            ? Number(((displayedVotes / totalActiveVotes) * 100).toFixed(1))
            : 0;
        return {
          ...c,
          rawVotes,
          adjustmentAmount: adj,
          hasAdjustments: adj !== 0,
          votes: displayedVotes,
          percentage: voterPercentage,
        };
      })
      .sort((a, b) => b.votes - a.votes);

    // 6. Geographic Aggregation by Province
    const provinceDataMap: Record<
      string,
      {
        totalSubmissions: number;
        presVotes: Record<string, number>;
        vpVotes: Record<string, number>;
        senVotes: Record<string, number>;
      }
    > = {};

    const activeSubmissions = await prisma.surveySubmission.findMany({
      where: { status: "ACTIVE", ...(campaignId ? { campaignId } : {}) },
      select: {
        id: true,
        residenceType: true,
        countryCode: true,
        countryName: true,
        overseasRegion: true,
        overseasCity: true,
        provinceId: true,
        provinceName: true,
        regionId: true,
      },
    });

    // 7. Overseas Filipino Participation Aggregation
    const overseasSubmissions = activeSubmissions.filter((s) => s.residenceType === "OVERSEAS");
    const domesticSubmissions = activeSubmissions.filter((s) => s.residenceType !== "OVERSEAS");
    const overseasTotalCount = overseasSubmissions.length;
    const domesticTotalCount = domesticSubmissions.length;
    const displayedDomesticCount = Math.max(0, domesticTotalCount + domesticVotesAdjustment);
    const displayedOverseasCount = Math.max(0, overseasTotalCount + overseasVotesAdjustment);

    // Group overseas submissions by Country
    const overseasCountryMap: Record<
      string,
      { code: string; name: string; region: string; flag: string; count: number }
    > = {};

    overseasSubmissions.forEach((sub) => {
      const code = sub.countryCode || "OTHER";
      if (!overseasCountryMap[code]) {
        const cInfo = getCountryByCode(code);
        overseasCountryMap[code] = {
          code,
          name: sub.countryName || cInfo?.name || code,
          region: sub.overseasRegion || cInfo?.region || "Other",
          flag: cInfo?.flag || "🌐",
          count: 0,
        };
      }
      overseasCountryMap[code].count += 1;
    });

    const overseasCountryBreakdown = Object.values(overseasCountryMap)
      .map((item) => ({
        ...item,
        percentage:
          overseasTotalCount > 0
            ? Number(((item.count / overseasTotalCount) * 100).toFixed(1))
            : 0,
        percentageOfTotal:
          activeSubmissionsCount > 0
            ? Number(((item.count / activeSubmissionsCount) * 100).toFixed(1))
            : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // Group overseas submissions by Region abroad (Middle East, Asia Pacific, etc.)
    const overseasRegionMap: Record<string, { region: string; count: number }> = {};
    overseasSubmissions.forEach((sub) => {
      const reg = sub.overseasRegion || "Other";
      if (!overseasRegionMap[reg]) {
        overseasRegionMap[reg] = { region: reg, count: 0 };
      }
      overseasRegionMap[reg].count += 1;
    });

    const overseasRegionBreakdown = Object.values(overseasRegionMap)
      .map((item) => ({
        ...item,
        percentage:
          overseasTotalCount > 0
            ? Number(((item.count / overseasTotalCount) * 100).toFixed(1))
            : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // Count distinct provinces with active qualifying submissions (DOMESTIC ONLY)
    const distinctReportingProvinceIds = new Set(
      activeSubmissions
        .filter((s) => s.residenceType !== "OVERSEAS")
        .map((s) => s.provinceId)
        .filter((pId): pId is string => Boolean(pId && PHILIPPINE_PROVINCES.some((p) => p.id === pId)))
    );
    const calculatedProvincesReporting = distinctReportingProvinceIds.size;
    const totalProvincesCount = PHILIPPINE_PROVINCES.length; // 82
    const displayedProvincesReporting =
      provincesReportingOverride !== null && provincesReportingOverride !== undefined
        ? Math.min(totalProvincesCount, Math.max(0, provincesReportingOverride))
        : calculatedProvincesReporting;

    activeSubmissions.forEach((sub) => {
      // Overseas responses must never be added to Philippine province tallies
      if (sub.residenceType === "OVERSEAS") return;
      const pKey = sub.provinceId || "unspecified";
      if (!provinceDataMap[pKey]) {
        provinceDataMap[pKey] = {
          totalSubmissions: 0,
          presVotes: {},
          vpVotes: {},
          senVotes: {},
        };
      }
      provinceDataMap[pKey].totalSubmissions += 1;
    });

    activeSelections.forEach((s) => {
      // Overseas responses must never be assigned to Philippine province tallies
      if (s.submission.residenceType === "OVERSEAS") return;
      const pKey = s.submission.provinceId || "unspecified";
      if (!provinceDataMap[pKey]) {
        provinceDataMap[pKey] = {
          totalSubmissions: 0,
          presVotes: {},
          vpVotes: {},
          senVotes: {},
        };
      }
      if (s.position === "PRESIDENT") {
        provinceDataMap[pKey].presVotes[s.candidateId] =
          (provinceDataMap[pKey].presVotes[s.candidateId] || 0) + 1;
      } else if (s.position === "VICE_PRESIDENT") {
        provinceDataMap[pKey].vpVotes[s.candidateId] =
          (provinceDataMap[pKey].vpVotes[s.candidateId] || 0) + 1;
      } else if (s.position === "SENATOR") {
        provinceDataMap[pKey].senVotes[s.candidateId] =
          (provinceDataMap[pKey].senVotes[s.candidateId] || 0) + 1;
      }
    });

    // Apply explicit province-level adjustments if any
    Object.entries(provincialAdjustmentMap).forEach(([pId, candAdjustments]) => {
      if (!provinceDataMap[pId]) {
        provinceDataMap[pId] = {
          totalSubmissions: 0,
          presVotes: {},
          vpVotes: {},
          senVotes: {},
        };
      }
      Object.entries(candAdjustments).forEach(([cId, amount]) => {
        const cand = candidates.find((c) => c.id === cId);
        if (cand?.position === "PRESIDENT") {
          provinceDataMap[pId].presVotes[cId] = Math.max(
            0,
            (provinceDataMap[pId].presVotes[cId] || 0) + amount
          );
        } else if (cand?.position === "VICE_PRESIDENT") {
          provinceDataMap[pId].vpVotes[cId] = Math.max(
            0,
            (provinceDataMap[pId].vpVotes[cId] || 0) + amount
          );
        } else if (cand?.position === "SENATOR") {
          provinceDataMap[pId].senVotes[cId] = Math.max(
            0,
            (provinceDataMap[pId].senVotes[cId] || 0) + amount
          );
        }
      });
      // Ensure totalSubmissions reflects actual vote counts after adjustments
      const pTotal = Math.max(
        provinceDataMap[pId].totalSubmissions,
        Object.values(provinceDataMap[pId].presVotes).reduce((a, b) => a + b, 0),
        Object.values(provinceDataMap[pId].vpVotes).reduce((a, b) => a + b, 0)
      );
      provinceDataMap[pId].totalSubmissions = pTotal;
    });

    const candidateLookup = new Map(candidates.map((c) => [c.id, c]));

    // Construct enriched province statistics
    const provincesAnalytics = geographicResultsVisible
      ? PHILIPPINE_PROVINCES.map((p) => {
          const data = provinceDataMap[p.id] || {
            totalSubmissions: 0,
            presVotes: {},
            vpVotes: {},
            senVotes: {},
          };

          const hasSufficientData = data.totalSubmissions >= minThreshold;

          // Leading President
          const presEntries = Object.entries(data.presVotes).sort((a, b) => b[1] - a[1]);
          let leadingPres = null;
          let presMargin = 0;
          if (presEntries.length > 0 && hasSufficientData) {
            const topCandidate = candidateLookup.get(presEntries[0][0]);
            const topVotes = presEntries[0][1];
            const secondVotes = presEntries[1] ? presEntries[1][1] : 0;
            const totalP = Object.values(data.presVotes).reduce((sum, v) => sum + v, 0);
            presMargin = totalP > 0 ? Number((((topVotes - secondVotes) / totalP) * 100).toFixed(1)) : 0;

            if (topCandidate) {
              leadingPres = {
                id: topCandidate.id,
                name: topCandidate.name,
                color: topCandidate.color,
                votes: topVotes,
                share: totalP > 0 ? Number(((topVotes / totalP) * 100).toFixed(1)) : 0,
                margin: presMargin,
              };
            }
          }

          // Leading VP
          const vpEntries = Object.entries(data.vpVotes).sort((a, b) => b[1] - a[1]);
          let leadingVp = null;
          if (vpEntries.length > 0 && hasSufficientData) {
            const topCandidate = candidateLookup.get(vpEntries[0][0]);
            const topVotes = vpEntries[0][1];
            const totalV = Object.values(data.vpVotes).reduce((sum, v) => sum + v, 0);
            if (topCandidate) {
              leadingVp = {
                id: topCandidate.id,
                name: topCandidate.name,
                color: topCandidate.color,
                votes: topVotes,
                share: totalV > 0 ? Number(((topVotes / totalV) * 100).toFixed(1)) : 0,
              };
            }
          }

          // Top Senators in province
          const senEntries = Object.entries(data.senVotes)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([cId, count]) => {
              const cand = candidateLookup.get(cId);
              return {
                id: cId,
                name: cand?.name || "Unknown",
                color: cand?.color || "#3B82F6",
                votes: count,
              };
            });

          return {
            id: p.id,
            name: p.name,
            regionId: p.regionId,
            islandGroup: p.islandGroup,
            centerLat: p.centerLat,
            centerLng: p.centerLng,
            svgX: p.svgX,
            svgY: p.svgY,
            cities: p.cities,
            totalSubmissions: data.totalSubmissions,
            hasSufficientData,
            leadingPresident: leadingPres,
            leadingVicePresident: leadingVp,
            topSenators: senEntries,
            presVotes: data.presVotes,
            vpVotes: data.vpVotes,
            senVotes: data.senVotes,
          };
        })
      : [];

    // 7. Island Group distribution
    const islandCounts = { Luzon: 0, Visayas: 0, Mindanao: 0 };
    provincesAnalytics.forEach((p) => {
      islandCounts[p.islandGroup] += p.totalSubmissions;
    });

    // 8. Regional breakdown
    const regionMap: Record<
      string,
      { presVotes: Record<string, number>; vpVotes: Record<string, number>; senVotes: Record<string, number> }
    > = {};
    PHILIPPINE_REGIONS.forEach((r) => {
      regionMap[r.id] = { presVotes: {}, vpVotes: {}, senVotes: {} };
    });

    // Aggregate votes from all provinces belonging to each region
    provincesAnalytics.forEach((prov) => {
      const regId = prov.regionId;
      if (regId && regionMap[regId]) {
        if (prov.presVotes) {
          Object.entries(prov.presVotes).forEach(([cId, v]) => {
            regionMap[regId].presVotes[cId] = (regionMap[regId].presVotes[cId] || 0) + (v as number);
          });
        }
        if (prov.vpVotes) {
          Object.entries(prov.vpVotes).forEach(([cId, v]) => {
            regionMap[regId].vpVotes[cId] = (regionMap[regId].vpVotes[cId] || 0) + (v as number);
          });
        }
        if (prov.senVotes) {
          Object.entries(prov.senVotes).forEach(([cId, v]) => {
            regionMap[regId].senVotes[cId] = (regionMap[regId].senVotes[cId] || 0) + (v as number);
          });
        }
      }
    });

    // Also include any standalone direct region-level adjustments if not already covered by provinces
    Object.entries(regionalAdjustmentMap).forEach(([rId, candAdjustments]) => {
      if (regionMap[rId]) {
        Object.entries(candAdjustments).forEach(([cId, amount]) => {
          const provsInReg = PHILIPPINE_PROVINCES.filter((p) => p.regionId === rId);
          if (provsInReg.length === 0) {
            const cand = candidates.find((c) => c.id === cId);
            if (cand?.position === "PRESIDENT") {
              regionMap[rId].presVotes[cId] = Math.max(0, (regionMap[rId].presVotes[cId] || 0) + amount);
            } else if (cand?.position === "VICE_PRESIDENT") {
              regionMap[rId].vpVotes[cId] = Math.max(0, (regionMap[rId].vpVotes[cId] || 0) + amount);
            } else if (cand?.position === "SENATOR") {
              regionMap[rId].senVotes[cId] = Math.max(0, (regionMap[rId].senVotes[cId] || 0) + amount);
            }
          }
        });
      }
    });

    const regionsAnalytics = geographicResultsVisible
      ? PHILIPPINE_REGIONS.map((r) => {
          const regData = regionMap[r.id] || { presVotes: {}, vpVotes: {}, senVotes: {} };

          // Leading President
          const presEntries = Object.entries(regData.presVotes).sort((a, b) => b[1] - a[1]);
          let leadingPres = null;
          let presMargin = 0;
          if (presEntries.length > 0 && presEntries[0][1] > 0) {
            const topCand = candidateLookup.get(presEntries[0][0]);
            const topVotes = presEntries[0][1];
            const secondVotes = presEntries[1] ? presEntries[1][1] : 0;
            const totalP = Object.values(regData.presVotes).reduce((sum, v) => sum + v, 0);
            presMargin = totalP > 0 ? Number((((topVotes - secondVotes) / totalP) * 100).toFixed(1)) : 0;
            if (topCand) {
              leadingPres = {
                id: topCand.id,
                name: topCand.name,
                color: topCand.color,
                votes: topVotes,
                share: totalP > 0 ? Number(((topVotes / totalP) * 100).toFixed(1)) : 0,
                margin: presMargin,
              };
            }
          }

          // Leading VP
          const vpEntries = Object.entries(regData.vpVotes).sort((a, b) => b[1] - a[1]);
          let leadingVp = null;
          let vpMargin = 0;
          if (vpEntries.length > 0 && vpEntries[0][1] > 0) {
            const topCand = candidateLookup.get(vpEntries[0][0]);
            const topVotes = vpEntries[0][1];
            const secondVotes = vpEntries[1] ? vpEntries[1][1] : 0;
            const totalV = Object.values(regData.vpVotes).reduce((sum, v) => sum + v, 0);
            vpMargin = totalV > 0 ? Number((((topVotes - secondVotes) / totalV) * 100).toFixed(1)) : 0;
            if (topCand) {
              leadingVp = {
                id: topCand.id,
                name: topCand.name,
                color: topCand.color,
                votes: topVotes,
                share: totalV > 0 ? Number(((topVotes / totalV) * 100).toFixed(1)) : 0,
                margin: vpMargin,
              };
            }
          }

          // Leading Senators
          const senEntries = Object.entries(regData.senVotes)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([cId, count]) => {
              const cand = candidateLookup.get(cId);
              return {
                id: cId,
                name: cand?.name || "Unknown",
                color: cand?.color || "#3B82F6",
                votes: count,
              };
            });

          const totalRegSubmissions = Math.max(
            Object.values(regData.presVotes).reduce((a, b) => a + b, 0),
            Object.values(regData.vpVotes).reduce((a, b) => a + b, 0)
          );

          return {
            id: r.id,
            code: r.code,
            name: r.name,
            islandGroup: r.islandGroup,
            centerLat: r.centerLat,
            centerLng: r.centerLng,
            registeredVoters: r.registeredVoters || 0,
            totalSubmissions: totalRegSubmissions,
            leadingPresident: leadingPres,
            leadingVicePresident: leadingVp,
            topSenators: senEntries,
            presVotes: regData.presVotes,
            vpVotes: regData.vpVotes,
            senVotes: regData.senVotes,
          };
        })
      : [];

    // 9. Voter Demographics Analysis
    const demographicSubmissions = await prisma.surveySubmission.findMany({
      where: {
        status: "ACTIVE",
        ...(campaignId ? { campaignId } : {}),
      },
      select: {
        ageGroup: true,
        gender: true,
        civilStatus: true,
        isFirstTimeVoter: true,
      },
    });

    const surveyGenerations: Record<string, number> = {
      "Gen Z (18-25)": 0,
      "Millennials (26-41)": 0,
      "Gen X (42-57)": 0,
      "Boomers & Elders (58+)": 0,
    };
    const surveyGenders: Record<string, number> = { Female: 0, Male: 0, Other: 0 };
    let firstTimeVoterCount = 0;

    demographicSubmissions.forEach((sub) => {
      if (sub.ageGroup === "18-24" || sub.ageGroup === "18-25") surveyGenerations["Gen Z (18-25)"]++;
      else if (sub.ageGroup === "25-34" || sub.ageGroup === "26-41") surveyGenerations["Millennials (26-41)"]++;
      else if (sub.ageGroup === "35-49" || sub.ageGroup === "42-57") surveyGenerations["Gen X (42-57)"]++;
      else if (sub.ageGroup === "50-64" || sub.ageGroup === "65+" || sub.ageGroup === "58+") surveyGenerations["Boomers & Elders (58+)"]++;

      if (sub.gender === "FEMALE") surveyGenders.Female++;
      else if (sub.gender === "MALE") surveyGenders.Male++;
      else if (sub.gender) surveyGenders.Other++;

      if (sub.isFirstTimeVoter) firstTimeVoterCount++;
    });

    const votersDemographics = {
      baseline: PHILIPPINE_VOTERS_DEMOGRAPHICS,
      surveySample: {
        totalResponses: demographicSubmissions.length,
        firstTimeVoters: firstTimeVoterCount,
        generations: surveyGenerations,
        genders: surveyGenders,
      },
    };

    return NextResponse.json({
      summary: {
        totalActiveSubmissions: displayedActiveVotes,
        rawActiveSubmissions: activeSubmissionsCount,
        overseasSubmissionsCount: displayedOverseasCount,
        rawOverseasSubmissions: overseasTotalCount,
        overseasVotesAdjustment,
        domesticSubmissionsCount: displayedDomesticCount,
        rawDomesticSubmissions: domesticTotalCount,
        domesticVotesAdjustment,
        activeVotesAdjustment,
        totalRetractedSubmissions: retractedSubmissionsCount,
        todaySubmissions: displayedTodayVotes,
        rawTodaySubmissions: todaySubmissionsCount,
        todayVotesAdjustment,
        provincesReporting: displayedProvincesReporting,
        rawProvincesReporting: calculatedProvincesReporting,
        provincesReportingOverride,
        totalProvinces: totalProvincesCount,
        presidentialTotalVotes: totalPresDisplayedVotes,
        vicePresidentialTotalVotes: totalVpDisplayedVotes,
        totalAdjustmentsCount: approvedAdjustments.length,
        totalCandidateAdjustmentAmount: totalAdjustmentAmount,
        minResponseThreshold: minThreshold,
        campaignStatus: campaign?.status || "ACTIVE",
        publicResultsVisible,
        geographicResultsVisible,
        lastUpdated: new Date().toISOString(),
      },
      overseas: {
        totalSubmissions: displayedOverseasCount,
        rawTotalSubmissions: overseasTotalCount,
        percentageOfTotal:
          displayedActiveVotes > 0
            ? Number(((displayedOverseasCount / displayedActiveVotes) * 100).toFixed(1))
            : 0,
        domesticSubmissions: displayedDomesticCount,
        rawDomesticSubmissions: domesticTotalCount,
        countries: overseasCountryBreakdown,
        regions: overseasRegionBreakdown,
      },
      presidentialRankings,
      vicePresidentialRankings,
      senatorialRankings,
      provinces: provincesAnalytics,
      regions: regionsAnalytics,
      votersDemographics,
      islandGroupBreakdown: islandCounts,
      candidates,
    });
  } catch (error) {
    console.error("Analytics route error:", error);
    return NextResponse.json({ error: "Failed to generate analytics." }, { status: 500 });
  }
}
