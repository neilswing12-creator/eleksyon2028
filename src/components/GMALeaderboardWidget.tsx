"use client";

import React from "react";
import Link from "next/link";
import { Award, TrendingUp, Users, CheckCircle2, ChevronRight, MapPin, X } from "lucide-react";

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
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col h-full">
      {/* Header Panel */}
      <div className="bg-slate-50/90 p-4 border-b border-slate-200/80">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-200/60">
            <Award className="w-3.5 h-3.5" />
            <span>Survey Standings</span>
          </span>

          <span className="text-[11px] text-slate-500 font-medium">
            {totalSubmissions.toLocaleString()} Total Votes
          </span>
        </div>

        {/* Selected Area Banner */}
        {selectedProvince ? (
          <div className="bg-white rounded-xl p-2.5 flex items-center justify-between border border-slate-200 shadow-xs mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#0B1E36]">
                  {selectedProvince.name}
                </div>
                <div className="text-[10px] text-slate-500">
                  {selectedProvince.islandGroup} &bull; {selectedProvince.regionId}
                </div>
              </div>
            </div>
            <button
              onClick={onClearProvince}
              className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title="Clear province selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="text-sm font-bold text-[#0B1E36] mb-2">
            {selectedPosition === "PRESIDENT" && "Presidential Race — National"}
            {selectedPosition === "VICE_PRESIDENT" && "Vice Presidential Race — National"}
            {selectedPosition === "SENATOR" && "Senatorial Race — Top Slate"}
          </div>
        )}

        {/* Position Tab Switchers */}
        <div className="grid grid-cols-3 gap-1 bg-slate-200/60 p-1 rounded-xl text-xs font-semibold">
          {(["PRESIDENT", "VICE_PRESIDENT", "SENATOR"] as const).map((pos) => (
            <button
              key={pos}
              onClick={() => onSelectPosition(pos)}
              className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedPosition === pos
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {pos === "PRESIDENT" ? "President" : pos === "VICE_PRESIDENT" ? "Vice Pres" : "Senators"}
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
                    ? "border-blue-300 bg-blue-50/30 shadow-xs"
                    : "border-slate-200/80 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Left: Rank, Avatar, Name */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                        isFirst ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {idx + 1}
                    </span>

                    {/* Candidate Photo */}
                    <div className="relative flex-shrink-0">
                      {cand.photoUrl ? (
                        <img
                          src={cand.photoUrl}
                          alt={cand.name}
                          className="w-10 h-10 rounded-full object-cover border shadow-xs"
                          style={{ borderColor: cand.color }}
                        />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xs"
                          style={{ backgroundColor: cand.color }}
                        >
                          {cand.name.slice(0, 2)}
                        </div>
                      )}
                      <span
                        className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-white shadow-xs"
                        style={{ backgroundColor: cand.color }}
                      ></span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs sm:text-sm text-[#0B1E36] truncate leading-tight">
                          {cand.name}
                        </h4>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                        {cand.party || "Independent"}
                      </div>
                    </div>
                  </div>

                  {/* Right: Percent & Votes */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-base sm:text-lg font-bold text-[#0B1E36] tabular-nums leading-none">
                      {cand.percentage}%
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5 tabular-nums">
                      {cand.votes.toLocaleString()} votes
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2.5">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(cand.percentage, 2)}%`,
                      backgroundColor: cand.color || "#004B93",
                    }}
                  ></div>
                </div>

                {isFirst && margin > 0 && (
                  <div className="mt-2 pt-1.5 border-t border-blue-100/60 flex items-center justify-between text-[10px] text-blue-700 font-semibold">
                    <span>Leading candidate in tally</span>
                    <span>+{margin}% lead</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-200/80 text-center">
        <Link
          href="/results"
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
        >
          <span>View complete national race standings</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
