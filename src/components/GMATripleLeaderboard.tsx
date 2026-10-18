"use client";

import React from "react";
import Link from "next/link";
import { Star, ChevronRight } from "lucide-react";

interface CandidateResult {
  id: string;
  name: string;
  party: string | null;
  position: string;
  color: string;
  photoUrl: string | null;
  votes: number;
  percentage: number;
}

interface GMATripleLeaderboardProps {
  presidentialRankings: CandidateResult[];
  vicePresidentialRankings: CandidateResult[];
  senatorialRankings: CandidateResult[];
  lastUpdated?: string;
}

export default function GMATripleLeaderboard({
  presidentialRankings = [],
  vicePresidentialRankings = [],
  senatorialRankings = [],
  lastUpdated,
}: GMATripleLeaderboardProps) {
  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    : "May 13, 2028 14:47:00";

  // Calculate highest vote in each category for max progress bar width
  const maxPresVotes = Math.max(...presidentialRankings.map((c) => c.votes), 1);
  const maxVpVotes = Math.max(...vicePresidentialRankings.map((c) => c.votes), 1);
  const maxSenVotes = Math.max(...senatorialRankings.map((c) => c.votes), 1);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= COLUMN 1: PRESIDENTIAL ================= */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="bg-[#0B132B] px-4 py-3 text-center border-b-2 border-gma-red">
              <h2 className="text-xl font-headline font-black text-white tracking-wider uppercase">
                PRESIDENTIAL
              </h2>
            </div>
            <div className="text-center py-1.5 bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 font-medium">
              As of {formattedDate}
            </div>

            <div className="p-3 sm:p-4 space-y-3.5">
              {presidentialRankings.slice(0, 10).map((c, idx) => {
                const rank = idx + 1;
                const isLeader = rank === 1;
                const barWidth = Math.max(Math.round((c.votes / maxPresVotes) * 100), 2);

                return (
                  <div key={c.id} className="relative flex items-center justify-between gap-2.5">
                    {/* Rank Badge */}
                    <div className="flex-shrink-0">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-headline font-bold text-white shadow-sm ${
                          isLeader ? "bg-gma-red ring-2 ring-red-200" : "bg-slate-400"
                        }`}
                      >
                        {rank}
                      </span>
                    </div>

                    {/* Candidate Name, Party, & Progress Bar */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-baseline gap-1.5 truncate">
                        <span className="font-headline font-bold text-sm text-[#0B132B] truncate uppercase tracking-tight">
                          {c.name}
                        </span>
                        {c.party && (
                          <span className="text-[10px] text-slate-500 font-semibold uppercase flex-shrink-0">
                            {c.party}
                          </span>
                        )}
                      </div>

                      {/* Progress Bar with Candidate Color */}
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${barWidth}%`,
                            backgroundColor: isLeader ? "#004B93" : "#94A3B8",
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Vote Count & Star Indicator */}
                    <div className="flex items-center gap-1.5 flex-shrink-0 text-right">
                      <span className="font-headline font-bold text-sm text-[#0B132B] tabular-nums tracking-tight">
                        {c.votes.toLocaleString()}
                      </span>
                      <Star
                        className={`w-3.5 h-3.5 ${
                          isLeader ? "text-amber-400 fill-amber-400" : "text-slate-300"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= COLUMN 2: VICE-PRESIDENTIAL ================= */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="bg-[#0B132B] px-4 py-3 text-center border-b-2 border-gma-red">
              <h2 className="text-xl font-headline font-black text-white tracking-wider uppercase">
                VICE-PRESIDENTIAL
              </h2>
            </div>
            <div className="text-center py-1.5 bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 font-medium">
              As of {formattedDate}
            </div>

            <div className="p-3 sm:p-4 space-y-3.5">
              {vicePresidentialRankings.slice(0, 10).map((c, idx) => {
                const rank = idx + 1;
                const isLeader = rank === 1;
                const barWidth = Math.max(Math.round((c.votes / maxVpVotes) * 100), 2);

                return (
                  <div key={c.id} className="relative flex items-center justify-between gap-2.5">
                    {/* Rank Badge */}
                    <div className="flex-shrink-0">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-headline font-bold text-white shadow-sm ${
                          isLeader ? "bg-gma-red ring-2 ring-red-200" : "bg-slate-400"
                        }`}
                      >
                        {rank}
                      </span>
                    </div>

                    {/* Candidate Name, Party, & Progress Bar */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-baseline gap-1.5 truncate">
                        <span className="font-headline font-bold text-sm text-[#0B132B] truncate uppercase tracking-tight">
                          {c.name}
                        </span>
                        {c.party && (
                          <span className="text-[10px] text-slate-500 font-semibold uppercase flex-shrink-0">
                            {c.party}
                          </span>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${barWidth}%`,
                            backgroundColor: isLeader ? "#004B93" : "#94A3B8",
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Vote Count & Star Indicator */}
                    <div className="flex items-center gap-1.5 flex-shrink-0 text-right">
                      <span className="font-headline font-bold text-sm text-[#0B132B] tabular-nums tracking-tight">
                        {c.votes.toLocaleString()}
                      </span>
                      <Star
                        className={`w-3.5 h-3.5 ${
                          isLeader ? "text-amber-400 fill-amber-400" : "text-slate-300"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= COLUMN 3: SENATORIAL RACE (MAGIC 12) ================= */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="bg-[#0B132B] px-4 py-3 text-center border-b-2 border-gma-red">
              <h2 className="text-xl font-headline font-black text-white tracking-wider uppercase">
                SENATORIAL RACE
              </h2>
            </div>
            <div className="text-center py-1.5 bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 font-medium">
              As of {formattedDate}
            </div>

            <div className="p-3 sm:p-4 space-y-3">
              {senatorialRankings.slice(0, 12).map((c, idx) => {
                const rank = idx + 1;
                // In GMA Eleksyon 2022, all Top 12 (Magic 12 winning seats) have RED circular badges with gold star!
                const isMagic12 = rank <= 12;
                const barWidth = Math.max(Math.round((c.votes / maxSenVotes) * 100), 2);

                return (
                  <div key={c.id} className="relative flex items-center justify-between gap-2.5">
                    {/* Rank Badge */}
                    <div className="flex-shrink-0">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-headline font-bold text-white shadow-sm ${
                          isMagic12 ? "bg-gma-red ring-2 ring-red-200" : "bg-slate-400"
                        }`}
                      >
                        {rank}
                      </span>
                    </div>

                    {/* Candidate Name, Party, & Progress Bar */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-baseline gap-1.5 truncate">
                        <span className="font-headline font-bold text-sm text-[#0B132B] truncate uppercase tracking-tight">
                          {c.name}
                        </span>
                        {c.party && (
                          <span className="text-[10px] text-slate-500 font-semibold uppercase flex-shrink-0">
                            {c.party}
                          </span>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${barWidth}%`,
                            backgroundColor: isMagic12 ? "#004B93" : "#94A3B8",
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Vote Count & Star Indicator */}
                    <div className="flex items-center gap-1.5 flex-shrink-0 text-right">
                      <span className="font-headline font-bold text-sm text-[#0B132B] tabular-nums tracking-tight">
                        {c.votes.toLocaleString()}
                      </span>
                      <Star
                        className={`w-3.5 h-3.5 ${
                          isMagic12 ? "text-amber-400 fill-amber-400" : "text-slate-300"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Action: View Full List */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
            <Link
              href="/results"
              className="inline-flex items-center justify-center w-full py-2 px-4 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-headline font-bold text-[#0B132B] uppercase tracking-wider transition-colors shadow-sm"
            >
              <span>VIEW FULL LIST</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1 text-slate-500" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
