"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Award,
  Vote,
  RefreshCw,
  Users,
  MapPin,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Globe,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function LiveResultsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"PRESIDENT" | "VICE_PRESIDENT" | "SENATOR">("PRESIDENT");
  const [showAllCountries, setShowAllCountries] = useState(false);

  const loadData = async () => {
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 15000);
    return () => clearInterval(timer);
  }, []);

  const rankings =
    activeTab === "PRESIDENT"
      ? analytics?.presidentialRankings || []
      : activeTab === "VICE_PRESIDENT"
      ? analytics?.vicePresidentialRankings || []
      : analytics?.senatorialRankings || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* Civic Header Banner */}
      <div className="bg-white border-b border-slate-200/80 py-8 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Official Public Opinion Tally</span>
                <span className="text-blue-300">•</span>
                <span className="text-slate-500 font-normal">Made by Swing Labs</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B1E36] tracking-tight">
                National Election Survey <span className="text-blue-600">Results</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Real-time tabulation derived strictly from active, verified voluntary online survey submissions.
                Updated continuously as participants cast their votes.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadData}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors border border-slate-200"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Tally</span>
              </button>
              <Link
                href="/survey"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors"
              >
                <Vote className="w-3.5 h-3.5" />
                <span>Cast Your Vote</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mt-6">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-500">
                Total Counted
              </span>
              <div className="text-2xl font-bold text-[#0B1E36] mt-1 tabular-nums">
                {(analytics?.summary?.totalActiveSubmissions || 0).toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Contributing to live tallies</p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-sky-600" />
                <span>Domestic (PH)</span>
              </span>
              <div className="text-2xl font-bold text-sky-700 mt-1 tabular-nums">
                {(analytics?.summary?.domesticSubmissionsCount || 0).toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Provinces &amp; cities</p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <Globe className="w-3 h-3 text-blue-600" />
                <span>Overseas (OFW)</span>
              </span>
              <div className="text-2xl font-bold text-blue-700 mt-1 tabular-nums">
                {(analytics?.summary?.overseasSubmissionsCount || 0).toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {analytics?.overseas?.percentageOfTotal ?? 0}% of active votes
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-500">
                Votes Today
              </span>
              <div className="text-2xl font-bold text-emerald-600 mt-1 tabular-nums">
                {(analytics?.summary?.todaySubmissions || 0).toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Philippine calendar day (PST)</p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/80 col-span-2 sm:col-span-1">
              <span className="text-[11px] font-semibold text-slate-500">
                Retracted Votes
              </span>
              <div className="text-2xl font-bold text-slate-400 mt-1 tabular-nums">
                {(analytics?.summary?.totalRetractedSubmissions || 0).toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Excluded from counts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none">
          {(["PRESIDENT", "VICE_PRESIDENT", "SENATOR"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-normal transition-all whitespace-nowrap flex-shrink-0 ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {tab === "PRESIDENT"
                ? "Presidential Standings"
                : tab === "VICE_PRESIDENT"
                ? "Vice Presidential Standings"
                : "Senatorial Slate Standings"}
            </button>
          ))}
        </div>

        {/* Standings Table with Candidate Cards */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#0B1E36]">
                {activeTab === "PRESIDENT" && "President of the Philippines • National Standings"}
                {activeTab === "VICE_PRESIDENT" && "Vice President of the Philippines • National Standings"}
                {activeTab === "SENATOR" && "Senatorial Slate Rankings (Top Candidates)"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeTab === "SENATOR"
                  ? "Percentages show the proportion of participating survey voters who included each senator in their ballot."
                  : "Percentages show share of valid votes cast in this national category."}
              </p>
            </div>

            <Link
              href="/map"
              className="inline-flex items-center gap-1.5 font-semibold text-xs text-blue-600 hover:text-blue-700 flex-shrink-0 self-start sm:self-auto"
            >
              <span>View Interactive Map</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Candidate Standings List */}
          <div className="space-y-3.5">
            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading live rankings...</div>
            ) : rankings.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 italic">
                No active survey responses recorded yet for this position.
              </div>
            ) : (
              rankings.map((cand: any, idx: number) => {
                const isLeader = idx === 0 && cand.votes > 0;
                return (
                  <div
                    key={cand.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isLeader
                        ? "border-blue-200 bg-blue-50/30 shadow-xs ring-1 ring-blue-100"
                        : "border-slate-200/80 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                            isLeader ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          #{idx + 1}
                        </span>

                        <div className="relative flex-shrink-0">
                          {cand.photoUrl ? (
                            <img
                              src={cand.photoUrl}
                              alt={cand.name}
                              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 shadow-xs"
                              style={{ borderColor: cand.color }}
                            />
                          ) : (
                            <div
                              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xs"
                              style={{ backgroundColor: cand.color }}
                            >
                              {cand.name.slice(0, 2)}
                            </div>
                          )}
                          <span
                            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white"
                            style={{ backgroundColor: cand.color }}
                          ></span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-base text-[#0B1E36] flex flex-wrap items-center gap-2">
                            <span className="truncate">{cand.name}</span>
                            {isLeader && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 flex-shrink-0">
                                <Award className="w-3 h-3" />
                                <span>LEADING</span>
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 font-medium truncate">
                            {cand.party || "INDEPENDENT"}
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 flex-shrink-0">
                        <div className="font-bold text-2xl text-blue-700 tabular-nums">
                          {cand.percentage}%
                        </div>
                        <div className="text-xs text-slate-500 tabular-nums font-medium">
                          {cand.votes.toLocaleString()} votes
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(2, cand.percentage)}%`,
                          backgroundColor: cand.color,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Island Group Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Luzon Island Group
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#0B1E36] tabular-nums">
              {(analytics?.islandGroupBreakdown?.Luzon || 0).toLocaleString()} Votes
            </div>
            <p className="text-xs text-slate-500">
              NCR, CAR, Central Luzon, CALABARZON, MIMAROPA, and Bicol provinces.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Visayas Island Group
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#0B1E36] tabular-nums">
              {(analytics?.islandGroupBreakdown?.Visayas || 0).toLocaleString()} Votes
            </div>
            <p className="text-xs text-slate-500">
              Western Visayas, Central Visayas (Cebu, Bohol), and Eastern Visayas.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Mindanao Island Group
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#0B1E36] tabular-nums">
              {(analytics?.islandGroupBreakdown?.Mindanao || 0).toLocaleString()} Votes
            </div>
            <p className="text-xs text-slate-500">
              Davao Region, Northern Mindanao, SOCCSKSARGEN, Caraga, and BARMM.
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* OVERSEAS FILIPINO PARTICIPATION & GLOBAL DIASPORA SECTION */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold mb-2">
                <Globe className="w-3.5 h-3.5" />
                <span>Global Filipino Diaspora • Overseas Public Opinion</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B1E36]">
                Overseas Filipino Participation (OFW &amp; Diaspora)
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                Independent voluntary survey responses cast by Filipinos living and working abroad across
                the Middle East, Asia Pacific, North America, Europe, and maritime fleets worldwide.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-right flex-shrink-0">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Total Overseas Submissions
              </span>
              <div className="text-2xl font-bold text-blue-700 tabular-nums">
                {(analytics?.overseas?.totalSubmissions || 0).toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                {analytics?.overseas?.percentageOfTotal ?? 0}% of all counted responses
              </span>
            </div>
          </div>

          {/* Domestic vs Overseas Participation Comparison */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-[#0B1E36]">
              <span className="flex items-center gap-1 text-sky-700">
                <MapPin className="w-3.5 h-3.5" />
                <span>
                  Domestic Philippines: {(analytics?.summary?.domesticSubmissionsCount || 0).toLocaleString()} (
                  {analytics?.summary?.totalActiveSubmissions > 0
                    ? (
                        ((analytics?.summary?.domesticSubmissionsCount || 0) /
                          analytics?.summary?.totalActiveSubmissions) *
                        100
                      ).toFixed(1)
                    : 100}
                  %)
                </span>
              </span>
              <span className="flex items-center gap-1 text-blue-700">
                <Globe className="w-3.5 h-3.5" />
                <span>
                  Overseas / OFW: {(analytics?.overseas?.totalSubmissions || 0).toLocaleString()} (
                  {analytics?.overseas?.percentageOfTotal ?? 0}%)
                </span>
              </span>
            </div>

            {/* Split Progress Bar */}
            <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden flex">
              <div
                style={{
                  width: `${
                    analytics?.summary?.totalActiveSubmissions > 0
                      ? (
                          ((analytics?.summary?.domesticSubmissionsCount || 0) /
                            analytics?.summary?.totalActiveSubmissions) *
                          100
                        ).toFixed(1)
                      : 100
                  }%`,
                }}
                className="bg-blue-600 h-full"
                title="Domestic Philippines"
              ></div>
              <div
                style={{
                  width: `${analytics?.overseas?.percentageOfTotal ?? 0}%`,
                }}
                className="bg-amber-400 h-full"
                title="Overseas (OFW)"
              ></div>
            </div>
          </div>

          {/* Regional Summary Pills */}
          {analytics?.overseas?.regions && analytics.overseas.regions.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-600 block">
                Regional Distribution Abroad
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {analytics.overseas.regions.map((reg: any) => (
                  <div
                    key={reg.region}
                    className="p-3.5 rounded-xl border border-slate-200/80 bg-white shadow-xs"
                  >
                    <span className="text-[11px] font-semibold text-slate-500 block truncate">
                      {reg.region}
                    </span>
                    <div className="text-lg font-bold text-[#0B1E36] mt-0.5 tabular-nums">
                      {reg.count.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-400">{reg.percentage}% of overseas</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Country Breakdown Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">
                Participation Breakdown by Country
              </span>
              {analytics?.overseas?.countries && analytics.overseas.countries.length > 6 && (
                <button
                  type="button"
                  onClick={() => setShowAllCountries(!showAllCountries)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  <span>{showAllCountries ? "Show Fewer" : "View All Countries"}</span>
                  {showAllCountries ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>

            {!analytics?.overseas?.countries || analytics.overseas.countries.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400 italic">
                No active responses from overseas participants yet. Overseas Filipinos may participate by selecting
                &quot;Outside the Philippines (OFW)&quot; in the survey.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200/80">
                <table className="w-full text-left text-xs min-w-[500px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                      <th className="py-2.5 px-3">Country</th>
                      <th className="py-2.5 px-3">Region</th>
                      <th className="py-2.5 px-3 text-right">Submissions</th>
                      <th className="py-2.5 px-3 text-right">% of Overseas</th>
                      <th className="py-2.5 px-3 text-right">% of Total Survey</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(showAllCountries
                      ? analytics.overseas.countries
                      : analytics.overseas.countries.slice(0, 6)
                    ).map((c: any) => (
                      <tr key={c.code} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-3 font-semibold text-[#0B1E36] flex items-center gap-2">
                          <span className="text-base">{c.flag}</span>
                          <span>{c.name}</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 text-[11px]">{c.region}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">
                          {c.count.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-blue-700 font-semibold">
                          {c.percentage}%
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                          {c.percentageOfTotal}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Civic Disclaimer Notice */}
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/60 text-slate-700 text-xs flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 leading-relaxed">
              <span className="font-semibold text-slate-900 block">
                Public Opinion Survey Transparency Notice
              </span>
              <p className="text-slate-600 text-[11px]">
                These figures reflect voluntary participation in an unofficial public opinion survey and do not
                represent official Commission on Elections (COMELEC) overseas absentee voting (OAV) returns or
                certified ballot tallies. Overseas submissions are included in national executive and senatorial candidate
                totals, but are strictly partitioned from Philippine domestic provincial and regional map tallies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
