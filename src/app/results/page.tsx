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
} from "lucide-react";
import ElectionLiveBadge from "@/components/ElectionLiveBadge";

export default function LiveResultsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"PRESIDENT" | "VICE_PRESIDENT" | "SENATOR">("PRESIDENT");

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
      {/* Broadcast Header Banner */}
      <div className="bg-[#0B132B] text-white border-b-2 border-gma-red py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ElectionLiveBadge label="OFFICIAL TALLY REPORT" sublabel="Made by Neil Swing" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-headline font-black text-white tracking-wide uppercase mt-1">
                National Election Survey Results
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-sans mt-0.5 max-w-2xl">
                Real-time tabulation derived strictly from active, verified voluntary online survey submissions.
                Updated continuously as participants cast their votes.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadData}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-headline font-bold text-xs uppercase tracking-wider transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Tally</span>
              </button>
              <Link
                href="/survey"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gma-red hover:bg-red-700 text-white font-headline font-bold text-xs uppercase tracking-wider shadow transition-colors"
              >
                <Vote className="w-3.5 h-3.5 text-amber-300" />
                <span>Cast Your Vote</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] font-headline font-bold uppercase tracking-wider text-slate-300">
                Active Counted Votes
              </span>
              <div className="text-2xl font-headline font-black text-amber-400 mt-1 tabular-nums">
                {(analytics?.summary?.totalActiveSubmissions || 0).toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Contributing to live tallies</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] font-headline font-bold uppercase tracking-wider text-slate-300">
                Votes Recorded Today
              </span>
              <div className="text-2xl font-headline font-black text-emerald-400 mt-1 tabular-nums">
                {(analytics?.summary?.todaySubmissions || 0).toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Last 24 hours</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] font-headline font-bold uppercase tracking-wider text-slate-300">
                Retracted Votes
              </span>
              <div className="text-2xl font-headline font-black text-slate-400 mt-1 tabular-nums">
                {(analytics?.summary?.totalRetractedSubmissions || 0).toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Excluded from counts</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] font-headline font-bold uppercase tracking-wider text-slate-300">
                Tally Status
              </span>
              <div className="text-sm font-headline font-bold text-white mt-2 uppercase">
                {analytics?.summary?.lastUpdated
                  ? new Date(analytics.summary.lastUpdated).toLocaleTimeString()
                  : "LIVE DATA"}
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Synchronized with database</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-2 font-headline overflow-x-auto scrollbar-none">
          {(["PRESIDENT", "VICE_PRESIDENT", "SENATOR"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all whitespace-nowrap flex-shrink-0 ${
                activeTab === tab
                  ? "bg-gma-red text-white shadow"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
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
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 sm:p-6 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-headline font-bold text-[#0B132B] uppercase tracking-wide">
                {activeTab === "PRESIDENT" && "PRESIDENT OF THE PHILIPPINES \u2022 NATIONAL STANDINGS"}
                {activeTab === "VICE_PRESIDENT" && "VICE PRESIDENT OF THE PHILIPPINES \u2022 NATIONAL STANDINGS"}
                {activeTab === "SENATOR" && "SENATORIAL SLATE RANKINGS (TOP CANDIDATES)"}
              </h2>
              <p className="text-xs font-sans text-slate-500 mt-0.5">
                {activeTab === "SENATOR"
                  ? "Percentages show the proportion of participating survey voters who included each senator in their ballot."
                  : "Percentages show share of valid votes cast in this national category."}
              </p>
            </div>

            <Link
              href="/map"
              className="inline-flex items-center gap-1.5 font-headline font-bold text-xs text-gma-blue hover:text-blue-800 uppercase tracking-wider flex-shrink-0 self-start sm:self-auto"
            >
              <span>View Map Heatmap</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Candidate Standings List */}
          <div className="space-y-4">
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
                    className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                      isLeader
                        ? "border-amber-400 bg-amber-50/40 shadow-sm ring-1 ring-amber-300"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-headline font-bold text-xs flex-shrink-0 ${
                            isLeader ? "bg-amber-400 text-slate-900 shadow-sm" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          #{idx + 1}
                        </span>

                        <div className="relative flex-shrink-0">
                          {cand.photoUrl ? (
                            <img
                              src={cand.photoUrl}
                              alt={cand.name}
                              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 shadow-sm"
                              style={{ borderColor: cand.color }}
                            />
                          ) : (
                            <div
                              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm"
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
                          <div className="font-headline font-bold text-base sm:text-lg text-[#0B132B] uppercase tracking-wide flex flex-wrap items-center gap-2">
                            <span className="truncate">{cand.name}</span>
                            {isLeader && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-headline font-bold px-2 py-0.5 rounded bg-gma-red text-white uppercase tracking-wider flex-shrink-0">
                                <Award className="w-3 h-3" />
                                <span>LEADING</span>
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-sans text-slate-500 font-semibold truncate">
                            {cand.party || "INDEPENDENT"}
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 flex-shrink-0">
                        <div className="font-headline font-black text-2xl text-gma-blue tabular-nums">
                          {cand.percentage}%
                        </div>
                        <div className="text-xs font-sans font-bold text-slate-500 tabular-nums">
                          {cand.votes.toLocaleString()} votes
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mt-1">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-headline">
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-subtle space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Luzon Island Group
            </span>
            <div className="text-3xl font-black text-gma-blue tabular-nums">
              {(analytics?.islandGroupBreakdown?.Luzon || 0).toLocaleString()} Votes
            </div>
            <p className="text-[11px] font-sans text-slate-500">
              NCR, CAR, Central Luzon, CALABARZON, MIMAROPA, and Bicol provinces.
            </p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-subtle space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Visayas Island Group
            </span>
            <div className="text-3xl font-black text-gma-blue tabular-nums">
              {(analytics?.islandGroupBreakdown?.Visayas || 0).toLocaleString()} Votes
            </div>
            <p className="text-[11px] font-sans text-slate-500">
              Western Visayas, Central Visayas (Cebu, Bohol), and Eastern Visayas.
            </p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-subtle space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Mindanao Island Group
            </span>
            <div className="text-3xl font-black text-gma-blue tabular-nums">
              {(analytics?.islandGroupBreakdown?.Mindanao || 0).toLocaleString()} Votes
            </div>
            <p className="text-[11px] font-sans text-slate-500">
              Davao Region, Northern Mindanao, SOCCSKSARGEN, Caraga, and BARMM.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
