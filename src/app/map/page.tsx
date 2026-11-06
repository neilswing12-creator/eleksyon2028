"use client";

import React, { useEffect, useState } from "react";
import PhilippineResultsMap from "@/components/PhilippineResultsMap";
import { Globe, Info, RefreshCw } from "lucide-react";

export default function InteractiveMapPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/analytics", { cache: "no-store" });
      if (res.ok) setAnalytics(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      <div className="border-b border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 md:flex-row md:items-end md:justify-between lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#CE1126]">Mapa ng Survey · Survey Map</p>
            <h1 className="mt-1 text-3xl font-bold text-[#0B1E36]">Resulta sa bawat lalawigan, lungsod at bayan</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Results for all 82 provinces and 1,642 cities and municipalities, drawn on official PSGC boundaries.
              This is a voluntary, non-scientific opinion survey, not an official COMELEC count.
            </p>
          </div>
          <button
            onClick={fetchAnalytics}
            className="flex items-center gap-2 self-start rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 md:self-auto"
          >
            <RefreshCw className="h-3.5 w-3.5" /> I-refresh
          </button>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex h-[620px] w-full flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white">
            <RefreshCw className="h-7 w-7 animate-spin text-[#0038A8]" />
            <p className="text-xs font-semibold text-slate-500">Nilo-load ang mapa…</p>
          </div>
        ) : (
          <PhilippineResultsMap
            candidates={analytics?.candidates || []}
            presidentialRankings={analytics?.presidentialRankings || []}
            vicePresidentialRankings={analytics?.vicePresidentialRankings || []}
            senatorialRankings={analytics?.senatorialRankings || []}
            provinces={analytics?.provinces || []}
            regions={analytics?.regions || []}
            lastUpdated={analytics?.summary?.lastUpdated}
          />
        )}

        {/* Overseas Filipino Participation (OFW & Diaspora) Summary */}
        <div className="mt-8 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider mb-1">
                <Globe className="w-3.5 h-3.5" />
                <span>Global Filipino Community &bull; OFW Sector</span>
              </div>
              <h3 className="text-base font-bold text-[#0B1E36]">
                Overseas Filipino Participation (Diaspora Tally)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Overseas Filipino survey responses are counted in national candidate standings and kept
                separate from the 82 Philippine provincial map cartograms.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-right flex-shrink-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Overseas Votes
              </span>
              <div className="text-xl font-bold text-blue-700 tabular-nums">
                {(analytics?.overseas?.totalSubmissions || 0).toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500">
                {analytics?.overseas?.percentageOfTotal ?? 0}% of all active responses
              </span>
            </div>
          </div>

          {/* Top Participating Countries Grid */}
          {analytics?.overseas?.countries && analytics.overseas.countries.length > 0 ? (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Top Participating Countries Abroad
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {analytics.overseas.countries.slice(0, 6).map((c: any) => (
                  <div
                    key={c.code}
                    className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-base">
                        <span>{c.flag}</span>
                        <span className="font-semibold text-xs text-[#0B1E36] truncate">
                          {c.name}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate">{c.region}</div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-slate-800">{c.count} votes</span>
                      <span className="text-[10px] text-blue-600 font-bold">{c.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400 italic">
              No overseas submissions recorded yet. Overseas Filipinos can cast their vote by choosing &quot;Outside the Philippines (OFW)&quot; in the survey.
            </div>
          )}

          <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <p className="text-[11px] leading-relaxed">
              <strong>Geographic Isolation Rule:</strong> Under our survey aggregation methodology, overseas responses are never assigned to a random or default Philippine province. Philippine map colors and leader calculations represent domestic provincial voters only.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
