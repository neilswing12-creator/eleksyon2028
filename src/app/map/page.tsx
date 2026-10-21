"use client";

import React, { useEffect, useState } from "react";
import Philippine3DMap from "@/components/Philippine3DMap";
import Philippine2DMap from "@/components/Philippine2DMap";
import GMALeaderboardWidget from "@/components/GMALeaderboardWidget";
import GMASmartMapStation from "@/components/GMASmartMapStation";
import ElectionLiveBadge from "@/components/ElectionLiveBadge";
import ProvinceDetailModal from "@/components/ProvinceDetailModal";
import {
  Map,
  Layers,
  RefreshCw,
  Award,
  Vote,
  Hexagon,
  Flame,
  CheckCircle2,
  Users,
  Compass,
} from "lucide-react";

export default function InteractiveMapPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"STATION" | "HEX" | "3D">("STATION");
  const [selectedPosition, setSelectedPosition] = useState<"PRESIDENT" | "VICE_PRESIDENT" | "SENATOR">("PRESIDENT");
  const [selectedProvince, setSelectedProvince] = useState<any>(null);

  const fetchAnalytics = async () => {
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
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 15000);
    return () => clearInterval(interval);
  }, []);

  // Compute rankings to pass into Leaderboard
  const currentRankings =
    selectedPosition === "PRESIDENT"
      ? analytics?.presidentialRankings || []
      : selectedPosition === "VICE_PRESIDENT"
      ? analytics?.vicePresidentialRankings || []
      : analytics?.senatorialRankings || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* GMA News Broadcast Header Ticker */}
      <div className="bg-[#0B132B] text-white border-b-2 border-gma-red py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ElectionLiveBadge label="ELECTION DATA DESK" sublabel="Made by Swing Labs" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-headline font-black text-white tracking-wide uppercase mt-1">
                Philippine Survey Map &amp; Real-Time Tally
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-sans mt-0.5 max-w-2xl">
                Explore voting trends across all 82 provinces using the interactive hexagonal cartogram,
                geographic heatmap, or 3D spatial studio view created by Swing Labs.
              </p>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
              <div className="bg-[#070D1F] p-1 rounded-xl flex items-center border border-white/10 font-headline text-xs overflow-x-auto scrollbar-none max-w-full">
                <button
                  onClick={() => setViewMode("STATION")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold tracking-wider uppercase transition-all ${
                    viewMode === "STATION"
                      ? "bg-gma-red text-white shadow"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-amber-300" />
                  <span>Smart Station</span>
                </button>
                <button
                  onClick={() => setViewMode("HEX")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold tracking-wider uppercase transition-all ${
                    viewMode === "HEX"
                      ? "bg-gma-red text-white shadow"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Map className="w-3.5 h-3.5 text-amber-300" />
                  <span>Hex Cartogram</span>
                </button>
                <button
                  onClick={() => setViewMode("3D")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold tracking-wider uppercase transition-all ${
                    viewMode === "3D"
                      ? "bg-gma-red text-white shadow"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-amber-300" />
                  <span>3D Spatial</span>
                </button>
              </div>

              <button
                onClick={fetchAnalytics}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Refresh Live Data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {loading ? (
          <div className="w-full h-[620px] bg-white rounded-2xl border-2 border-slate-200 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 text-gma-blue animate-spin" />
            <p className="text-xs font-headline font-bold text-slate-500 uppercase tracking-wider">
              Loading Philippine Election Map Data...
            </p>
          </div>
        ) : viewMode === "STATION" ? (
          <GMASmartMapStation
            candidates={analytics?.candidates || []}
            presidentialRankings={analytics?.presidentialRankings || []}
            vicePresidentialRankings={analytics?.vicePresidentialRankings || []}
            senatorialRankings={analytics?.senatorialRankings || []}
            provinces={analytics?.provinces || []}
            regions={analytics?.regions || []}
            lastUpdated={analytics?.summary?.lastUpdated}
            onSelectProvince={(p) => setSelectedProvince(p)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Map Column (7 Columns) */}
            <div className="lg:col-span-7">
              {viewMode === "3D" ? (
                <Philippine3DMap
                  provinces={analytics?.provinces || []}
                  selectedPosition={selectedPosition}
                  onSelectProvince={(p) => setSelectedProvince(p)}
                  selectedProvinceId={selectedProvince?.id}
                />
              ) : (
                <Philippine2DMap
                  provinces={analytics?.provinces || []}
                  selectedPosition={selectedPosition}
                  onSelectProvince={(p) => setSelectedProvince(p)}
                  selectedProvinceId={selectedProvince?.id}
                />
              )}
            </div>

            {/* GMA Live Leaderboard Column (5 Columns) */}
            <div className="lg:col-span-5">
              <GMALeaderboardWidget
                selectedPosition={selectedPosition}
                onSelectPosition={(pos) => setSelectedPosition(pos)}
                rankings={currentRankings}
                selectedProvince={selectedProvince}
                onClearProvince={() => setSelectedProvince(null)}
                totalSubmissions={analytics?.summary?.totalActiveSubmissions || 0}
              />
            </div>
          </div>
        )}

        {/* Assigned Candidate Colors Bar */}
        <div className="mt-8 bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-subtle">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-gma-blue" />
              <h3 className="text-xs font-headline font-bold uppercase tracking-wider text-[#0B132B]">
                Official Candidate Color Index &bull; {selectedPosition.replace("_", " ")}
              </h3>
            </div>
            <span className="text-[11px] font-sans text-slate-400">Configured by Survey Administrators</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {currentRankings.map((c: any) => (
              <div
                key={c.id}
                className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200 bg-slate-50/60"
              >
                <span
                  className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-sm border border-slate-300"
                  style={{ backgroundColor: c.color }}
                ></span>
                <div className="truncate">
                  <div className="font-headline font-bold text-xs text-[#0B132B] truncate uppercase">
                    {c.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold">{c.party || "INDEPENDENT"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for detailed province breakdown */}
      <ProvinceDetailModal
        province={selectedProvince}
        onClose={() => setSelectedProvince(null)}
        minThreshold={analytics?.summary?.minResponseThreshold || 1}
      />
    </div>
  );
}
