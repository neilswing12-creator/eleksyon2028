"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Philippine3DMap from "@/components/Philippine3DMap";
import Philippine2DMap from "@/components/Philippine2DMap";
import GMALeaderboardWidget from "@/components/GMALeaderboardWidget";
import GMASmartMapStation from "@/components/GMASmartMapStation";
import GMATripleLeaderboard from "@/components/GMATripleLeaderboard";
import ElectionLiveBadge from "@/components/ElectionLiveBadge";
import ProvinceDetailModal from "@/components/ProvinceDetailModal";
import { PHILIPPINE_VOTERS_DEMOGRAPHICS } from "@/lib/philippines-geo";
import {
  Vote,
  BarChart3,
  MapPin,
  Users,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  Map,
  Flame,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

export default function HomePage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mapMode, setMapMode] = useState<"2D" | "3D">("2D");
  const [selectedPosition, setSelectedPosition] = useState<"PRESIDENT" | "VICE_PRESIDENT" | "SENATOR">("PRESIDENT");
  const [selectedProvince, setSelectedProvince] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
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
    }
    loadData();
  }, []);

  const presLeader = analytics?.presidentialRankings?.[0];
  const vpLeader = analytics?.vicePresidentialRankings?.[0];
  const topSenators = analytics?.senatorialRankings?.slice(0, 6) || [];
  const featuredCandidates = analytics?.candidates?.slice(0, 6) || [];

  const currentRankings =
    selectedPosition === "PRESIDENT"
      ? analytics?.presidentialRankings || []
      : selectedPosition === "VICE_PRESIDENT"
      ? analytics?.vicePresidentialRankings || []
      : analytics?.senatorialRankings || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Broadcast Live Hero Banner (GMA Eleksyon 2022 Style) */}
      <section className="bg-[#0B132B] text-white border-b-4 border-gma-red pt-10 pb-14 shadow-broadcast">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-4">
            {/* Live Badge */}
            <div className="flex justify-center">
              <ElectionLiveBadge
                label="PHILIPPINE 2028 ELECTION SURVEY DESK"
                sublabel="Made by Neil Swing"
                className="text-xs py-1.5 px-4"
              />
            </div>

            <h1 className="text-3xl sm:text-6xl font-headline font-black text-white tracking-wide uppercase leading-tight">
              YOUR VOICE. YOUR VOTE. <br />
              <span className="text-amber-400">YOUR PHILIPPINES.</span>
            </h1>

            <p className="text-xs sm:text-base text-slate-300 font-sans leading-relaxed max-w-2xl mx-auto">
              Track voluntary public opinion on the 2028 Philippine National Elections in real time. Examine
              live tallies across Luzon, Visayas, and Mindanao with interactive cartograms and geographic heatmaps made by Neil Swing.
            </p>

            {/* Quick CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/survey"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gma-red hover:bg-red-700 text-white font-headline font-bold text-base tracking-wider uppercase shadow-lg transition-transform transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <Vote className="w-5 h-5 text-amber-300" />
                <span>Cast Your Vote Now</span>
              </Link>
              <Link
                href="/map"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-headline font-bold text-base tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
              >
                <MapPin className="w-5 h-5 text-amber-400" />
                <span>Explore Map &amp; Results</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Broadcast Workstation: GMA Smart Map Station (Image 1 Style) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {loading ? (
          <div className="w-full h-[620px] bg-white rounded-2xl border-2 border-slate-200 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 text-gma-blue animate-spin" />
            <p className="text-xs font-headline font-bold text-slate-500 uppercase">
              Loading Interactive Election Map...
            </p>
          </div>
        ) : (
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
        )}
      </section>

      {/* GMA News Triple Leaderboard: Pres, VP, and Senatorial Magic 12 (Image 2 Style) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#0B132B] pb-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-gma-red text-white text-[10px] font-headline font-bold uppercase tracking-wider mb-1">
              TRIPLE RACE STANDINGS
            </div>
            <h2 className="text-xl sm:text-2xl font-headline font-black text-[#0B132B] uppercase tracking-wide">
              NATIONAL ELECTION SURVEY RESULTS
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-sans font-medium">
            Partial &bull; Unofficial Pre-Election Survey
          </span>
        </div>

        <GMATripleLeaderboard
          presidentialRankings={analytics?.presidentialRankings || []}
          vicePresidentialRankings={analytics?.vicePresidentialRankings || []}
          senatorialRankings={analytics?.senatorialRankings || []}
          lastUpdated={analytics?.summary?.lastUpdated}
        />
      </section>

      {/* Live Highlights & Statistics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-10">
        {/* Metric Ticker */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-3.5 sm:p-5 shadow-subtle min-w-0">
            <span className="text-[10px] sm:text-[11px] font-headline font-bold uppercase tracking-wider text-slate-500 block truncate">
              Active Verified Votes
            </span>
            <div className="text-xl sm:text-3xl font-headline font-black text-gma-blue mt-1 tabular-nums truncate">
              {(analytics?.summary?.totalActiveSubmissions || 0).toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">Contributing to live tally</p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-slate-200 p-3.5 sm:p-5 shadow-subtle min-w-0">
            <span className="text-[10px] sm:text-[11px] font-headline font-bold uppercase tracking-wider text-slate-500 block truncate">
              Votes Received Today
            </span>
            <div className="text-xl sm:text-3xl font-headline font-black text-emerald-600 mt-1 tabular-nums truncate">
              {(analytics?.summary?.todaySubmissions || 0).toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">Last 24 hours</p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-slate-200 p-3.5 sm:p-5 shadow-subtle min-w-0">
            <span className="text-[10px] sm:text-[11px] font-headline font-bold uppercase tracking-wider text-slate-500 block truncate">
              Provinces Reporting
            </span>
            <div className="text-xl sm:text-3xl font-headline font-black text-[#0B132B] mt-1 tabular-nums truncate">
              {analytics?.provinces?.filter((p: any) => p.totalSubmissions > 0).length || 0} / 82
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">Nationwide geographic coverage</p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-slate-200 p-3.5 sm:p-5 shadow-subtle min-w-0">
            <span className="text-[10px] sm:text-[11px] font-headline font-bold uppercase tracking-wider text-slate-500 block truncate">
              Integrity Safeguard
            </span>
            <div className="text-xs sm:text-sm font-headline font-bold text-[#0B132B] mt-2 flex items-center gap-1.5 uppercase truncate">
              <ShieldCheck className="w-4 h-4 text-gma-blue flex-shrink-0" />
              <span className="truncate">HMAC Salted Hash</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">1 vote per IP network</p>
          </div>
        </div>

        {/* Presidential & Vice Presidential Top Contenders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* President */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 sm:p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 min-w-0">
                <Award className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <h3 className="font-headline font-bold text-xs sm:text-sm uppercase tracking-wider text-[#0B132B] truncate">
                  PRESIDENTIAL LEADERBOARD &bull; NATIONAL
                </h3>
              </div>
              <Link
                href="/results"
                className="text-xs font-headline font-bold text-gma-blue hover:text-blue-800 uppercase flex-shrink-0 ml-2"
              >
                Full Standings &rarr;
              </Link>
            </div>

            {presLeader ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  {presLeader.photoUrl && (
                    <img
                      src={presLeader.photoUrl}
                      alt={presLeader.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 shadow-sm flex-shrink-0"
                      style={{ borderColor: presLeader.color }}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-headline font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded uppercase inline-block">
                      RANK #1
                    </span>
                    <h4 className="font-headline font-bold text-base sm:text-lg text-[#0B132B] uppercase mt-0.5 truncate">
                      {presLeader.name}
                    </h4>
                    <p className="text-xs font-sans text-slate-500 font-semibold truncate">
                      {presLeader.party || "INDEPENDENT"}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 flex-shrink-0">
                  <div className="font-headline font-black text-2xl sm:text-3xl text-gma-blue tabular-nums">
                    {presLeader.percentage}%
                  </div>
                  <div className="text-xs font-sans font-bold text-slate-500 tabular-nums">
                    {presLeader.votes.toLocaleString()} votes
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No responses recorded yet.</p>
            )}
          </div>

          {/* Vice President */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 sm:p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 min-w-0">
                <Award className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <h3 className="font-headline font-bold text-xs sm:text-sm uppercase tracking-wider text-[#0B132B] truncate">
                  VICE PRESIDENTIAL LEADERBOARD &bull; NATIONAL
                </h3>
              </div>
              <Link
                href="/results"
                className="text-xs font-headline font-bold text-gma-blue hover:text-blue-800 uppercase flex-shrink-0 ml-2"
              >
                Full Standings &rarr;
              </Link>
            </div>

            {vpLeader ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  {vpLeader.photoUrl && (
                    <img
                      src={vpLeader.photoUrl}
                      alt={vpLeader.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 shadow-sm flex-shrink-0"
                      style={{ borderColor: vpLeader.color }}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-headline font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded uppercase inline-block">
                      RANK #1
                    </span>
                    <h4 className="font-headline font-bold text-base sm:text-lg text-[#0B132B] uppercase mt-0.5 truncate">
                      {vpLeader.name}
                    </h4>
                    <p className="text-xs font-sans text-slate-500 font-semibold truncate">
                      {vpLeader.party || "INDEPENDENT"}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 flex-shrink-0">
                  <div className="font-headline font-black text-2xl sm:text-3xl text-[#0B132B] tabular-nums">
                    {vpLeader.percentage}%
                  </div>
                  <div className="text-xs font-sans font-bold text-slate-500 tabular-nums">
                    {vpLeader.votes.toLocaleString()} votes
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No responses recorded yet.</p>
            )}
          </div>
        </div>

        {/* Senatorial Slate Top 6 Preview */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-headline font-bold text-base text-[#0B132B] uppercase tracking-wide">
                LEADING SENATORIAL CANDIDATES (TOP 6 OF 12 SEATS)
              </h3>
              <p className="text-xs text-slate-500 font-sans">
                Ranked by percentage of survey respondents who included them in their 12-candidate ballot.
              </p>
            </div>
            <Link
              href="/results"
              className="text-xs font-headline font-bold text-gma-blue hover:text-blue-800 uppercase"
            >
              View Full Magic 12 &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {topSenators.map((sen: any, idx: number) => (
              <div
                key={sen.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-center space-y-2 hover:border-amber-400 transition-colors"
              >
                <div className="relative inline-block">
                  {sen.photoUrl ? (
                    <img
                      src={sen.photoUrl}
                      alt={sen.name}
                      className="w-14 h-14 rounded-full object-cover mx-auto border-2 shadow-sm"
                      style={{ borderColor: sen.color }}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center font-headline font-bold text-sm text-slate-600 mx-auto">
                      {sen.name.slice(0, 2)}
                    </div>
                  )}
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#0B132B] text-amber-400 text-[10px] font-headline font-bold flex items-center justify-center border border-white">
                    #{idx + 1}
                  </span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-xs text-[#0B132B] uppercase line-clamp-1">
                    {sen.name}
                  </h4>
                  <div className="font-headline font-black text-sm text-gma-blue tabular-nums mt-0.5">
                    {sen.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Voters' Profile & Demographics Showcase (GMA Eleksyon 2022 Style) */}
        <div className="bg-[#0B132B] rounded-2xl border-2 border-gma-red p-6 sm:p-8 text-white shadow-broadcast flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-gma-red text-white text-xs font-headline font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              <span>VOTERS&apos; DEMOGRAPHIC PROFILE &bull; MADE BY NEIL SWING</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-headline font-black text-white uppercase tracking-wide">
              WHO DECIDES ELEKSYON 2028?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Explore the official demographic breakdown of the 65.7M+ registered Filipino voters. Discover why the
              Youth Vote (Gen Z and Millennials) holds an unprecedented 56.4% majority and examine voting distribution across top battleground provinces.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
            <Link
              href="/voters"
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#0B132B] font-headline font-bold text-sm uppercase tracking-wider shadow text-center transition-all transform hover:scale-105"
            >
              Explore Voters&apos; Profile &rarr;
            </Link>
          </div>
        </div>

        {/* Candidate Directory Spotlight */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-headline font-bold text-lg text-[#0B132B] uppercase tracking-wide">
                CANDIDATE DIRECTORY &bull; AGENDAS &amp; PLATFORMS
              </h3>
              <p className="text-xs text-slate-500 font-sans">
                Review verified educational backgrounds, legislative records, and published policy platforms.
              </p>
            </div>
            <Link
              href="/candidates"
              className="text-xs font-headline font-bold text-gma-blue hover:text-blue-800 uppercase"
            >
              All Candidates &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredCandidates.map((c: any) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-subtle hover:border-gma-blue transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {c.photoUrl ? (
                      <img
                        src={c.photoUrl}
                        alt={c.name}
                        className="w-12 h-12 rounded-full object-cover border-2 shadow-sm"
                        style={{ borderColor: c.color }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                        {c.name.slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] font-headline font-bold uppercase tracking-wider text-slate-400 block">
                        {c.position.replace("_", " ")}
                      </span>
                      <h4 className="font-headline font-bold text-base text-[#0B132B] uppercase leading-tight">
                        {c.name}
                      </h4>
                      <p className="text-xs font-sans text-slate-500 font-semibold">{c.party || "INDEPENDENT"}</p>
                    </div>
                  </div>
                  {c.bio && (
                    <p className="text-xs font-sans text-slate-600 line-clamp-2 leading-relaxed">{c.bio}</p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-500">
                    <span
                      className="w-3 h-3 rounded-full inline-block border border-slate-300"
                      style={{ backgroundColor: c.color }}
                    ></span>
                    {c.color}
                  </span>
                  <Link
                    href={`/candidates/${c.slug}`}
                    className="font-headline font-bold text-gma-blue hover:text-blue-800 uppercase tracking-wider"
                  >
                    View Profile &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal for Province Details */}
      <ProvinceDetailModal
        province={selectedProvince}
        onClose={() => setSelectedProvince(null)}
        minThreshold={analytics?.summary?.minResponseThreshold || 1}
      />
    </div>
  );
}
