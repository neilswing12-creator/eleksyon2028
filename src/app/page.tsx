"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import GMASmartMapStation from "@/components/GMASmartMapStation";
import GMATripleLeaderboard from "@/components/GMATripleLeaderboard";
import ProvinceDetailModal from "@/components/ProvinceDetailModal";
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
  ChevronRight,
  RefreshCw,
  Landmark,
  FileCheck,
  CheckCircle2,
  Lock,
  Globe,
} from "lucide-react";

export default function HomePage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
  const featuredCandidates = analytics?.candidates?.slice(0, 6) || [];

  return (
    <div className="min-h-screen bg-white">
      {/* ========================================================= */}
      {/* 1. HERO SECTION (Clean White / Light Blue-Gray Civic Design) */}
      {/* ========================================================= */}
      <section className="relative bg-gradient-to-b from-[#F0F6FF]/70 via-[#F8FAFC] to-white border-b border-slate-200/80 pt-14 pb-16 sm:pt-20 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            {/* Understated Civic Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200/80 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>Independent Civic Opinion Research &bull; Philippines 2028</span>
            </div>

            {/* Clear Primary Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0B1E36] leading-tight">
              2028 Philippine Pre-Election{" "}
              <span className="text-blue-600">Public Opinion Survey</span>
            </h1>

            {/* Concise Transparency Notice */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              An independent, non-partisan public opinion study measuring voluntary citizen sentiment for President,
              Vice President, and Senators for the 2028 Philippine National Elections. Results reflect voluntary online
              submissions and are not certified election returns.
            </p>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/survey"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                <Vote className="w-4 h-4 text-white" />
                <span>Participate in Survey</span>
              </Link>
              <Link
                href="/map"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Explore Map &amp; Results</span>
              </Link>
            </div>
          </div>

          {/* Hero Statistics Summary Cards */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Active Verified Submissions
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-[#0B1E36] mt-1 tabular-nums">
                {(analytics?.summary?.totalActiveSubmissions || 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Contributing to live tallies</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Submissions Today
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mt-1 tabular-nums">
                {(analytics?.summary?.todaySubmissions ?? 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Philippine calendar day (PST)</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Provinces Reporting
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-[#0B1E36] mt-1 tabular-nums">
                {analytics?.summary?.provincesReporting ?? (analytics?.provinces?.filter((p: any) => p.totalSubmissions > 0).length || 0)} / {analytics?.summary?.totalProvinces ?? 82}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Nationwide geographic coverage</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Abuse Prevention
              </span>
              <div className="text-sm font-bold text-slate-800 mt-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>HMAC Salted Hash</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">1 vote per IP network</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. INTERACTIVE MAP & GEOGRAPHIC COVERAGE                   */}
      {/* ========================================================= */}
      <section className="bg-[#F8FAFC] py-16 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
                Geographic Coverage
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1E36] tracking-tight">
                Interactive Philippine Survey Map
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                Analyze province-by-province trends with authentic geographic boundaries and hexagonal cartogram visualizations.
              </p>
            </div>
            <Link
              href="/map"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Full-screen map station</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="w-full h-[580px] bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-7 h-7 text-blue-600 animate-spin" />
              <p className="text-xs font-semibold text-slate-500">
                Loading interactive geographic map...
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
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. CURRENT SURVEY STANDINGS (TRIPLE LEADERBOARD)          */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-slate-200/70">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
              Current Survey Standings
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1E36] tracking-tight">
              National Survey Results
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Real-time tabulation across President, Vice President, and the Senatorial Magic 12 from voluntary survey submissions.
            </p>
          </div>
          <Link
            href="/results"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Explore full results breakdown</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <GMATripleLeaderboard
          presidentialRankings={analytics?.presidentialRankings || []}
          vicePresidentialRankings={analytics?.vicePresidentialRankings || []}
          senatorialRankings={analytics?.senatorialRankings || []}
          lastUpdated={analytics?.summary?.lastUpdated}
        />
      </section>

      {/* ========================================================= */}
      {/* 4. HOW THE SURVEY WORKS (Ayos Bayan & eGovPH Style)       */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-b border-slate-200/70">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Transparent Civic Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1E36] tracking-tight">
            How Eleksyon 2028 Survey Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            From participant submission to cryptographic hashing and public aggregation, every step is transparent and documented.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#0B1E36] text-white flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h3 className="text-base font-bold text-[#0B1E36]">Voluntary Ballot Selection</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Select your candidate preferences for President, Vice President, and up to 12 Senators across verified candidates.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h3 className="text-base font-bold text-[#0B1E36]">Cryptographic Verification</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              IP addresses are converted to one-way HMAC-SHA256 salted hashes to enforce a strict 1-response-per-network rule without collecting personal identifiers.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#0B1E36] text-white flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h3 className="text-base font-bold text-[#0B1E36]">Token-Based Response Control</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Participants receive an anonymous management token that allows editing choices or retracting their ballot at any time.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              04
            </div>
            <h3 className="text-base font-bold text-[#0B1E36]">Live Open Analytics</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Submissions update public tallies in real time with transparent provincial maps, overseas Filipino participation, and audit trails.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. VOTERS PROFILE & DEMOGRAPHICS PREVIEW                  */}
      {/* ========================================================= */}
      <section className="bg-[#F8FAFC] py-16 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
                Electoral Demographics
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1E36] tracking-tight">
                Philippine Registered Voters Profile
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                Official Commission on Elections (COMELEC) baseline demographics contextualized with voluntary survey participation.
              </p>
            </div>
            <Link
              href="/voters"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Explore full demographics directory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Official Registered Voters (COMELEC)
              </span>
              <div className="text-3xl font-bold text-[#0B1E36]">65.74M+</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Total certified registered voters across 82 provinces and 17 administrative regions.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Youth Electorate (Gen Z &amp; Millennials)
              </span>
              <div className="text-3xl font-bold text-blue-600">56.4%</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Voters aged 18 to 41 constitute the decisive majority of the Philippine electorate for 2028.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Overseas Filipino Participation
              </span>
              <div className="text-3xl font-bold text-[#0B1E36]">1.69M+</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Registered overseas voters across the Middle East, Asia-Pacific, North America, and Europe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. CANDIDATE DIRECTORY & LEGISLATIVE RECORDS SPOTLIGHT    */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-slate-200/70 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
              Public Accountability
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1E36] tracking-tight">
              Candidate Directory &amp; Legislative Records
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Verified public profiles, educational credentials, and one-click imported bills from the Senate and House of Representatives.
            </p>
          </div>
          <Link
            href="/candidates"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View all 42 candidates</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredCandidates.map((c: any) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {c.photoUrl ? (
                    <picture className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 shadow-xs flex-shrink-0 bg-slate-100">
                      <source srcSet={c.photoUrl.replace(/\.(jpg|jpeg|png)$/i, ".webp")} type="image/webp" />
                      <img
                        src={c.photoUrl}
                        alt={c.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-top"
                        width={48}
                        height={48}
                      />
                    </picture>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                      {c.name.slice(0, 2)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                      {c.position.replace("_", " ")}
                    </span>
                    <h3 className="font-bold text-base text-[#0B1E36] truncate leading-tight">
                      {c.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium truncate">{c.party || "Independent"}</p>
                  </div>
                </div>
                {c.bio && (
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{c.bio}</p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-3">
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: c.color }}
                  ></span>
                  Map Indicator
                </span>
                <Link
                  href={`/candidates/${c.slug}`}
                  className="font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
                >
                  <span>View Profile &amp; Bills</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. CIVIC TRANSPARENCY CARD (eGovPH Banner Style)          */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-[#004B93] to-blue-600 rounded-3xl p-8 sm:p-12 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-200" />
              <span>Philippine Civic Technology</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              An Open, Non-Partisan Public Opinion Platform
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Compliant with the Philippine Data Privacy Act of 2012 (RA 10173). Zero commercial monetization, zero advertising, and open methodology designed to foster informed democratic discourse.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 w-full sm:w-auto">
            <Link
              href="/survey"
              className="px-6 py-3 rounded-xl bg-white text-[#004B93] hover:bg-slate-50 font-bold text-xs uppercase tracking-wider text-center shadow-sm transition-all"
            >
              Participate Now
            </Link>
            <Link
              href="/methodology"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs text-center border border-white/20 transition-colors"
            >
              Read Methodology
            </Link>
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
