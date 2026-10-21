import React, { useState } from "react";
import Link from "next/link";
import { Star, ChevronRight, Share2, Award } from "lucide-react";
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
      slug: c.id,
      position: c.position,
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
    ? new Date(lastUpdated).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Live Tally";

  const maxPresVotes = Math.max(...presidentialRankings.map((c) => c.votes), 1);
  const maxVpVotes = Math.max(...vicePresidentialRankings.map((c) => c.votes), 1);
  const maxSenVotes = Math.max(...senatorialRankings.map((c) => c.votes), 1);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= COLUMN 1: PRESIDENTIAL ================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs flex flex-col justify-between">
          <div>
            <div className="bg-slate-50/90 px-5 py-3.5 border-b border-slate-200/80 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0B1E36] tracking-tight uppercase">
                  Presidential Race
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">Top Contenders</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                {formattedDate}
              </span>
            </div>

            <div className="p-4 space-y-3.5">
              {presidentialRankings.slice(0, 8).map((c, idx) => {
                const rank = idx + 1;
                const isLeader = rank === 1;
                const barWidth = Math.max(Math.round((c.votes / maxPresVotes) * 100), 2);

                return (
                  <div key={c.id} className="relative flex items-center justify-between gap-3">
                    <div className="flex-shrink-0">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${
                          isLeader
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {rank}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 pr-1">
                      <div
                        className="flex items-baseline gap-1.5 min-w-0 overflow-hidden"
                        title={c.party ? `${c.name} (${c.party})` : c.name}
                      >
                        <span className="font-semibold text-xs sm:text-sm text-[#0B1E36] truncate flex-shrink-0 max-w-full">
                          {c.name}
                        </span>
                        {c.party && (
                          <span className="text-[10px] text-slate-400 font-medium uppercase flex-shrink min-w-0 truncate">
                            {getDisplayParty(c.party)}
                          </span>
                        )}
                      </div>

                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${barWidth}%`,
                            backgroundColor: isLeader ? "#004B93" : "#94A3B8",
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 text-right">
                      <span className="font-bold text-xs sm:text-sm text-[#0B1E36] tabular-nums">
                        {c.votes.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleShare(c, "PRESIDENT", rank)}
                        title={`Share card for ${c.name}`}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      {isLeader && (
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-slate-50/60 border-t border-slate-100 text-center">
            <Link
              href="/results"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
            >
              <span>View full presidential tally</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* ================= COLUMN 2: VICE-PRESIDENTIAL ================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs flex flex-col justify-between">
          <div>
            <div className="bg-slate-50/90 px-5 py-3.5 border-b border-slate-200/80 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0B1E36] tracking-tight uppercase">
                  Vice-Presidential Race
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">Top Contenders</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                {formattedDate}
              </span>
            </div>

            <div className="p-4 space-y-3.5">
              {vicePresidentialRankings.slice(0, 8).map((c, idx) => {
                const rank = idx + 1;
                const isLeader = rank === 1;
                const barWidth = Math.max(Math.round((c.votes / maxVpVotes) * 100), 2);

                return (
                  <div key={c.id} className="relative flex items-center justify-between gap-3">
                    <div className="flex-shrink-0">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${
                          isLeader
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {rank}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 pr-1">
                      <div
                        className="flex items-baseline gap-1.5 min-w-0 overflow-hidden"
                        title={c.party ? `${c.name} (${c.party})` : c.name}
                      >
                        <span className="font-semibold text-xs sm:text-sm text-[#0B1E36] truncate flex-shrink-0 max-w-full">
                          {c.name}
                        </span>
                        {c.party && (
                          <span className="text-[10px] text-slate-400 font-medium uppercase flex-shrink min-w-0 truncate">
                            {getDisplayParty(c.party)}
                          </span>
                        )}
                      </div>

                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${barWidth}%`,
                            backgroundColor: isLeader ? "#004B93" : "#94A3B8",
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 text-right">
                      <span className="font-bold text-xs sm:text-sm text-[#0B1E36] tabular-nums">
                        {c.votes.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleShare(c, "VICE_PRESIDENT", rank)}
                        title={`Share card for ${c.name}`}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      {isLeader && (
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-slate-50/60 border-t border-slate-100 text-center">
            <Link
              href="/results"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
            >
              <span>View full vice-presidential tally</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* ================= COLUMN 3: SENATORIAL RACE (MAGIC 12) ================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs flex flex-col justify-between">
          <div>
            <div className="bg-slate-50/90 px-5 py-3.5 border-b border-slate-200/80 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0B1E36] tracking-tight uppercase">
                  Senatorial Magic 12
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">Leading Candidates</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                {formattedDate}
              </span>
            </div>

            <div className="p-4 space-y-3">
              {senatorialRankings.slice(0, 12).map((c, idx) => {
                const rank = idx + 1;
                const isMagic12 = rank <= 12;
                const barWidth = Math.max(Math.round((c.votes / maxSenVotes) * 100), 2);

                return (
                  <div key={c.id} className="relative flex items-center justify-between gap-3">
                    <div className="flex-shrink-0">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${
                          isMagic12
                            ? "bg-blue-50 text-blue-700 border border-blue-200/70"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {rank}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 pr-1">
                      <div
                        className="flex items-baseline gap-1.5 min-w-0 overflow-hidden"
                        title={c.party ? `${c.name} (${c.party})` : c.name}
                      >
                        <span className="font-semibold text-xs sm:text-sm text-[#0B1E36] truncate flex-shrink-0 max-w-full">
                          {c.name}
                        </span>
                        {c.party && (
                          <span className="text-[10px] text-slate-400 font-medium uppercase flex-shrink min-w-0 truncate">
                            {getDisplayParty(c.party)}
                          </span>
                        )}
                      </div>

                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${barWidth}%`,
                            backgroundColor: isMagic12 ? "#004B93" : "#94A3B8",
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 text-right">
                      <span className="font-bold text-xs sm:text-sm text-[#0B1E36] tabular-nums">
                        {c.votes.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleShare(c, "SENATOR", rank)}
                        title={`Share card for ${c.name}`}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-slate-50/60 border-t border-slate-100 text-center">
            <Link
              href="/results"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
            >
              <span>View full senatorial race standings</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {shareCandidate && (
        <ShareVoteCardModal
          isOpen={!!shareCandidate}
          onClose={() => setShareCandidate(null)}
          candidate={shareCandidate}
          competitors={shareCompetitors}
        />
      )}
    </div>
  );
}
