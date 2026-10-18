"use client";

import React from "react";
import Link from "next/link";
import { Award, TrendingUp, Users, CheckCircle2, ChevronRight, MapPin, X } from "lucide-react";
import ElectionLiveBadge from "./ElectionLiveBadge";

interface CandidateRank {
  id: string;
  name: string;
  party: string | null;
  color: string;
  photoUrl: string | null;
  votes: number;
  percentage: number;
}

interface Props {
  selectedPosition: "PRESIDENT" | "VICE_PRESIDENT" | "SENATOR";
  onSelectPosition: (pos: "PRESIDENT" | "VICE_PRESIDENT" | "SENATOR") => void;
  rankings: CandidateRank[];
  selectedProvince: any | null;
  onClearProvince: () => void;
  totalSubmissions: number;
}

export default function GMALeaderboardWidget({
  selectedPosition,
  onSelectPosition,
  rankings,
  selectedProvince,
  onClearProvince,
  totalSubmissions,
}: Props) {
  const topCandidate = rankings[0];

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-card flex flex-col h-full">
      {/* Broadcast Header */}
      <div className="bg-[#0B132B] text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ElectionLiveBadge label="OFFICIAL TALLY" sublabel="Made by Neil Swing" />
          </div>

          <span className="text-[11px] font-sans text-slate-300">
            {totalSubmissions.toLocaleString()} Total Votes
          </span>
        </div>

        {/* Selected Area Banner */}
        {selectedProvince ? (
          <div className="bg-white/10 rounded-xl p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div>
                <div className="text-xs font-headline font-bold tracking-wide uppercase text-white">
                  {selectedProvince.name}
                </div>
                <div className="text-[10px] text-slate-300">
                  {selectedProvince.islandGroup} &bull; {selectedProvince.regionId}
                </div>
              </div>
            </div>
            <button
              onClick={onClearProvince}
              className="p-1 rounded bg-white/20 hover:bg-white/30 text-white transition-colors"
              title="Clear province selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-base sm:text-lg font-headline font-bold uppercase text-white tracking-wide">
            {selectedPosition === "PRESIDENT" && "PRESIDENTIAL RACE - NATIONAL"}
            {selectedPosition === "VICE_PRESIDENT" && "VICE PRESIDENTIAL RACE - NATIONAL"}
            {selectedPosition === "SENATOR" && "SENATORIAL RACE - TOP SLATE"}
          </div>
        )}

        {/* Position Tab Switchers */}
        <div className="grid grid-cols-3 gap-1 mt-3 bg-[#070D1F] p-1 rounded-xl font-headline text-xs">
          {(["PRESIDENT", "VICE_PRESIDENT", "SENATOR"] as const).map((pos) => (
            <button
              key={pos}
              onClick={() => onSelectPosition(pos)}
              className={`py-1.5 rounded-lg font-bold tracking-wider uppercase transition-all ${
                selectedPosition === pos
                  ? "bg-gma-red text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {pos === "PRESIDENT" ? "PRESIDENT" : pos === "VICE_PRESIDENT" ? "VICE PRES" : "SENATORS"}
            </button>
          ))}
        </div>
      </div>

      {/* Rankings List */}
      <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[640px]">
        {rankings.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400 italic">
            No survey votes recorded yet for this category.
          </div>
        ) : (
          rankings.map((cand, idx) => {
            const isFirst = idx === 0 && cand.votes > 0;
            const margin =
              isFirst && rankings[1] ? Number((cand.percentage - rankings[1].percentage).toFixed(1)) : 0;

            return (
              <div
                key={cand.id}
                className={`rounded-xl border p-3.5 transition-all ${
                  isFirst
                    ? "border-amber-400 bg-amber-50/40 shadow-sm ring-1 ring-amber-300"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Left: Rank, Avatar, Name */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-headline font-bold text-xs ${
                        isFirst ? "bg-amber-400 text-slate-900 shadow-sm" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {idx + 1}
                    </span>

                    {/* Candidate Photo */}
                    <div className="relative">
                      {cand.photoUrl ? (
                        <img
                          src={cand.photoUrl}
                          alt={cand.name}
                          className="w-12 h-12 rounded-full object-cover border-2 shadow-sm"
                          style={{ borderColor: cand.color }}
                        />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm"
                          style={{ backgroundColor: cand.color }}
                        >
                          {cand.name.slice(0, 2)}
                        </div>
                      )}
                      <span
                        className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: cand.color }}
                      ></span>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-headline font-bold text-base text-[#0B132B] uppercase tracking-wide leading-none">
                          {cand.name}
                        </h4>
                      </div>
                      <div className="text-[11px] font-sans font-semibold text-slate-500 mt-1">
                        {cand.party || "INDEPENDENT"}
                      </div>
                    </div>
                  </div>

                  {/* Right: Percentage & Vote Count */}
                  <div className="text-right flex-shrink-0">
                    <div className="font-headline font-black text-xl text-[#0B132B] tabular-nums tracking-tight">
                      {cand.percentage}%
                    </div>
                    <div className="text-[11px] font-sans font-bold text-slate-500 tabular-nums">
                      {cand.votes.toLocaleString()} votes
                    </div>
                  </div>
                </div>

                {/* GMA-style bold progress bar */}
                <div className="mt-2.5 w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(2, cand.percentage)}%`,
                      backgroundColor: cand.color,
                    }}
                  ></div>
                </div>

                {/* Lead Margin Banner for 1st place */}
                {isFirst && margin > 0 && (
                  <div className="mt-2 pt-2 border-t border-amber-200/80 flex items-center justify-between text-[11px] text-amber-900 font-bold">
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      <span>LEAD MARGIN:</span>
                    </span>
                    <span className="text-gma-red font-headline text-xs font-bold">+{margin}% OVER #2</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer CTA */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
        <Link
          href="/results"
          className="font-headline font-bold text-gma-blue hover:text-blue-800 uppercase tracking-wider flex items-center gap-1"
        >
          <span>Full Comprehensive Tally</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
        <Link
          href="/survey"
          className="px-3 py-1.5 rounded-lg bg-gma-red text-white font-headline font-bold text-xs tracking-wider uppercase shadow hover:bg-red-700 transition-colors"
        >
          Cast Vote
        </Link>
      </div>
    </div>
  );
}
