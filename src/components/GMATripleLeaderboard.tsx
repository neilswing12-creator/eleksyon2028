import React, { useState } from "react";
import Link from "next/link";
import { Star, ChevronRight, Share2 } from "lucide-react";
import ShareVoteCardModal, {
  ShareCandidateData,
  CompetitorData,
} from "@/components/ShareVoteCardModal";

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

function getDisplayParty(party?: string | null): string {
  if (!party) return "";
  const trimmed = party.trim();

  // Specific mappings for known Philippine political parties and coalitions
  if (/akbayan/i.test(trimmed)) return "Akbayan";
  if (/magdalo/i.test(trimmed)) return "Magdalo";
  if (/nacionalista/i.test(trimmed)) return "NP";
  if (/promdi/i.test(trimmed)) return "PROMDI";
  if (/act-cis/i.test(trimmed)) return "ACT-CIS";
  if (/^independent$/i.test(trimmed)) return "IND";
  if (/independent.*fpj/i.test(trimmed)) return "FPJ / IND";
  if (/pdp/i.test(trimmed)) return "PDP";
  if (/liberal/i.test(trimmed)) return "Liberal";
  if (/lakas.*hnp/i.test(trimmed)) return "Lakas/HNP";
  if (/npc.*lakas/i.test(trimmed)) return "NPC/Lakas";

  // If acronym in parentheses e.g. "Nationalist People's Coalition (NPC)"
  const match = trimmed.match(/\(([^)]+)\)/);
  if (match && match[1]) return match[1].trim();

  if (trimmed.length <= 10) return trimmed;
  return trimmed.slice(0, 8) + "...";
}

export default function GMATripleLeaderboard({
  presidentialRankings = [],
  vicePresidentialRankings = [],
  senatorialRankings = [],
  lastUpdated,
}: GMATripleLeaderboardProps) {
  const [shareCandidate, setShareCandidate] = useState<ShareCandidateData | null>(null);
  const [shareCompetitors, setShareCompetitors] = useState<CompetitorData[]>([]);

  const handleShare = (c: CandidateResult, position: string, rank: number) => {
    let compList: CompetitorData[] = [];
    if (position === "PRESIDENT") {
      compList = presidentialRankings.map((r, i) => ({
        id: r.id,
        name: r.name,
        party: r.party,
        color: r.color,
        photoUrl: r.photoUrl,
        votes: r.votes,
        percentage: r.percentage,
        rank: i + 1,
      }));
    } else if (position === "VICE_PRESIDENT") {
      compList = vicePresidentialRankings.map((r, i) => ({
        id: r.id,
        name: r.name,
        party: r.party,
        color: r.color,
        photoUrl: r.photoUrl,
        votes: r.votes,
        percentage: r.percentage,
        rank: i + 1,
      }));
    } else {
      compList = senatorialRankings.map((r, i) => ({
        id: r.id,
        name: r.name,
        party: r.party,
        color: r.color,
        photoUrl: r.photoUrl,
        votes: r.votes,
        percentage: r.percentage,
        rank: i + 1,
      }));
    }

    setShareCandidate({
      id: c.id,
      name: c.name,
      position,
      party: c.party,
      color: c.color,
      photoUrl: c.photoUrl,
      votes: c.votes,
      percentage: c.percentage,
      rank,
    });
    setShareCompetitors(compList);
  };
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
                      <div
                        className="flex items-baseline gap-1.5 min-w-0 overflow-hidden"
                        title={c.party ? `${c.name} (${c.party})` : c.name}
                      >
                        <span className="font-headline font-bold text-xs sm:text-sm text-[#0B132B] truncate uppercase tracking-tight flex-shrink-0 max-w-full">
                          {c.name}
                        </span>
                        {c.party && (
                          <span className="text-[10px] text-slate-400 font-semibold uppercase flex-shrink min-w-0 truncate">
                            {getDisplayParty(c.party)}
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

                    {/* Vote Count & Star Indicator & Share Button */}
                    <div className="flex items-center gap-1.5 flex-shrink-0 text-right">
                      <span className="font-headline font-bold text-sm text-[#0B132B] tabular-nums tracking-tight">
                        {c.votes.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleShare(c, "PRESIDENT", rank)}
                        title={`Share 1080×1350 vote card for ${c.name}`}
                        className="p-1 rounded-md hover:bg-amber-100 text-slate-400 hover:text-amber-600 transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
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
                      <div
                        className="flex items-baseline gap-1.5 min-w-0 overflow-hidden"
                        title={c.party ? `${c.name} (${c.party})` : c.name}
                      >
                        <span className="font-headline font-bold text-xs sm:text-sm text-[#0B132B] truncate uppercase tracking-tight flex-shrink-0 max-w-full">
                          {c.name}
                        </span>
                        {c.party && (
                          <span className="text-[10px] text-slate-400 font-semibold uppercase flex-shrink min-w-0 truncate">
                            {getDisplayParty(c.party)}
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

                    {/* Vote Count & Star Indicator & Share Button */}
                    <div className="flex items-center gap-1.5 flex-shrink-0 text-right">
                      <span className="font-headline font-bold text-sm text-[#0B132B] tabular-nums tracking-tight">
                        {c.votes.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleShare(c, "VICE_PRESIDENT", rank)}
                        title={`Share 1080×1350 vote card for ${c.name}`}
                        className="p-1 rounded-md hover:bg-amber-100 text-slate-400 hover:text-amber-600 transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
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
                      <div
                        className="flex items-baseline gap-1.5 min-w-0 overflow-hidden"
                        title={c.party ? `${c.name} (${c.party})` : c.name}
                      >
                        <span className="font-headline font-bold text-xs sm:text-sm text-[#0B132B] truncate uppercase tracking-tight flex-shrink-0 max-w-full">
                          {c.name}
                        </span>
                        {c.party && (
                          <span className="text-[10px] text-slate-400 font-semibold uppercase flex-shrink min-w-0 truncate">
                            {getDisplayParty(c.party)}
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

                    {/* Vote Count & Star Indicator & Share Button */}
                    <div className="flex items-center gap-1.5 flex-shrink-0 text-right">
                      <span className="font-headline font-bold text-sm text-[#0B132B] tabular-nums tracking-tight">
                        {c.votes.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleShare(c, "SENATOR", rank)}
                        title={`Share 1080×1350 vote card for ${c.name}`}
                        className="p-1 rounded-md hover:bg-amber-100 text-slate-400 hover:text-amber-600 transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
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

      {/* Share 1080x1350 Vote Card Modal */}
      <ShareVoteCardModal
        isOpen={!!shareCandidate}
        onClose={() => setShareCandidate(null)}
        candidate={shareCandidate}
        competitors={shareCompetitors}
      />
    </div>
  );
}
