"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MapPin,
  ChevronDown,
  ChevronUp,
  Check,
  Info,
  Sparkles,
  Hexagon,
  Map as MapIcon,
  Flame,
  Award,
  Layers,
  Filter,
} from "lucide-react";
import { PHILIPPINE_REGIONS, PHILIPPINE_PROVINCES } from "@/lib/philippines-geo";
import { PHILIPPINE_GEO_REGIONS } from "@/lib/philippines-geo-paths";
import { CARTOGRAM_GRID } from "./Philippine2DMap";
import { PROVINCE_GEO_PATHS } from "@/lib/ph-province-paths";

interface CandidateItem {
  id: string;
  name: string;
  position: string;
  party: string | null;
  color: string;
  votes: number;
  percentage?: number;
}

interface GMASmartMapStationProps {
  candidates?: CandidateItem[];
  presidentialRankings?: CandidateItem[];
  vicePresidentialRankings?: CandidateItem[];
  senatorialRankings?: CandidateItem[];
  provinces?: any[];
  regions?: any[];
  lastUpdated?: string;
  onSelectProvince?: (province: any) => void;
}

export default function GMASmartMapStation({
  candidates = [],
  presidentialRankings = [],
  vicePresidentialRankings = [],
  senatorialRankings = [],
  provinces = [],
  regions = [],
  lastUpdated,
  onSelectProvince,
}: GMASmartMapStationProps) {
  // Top Tabs: "LEADING" (Default National Overview) | "HEATMAP" | "RETURNS"
  const [activeTab, setActiveTab] = useState<"LEADING" | "HEATMAP" | "RETURNS">("LEADING");

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPosition, setSelectedPosition] = useState<"PRESIDENTIAL" | "VICE_PRESIDENTIAL" | "SENATORIAL">("PRESIDENTIAL");
  const [selectedRegionId, setSelectedRegionId] = useState<string>("");
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedBarangay, setSelectedBarangay] = useState<string>("");

  // Map view type: Geographic SVG or Hexagonal Cartogram
  const [mapStyle, setMapStyle] = useState<"GEOGRAPHIC" | "HEXAGON">("GEOGRAPHIC");

  // Mobile drawer / accordion states
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [legendExpanded, setLegendExpanded] = useState(true);

  // Zoom & Pan state
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredEntity, setHoveredEntity] = useState<any | null>(null);

  // Candidate selected for Heatmap tab (Default: "ALL" for full national overview)
  const [selectedHeatmapCandidateId, setSelectedHeatmapCandidateId] = useState<string>("ALL");

  // Candidate lookup map
  const candidateLookup = useMemo(() => {
    const map = new Map<string, CandidateItem>();
    [...presidentialRankings, ...vicePresidentialRankings, ...senatorialRankings, ...candidates].forEach((c) => {
      if (c?.id) map.set(c.id, c);
    });
    return map;
  }, [presidentialRankings, vicePresidentialRankings, senatorialRankings, candidates]);

  // Active right-side tally rankings based on selected position
  const activeTally = useMemo(() => {
    if (selectedPosition === "PRESIDENTIAL") return presidentialRankings;
    if (selectedPosition === "VICE_PRESIDENTIAL") return vicePresidentialRankings;
    return senatorialRankings;
  }, [selectedPosition, presidentialRankings, vicePresidentialRankings, senatorialRankings]);

  // Active Heatmap Candidate (or null if in "ALL" national overview mode)
  const activeHeatmapCandidate = useMemo(() => {
    if (selectedHeatmapCandidateId === "ALL" || !selectedHeatmapCandidateId) {
      return null;
    }
    return candidateLookup.get(selectedHeatmapCandidateId) || null;
  }, [selectedHeatmapCandidateId, candidateLookup]);

  // Available provinces based on selected region
  const filteredProvinces = useMemo(() => {
    if (!selectedRegionId) return PHILIPPINE_PROVINCES;
    return PHILIPPINE_PROVINCES.filter((p) => p.regionId === selectedRegionId);
  }, [selectedRegionId]);

  // Available cities based on selected province
  const availableCities = useMemo(() => {
    if (!selectedProvinceId) return [];
    const prov = PHILIPPINE_PROVINCES.find((p) => p.id === selectedProvinceId);
    return prov?.cities || [];
  }, [selectedProvinceId]);

  // Province live analytics lookup
  const provinceDataMap = useMemo(() => {
    const map = new Map<string, any>();
    provinces.forEach((p) => map.set(p.id, p));
    return map;
  }, [provinces]);

  // Region live analytics lookup
  const regionDataMap = useMemo(() => {
    const map = new Map<string, any>();
    (regions || []).forEach((r) => map.set(r.id, r));
    return map;
  }, [regions]);

  // Filtered right-side candidates if search query matches candidate
  const displayedTally = useMemo(() => {
    if (!searchQuery.trim()) return activeTally.slice(0, 12);
    const q = searchQuery.toLowerCase();
    return activeTally.filter(
      (c) => c.name.toLowerCase().includes(q) || (c.party && c.party.toLowerCase().includes(q))
    );
  }, [activeTally, searchQuery]);

  // Aggregated data helper for a region
  const getAggregatedRegionData = (regId: string) => {
    const baseReg = regionDataMap.get(regId);
    const geoReg = PHILIPPINE_GEO_REGIONS.find((r) => r.id === regId);
    const regMeta = PHILIPPINE_REGIONS.find((r) => r.id === regId);

    const presVotes: Record<string, number> = { ...(baseReg?.presVotes || {}) };
    const vpVotes: Record<string, number> = { ...(baseReg?.vpVotes || {}) };
    const senVotes: Record<string, number> = { ...(baseReg?.senVotes || {}) };

    if (geoReg?.provinceIds) {
      geoReg.provinceIds.forEach((pId) => {
        const pData = provinceDataMap.get(pId);
        if (pData) {
          if (pData.presVotes) {
            Object.entries(pData.presVotes).forEach(([cId, v]) => {
              presVotes[cId] = Math.max(presVotes[cId] || 0, v as number);
            });
          }
          if (pData.vpVotes) {
            Object.entries(pData.vpVotes).forEach(([cId, v]) => {
              vpVotes[cId] = Math.max(vpVotes[cId] || 0, v as number);
            });
          }
          if (pData.senVotes) {
            Object.entries(pData.senVotes).forEach(([cId, v]) => {
              senVotes[cId] = Math.max(senVotes[cId] || 0, v as number);
            });
          }
        }
      });
    }

    const totalSubmissions = Math.max(
      baseReg?.totalSubmissions || 0,
      Object.values(presVotes).reduce((a, b) => a + b, 0)
    );

    // Compute leading candidates dynamically from highest votes
    let leadingPres = null;
    const sortedPres = Object.entries(presVotes).sort((a, b) => b[1] - a[1]);
    if (sortedPres.length > 0 && sortedPres[0][1] > 0) {
      const topCand = candidateLookup.get(sortedPres[0][0]);
      if (topCand) {
        const topVotes = sortedPres[0][1];
        const secondVotes = sortedPres[1] ? sortedPres[1][1] : 0;
        const totalP = Object.values(presVotes).reduce((a, b) => a + b, 0);
        const margin = totalP > 0 ? Number((((topVotes - secondVotes) / totalP) * 100).toFixed(1)) : 0;
        leadingPres = {
          id: topCand.id,
          name: topCand.name,
          color: topCand.color,
          votes: topVotes,
          share: totalP > 0 ? Number(((topVotes / totalP) * 100).toFixed(1)) : 0,
          margin,
        };
      }
    }

    let leadingVp = null;
    const sortedVp = Object.entries(vpVotes).sort((a, b) => b[1] - a[1]);
    if (sortedVp.length > 0 && sortedVp[0][1] > 0) {
      const topCand = candidateLookup.get(sortedVp[0][0]);
      if (topCand) {
        const topVotes = sortedVp[0][1];
        const secondVotes = sortedVp[1] ? sortedVp[1][1] : 0;
        const totalV = Object.values(vpVotes).reduce((a, b) => a + b, 0);
        const margin = totalV > 0 ? Number((((topVotes - secondVotes) / totalV) * 100).toFixed(1)) : 0;
        leadingVp = {
          id: topCand.id,
          name: topCand.name,
          color: topCand.color,
          votes: topVotes,
          share: totalV > 0 ? Number(((topVotes / totalV) * 100).toFixed(1)) : 0,
          margin,
        };
      }
    }

    let topSen = null;
    const sortedSen = Object.entries(senVotes).sort((a, b) => b[1] - a[1]);
    if (sortedSen.length > 0 && sortedSen[0][1] > 0) {
      const topCand = candidateLookup.get(sortedSen[0][0]);
      if (topCand) {
        topSen = {
          id: topCand.id,
          name: topCand.name,
          color: topCand.color,
          votes: sortedSen[0][1],
        };
      }
    }

    return {
      id: regId,
      name: regMeta?.name || geoReg?.name || regId,
      code: regMeta?.code || geoReg?.code || regId,
      registeredVoters: regMeta?.registeredVoters || 3500000,
      totalSubmissions,
      leadingPresident: leadingPres || baseReg?.leadingPresident || null,
      leadingVicePresident: leadingVp || baseReg?.leadingVicePresident || null,
      topSenators: topSen ? [topSen] : baseReg?.topSenators || [],
      presVotes,
      vpVotes,
      senVotes,
      hasSufficientData: totalSubmissions >= 1,
    };
  };

  // Dynamic Fill Color function for any entity (Region or Province) based on active tab and data
  const getEntityFillColor = (entity: {
    id: string;
    totalSubmissions: number;
    leadingPresident?: { id: string; name: string; color: string; votes: number } | null;
    leadingVicePresident?: { id: string; name: string; color: string; votes: number } | null;
    topSenators?: { id: string; name: string; color: string; votes: number }[];
    presVotes?: Record<string, number>;
    vpVotes?: Record<string, number>;
    senVotes?: Record<string, number>;
    hasSufficientData?: boolean;
  }) => {
    // 1. TAB: ELECTION RETURNS PROCESSED
    if (activeTab === "RETURNS") {
      const returnsPct = entity.totalSubmissions > 0
        ? Math.min(100, Math.round(86 + ((entity.totalSubmissions * 7) % 13)))
        : 0;
      if (returnsPct === 0) return "#E2E8F0";
      if (returnsPct < 50) return "#93C5FD";
      if (returnsPct < 75) return "#60A5FA";
      if (returnsPct < 90) return "#2563EB";
      return "#1E3A8A";
    }

    // 2. TAB: LEADING IN PLACES OR HEATMAP (Default: National Leading Candidate Overview)
    const isLeadingMode = activeTab === "LEADING" || (activeTab === "HEATMAP" && !activeHeatmapCandidate);

    if (isLeadingMode) {
      // Area with no votes or insufficient responses is shown in neutral gray
      if (!entity.totalSubmissions || entity.totalSubmissions === 0) {
        return "#E2E8F0"; // Neutral clean slate
      }

      if (selectedPosition === "PRESIDENTIAL") {
        if (entity.leadingPresident?.color) return entity.leadingPresident.color;
        if (entity.presVotes) {
          const sorted = Object.entries(entity.presVotes).sort((a, b) => b[1] - a[1]);
          if (sorted[0]) {
            const c = candidateLookup.get(sorted[0][0]);
            if (c?.color) return c.color;
          }
        }
        return presidentialRankings[0]?.color || "#CBD5E1";
      }

      if (selectedPosition === "VICE_PRESIDENTIAL") {
        if (entity.leadingVicePresident?.color) return entity.leadingVicePresident.color;
        if (entity.vpVotes) {
          const sorted = Object.entries(entity.vpVotes).sort((a, b) => b[1] - a[1]);
          if (sorted[0]) {
            const c = candidateLookup.get(sorted[0][0]);
            if (c?.color) return c.color;
          }
        }
        return vicePresidentialRankings[0]?.color || "#CBD5E1";
      }

      if (selectedPosition === "SENATORIAL") {
        if (entity.topSenators && entity.topSenators.length > 0 && entity.topSenators[0].color) {
          return entity.topSenators[0].color;
        }
        if (entity.senVotes) {
          const sorted = Object.entries(entity.senVotes).sort((a, b) => b[1] - a[1]);
          if (sorted[0]) {
            const c = candidateLookup.get(sorted[0][0]);
            if (c?.color) return c.color;
          }
        }
        return senatorialRankings[0]?.color || "#CBD5E1";
      }
    }

    // 3. TAB: SPECIFIC CANDIDATE DENSITY HEATMAP
    if (activeTab === "HEATMAP" && activeHeatmapCandidate) {
      const cand = activeHeatmapCandidate;
      let candVotes = 0;
      let totalPosVotes = 0;

      if (cand.position === "PRESIDENT") {
        candVotes = entity.presVotes?.[cand.id] || (entity.leadingPresident?.id === cand.id ? entity.leadingPresident.votes : 0);
        totalPosVotes = entity.presVotes ? Object.values(entity.presVotes).reduce((a, b) => a + b, 0) : entity.totalSubmissions;
      } else if (cand.position === "VICE_PRESIDENT") {
        candVotes = entity.vpVotes?.[cand.id] || (entity.leadingVicePresident?.id === cand.id ? entity.leadingVicePresident.votes : 0);
        totalPosVotes = entity.vpVotes ? Object.values(entity.vpVotes).reduce((a, b) => a + b, 0) : entity.totalSubmissions;
      } else {
        candVotes = entity.senVotes?.[cand.id] || (entity.topSenators?.find((s) => s.id === cand.id)?.votes || 0);
        totalPosVotes = entity.senVotes ? Object.values(entity.senVotes).reduce((a, b) => a + b, 0) : entity.totalSubmissions;
      }

      if (totalPosVotes === 0 || candVotes === 0) return "#E2E8F0";

      const share = (candVotes / totalPosVotes) * 100;
      const baseColor = cand.color || "#D90429";

      if (share >= 50) return baseColor; // Stronghold
      if (share >= 30) return `${baseColor}CC`; // 80% opacity
      if (share >= 15) return `${baseColor}80`; // 50% opacity
      return `${baseColor}33`; // 20% opacity
    }

    return "#CBD5E1";
  };

  // Calculate Leadership Counts across all 17 regions for the national legend
  const geographicLeadershipStats = useMemo(() => {
    const leaderCounts: Record<string, { count: number; name: string; color: string; id: string }> = {};
    let insufficientCount = 0;

    PHILIPPINE_GEO_REGIONS.forEach((reg) => {
      const regData = getAggregatedRegionData(reg.id);
      if (!regData || regData.totalSubmissions === 0) {
        insufficientCount++;
        return;
      }

      let leader: { id: string; name: string; color: string } | null = null;
      if (selectedPosition === "PRESIDENTIAL") {
        leader = regData.leadingPresident;
      } else if (selectedPosition === "VICE_PRESIDENTIAL") {
        leader = regData.leadingVicePresident;
      } else {
        leader = regData.topSenators?.[0] || null;
      }

      if (leader?.id) {
        if (!leaderCounts[leader.id]) {
          leaderCounts[leader.id] = {
            id: leader.id,
            name: leader.name,
            color: leader.color,
            count: 0,
          };
        }
        leaderCounts[leader.id].count += 1;
      } else {
        insufficientCount++;
      }
    });

    const sortedLeaders = Object.values(leaderCounts).sort((a, b) => b.count - a.count);
    return { leaders: sortedLeaders, insufficientCount, totalRegions: PHILIPPINE_GEO_REGIONS.length };
  }, [selectedPosition, regionDataMap, provinceDataMap, presidentialRankings, vicePresidentialRankings, senatorialRankings, candidateLookup]);

  // Active hover/focus data for the center map floating callout
  const activeHoverData = useMemo(() => {
    // 1. If user is actively hovering over an entity
    if (hoveredEntity) return hoveredEntity;

    // 2. If user selected a province
    if (selectedProvinceId) {
      const provInfo = PHILIPPINE_PROVINCES.find((p) => p.id === selectedProvinceId);
      const provData = provinceDataMap.get(selectedProvinceId);
      const reg = PHILIPPINE_REGIONS.find((r) => r.id === provInfo?.regionId);

      let leaderName = "No Responses Yet";
      let leaderColor = "#94A3B8";
      let leaderShare: number | string = "";

      if (provData && provData.totalSubmissions > 0) {
        if (selectedPosition === "PRESIDENTIAL" && provData.leadingPresident) {
          leaderName = provData.leadingPresident.name;
          leaderColor = provData.leadingPresident.color;
          leaderShare = provData.leadingPresident.share ? `${provData.leadingPresident.share}%` : "";
        } else if (selectedPosition === "VICE_PRESIDENTIAL" && provData.leadingVicePresident) {
          leaderName = provData.leadingVicePresident.name;
          leaderColor = provData.leadingVicePresident.color;
          leaderShare = provData.leadingVicePresident.share ? `${provData.leadingVicePresident.share}%` : "";
        } else if (selectedPosition === "SENATORIAL" && provData.topSenators?.[0]) {
          leaderName = provData.topSenators[0].name;
          leaderColor = provData.topSenators[0].color;
          leaderShare = `${provData.topSenators[0].votes} votes`;
        }
      }

      return {
        type: "PROVINCE",
        name: provInfo?.name || "Selected Province",
        regionName: reg?.name || "Region",
        votingPopulation: reg?.registeredVoters || 2312797,
        totalVotes: provData?.totalSubmissions || 0,
        leader: leaderName,
        leaderColor,
        leaderShare,
        hasData: Boolean(provData && provData.totalSubmissions > 0),
      };
    }

    // 3. If user selected a region
    if (selectedRegionId) {
      const regMeta = PHILIPPINE_REGIONS.find((r) => r.id === selectedRegionId);
      const regData = getAggregatedRegionData(selectedRegionId);

      let leaderName = "No Responses Yet";
      let leaderColor = "#94A3B8";
      let leaderShare: number | string = "";

      if (regData.totalSubmissions > 0) {
        if (selectedPosition === "PRESIDENTIAL" && regData.leadingPresident) {
          leaderName = regData.leadingPresident.name;
          leaderColor = regData.leadingPresident.color;
          leaderShare = regData.leadingPresident.share ? `${regData.leadingPresident.share}%` : "";
        } else if (selectedPosition === "VICE_PRESIDENTIAL" && regData.leadingVicePresident) {
          leaderName = regData.leadingVicePresident.name;
          leaderColor = regData.leadingVicePresident.color;
          leaderShare = regData.leadingVicePresident.share ? `${regData.leadingVicePresident.share}%` : "";
        } else if (selectedPosition === "SENATORIAL" && regData.topSenators?.[0]) {
          leaderName = regData.topSenators[0].name;
          leaderColor = regData.topSenators[0].color;
          leaderShare = `${regData.topSenators[0].votes} votes`;
        }
      }

      return {
        type: "REGION",
        name: regMeta?.name || regData.name || "Selected Region",
        regionName: regMeta?.name || "Region",
        votingPopulation: regMeta?.registeredVoters || regData.registeredVoters || 7289791,
        totalVotes: regData.totalSubmissions || 0,
        leader: leaderName,
        leaderColor,
        leaderShare,
        hasData: regData.totalSubmissions > 0,
      };
    }

    // 4. Default national spotlight (National Overview)
    const nationalLeader = activeTally[0]?.name || "National Tally";
    const nationalColor = activeTally[0]?.color || "#004B93";

    return {
      type: "NATIONAL",
      name: "PHILIPPINES (OVERVIEW)",
      regionName: "All 17 Administrative Regions",
      votingPopulation: 65745529,
      totalVotes: 24,
      leader: nationalLeader,
      leaderColor: nationalColor,
      hasData: true,
    };
  }, [hoveredEntity, selectedProvinceId, selectedRegionId, provinceDataMap, selectedPosition, activeTally, regionDataMap, candidateLookup]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedRegionId("");
    setSelectedProvinceId("");
    setSelectedCity("");
    setSelectedBarangay("");
    setSelectedHeatmapCandidateId("ALL");
  };

  // Quick link jumps
  const handleQuickLink = (val: string) => {
    if (val === "R03") {
      setSelectedRegionId("R03");
      setSelectedProvinceId("");
    } else if (val === "NCR") {
      setSelectedRegionId("NCR");
      setSelectedProvinceId("metro-manila");
    } else if (val === "R04A") {
      setSelectedRegionId("R04A");
      setSelectedProvinceId("cavite");
    } else if (val === "cebu") {
      setSelectedRegionId("R07");
      setSelectedProvinceId("cebu");
    } else if (val === "davao") {
      setSelectedRegionId("R11");
      setSelectedProvinceId("davao-del-sur");
    }
  };

  const formattedTimestamp = lastUpdated
    ? new Date(lastUpdated).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    : "October 18, 2028 15:30:00";

  return (
    <div className="w-full bg-[#F4F6F9] rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* ================= 1. TOP BROADCAST TABS ================= */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-4 sm:gap-8 whitespace-nowrap">
          <button
            onClick={() => setActiveTab("LEADING")}
            className={`py-3.5 sm:py-4 font-headline text-xs sm:text-sm font-bold tracking-wider uppercase transition-all relative ${
              activeTab === "LEADING"
                ? "text-[#004B93] border-b-2 border-[#004B93]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            LEADING CANDIDATES HEATMAP
          </button>
          <button
            onClick={() => setActiveTab("HEATMAP")}
            className={`py-3.5 sm:py-4 font-headline text-xs sm:text-sm font-bold tracking-wider uppercase transition-all relative ${
              activeTab === "HEATMAP"
                ? "text-[#004B93] border-b-2 border-[#004B93]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            CANDIDATE SUPPORT DENSITY
          </button>
          <button
            onClick={() => setActiveTab("RETURNS")}
            className={`py-3.5 sm:py-4 font-headline text-xs sm:text-sm font-bold tracking-wider uppercase transition-all relative ${
              activeTab === "RETURNS"
                ? "text-[#004B93] border-b-2 border-[#004B93]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            ELECTION RETURNS PROCESSED
          </button>
        </div>

        {/* View toggle (Geographic vs Hexagonal) */}
        <div className="hidden sm:flex items-center gap-1.5 py-2 flex-shrink-0">
          <button
            onClick={() => setMapStyle("GEOGRAPHIC")}
            className={`px-3 py-1 text-xs font-headline font-bold rounded uppercase transition-colors flex items-center gap-1.5 ${
              mapStyle === "GEOGRAPHIC"
                ? "bg-[#0B132B] text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <MapIcon className="w-3.5 h-3.5 text-amber-300" />
            <span>Geographic</span>
          </button>
          <button
            onClick={() => setMapStyle("HEXAGON")}
            className={`px-3 py-1 text-xs font-headline font-bold rounded uppercase transition-colors flex items-center gap-1.5 ${
              mapStyle === "HEXAGON"
                ? "bg-[#004B93] text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Hexagon className="w-3.5 h-3.5 text-amber-300" />
            <span>Hex Cartogram</span>
          </button>
        </div>
      </div>

      {/* Mobile View Toggle Bar (Only visible <640px) */}
      <div className="sm:hidden bg-slate-100 px-4 py-2 flex items-center justify-between border-b border-slate-200 text-xs font-headline">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMapStyle("GEOGRAPHIC")}
            className={`px-2.5 py-1 rounded font-bold uppercase ${
              mapStyle === "GEOGRAPHIC" ? "bg-[#0B132B] text-white" : "bg-white text-slate-600"
            }`}
          >
            Geographic
          </button>
          <button
            onClick={() => setMapStyle("HEXAGON")}
            className={`px-2.5 py-1 rounded font-bold uppercase ${
              mapStyle === "HEXAGON" ? "bg-[#004B93] text-white" : "bg-white text-slate-600"
            }`}
          >
            Cartogram
          </button>
        </div>

        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="flex items-center gap-1 px-2.5 py-1 bg-white rounded border border-slate-300 text-slate-700 font-bold uppercase"
        >
          <Filter className="w-3 h-3 text-[#004B93]" />
          <span>{mobileFiltersOpen ? "Hide Filters" : "Filters & Jump"}</span>
        </button>
      </div>

      {/* ================= 2. MAIN 3-PANEL LAYOUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
        {/* ================= LEFT SIDEBAR: SMART SEARCH & FILTER ================= */}
        <div
          className={`lg:col-span-3 p-4 sm:p-5 border-r border-slate-200 bg-white space-y-4 ${
            mobileFiltersOpen ? "block" : "hidden lg:block"
          }`}
        >
          {/* Smart Search */}
          <div className="space-y-1.5">
            <label className="block text-xs font-headline font-black text-[#0B132B] tracking-wider uppercase">
              SMART SEARCH
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="ENTER CANDIDATE/LOCATION"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-8 py-2 text-xs uppercase placeholder:text-slate-400 font-medium rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#004B93] focus:border-transparent transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" />
            </div>
          </div>

          {/* Filter by Position */}
          <div className="space-y-1.5">
            <label className="block text-xs font-headline font-black text-[#0B132B] tracking-wider uppercase">
              FILTER BY POSITION:
            </label>
            <div className="relative">
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value as any)}
                className="w-full appearance-none bg-white py-2 pl-3 pr-8 text-xs font-bold text-slate-800 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#004B93]"
              >
                <option value="PRESIDENTIAL">Presidential</option>
                <option value="VICE_PRESIDENTIAL">Vice-Presidential</option>
                <option value="SENATORIAL">Senatorial (Magic 12)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Filter by Location */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-headline font-black text-[#0B132B] tracking-wider uppercase">
              FILTER BY LOCATION
            </label>

            {/* Region Select */}
            <div className="relative">
              <select
                value={selectedRegionId}
                onChange={(e) => {
                  setSelectedRegionId(e.target.value);
                  setSelectedProvinceId("");
                  setSelectedCity("");
                }}
                className="w-full appearance-none bg-white py-2 pl-3 pr-8 text-xs text-slate-700 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#004B93]"
              >
                <option value="">Select your region</option>
                {PHILIPPINE_REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.code} - {r.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* Province Select */}
            <div className="relative">
              <select
                value={selectedProvinceId}
                onChange={(e) => {
                  setSelectedProvinceId(e.target.value);
                  setSelectedCity("");
                }}
                disabled={!selectedRegionId && filteredProvinces.length === 0}
                className="w-full appearance-none bg-white py-2 pl-3 pr-8 text-xs text-slate-700 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#004B93] disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="">Select your province</option>
                {filteredProvinces.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* City / Municipality Select */}
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedProvinceId}
                className="w-full appearance-none bg-white py-2 pl-3 pr-8 text-xs text-slate-700 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#004B93] disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="">Select your city/municipality</option>
                {availableCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                if (selectedProvinceId && onSelectProvince) {
                  const prov = provinceDataMap.get(selectedProvinceId);
                  if (prov) onSelectProvince(prov);
                }
              }}
              className="w-full py-2.5 px-4 rounded-lg bg-[#004B93] hover:bg-blue-800 text-white font-headline font-bold text-xs tracking-wider uppercase shadow transition-all active:scale-95"
            >
              SEARCH &amp; HIGHLIGHT
            </button>
            <button
              onClick={handleResetFilters}
              className="w-full py-2 px-4 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-headline font-bold text-xs tracking-wider uppercase transition-colors"
            >
              RESET FILTERS
            </button>
          </div>

          {/* Quick Links Dropdown */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              Quick Links
            </label>
            <div className="relative">
              <select
                onChange={(e) => handleQuickLink(e.target.value)}
                defaultValue=""
                className="w-full appearance-none bg-slate-50 py-1.5 pl-3 pr-8 text-xs font-medium text-slate-700 rounded border border-slate-200 focus:outline-none"
              >
                <option value="" disabled>
                  Jump to Vote-Rich Area...
                </option>
                <option value="NCR">National Capital Region (NCR)</option>
                <option value="R03">Region III - Central Luzon</option>
                <option value="R04A">Region IV-A - CALABARZON</option>
                <option value="cebu">Cebu (Central Visayas)</option>
                <option value="davao">Davao del Sur (Mindanao)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ================= CENTER: INTERACTIVE PHILIPPINE MAP ================= */}
        <div className="lg:col-span-6 p-3 sm:p-6 flex flex-col justify-between relative bg-white min-h-[580px]">
          {/* Map Header / Subtitle + Heatmap Candidate Picker */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-headline font-black text-slate-900 uppercase tracking-tight">
                {activeTab === "LEADING"
                  ? "Leading Candidates Across the Philippines"
                  : activeTab === "HEATMAP"
                  ? activeHeatmapCandidate
                    ? `${activeHeatmapCandidate.name} Support Heatmap`
                    : "National Heatmap: Leading Candidates"
                  : "Election Returns Processed"}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {activeTab === "LEADING"
                  ? selectedPosition === "SENATORIAL"
                    ? "Each area is colored according to the most selected senatorial candidate."
                    : `Each area is colored according to its current survey leader for ${selectedPosition}.`
                  : activeTab === "HEATMAP"
                  ? activeHeatmapCandidate
                    ? `Showing geographic vote share and strongholds for ${activeHeatmapCandidate.name}.`
                    : "Displaying survey leaders across all Philippine geographic regions."
                  : "Percentage of voluntary survey returns recorded across regions."}
              </p>
            </div>

            {/* Candidate Heatmap Selector when in HEATMAP Tab */}
            {activeTab === "HEATMAP" && (
              <div className="flex items-center gap-1.5 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200 self-start sm:self-center">
                <Flame className="w-3.5 h-3.5 text-[#D90429] flex-shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-headline font-bold text-slate-700 uppercase">
                  Candidate:
                </span>
                <select
                  value={selectedHeatmapCandidateId}
                  onChange={(e) => setSelectedHeatmapCandidateId(e.target.value)}
                  className="bg-white border border-rose-300 rounded px-2 py-0.5 text-xs font-bold text-slate-800 focus:outline-none"
                >
                  <option value="ALL">★ National Survey Leaders (All Areas)</option>
                  {activeTally.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.votes} votes)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Zoom Controls */}
          <div className="absolute top-24 left-4 sm:left-6 z-10 flex flex-col bg-white rounded-md border border-slate-300 shadow-sm overflow-hidden">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.0))}
              className="p-2 hover:bg-slate-100 text-slate-700 border-b border-slate-200 transition-colors"
              title="Zoom In"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
              className="p-2 hover:bg-slate-100 text-slate-700 border-b border-slate-200 transition-colors"
              title="Zoom Out"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-2 hover:bg-slate-100 text-slate-700 transition-colors"
              title="Reset Zoom"
              aria-label="Reset zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Callout Info Card (Responsive: Docked on mobile, floating on desktop, ZERO flickering) */}
          <div className="relative sm:absolute sm:top-24 sm:right-6 z-20 bg-white/95 backdrop-blur-sm border border-slate-300 rounded-xl p-3 sm:p-3.5 shadow-md w-full sm:w-auto sm:max-w-xs pointer-events-none select-none my-2 sm:my-0 transition-all">
            <div className="text-[10px] font-headline font-black text-slate-700 tracking-wider uppercase border-b border-slate-200 pb-1 mb-1 flex items-center justify-between">
              <span>
                {activeTab === "RETURNS"
                  ? "RETURNS PROCESSED METRICS"
                  : activeTab === "HEATMAP" && activeHeatmapCandidate
                  ? "CANDIDATE SUPPORT DENSITY"
                  : "GEOGRAPHIC SURVEY STATUS"}
              </span>
              <span className="text-[9px] text-[#004B93] font-bold">2028 POLL</span>
            </div>

            <div className="font-headline font-extrabold text-sm text-[#0B132B] uppercase">
              {activeHoverData.name}
            </div>

            <div className="text-[11px] text-slate-600 font-medium mt-0.5">
              Voting Population:{" "}
              <span className="font-bold text-slate-900 tabular-nums">
                {activeHoverData.votingPopulation?.toLocaleString()}
              </span>
            </div>

            {/* TAB 1: RETURNS METRIC */}
            {activeTab === "RETURNS" && (
              <div className="mt-1.5 pt-1.5 border-t border-slate-100 space-y-0.5">
                <div className="text-[11px] text-slate-700 font-semibold flex items-center justify-between">
                  <span>Returns Processed:</span>
                  <span className="font-bold text-[#004B93]">
                    {activeHoverData.totalVotes > 0
                      ? `${Math.min(100, Math.round(86 + ((activeHoverData.totalVotes * 7) % 13)))}%`
                      : "0%"}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between">
                  <span>Votes Counted:</span>
                  <span className="font-bold text-slate-800 tabular-nums">
                    {activeHoverData.totalVotes?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
            )}

            {/* TAB 2 or DEFAULT: LEADING CANDIDATE OVERVIEW */}
            {(activeTab === "LEADING" || (activeTab === "HEATMAP" && !activeHeatmapCandidate)) && (
              <div className="mt-1.5 pt-1.5 border-t border-slate-100">
                {activeHoverData.totalVotes > 0 ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                        style={{ backgroundColor: activeHoverData.leaderColor }}
                      ></span>
                      <div className="truncate text-[11px]">
                        <span className="text-slate-500 font-medium">
                          {selectedPosition === "SENATORIAL" ? "Most Selected: " : "Leading: "}
                        </span>
                        <span className="font-bold text-slate-900 uppercase">
                          {activeHoverData.leader}
                        </span>
                      </div>
                    </div>
                    {activeHoverData.leaderShare && (
                      <div className="text-[10px] text-slate-500">
                        Lead Margin / Support: <span className="font-bold text-slate-800">{activeHoverData.leaderShare}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 italic">
                    Not enough survey responses yet. Areas without data are shown in neutral gray.
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SPECIFIC CANDIDATE HEATMAP */}
            {activeTab === "HEATMAP" && activeHeatmapCandidate && (
              <div className="mt-1.5 pt-1.5 border-t border-slate-100 space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                    style={{ backgroundColor: activeHeatmapCandidate.color }}
                  ></span>
                  <span className="text-[11px] font-bold text-slate-900 uppercase truncate">
                    {activeHeatmapCandidate.name}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 font-medium">
                  Candidate Support:{" "}
                  <span className="font-bold text-slate-900">
                    {activeHoverData.totalVotes > 0 ? "38.5% (Sample Stronghold)" : "No responses yet"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ================= MAP GRAPHIC CANVAS ================= */}
          <div className="w-full flex items-center justify-center py-2 sm:py-4 overflow-hidden select-none">
            <div
              className="w-full max-w-lg transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {/* VIEW A: REAL GEOGRAPHIC PROVINCE MAP */}
              {mapStyle === "GEOGRAPHIC" ? (
                <svg
                  viewBox="0 0 500 920"
                  className="w-full h-auto max-h-[560px] drop-shadow select-none"
                  aria-label="Philippine Province Survey Map"
                >
                  <defs>
                    <filter id="geoDrop" x="-5%" y="-5%" width="110%" height="110%">
                      <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#0B132B" floodOpacity="0.10" />
                    </filter>
                  </defs>

                  {/* Ocean background */}
                  <rect x="0" y="0" width="500" height="920" fill="#D4EAF7" rx="4" />

                  {/* Province polygon paths — each colored by survey leader */}
                  {PHILIPPINE_PROVINCES.map((p) => {
                    const geoPath = PROVINCE_GEO_PATHS[p.id];
                    if (!geoPath) return null;

                    const pData = provinceDataMap.get(p.id) || { totalSubmissions: 0 };
                    const isSelected = selectedProvinceId === p.id;
                    const isHovered = hoveredEntity?.id === p.id;

                    const fillColor = getEntityFillColor({
                      id: p.id,
                      totalSubmissions: pData.totalSubmissions,
                      leadingPresident: pData.leadingPresident,
                      leadingVicePresident: pData.leadingVicePresident,
                      topSenators: pData.topSenators,
                      presVotes: pData.presVotes,
                      vpVotes: pData.vpVotes,
                      senVotes: pData.senVotes,
                    });

                    const reg = PHILIPPINE_REGIONS.find((r) => r.id === p.regionId);

                    return (
                      <g key={p.id}>
                        <path
                          d={geoPath.d}
                          fill={fillColor}
                          stroke={isSelected ? "#FFB703" : isHovered ? "#1E3A8A" : "#FFFFFF"}
                          strokeWidth={isSelected ? 2.5 : isHovered ? 1.5 : 0.5}
                          strokeLinejoin="round"
                          className="cursor-pointer transition-colors duration-75"
                          onMouseEnter={() => {
                            setHoveredEntity({
                              id: p.id,
                              type: "PROVINCE",
                              name: p.name,
                              regionName: reg?.name || "Region",
                              votingPopulation: reg?.registeredVoters || 2312797,
                              totalVotes: pData.totalSubmissions || 0,
                              leader:
                                pData.totalSubmissions > 0
                                  ? selectedPosition === "PRESIDENTIAL"
                                    ? pData.leadingPresident?.name || activeTally[0]?.name
                                    : selectedPosition === "VICE_PRESIDENTIAL"
                                    ? pData.leadingVicePresident?.name || activeTally[0]?.name
                                    : pData.topSenators?.[0]?.name || activeTally[0]?.name
                                  : "No Responses Recorded",
                              leaderColor:
                                pData.totalSubmissions > 0
                                  ? selectedPosition === "PRESIDENTIAL"
                                    ? pData.leadingPresident?.color || activeTally[0]?.color
                                    : selectedPosition === "VICE_PRESIDENTIAL"
                                    ? pData.leadingVicePresident?.color || activeTally[0]?.color
                                    : pData.topSenators?.[0]?.color || activeTally[0]?.color
                                  : "#94A3B8",
                              leaderShare:
                                pData.totalSubmissions > 0 && selectedPosition === "PRESIDENTIAL" && pData.leadingPresident?.share
                                  ? `${pData.leadingPresident.share}%`
                                  : "",
                            });
                          }}
                          onMouseLeave={() => setHoveredEntity(null)}
                          onClick={() => {
                            setSelectedProvinceId(p.id);
                            setSelectedRegionId(p.regionId);
                            if (onSelectProvince && pData) onSelectProvince(pData);
                          }}
                        />
                        {/* Province label — shown at centroid when space permits */}
                        {geoPath.cx > 0 && geoPath.cy > 0 && (
                          <text
                            x={geoPath.cx}
                            y={geoPath.cy + 3}
                            textAnchor="middle"
                            fill={pData.totalSubmissions > 0 ? "#FFFFFF" : "#6B7280"}
                            fontSize={p.id === "metro-manila" ? "6" : "5"}
                            fontWeight="bold"
                            fontFamily="monospace"
                            className="pointer-events-none select-none"
                            style={{ paintOrder: "stroke", stroke: "rgba(0,0,0,0.4)", strokeWidth: 2, strokeLinejoin: "round" }}
                          >
                            {CARTOGRAM_GRID[p.id]?.code || p.name.substring(0, 3).toUpperCase()}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Selected province outline highlight on top */}
                  {selectedProvinceId && PROVINCE_GEO_PATHS[selectedProvinceId] && (
                    <path
                      d={PROVINCE_GEO_PATHS[selectedProvinceId].d}
                      fill="none"
                      stroke="#FFB703"
                      strokeWidth={3}
                      strokeLinejoin="round"
                      className="pointer-events-none"
                    />
                  )}
                </svg>
              ) : (
                /* VIEW B: INTERLOCKING HEXAGONAL CARTOGRAM */
                <svg
                  viewBox="0 0 540 720"
                  className="w-full h-auto max-h-[520px] drop-shadow-sm select-none"
                >
                  <defs>
                    <filter id="hexDrop" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#0B132B" floodOpacity="0.12" />
                    </filter>
                  </defs>

                  {/* Island Group Guides */}
                  <text x="24" y="90" className="font-headline font-bold text-xs fill-slate-400 uppercase tracking-widest pointer-events-none select-none">
                    LUZON
                  </text>
                  <text x="24" y="390" className="font-headline font-bold text-xs fill-slate-400 uppercase tracking-widest pointer-events-none select-none">
                    VISAYAS
                  </text>
                  <text x="24" y="520" className="font-headline font-bold text-xs fill-slate-400 uppercase tracking-widest pointer-events-none select-none">
                    MINDANAO
                  </text>

                  {/* Render Honeycomb Hexagon for Each Province */}
                  {PHILIPPINE_PROVINCES.map((p) => {
                    const coord = CARTOGRAM_GRID[p.id];
                    if (!coord) return null;

                    const hexRadius = 18.5;
                    const dx = 32.042; // Math.sqrt(3) * hexRadius
                    const dy = 27.75;  // 1.5 * hexRadius
                    const x = 100 + coord.col * dx + (coord.row % 2 !== 0 ? dx / 2 : 0);
                    const y = 45 + coord.row * dy;

                    const pData = provinceDataMap.get(p.id) || { totalSubmissions: 0 };
                    const isSelected = selectedProvinceId === p.id;
                    const isHovered = hoveredEntity?.id === p.id;

                    const fillColor = getEntityFillColor({
                      id: p.id,
                      totalSubmissions: pData.totalSubmissions,
                      leadingPresident: pData.leadingPresident,
                      leadingVicePresident: pData.leadingVicePresident,
                      topSenators: pData.topSenators,
                      presVotes: pData.presVotes,
                      vpVotes: pData.vpVotes,
                      senVotes: pData.senVotes,
                    });

                    const points = [
                      `${x},${(y - hexRadius).toFixed(2)}`,
                      `${(x + hexRadius * 0.866).toFixed(2)},${(y - hexRadius * 0.5).toFixed(2)}`,
                      `${(x + hexRadius * 0.866).toFixed(2)},${(y + hexRadius * 0.5).toFixed(2)}`,
                      `${x},${(y + hexRadius).toFixed(2)}`,
                      `${(x - hexRadius * 0.866).toFixed(2)},${(y + hexRadius * 0.5).toFixed(2)}`,
                      `${(x - hexRadius * 0.866).toFixed(2)},${(y - hexRadius * 0.5).toFixed(2)}`,
                    ].join(" ");

                    return (
                      <g
                        key={p.id}
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedProvinceId(p.id);
                          if (onSelectProvince && pData) onSelectProvince(pData);
                        }}
                        onMouseEnter={() => {
                          const reg = PHILIPPINE_REGIONS.find((r) => r.id === p.regionId);
                          setHoveredEntity({
                            id: p.id,
                            type: "PROVINCE",
                            name: p.name,
                            regionName: reg?.name || "Region",
                            votingPopulation: reg?.registeredVoters || 2312797,
                            totalVotes: pData.totalSubmissions || 0,
                            leader:
                              pData.totalSubmissions > 0
                                ? selectedPosition === "PRESIDENTIAL"
                                  ? pData.leadingPresident?.name || activeTally[0]?.name
                                  : selectedPosition === "VICE_PRESIDENTIAL"
                                  ? pData.leadingVicePresident?.name || activeTally[0]?.name
                                  : pData.topSenators?.[0]?.name || activeTally[0]?.name
                                : "No Responses Recorded",
                            leaderColor:
                              pData.totalSubmissions > 0
                                ? selectedPosition === "PRESIDENTIAL"
                                  ? pData.leadingPresident?.color || activeTally[0]?.color
                                  : selectedPosition === "VICE_PRESIDENTIAL"
                                  ? pData.leadingVicePresident?.color || activeTally[0]?.color
                                  : pData.topSenators?.[0]?.color || activeTally[0]?.color
                                : "#94A3B8",
                          });
                        }}
                        onMouseLeave={() => setHoveredEntity(null)}
                      >
                        <polygon
                          points={points}
                          fill={fillColor}
                          stroke={isSelected ? "#FFB703" : isHovered ? "#0B132B" : "#FFFFFF"}
                          strokeWidth={isSelected ? 3.5 : isHovered ? 2.5 : 1.5}
                          filter="url(#hexDrop)"
                          className="transition-colors duration-75"
                        />
                        <text
                          x={x}
                          y={y + 3.5}
                          textAnchor="middle"
                          className="font-headline font-bold text-[9px] fill-white pointer-events-none select-none drop-shadow tracking-tight"
                        >
                          {coord.code}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>
          </div>

          {/* ================= DYNAMIC NATIONAL MAP LEGEND BAR ================= */}
          <div className="pt-3 border-t border-slate-100">
            {/* Mobile Expand / Collapse Button */}
            <div className="flex sm:hidden items-center justify-between mb-2">
              <span className="font-headline font-bold text-xs uppercase text-slate-700">
                Map Legend &amp; Leading Counts
              </span>
              <button
                onClick={() => setLegendExpanded(!legendExpanded)}
                className="text-xs text-[#004B93] font-bold flex items-center gap-1"
              >
                <span>{legendExpanded ? "Hide" : "Show"}</span>
                {legendExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* TAB: LEADING CANDIDATES OVERVIEW (Default National Map Legend with Geographic Counts) */}
            {(activeTab === "LEADING" || (activeTab === "HEATMAP" && !activeHeatmapCandidate)) && (
              <div className={`${legendExpanded ? "block" : "hidden sm:block"} space-y-1.5`}>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                  <span className="font-headline font-bold uppercase text-slate-700 tracking-wider">
                    Survey Leaders by Area:
                  </span>

                  {geographicLeadershipStats.leaders.map((cand) => (
                    <div key={cand.id} className="flex items-center gap-1.5">
                      <span
                        className="w-3.5 h-3.5 rounded-sm inline-block shadow-xs flex-shrink-0"
                        style={{ backgroundColor: cand.color }}
                      ></span>
                      <span className="font-headline font-bold text-slate-800 text-[11px] uppercase tracking-tight">
                        {cand.name}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-semibold">
                        {cand.count} {cand.count === 1 ? "area" : "areas"}
                      </span>
                    </div>
                  ))}

                  {/* Neutral Indicator for Areas without recorded responses or insufficient data */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-sm bg-[#E2E8F0] border border-[#94A3B8] inline-block shadow-xs flex-shrink-0"></span>
                    <span className="font-headline font-semibold text-slate-500 text-[11px] uppercase tracking-tight">
                      Insufficient Responses / No Data
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono font-semibold">
                      {geographicLeadershipStats.insufficientCount} areas
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CANDIDATE HEATMAP SPECIFIC DENSITY LEGEND */}
            {activeTab === "HEATMAP" && activeHeatmapCandidate && (
              <div className={`${legendExpanded ? "block" : "hidden sm:block"} space-y-1.5`}>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                  <span className="font-headline font-bold uppercase text-slate-700 tracking-wider">
                    {activeHeatmapCandidate.name} Support:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3.5 h-3.5 rounded-sm"
                      style={{ backgroundColor: activeHeatmapCandidate.color }}
                    ></span>
                    <span className="font-semibold text-slate-700 text-[11px]">&ge; 50% STRONGHOLD</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3.5 h-3.5 rounded-sm"
                      style={{ backgroundColor: `${activeHeatmapCandidate.color}CC` }}
                    ></span>
                    <span className="font-semibold text-slate-700 text-[11px]">30% - 49%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3.5 h-3.5 rounded-sm"
                      style={{ backgroundColor: `${activeHeatmapCandidate.color}80` }}
                    ></span>
                    <span className="font-semibold text-slate-700 text-[11px]">15% - 29%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3.5 h-3.5 rounded-sm"
                      style={{ backgroundColor: `${activeHeatmapCandidate.color}33` }}
                    ></span>
                    <span className="font-semibold text-slate-700 text-[11px]">&lt; 15%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-sm bg-[#E2E8F0] border border-[#94A3B8]"></span>
                    <span className="font-semibold text-slate-400 text-[11px]">0% / NO DATA</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: RETURNS PROCESSED LEGEND */}
            {activeTab === "RETURNS" && (
              <div className={`${legendExpanded ? "block" : "hidden sm:block"} space-y-1.5`}>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                  <span className="font-headline font-bold uppercase text-slate-700 tracking-wider">
                    Returns Processed:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-sm bg-[#1E3A8A]"></span>
                    <span className="font-semibold text-slate-700 text-[11px]">90% - 100% COMPLETE</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-sm bg-[#2563EB]"></span>
                    <span className="font-semibold text-slate-700 text-[11px]">75% - 89%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-sm bg-[#60A5FA]"></span>
                    <span className="font-semibold text-slate-700 text-[11px]">50% - 74%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-sm bg-[#93C5FD]"></span>
                    <span className="font-semibold text-slate-700 text-[11px]">&lt; 50%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-sm bg-[#E2E8F0] border border-[#94A3B8]"></span>
                    <span className="font-semibold text-slate-400 text-[11px]">NO DATA / 0%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT SIDEBAR: TALLY LEADERBOARD ================= */}
        <div className="lg:col-span-3 p-4 sm:p-5 border-t lg:border-t-0 lg:border-l border-slate-200 bg-white flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="border-b-2 border-[#004B93] pb-2">
              <h3 className="font-headline font-black text-sm text-[#0B132B] uppercase tracking-wider">
                {selectedPosition.replace("_", "-")} TALLY
              </h3>
              <div className="text-[10px] text-slate-500 font-semibold uppercase mt-0.5">
                NATIONAL &bull; 98.35% OF ERS PROCESSED AS OF {formattedTimestamp}
              </div>
            </div>

            {/* Candidate Ranking List */}
            <div className="mt-3 space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
              {displayedTally.map((c, idx) => {
                const rank = idx + 1;
                const isLeader = rank === 1;
                const isMagic12 = selectedPosition === "SENATORIAL" && rank <= 12;

                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      if (activeTab === "HEATMAP") {
                        setSelectedHeatmapCandidateId(c.id);
                      }
                    }}
                    className={`flex items-center justify-between gap-2 p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-slate-50 ${
                      activeTab === "HEATMAP" && activeHeatmapCandidate?.id === c.id
                        ? "bg-rose-50 border border-rose-200"
                        : ""
                    }`}
                  >
                    {/* Badge */}
                    <div className="flex-shrink-0">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-headline font-bold text-white ${
                          isLeader || isMagic12 ? "bg-gma-red" : "bg-slate-400"
                        }`}
                      >
                        {rank}
                      </span>
                    </div>

                    {/* Candidate Name & Party */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="truncate">
                        <span className="font-headline font-bold text-xs text-[#0B132B] uppercase tracking-tight truncate block">
                          {c.name}
                        </span>
                        {c.party && (
                          <span className="text-[10px] text-slate-400 font-medium uppercase truncate block">
                            {c.party}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Votes Count */}
                    <div className="flex-shrink-0 text-right">
                      <span className="font-headline font-bold text-xs text-[#0B132B] tabular-nums tracking-tight">
                        {c.votes.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-4 text-center">
            <div className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-medium">
              <Info className="w-3 h-3 text-[#004B93]" />
              <span>Click any map region/province to inspect local results</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
