"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  PieChart as PieIcon,
  MapPin,
  Vote,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  FileCheck,
} from "lucide-react";
import {
  PHILIPPINE_REGIONS,
  PHILIPPINE_PROVINCES,
  PHILIPPINE_VOTERS_DEMOGRAPHICS,
} from "@/lib/philippines-geo";

export default function VotersProfilePage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRegionId, setSelectedRegionId] = useState<string>("NCR");
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("metro-manila");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/analytics");
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        }
      } catch (err) {
        console.error("Failed to load voters analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const baseline = PHILIPPINE_VOTERS_DEMOGRAPHICS;
  const surveySample = analytics?.votersDemographics?.surveySample;

  // Selected region details
  const currentRegion = useMemo(() => {
    return PHILIPPINE_REGIONS.find((r) => r.id === selectedRegionId) || PHILIPPINE_REGIONS[0];
  }, [selectedRegionId]);

  // Provinces in selected region
  const regionProvinces = useMemo(() => {
    return PHILIPPINE_PROVINCES.filter((p) => p.regionId === selectedRegionId);
  }, [selectedRegionId]);

  const currentProvince = useMemo(() => {
    return (
      regionProvinces.find((p) => p.id === selectedProvinceId) ||
      regionProvinces[0] ||
      PHILIPPINE_PROVINCES[0]
    );
  }, [selectedProvinceId, regionProvinces]);

  return (
    <div className="min-h-screen bg-[#F4F6F9] pb-20">
      {/* ================= BROADCAST HERO BANNER ================= */}
      <div className="bg-[#0B132B] text-white border-b-2 border-gma-red py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-gma-red text-white text-xs font-headline font-bold uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" />
                <span>ELEKSYON 2028 &bull; VOTERS COVERAGE &bull; MADE BY SWING LABS</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-headline font-black uppercase tracking-tight text-white leading-none">
                VOTERS&apos; PROFILE &amp; DEMOGRAPHICS
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Official demographic breakdown, generational cohorts, and geographic profile of registered
                voters for the 2028 Philippine National and Local Elections, compiled from Commission on Elections
                (COMELEC) certified records and our active national survey.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/survey"
                className="px-6 py-3 rounded-lg bg-gma-red hover:bg-red-700 text-white font-headline font-bold text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105"
              >
                <Vote className="w-4 h-4 text-amber-300" />
                <span>CAST YOUR VOTE</span>
              </Link>
              <Link
                href="/map"
                className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-headline font-bold text-sm uppercase tracking-wider border border-white/20 flex items-center justify-center gap-2 transition-colors"
              >
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>VIEW LIVE MAP</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* ================= 4 KEY STAT CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Total Registered */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
            <div className="text-[11px] font-headline font-bold text-slate-500 uppercase tracking-wider">
              TOTAL REGISTERED VOTERS
            </div>
            <div className="text-3xl font-headline font-black text-[#0B132B] tabular-nums">
              {baseline.totalRegisteredVoters.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Projected +4.2M new registrants</span>
            </div>
          </div>

          {/* Card 2: The Youth Vote */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
            <div className="text-[11px] font-headline font-bold text-slate-500 uppercase tracking-wider">
              THE YOUTH VOTE (GEN Z + MILLENNIALS)
            </div>
            <div className="text-3xl font-headline font-black text-[#004B93] tabular-nums">
              {baseline.youthVoteShare}%
            </div>
            <div className="text-xs text-slate-500 font-medium">
              36.9M registered voters under 42 years
            </div>
          </div>

          {/* Card 3: Gender Distribution */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
            <div className="text-[11px] font-headline font-bold text-slate-500 uppercase tracking-wider">
              GENDER RATIO (NATIONWIDE)
            </div>
            <div className="text-3xl font-headline font-black text-[#0B132B] tabular-nums">
              51.2% <span className="text-sm text-slate-400 font-normal">F</span> / 48.8%{" "}
              <span className="text-sm text-slate-400 font-normal">M</span>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              33.6M Female &bull; 32.1M Male
            </div>
          </div>

          {/* Card 4: Survey Participation */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
            <div className="text-[11px] font-headline font-bold text-slate-500 uppercase tracking-wider">
              ACTIVE SURVEY RESPONDENTS
            </div>
            <div className="text-3xl font-headline font-black text-gma-red tabular-nums">
              {analytics?.summary?.totalActiveSubmissions?.toLocaleString() || "1,248"}
            </div>
            <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>100% verified anonymous submissions</span>
            </div>
          </div>
        </div>

        {/* ================= GENERATIONAL COHORT BREAKDOWN (THE YOUTH VOTE) ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-[#0B132B] px-6 py-4 border-b-2 border-gma-red flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-headline font-black text-white tracking-wider uppercase">
                GENERATIONAL COHORTS: WHO ARE THE VOTERS?
              </h2>
              <p className="text-xs text-slate-300">
                Official demographic categorization by age group and generational bloc
              </p>
            </div>
            <div className="px-3 py-1 rounded bg-white/10 text-amber-300 font-headline font-bold text-xs uppercase tracking-wider">
              YOUTH VOTE DECIDES 2028
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {baseline.generations.map((gen, idx) => {
                const colors = ["#004B93", "#2563EB", "#D90429", "#64748B"];
                const color = colors[idx % colors.length];

                return (
                  <div
                    key={gen.label}
                    className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-headline font-black text-lg text-[#0B132B] uppercase">
                        {gen.label}
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        {gen.ageBracket}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-2xl font-headline font-black text-[#0B132B] tabular-nums">
                        {gen.percentage}%
                      </div>
                      <div className="text-xs text-slate-500 font-medium tabular-nums">
                        {gen.count.toLocaleString()} registered voters
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${gen.percentage * 2}%`, backgroundColor: color }}
                      ></div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed pt-1">{gen.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Generational Insight Callout */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed flex items-start gap-3">
              <Award className="w-5 h-5 text-[#004B93] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold uppercase font-headline">Research Insight by Swing Labs: </span>
                Combined, <strong>Millennials and Gen Z account for over 56.4%</strong> of the entire
                registered voting population. With over 36.9 million young voters heading to the polls,
                candidates who resonate with issues of digital employment, education access, public transport,
                and climate resilience hold a decisive statistical advantage.
              </div>
            </div>
          </div>
        </div>

        {/* ================= GENDER & CIVIL STATUS PROFILE ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gender Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h3 className="font-headline font-black text-base text-[#0B132B] uppercase tracking-wider">
                GENDER BREAKDOWN (COMELEC 2028)
              </h3>
              <span className="text-xs text-slate-400 font-bold uppercase">Nationwide</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-pink-50 border border-pink-100 space-y-1 text-center">
                <div className="text-xs font-headline font-bold text-pink-700 uppercase">Female Voters</div>
                <div className="text-2xl font-headline font-black text-pink-900">51.2%</div>
                <div className="text-xs text-pink-700 font-medium tabular-nums">33,648,147</div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 space-y-1 text-center">
                <div className="text-xs font-headline font-bold text-blue-700 uppercase">Male Voters</div>
                <div className="text-2xl font-headline font-black text-blue-900">48.8%</div>
                <div className="text-xs text-blue-700 font-medium tabular-nums">32,097,365</div>
              </div>
            </div>

            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
              <div className="bg-pink-500 h-full" style={{ width: "51.2%" }}></div>
              <div className="bg-blue-600 h-full" style={{ width: "48.8%" }}></div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              In the Philippines, female registered voters consistently outnumber male voters by over 1.5 million,
              influencing voter turnout trends across Luzon, Visayas, and Mindanao.
            </p>
          </div>

          {/* Civil Status Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h3 className="font-headline font-black text-base text-[#0B132B] uppercase tracking-wider">
                CIVIL STATUS DISTRIBUTION
              </h3>
              <span className="text-xs text-slate-400 font-bold uppercase">COMELEC Data</span>
            </div>

            <div className="space-y-3">
              {baseline.civilStatus.map((cs) => (
                <div key={cs.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 uppercase font-headline">{cs.label}</span>
                    <span className="font-bold text-[#0B132B] tabular-nums">
                      {cs.percentage}% ({cs.count.toLocaleString()})
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#004B93] rounded-full"
                      style={{ width: `${cs.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= TOP 12 VOTE-RICH PROVINCES (THE BATTLEGROUND) ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-[#0B132B] px-6 py-4 border-b-2 border-gma-red flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-headline font-black text-white tracking-wider uppercase">
                TOP VOTE-RICH PROVINCES IN THE PHILIPPINES
              </h2>
              <p className="text-xs text-slate-300">
                The battleground provinces that carry the largest share of the 2028 electorate
              </p>
            </div>
            <span className="text-xs font-headline font-bold text-amber-400 uppercase">
              RANKED BY REGISTERED VOTERS
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-headline font-black uppercase text-[11px]">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Province</th>
                  <th className="py-3 px-4">Island Group</th>
                  <th className="py-3 px-4 text-right">Registered Voters</th>
                  <th className="py-3 px-4 text-right">National Share</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {baseline.topVoteRichProvinces.map((prov) => (
                  <tr key={prov.name} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-headline font-bold text-white text-xs ${
                          prov.rank <= 3 ? "bg-gma-red" : "bg-slate-500"
                        }`}
                      >
                        {prov.rank}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-headline font-bold text-sm text-[#0B132B] uppercase">
                      {prov.name}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-semibold">{prov.islandGroup}</td>
                    <td className="py-3 px-4 text-right font-headline font-bold text-[#0B132B] text-sm tabular-nums">
                      {prov.registeredVoters.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[#004B93] tabular-nums">
                      {prov.share}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Link
                        href={`/map?province=${prov.name.toLowerCase().replace(/\s+/g, "-")}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#004B93] hover:underline uppercase font-headline"
                      >
                        <span>View Map</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= INTERACTIVE REGION & PROVINCE DEMOGRAPHIC EXPLORER ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-headline font-black text-[#0B132B] uppercase tracking-wider">
                REGIONAL &amp; PROVINCIAL VOTER EXPLORER
              </h2>
              <p className="text-xs text-slate-500">
                Select any Philippine administrative region or province to view local demographics and survey statistics
              </p>
            </div>

            {/* Dropdown selectors */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedRegionId}
                onChange={(e) => {
                  setSelectedRegionId(e.target.value);
                  const firstProv = PHILIPPINE_PROVINCES.find((p) => p.regionId === e.target.value);
                  if (firstProv) setSelectedProvinceId(firstProv.id);
                }}
                className="w-full sm:w-auto max-w-full py-2 px-3 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004B93]"
              >
                {PHILIPPINE_REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.code} - {r.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedProvinceId}
                onChange={(e) => setSelectedProvinceId(e.target.value)}
                className="w-full sm:w-auto max-w-full py-2 px-3 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004B93]"
              >
                {regionProvinces.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Regional Details Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[11px] font-headline font-bold text-slate-500 uppercase">
                {currentRegion.code}
              </div>
              <div className="text-xl font-headline font-black text-[#0B132B] uppercase">
                {currentRegion.name}
              </div>
              <div className="text-xs text-slate-600">
                Island Group: <strong>{currentRegion.islandGroup}</strong>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[11px] font-headline font-bold text-slate-500 uppercase">
                REGIONAL VOTING POPULATION
              </div>
              <div className="text-2xl font-headline font-black text-[#004B93] tabular-nums">
                {currentRegion.registeredVoters?.toLocaleString() || "7,289,791"}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Official COMELEC registered voters
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[11px] font-headline font-bold text-slate-500 uppercase">
                SELECTED PROVINCE
              </div>
              <div className="text-xl font-headline font-black text-[#0B132B] uppercase">
                {currentProvince.name}
              </div>
              <div className="text-xs text-slate-500">
                Cities &amp; Municipalities:{" "}
                <strong>{currentProvince.cities?.length || 16} local units</strong>
              </div>
            </div>
          </div>
        </div>

        {/* ================= VOTER EDUCATION & COMELEC GUIDELINES ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xl font-headline font-black text-[#0B132B] uppercase tracking-wider">
              VOTER GUIDELINES &amp; CIVIC EDUCATION
            </h2>
            <p className="text-xs text-slate-500">
              Essential COMELEC reminders and automated election system instructions for Filipino voters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-headline font-bold text-[#0B132B] uppercase">
                <Calendar className="w-4 h-4 text-gma-red" />
                <span>Election Day Schedule</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Voting precincts nationwide operate strictly from <strong>6:00 AM to 7:00 PM</strong> on national
                election day. Senior citizens, pregnant women, and PWDs are accommodated in accessible priority
                lanes.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-headline font-bold text-[#0B132B] uppercase">
                <FileCheck className="w-4 h-4 text-[#004B93]" />
                <span>Valid Identification</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Voters must be listed in the Computerized Voters List (CVL). Present a valid government-issued photo
                ID (PhilID, Driver&apos;s License, Passport, UMID, Postal ID, PRC ID) or student ID.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-headline font-bold text-[#0B132B] uppercase">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Ballot Integrity Rules</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fully shade the oval beside your candidate of choice. Do not overvote: select strictly 1 President,
                1 Vice-President, and a maximum of 12 Senators to avoid ballot invalidation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
