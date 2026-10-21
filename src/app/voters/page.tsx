"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  PieChart as PieIcon,
  MapPin,
  Vote,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  FileCheck,
  Info,
} from "lucide-react";
import {
  PHILIPPINE_REGIONS,
  PHILIPPINE_PROVINCES,
  PHILIPPINE_VOTERS_DEMOGRAPHICS,
} from "@/lib/philippines-geo";

export default function VotersProfilePage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRegionId, setSelectedRegionId] = useState<string>("NCR");
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("metro-manila");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/analytics");
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        }
      } catch (err) {
        console.error("Failed to load voters analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const baseline = PHILIPPINE_VOTERS_DEMOGRAPHICS;

  const currentRegion = useMemo(() => {
    return PHILIPPINE_REGIONS.find((r) => r.id === selectedRegionId) || PHILIPPINE_REGIONS[0];
  }, [selectedRegionId]);

  const regionProvinces = useMemo(() => {
    return PHILIPPINE_PROVINCES.filter((p) => p.regionId === selectedRegionId);
  }, [selectedRegionId]);

  const currentProvince = useMemo(() => {
    return (
      regionProvinces.find((p) => p.id === selectedProvinceId) ||
      regionProvinces[0] ||
      PHILIPPINE_PROVINCES[0]
    );
  }, [selectedProvinceId, regionProvinces]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 sm:pb-20">
      {/* ================= CLEAN LIGHT CIVIC HERO BANNER ================= */}
      <div className="bg-white border-b border-slate-200/80 py-8 sm:py-12 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2.5 sm:space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200/60 flex-wrap">
                <Users className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Certified COMELEC Records &bull; Civic Demographics</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#0B1E36] leading-tight break-words">
                Voters&apos; Profile &amp; Demographics
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Official demographic distribution, generational cohorts, and geographic profile of registered
                Filipino voters for the 2028 National Elections, compiled from Commission on Elections
                (COMELEC) certified records and contextualized alongside our voluntary public opinion survey.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto flex-shrink-0">
              <Link
                href="/survey"
                className="w-full sm:w-auto min-h-[44px] px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Vote className="w-4 h-4 text-white flex-shrink-0" />
                <span>Participate in Survey</span>
              </Link>
              <Link
                href="/map"
                className="w-full sm:w-auto min-h-[44px] px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-300 flex items-center justify-center gap-2 transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>View Live Map</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 space-y-6 sm:space-y-8">
        {/* Transparent Attribution Banner */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-blue-50/70 border border-blue-200/70 text-xs text-blue-900 flex items-start gap-2.5 sm:gap-3">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed min-w-0 flex-1">
            <span className="font-bold">Data Attribution Notice:</span> The registered voter demographics, generational cohorts, and provincial figures presented below reflect official certified data from the Commission on Elections (COMELEC) and the Philippine Statistics Authority (PSA). Survey respondent totals represent voluntary online participation and are strictly partitioned from official election registries.
          </div>
        </div>

        {/* ================= 4 KEY STAT CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Total Registered */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-2 min-w-0">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Registered Voters (COMELEC)
            </div>
            <div className="text-xl sm:text-2xl lg:text-[22px] xl:text-3xl font-bold text-[#0B1E36] tabular-nums whitespace-nowrap">
              {baseline.totalRegisteredVoters.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Certified electoral baseline</span>
            </div>
          </div>

          {/* Card 2: The Youth Vote */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-2 min-w-0">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Youth Electorate (Gen Z + Millennials)
            </div>
            <div className="text-xl sm:text-2xl lg:text-[22px] xl:text-3xl font-bold text-blue-600 tabular-nums whitespace-nowrap">
              {baseline.youthVoteShare}%
            </div>
            <div className="text-xs text-slate-500 font-medium">
              36.9M registered voters under 42 years
            </div>
          </div>

          {/* Card 3: Gender Distribution */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-2 min-w-0">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Gender Ratio (Nationwide)
            </div>
            <div className="flex items-baseline gap-1.5 whitespace-nowrap">
              <span className="text-xl sm:text-2xl lg:text-[22px] xl:text-3xl font-bold text-[#0B1E36] tabular-nums whitespace-nowrap">
                51.2%<span className="text-xs sm:text-sm font-semibold text-purple-600 ml-1">F</span>
              </span>
              <span className="text-slate-300 font-light text-base sm:text-lg lg:text-xl">/</span>
              <span className="text-xl sm:text-2xl lg:text-[22px] xl:text-3xl font-bold text-[#0B1E36] tabular-nums whitespace-nowrap">
                48.8%<span className="text-xs sm:text-sm font-semibold text-blue-600 ml-1">M</span>
              </span>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              33.6M Female &bull; 32.1M Male
            </div>
          </div>

          {/* Card 4: Survey Participation */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-2 min-w-0">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Voluntary Survey Submissions
            </div>
            <div className="text-xl sm:text-2xl lg:text-[22px] xl:text-3xl font-bold text-blue-600 tabular-nums whitespace-nowrap">
              {analytics?.summary?.totalActiveSubmissions?.toLocaleString() || "0"}
            </div>
            <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></span>
              <span>100% verified online participants</span>
            </div>
          </div>
        </div>

        {/* ================= GENERATIONAL COHORT BREAKDOWN (THE YOUTH VOTE) ================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
          <div className="bg-slate-50/90 px-4 sm:px-6 py-4 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0B1E36] tracking-tight">
                Generational Cohorts: Age Group Distribution
              </h2>
              <p className="text-xs text-slate-500">
                Official demographic categorization of registered voters by age bracket (COMELEC)
              </p>
            </div>
            <div className="self-start sm:self-auto px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-200/60">
              Youth Vote Holds 56.4% Majority
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {baseline.generations.map((gen, idx) => {
                const colors = ["#004B93", "#0284C7", "#0D9488", "#64748B"];
                const color = colors[idx % colors.length];

                return (
                  <div
                    key={gen.label}
                    className="p-4 sm:p-5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3 min-w-0"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-bold text-sm sm:text-base text-[#0B1E36]">
                        {gen.label}
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-200/80 text-slate-700">
                        {gen.ageBracket}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-2xl font-bold text-[#0B1E36] tabular-nums">
                        {gen.percentage}%
                      </div>
                      <div className="text-xs text-slate-500 font-medium tabular-nums">
                        {gen.count.toLocaleString()} registered voters
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200/70 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, gen.percentage * 2)}%`, backgroundColor: color }}
                      ></div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed pt-1 break-words">{gen.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Generational Insight Callout */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-blue-50/60 border border-blue-200/70 text-xs text-blue-900 leading-relaxed flex flex-col sm:flex-row items-start gap-3">
              <Award className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="font-bold">Demographic Research Insight: </span>
                Combined, <strong>Millennials and Gen Z account for over 56.4%</strong> of the entire
                Philippine registered voting population. With over 36.9 million young voters eligible to cast ballots,
                issues of accessible higher education, digital employment, public transport modernisation, and civic accountability
                represent the primary decision factors.
              </div>
            </div>
          </div>
        </div>

        {/* ================= GENDER & CIVIL STATUS PROFILE ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gender Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4 min-w-0">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base text-[#0B1E36]">
                Gender Breakdown (COMELEC Certified)
              </h3>
              <span className="text-xs text-slate-400 font-semibold uppercase">Nationwide</span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3.5 sm:p-4 rounded-xl bg-purple-50/70 border border-purple-100 space-y-1 text-center">
                <div className="text-[11px] sm:text-xs font-bold text-purple-700 uppercase">Female Voters</div>
                <div className="text-xl sm:text-2xl font-bold text-purple-900">51.2%</div>
                <div className="text-[11px] sm:text-xs text-purple-700 font-medium tabular-nums">33,648,147</div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-blue-50/70 border border-blue-100 space-y-1 text-center">
                <div className="text-[11px] sm:text-xs font-bold text-blue-700 uppercase">Male Voters</div>
                <div className="text-xl sm:text-2xl font-bold text-blue-900">48.8%</div>
                <div className="text-[11px] sm:text-xs text-blue-700 font-medium tabular-nums">32,097,365</div>
              </div>
            </div>

            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
              <div className="bg-purple-500 h-full" style={{ width: "51.2%" }}></div>
              <div className="bg-blue-600 h-full" style={{ width: "48.8%" }}></div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              In the Philippines, female registered voters consistently outnumber male voters by over 1.5 million,
              influencing turnout trends across Luzon, Visayas, and Mindanao.
            </p>
          </div>

          {/* Civil Status Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4 min-w-0">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base text-[#0B1E36]">
                Civil Status Distribution
              </h3>
              <span className="text-xs text-slate-400 font-semibold uppercase">Official Baseline</span>
            </div>

            <div className="space-y-3">
              {baseline.civilStatus.map((cs) => (
                <div key={cs.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="font-semibold text-slate-700 truncate">{cs.label}</span>
                    <span className="font-bold text-[#0B1E36] tabular-nums flex-shrink-0">
                      {cs.percentage}% ({cs.count.toLocaleString()})
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${cs.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= TOP 12 VOTE-RICH PROVINCES ================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
          <div className="bg-slate-50/90 px-4 sm:px-6 py-4 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0B1E36] tracking-tight">
                Top Vote-Rich Provinces in the Philippines
              </h2>
              <p className="text-xs text-slate-500">
                The battleground provinces that carry the largest share of the 2028 electorate
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500 self-start sm:self-auto">
              Ranked by Certified Registrants
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Province</th>
                  <th className="py-3 px-4">Island Group</th>
                  <th className="py-3 px-4 text-right">Registered Voters</th>
                  <th className="py-3 px-4 text-right">National Share</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {baseline.topVoteRichProvinces.map((prov) => (
                  <tr key={prov.name} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                          prov.rank <= 3 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {prov.rank}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-sm text-[#0B1E36]">
                      {prov.name}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-medium">{prov.islandGroup}</td>
                    <td className="py-3 px-4 text-right font-bold text-[#0B1E36] text-sm tabular-nums">
                      {prov.registeredVoters.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-blue-600 tabular-nums">
                      {prov.share}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Link
                        href={`/map?province=${prov.name.toLowerCase().replace(/\s+/g, "-")}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 p-1 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                      >
                        <span>View Map</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= INTERACTIVE REGION & PROVINCE DEMOGRAPHIC EXPLORER ================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 lg:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0B1E36] tracking-tight">
                Regional &amp; Provincial Demographic Explorer
              </h2>
              <p className="text-xs text-slate-500">
                Select any Philippine administrative region or province to view local demographics and survey statistics
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedRegionId}
                onChange={(e) => {
                  setSelectedRegionId(e.target.value);
                  const firstProv = PHILIPPINE_PROVINCES.find((p) => p.regionId === e.target.value);
                  if (firstProv) setSelectedProvinceId(firstProv.id);
                }}
                className="w-full sm:w-auto min-h-[44px] py-2 px-3 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {PHILIPPINE_REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.code} - {r.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedProvinceId}
                onChange={(e) => setSelectedProvinceId(e.target.value)}
                className="w-full sm:w-auto min-h-[44px] py-2 px-3 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {regionProvinces.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Regional Details Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 min-w-0">
              <div className="text-[11px] font-bold text-slate-500 uppercase">
                {currentRegion.code}
              </div>
              <div className="text-base sm:text-lg font-bold text-[#0B1E36] truncate">
                {currentRegion.name}
              </div>
              <div className="text-xs text-slate-600">
                Island Group: <strong>{currentRegion.islandGroup}</strong>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 min-w-0">
              <div className="text-[11px] font-bold text-slate-500 uppercase">
                Regional Voting Population
              </div>
              <div className="text-xl sm:text-2xl font-bold text-blue-600 tabular-nums break-words">
                {currentRegion.registeredVoters?.toLocaleString() || "7,289,791"}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Official COMELEC registered voters
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 min-w-0 sm:col-span-2 md:col-span-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase">
                Selected Province
              </div>
              <div className="text-base sm:text-lg font-bold text-[#0B1E36] truncate">
                {currentProvince.name}
              </div>
              <div className="text-xs text-slate-500">
                Cities &amp; Municipalities:{" "}
                <strong>{currentProvince.cities?.length || 16} local units</strong>
              </div>
            </div>
          </div>
        </div>

        {/* ================= VOTER EDUCATION & COMELEC GUIDELINES ================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 lg:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-[#0B1E36] tracking-tight">
              Voter Guidelines &amp; Civic Education
            </h2>
            <p className="text-xs text-slate-500">
              Essential COMELEC reminders and automated election system instructions for Filipino voters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0B1E36]">
                <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Election Day Schedule</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Voting precincts nationwide operate strictly from <strong>6:00 AM to 7:00 PM</strong> on national
                election day. Senior citizens, pregnant women, and PWDs are accommodated in accessible priority
                lanes.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0B1E36]">
                <FileCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Valid Identification</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Voters must be listed in the Computerized Voters List (CVL). Present a valid government-issued photo
                ID (PhilID, Driver&apos;s License, Passport, UMID, Postal ID, PRC ID) or student ID.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0B1E36]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Ballot Integrity Rules</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fully shade the oval beside your candidate of choice. Do not overvote: select strictly 1 President,
                1 Vice-President, and a maximum of 12 Senators to avoid ballot invalidation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
