"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Search, BookOpen, ExternalLink, ArrowRight, ShieldCheck } from "lucide-react";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchCandidates() {
      try {
        const res = await fetch("/api/candidates");
        if (res.ok) {
          const data = await res.json();
          setCandidates(data.candidates || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchCandidates();
  }, []);

  const filtered = candidates.filter((c) => {
    const matchesPos = selectedPosition === "ALL" || c.position === selectedPosition;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.party && c.party.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesPos && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* Header */}
      <div className="bg-white border-b border-brand-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Comprehensive 2028 Electoral Registry</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0B1E36] tracking-tight">
              Candidate Directory &amp; Biographies
            </h1>
            <p className="text-xs sm:text-sm text-brand-slate mt-1 max-w-2xl">
              Verified public profiles, educational backgrounds, legislative records, and published policy agendas
              for prospective candidates in the 2028 National Elections.
            </p>
          </div>

          {/* Search & Position Filters */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidates or political parties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {[
                { label: "All Candidates", value: "ALL" },
                { label: "President", value: "PRESIDENT" },
                { label: "Vice President", value: "VICE_PRESIDENT" },
                { label: "Senators", value: "SENATOR" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setSelectedPosition(tab.value)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedPosition === tab.value
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-brand-slate hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Candidates */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading candidate directory...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-brand-border p-12 text-center text-xs text-slate-500">
            No candidates matched your search criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-subtle hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Map Color Indicator */}
                  <div className="h-1.5 w-full" style={{ backgroundColor: c.color }}></div>

                  <div className="p-5 space-y-4">
                    <div className="flex items-start gap-3.5">
                      {c.photoUrl ? (
                        <img
                          src={c.photoUrl}
                          alt={c.name}
                          className="w-14 h-14 rounded-full object-cover border border-slate-200 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm text-slate-600 flex-shrink-0">
                          {c.name.slice(0, 2)}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-brand-slate mb-1">
                          {c.position.replace("_", " ")}
                        </span>
                        <h3 className="font-bold text-base sm:text-lg text-[#0B1E36] leading-snug truncate">{c.name}</h3>
                        <p className="text-xs text-brand-slate font-medium truncate">{c.party || "Independent"}</p>
                      </div>
                    </div>

                    {c.bio && (
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{c.bio}</p>
                    )}

                    {/* Platform Summary Count */}
                    <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
                      <span>Assigned Map Color:</span>
                      <span className="flex items-center gap-1 font-mono font-bold text-slate-600">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block"
                          style={{ backgroundColor: c.color }}
                        ></span>
                        {c.color}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 bg-slate-50 border-t border-brand-border flex items-center justify-between gap-2">
                  <Link
                    href={`/candidates/${c.slug}`}
                    className="w-full text-center py-2 px-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    View Biography
                  </Link>
                  <Link
                    href={`/platforms?candidate=${c.slug}`}
                    className="w-full text-center py-2 px-3 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Platforms</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
