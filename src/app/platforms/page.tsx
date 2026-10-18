"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Search, CheckCircle2, ExternalLink, Filter, ShieldCheck } from "lucide-react";

export default function PlatformsPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { label: "All Categories", value: "ALL" },
    { label: "Economy & Jobs", value: "ECONOMY" },
    { label: "Healthcare", value: "HEALTHCARE" },
    { label: "Education", value: "EDUCATION" },
    { label: "Agriculture & Fisheries", value: "AGRICULTURE" },
    { label: "Infrastructure", value: "INFRASTRUCTURE" },
    { label: "Governance & Anti-Corruption", value: "GOVERNANCE" },
    { label: "Digital Transformation", value: "DIGITAL_TRANSFORMATION" },
    { label: "Public Safety", value: "PUBLIC_SAFETY" },
    { label: "Environment & Climate", value: "ENVIRONMENT" },
  ];

  useEffect(() => {
    async function load() {
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
    load();
  }, []);

  // Collect all platforms with parent candidate info
  const allPlatforms = candidates.flatMap((c) =>
    (c.platforms || []).map((p: any) => ({
      ...p,
      candidateName: c.name,
      candidateSlug: c.slug,
      candidateColor: c.color,
      candidatePosition: c.position,
      candidateParty: c.party,
    }))
  );

  const filtered = allPlatforms.filter((p) => {
    const matchesCat = selectedCategory === "ALL" || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.candidateName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-brand-light pb-16">
      {/* Header */}
      <div className="bg-white border-b border-brand-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-gma-blue/10 text-gma-blue text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Comparative Policy Repository</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-headline font-bold uppercase tracking-tight text-brand-navy">
              Candidate Agendas &amp; Platforms
            </h1>
            <p className="text-xs sm:text-sm text-brand-slate mt-1 max-w-2xl">
              Examine the verified policy proposals, economic frameworks, and legislative agendas offered by
              2028 presidential, vice-presidential, and senatorial candidates.
            </p>
          </div>

          {/* Controls Bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search policy topic or candidate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat.value
                      ? "bg-brand-blue text-white shadow-sm"
                      : "bg-slate-100 text-brand-slate hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Platform Proposals Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading policy platforms...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-brand-border p-12 text-center text-xs text-slate-500">
            No platforms found for the selected category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Category Pill & Verification */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-brand-blue">
                      {item.category.replace("_", " ")}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{item.verificationStatus}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-brand-navy leading-snug">{item.title}</h3>
                  <p className="text-xs text-brand-slate leading-relaxed">{item.description}</p>
                </div>

                {/* Candidate Tag & Link */}
                <div className="pt-4 border-t border-brand-border flex flex-wrap items-center justify-between gap-2">
                  <Link
                    href={`/candidates/${item.candidateSlug}`}
                    className="flex items-center gap-2 group min-w-0 flex-1"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.candidateColor }}
                    ></span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-brand-navy group-hover:text-brand-blue transition-colors truncate">
                        {item.candidateName}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {item.candidatePosition.replace("_", " ")} &bull; {item.candidateParty}
                      </div>
                    </div>
                  </Link>

                  {item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-blue hover:underline flex-shrink-0 ml-auto"
                    >
                      <span>Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
