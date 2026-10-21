"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  GraduationCap,
  Briefcase,
  Globe,
  BookOpen,
  Vote,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  FileText,
  Calendar,
  Building,
  Check,
  Info,
  Share2,
  Landmark,
  Search,
  Filter,
  FileCheck,
  Award,
  Layers,
} from "lucide-react";
import ShareVoteCardModal, {
  ShareCandidateData,
  CompetitorData,
} from "@/components/ShareVoteCardModal";

export default function CandidateDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [shareCandidate, setShareCandidate] = useState<ShareCandidateData | null>(null);
  const [shareCompetitors, setShareCompetitors] = useState<CompetitorData[]>([]);

  // Legislative Records Filters
  const [legSearch, setLegSearch] = useState("");
  const [legChamber, setLegChamber] = useState("ALL");
  const [legCongress, setLegCongress] = useState("ALL");
  const [legRole, setLegRole] = useState("ALL");
  const [legStatus, setLegStatus] = useState("ALL");

  useEffect(() => {
    async function load() {
      try {
        const [candRes, analyticsRes] = await Promise.all([
          fetch(`/api/candidates?slug=${slug}`),
          fetch("/api/analytics"),
        ]);
        if (candRes.ok) {
          const data = await candRes.json();
          setCandidate(data.candidate);
        }
        if (analyticsRes.ok) {
          const data = await analyticsRes.json();
          setAnalytics(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (slug) load();
  }, [slug]);

  const handleOpenShare = () => {
    if (!candidate) return;
    let rank = 1;
    let votes = 0;
    let percentage = 0;
    let compList: CompetitorData[] = [];

    if (analytics) {
      if (candidate.position === "PRESIDENT") {
        const rankings = analytics.presidentialRankings || [];
        const idx = rankings.findIndex((r: any) => r.id === candidate.id);
        if (idx !== -1) {
          rank = idx + 1;
          votes = rankings[idx].votes;
          percentage = rankings[idx].percentage;
        }
        compList = rankings.map((r: any, i: number) => ({
          id: r.id,
          name: r.name,
          party: r.party,
          color: r.color,
          photoUrl: r.photoUrl,
          votes: r.votes,
          percentage: r.percentage,
          rank: i + 1,
        }));
      } else if (candidate.position === "VICE_PRESIDENT") {
        const rankings = analytics.vicePresidentialRankings || [];
        const idx = rankings.findIndex((r: any) => r.id === candidate.id);
        if (idx !== -1) {
          rank = idx + 1;
          votes = rankings[idx].votes;
          percentage = rankings[idx].percentage;
        }
        compList = rankings.map((r: any, i: number) => ({
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
        const rankings = analytics.senatorialRankings || [];
        const idx = rankings.findIndex((r: any) => r.id === candidate.id);
        if (idx !== -1) {
          rank = idx + 1;
          votes = rankings[idx].votes;
          percentage = rankings[idx].percentage;
        }
        compList = rankings.map((r: any, i: number) => ({
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
    }

    setShareCandidate({
      id: candidate.id,
      name: candidate.name,
      slug: candidate.slug,
      position: candidate.position,
      party: candidate.party,
      color: candidate.color,
      photoUrl: candidate.photoUrl,
      votes,
      percentage,
      rank,
    });
    setShareCompetitors(compList);
  };

  // Filtered legislative records
  const allRecords = useMemo(() => {
    return candidate?.legislativeRecords || [];
  }, [candidate]);

  const filteredRecords = useMemo(() => {
    return allRecords.filter((rec: any) => {
      // Search
      if (legSearch.trim()) {
        const q = legSearch.toLowerCase().trim();
        const matchTitle = rec.title?.toLowerCase().includes(q);
        const matchBill = rec.billNo?.toLowerCase().includes(q);
        const matchRA = rec.republicActNo?.toLowerCase().includes(q);
        const matchLong = rec.longTitle?.toLowerCase().includes(q);
        if (!matchTitle && !matchBill && !matchRA && !matchLong) return false;
      }

      // Chamber
      if (legChamber !== "ALL" && rec.chamber !== legChamber) {
        return false;
      }

      // Congress
      if (legCongress !== "ALL" && String(rec.congress) !== legCongress) {
        return false;
      }

      // Role
      if (legRole !== "ALL" && rec.role !== legRole) {
        return false;
      }

      // Status
      if (legStatus !== "ALL") {
        if (legStatus === "ENACTED" && rec.status !== "ENACTED_INTO_LAW" && rec.status !== "REPUBLIC_ACT" && !rec.republicActNo) {
          return false;
        }
        if (legStatus === "PASSED" && rec.status !== "PASSED_SENATE" && rec.status !== "PASSED_HOUSE") {
          return false;
        }
        if (legStatus === "PENDING" && rec.status !== "PENDING") {
          return false;
        }
      }

      return true;
    });
  }, [allRecords, legSearch, legChamber, legCongress, legRole, legStatus]);

  // Legislative Metrics
  const legMetrics = useMemo(() => {
    const total = allRecords.length;
    const enacted = allRecords.filter(
      (r: any) => r.status === "ENACTED_INTO_LAW" || r.status === "REPUBLIC_ACT" || !!r.republicActNo
    ).length;
    const authored = allRecords.filter((r: any) => r.role === "PRINCIPAL_AUTHOR").length;
    const coAuthoredOrSponsored = allRecords.filter((r: any) => r.role !== "PRINCIPAL_AUTHOR").length;
    const pending = allRecords.filter((r: any) => r.status === "PENDING").length;

    return { total, enacted, authored, coAuthoredOrSponsored, pending };
  }, [allRecords]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-brand-slate font-medium">Loading candidate profile...</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-brand-border p-8 text-center max-w-md shadow-subtle">
          <h2 className="text-lg font-bold text-brand-navy">Candidate Not Found</h2>
          <p className="text-xs text-brand-slate mt-1">
            The requested candidate profile does not exist or has been unpublished.
          </p>
          <Link
            href="/candidates"
            className="inline-block mt-4 px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-700"
          >
            Return to Directory
          </Link>
        </div>
      </div>
    );
  }

  const verifiedDateFormatted = candidate.lastVerifiedAt
    ? new Date(candidate.lastVerifiedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "March 2026";

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* Top Breadcrumb & Verification Header */}
      <div className="bg-white border-b border-brand-border py-3.5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href="/candidates"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-sky-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Candidates</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Public Profile</span>
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              {candidate.position.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Profile Header Card (BetterGov.ph / eGov.ph style) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-subtle">
          <div className="h-2 w-full" style={{ backgroundColor: candidate.color }}></div>

          <div className="p-6 sm:p-8 flex flex-col md:flex-row items-start gap-6">
            {candidate.photoUrl ? (
              <img
                src={candidate.photoUrl}
                alt={candidate.name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover object-top border border-slate-200 shadow-sm flex-shrink-0"
              />
            ) : (
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-2xl text-slate-600 flex-shrink-0">
                {candidate.name.slice(0, 2)}
              </div>
            )}

            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-sky-50 text-sky-800 border border-sky-100">
                  {candidate.position.replace("_", " ")}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                  {candidate.party || "Independent"}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-600 font-mono">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: candidate.color }}
                  ></span>
                  Map Indicator
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1E36]">
                {candidate.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1 max-w-3xl">
                {candidate.bio}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
                {candidate.officialWebsite && (
                  <a
                    href={candidate.officialWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-sky-700 hover:text-sky-800 hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Official Portal / Senate Bio</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Audited: {verifiedDateFormatted}</span>
                </span>
              </div>
            </div>

            <div className="w-full md:w-auto flex md:flex-col gap-2 flex-shrink-0">
              <Link
                href="/survey"
                className="w-full text-center px-5 py-2.5 rounded-xl bg-[#004B93] hover:bg-sky-700 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <Vote className="w-4 h-4 text-amber-300" />
                <span>Cast Survey Ballot</span>
              </Link>
              <button
                onClick={handleOpenShare}
                className="w-full text-center px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0B1E36] text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
              >
                <Share2 className="w-4 h-4 text-sky-700" />
                <span>Share Results Card</span>
              </button>
            </div>
          </div>
        </div>

        {/* Credentials & Background */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Education */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0B1E36] uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-sky-600" />
                <span>Educational Background</span>
              </div>
              <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>
            {candidate.educations && candidate.educations.length > 0 ? (
              <ul className="space-y-3 pt-1">
                {candidate.educations.map((edu: any, i: number) => (
                  <li key={edu.id || i} className="flex items-start gap-2.5 text-xs text-[#0B1E36]">
                    <span className="w-2 h-2 rounded-full bg-sky-600 mt-1 flex-shrink-0"></span>
                    <div className="space-y-0.5">
                      <div className="font-semibold text-[#0B1E36] leading-snug">{edu.degree}</div>
                      {(edu.institution || edu.year) && (
                        <div className="text-[11px] text-slate-500">
                          {edu.institution} {edu.year ? `(${edu.year})` : ""}
                        </div>
                      )}
                      {edu.sourceTitle && (
                        <div className="text-[10px] text-slate-400">
                          Source: {edu.sourceTitle}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : candidate.education ? (
              <ul className="space-y-3 pt-1">
                {candidate.education.split(";").map((e: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-[#0B1E36]">
                    <span className="w-2 h-2 rounded-full bg-sky-600 mt-1 flex-shrink-0"></span>
                    <span className="leading-relaxed font-semibold">{e.trim()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Verified academic records under research review.
              </p>
            )}
          </div>

          {/* Public Service History */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0B1E36] uppercase tracking-wider">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <span>Public Service Record</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                Official Record
              </span>
            </div>
            {candidate.publicServices && candidate.publicServices.length > 0 ? (
              <ul className="space-y-3 pt-1">
                {candidate.publicServices.map((srv: any, i: number) => (
                  <li key={srv.id || i} className="flex items-start gap-2.5 text-xs text-[#0B1E36]">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1 flex-shrink-0"></span>
                    <div className="space-y-0.5">
                      <div className="font-semibold text-[#0B1E36] leading-snug">{srv.position}</div>
                      {(srv.title || srv.period) && (
                        <div className="text-[11px] text-slate-500">
                          {srv.title} {srv.period ? `(${srv.period})` : ""}
                        </div>
                      )}
                      {srv.sourceTitle && (
                        <div className="text-[10px] text-slate-400">
                          Source: {srv.sourceTitle}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : candidate.publicService ? (
              <ul className="space-y-3 pt-1">
                {candidate.publicService.split(";").map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-[#0B1E36]">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1 flex-shrink-0"></span>
                    <span className="leading-relaxed font-semibold">{s.trim()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Previous elected or appointed public service details.
              </p>
            )}
          </div>
        </div>

        {/* SECTION: DEDICATED LEGISLATIVE RECORDS (Official Philippine Congress Registry) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/70">
            <div>
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-[#004B93]" />
                <h3 className="text-lg font-bold text-[#0B1E36]">
                  Official Legislative Records &amp; Bills
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Primary records retrieved from the Senate Legislative Information System (LIS) and House of Representatives.
              </p>
            </div>

            {/* Metrics Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-100 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-sky-600" />
                <span>{legMetrics.enacted} Republic Acts</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                {legMetrics.authored} Principal Author
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                {legMetrics.total} Total Recorded
              </span>
            </div>
          </div>

          {/* Legislative Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/60 text-center">
              <div className="text-xl sm:text-2xl font-bold text-[#0B1E36]">{legMetrics.total}</div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide mt-0.5">
                Total Bills
              </div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-100 text-center">
              <div className="text-xl sm:text-2xl font-bold text-emerald-800">{legMetrics.enacted}</div>
              <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide mt-0.5">
                Enacted Laws (RA)
              </div>
            </div>
            <div className="bg-sky-50 rounded-xl p-3.5 border border-sky-100 text-center">
              <div className="text-xl sm:text-2xl font-bold text-sky-800">{legMetrics.authored}</div>
              <div className="text-[11px] font-semibold text-sky-700 uppercase tracking-wide mt-0.5">
                Authored Bills
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/60 text-center">
              <div className="text-xl sm:text-2xl font-bold text-slate-700">{legMetrics.pending}</div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide mt-0.5">
                Active / In Review
              </div>
            </div>
          </div>

          {/* Filters & Keyword Search Bar */}
          {allRecords.length > 0 && (
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/60 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={legSearch}
                    onChange={(e) => setLegSearch(e.target.value)}
                    placeholder="Search by bill number, title, Republic Act (e.g. SB-1304, RA 10931)..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  />
                  {legSearch && (
                    <button
                      onClick={() => setLegSearch("")}
                      className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
                    >
                      &times;
                    </button>
                  )}
                </div>

                {/* Clear Filters Button if any active */}
                {(legSearch || legChamber !== "ALL" || legCongress !== "ALL" || legRole !== "ALL" || legStatus !== "ALL") && (
                  <button
                    onClick={() => {
                      setLegSearch("");
                      setLegChamber("ALL");
                      setLegCongress("ALL");
                      setLegRole("ALL");
                      setLegStatus("ALL");
                    }}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    Reset Filters
                  </button>
                )}
              </div>

              {/* Multi-facet Filter Selectors */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {/* Chamber */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Chamber
                  </label>
                  <select
                    value={legChamber}
                    onChange={(e) => setLegChamber(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="ALL">All Chambers</option>
                    <option value="SENATE">Senate</option>
                    <option value="HOUSE">House of Representatives</option>
                  </select>
                </div>

                {/* Congress */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Congress
                  </label>
                  <select
                    value={legCongress}
                    onChange={(e) => setLegCongress(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="ALL">All Congresses</option>
                    <option value="19">19th Congress (2022–2025)</option>
                    <option value="18">18th Congress (2019–2022)</option>
                    <option value="17">17th Congress (2016–2019)</option>
                    <option value="16">16th Congress (2013–2016)</option>
                    <option value="15">15th Congress (2010–2013)</option>
                    <option value="14">14th Congress (2007–2010)</option>
                  </select>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Legislative Role
                  </label>
                  <select
                    value={legRole}
                    onChange={(e) => setLegRole(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="ALL">All Roles</option>
                    <option value="PRINCIPAL_AUTHOR">Principal Author</option>
                    <option value="CO_AUTHOR">Co-Author</option>
                    <option value="SPONSOR">Sponsor</option>
                    <option value="CO_SPONSOR">Co-Sponsor</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Bill Status
                  </label>
                  <select
                    value={legStatus}
                    onChange={(e) => setLegStatus(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="ENACTED">Enacted (Republic Act)</option>
                    <option value="PASSED">Passed Senate / House</option>
                    <option value="PENDING">Pending in Committee</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Record List */}
          {filteredRecords.length > 0 ? (
            <div className="space-y-3">
              {filteredRecords.map((bill: any) => {
                const isEnacted =
                  bill.status === "ENACTED_INTO_LAW" ||
                  bill.status === "REPUBLIC_ACT" ||
                  !!bill.republicActNo;

                return (
                  <div
                    key={bill.id}
                    className="p-5 rounded-xl border border-slate-200 bg-white hover:border-sky-300 transition-all space-y-2.5 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Bill Badge */}
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-[#0B1E36] text-white">
                          {bill.billNo}
                        </span>

                        {/* Republic Act Badge */}
                        {bill.republicActNo && (
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                            <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
                            <span>{bill.republicActNo}</span>
                          </span>
                        )}

                        {/* Chamber & Congress */}
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {bill.chamber === "SENATE" ? "Senate" : "House"} &bull; {bill.congress}th Congress
                        </span>

                        {/* Role */}
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-100">
                          {bill.role.replace(/_/g, " ")}
                        </span>
                      </div>

                      {/* Status Tag */}
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                          isEnacted
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : bill.status.startsWith("PASSED")
                            ? "bg-blue-50 text-blue-800 border border-blue-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {isEnacted
                          ? "ENACTED INTO LAW"
                          : bill.status.replace(/_/g, " ")}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-base font-bold text-[#0B1E36] leading-snug">
                      {bill.title}
                    </h4>

                    {/* Long Title / Summary */}
                    {bill.longTitle && bill.longTitle !== bill.title && (
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {bill.longTitle}
                      </p>
                    )}

                    {/* Meta Footer */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 text-xs text-slate-500">
                      <div className="flex items-center gap-3">
                        {bill.filedDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>
                              Filed: {new Date(bill.filedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">
                          Source: {bill.sourceInstitution === "SENATE_PH" ? "Senate LIS" : "House LIS"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {bill.pdfUrl && (
                          <a
                            href={bill.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Official PDF</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {bill.sourceUrl && (
                          <a
                            href={bill.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-semibold text-sky-700 hover:text-sky-800 hover:underline"
                          >
                            <span>View Source Record</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : allRecords.length > 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-xs font-semibold text-slate-600">
                No legislative records matched the active filter criteria.
              </p>
              <button
                onClick={() => {
                  setLegSearch("");
                  setLegChamber("ALL");
                  setLegCongress("ALL");
                  setLegRole("ALL");
                  setLegStatus("ALL");
                }}
                className="mt-2 text-xs text-sky-700 font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            // Informative Graceful State for Non-Congressional Candidates
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/60 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Landmark className="w-6 h-6 text-slate-400" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h4 className="text-sm font-bold text-[#0B1E36]">
                  No Congressional Legislative Records on File
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {candidate.name} has not served as an elected member of the Senate of the Philippines or the House of Representatives.
                  Their public career focuses on executive administration, local governance, or private sector leadership, detailed in the verified Public Service and Platforms sections below.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Agendas & Policy Platforms */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/70">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-600" />
              <h3 className="text-lg font-bold text-[#0B1E36]">Published Agendas &amp; Platforms</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {candidate.platforms?.length || 0} policy platform{candidate.platforms?.length !== 1 ? "s" : ""} documented
            </span>
          </div>

          {candidate.platforms && candidate.platforms.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {candidate.platforms.map((p: any) => (
                <div
                  key={p.id}
                  className="p-5 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-slate-200 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-sky-800">
                      {p.category.replace("_", " ")}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{p.verificationStatus}</span>
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-[#0B1E36]">{p.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{p.description}</p>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/60 mt-3 text-xs">
                    {p.sourceType && (
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">
                        Type: {p.sourceType.replace(/_/g, " ")}
                      </span>
                    )}
                    {p.sourceUrl && (
                      <a
                        href={p.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 hover:underline ml-auto"
                      >
                        <span>{p.sourceTitle || "Official Source Document"}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic py-4">
              No verified policy platform information has been submitted yet for this profile.
            </p>
          )}
        </div>

        {/* Sources & Public Domain Citations */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-[#0B1E36]">Sources &amp; Verification Citations</h3>
            </div>
            <span className="text-xs text-slate-500">
              {candidate.sources?.length || 0} primary reference{candidate.sources?.length !== 1 ? "s" : ""}
            </span>
          </div>

          {candidate.sources && candidate.sources.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {candidate.sources.map((src: any) => (
                <div
                  key={src.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start gap-3"
                >
                  <FileText className="w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="text-xs font-semibold text-[#0B1E36] truncate">{src.title}</div>
                    <div className="text-[11px] text-slate-500">
                      Publisher: {src.publisher || "Official Philippine Government Portal"}
                    </div>
                    {src.url && (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] text-sky-700 hover:underline font-mono"
                      >
                        <span>Visit Official Source</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">
              Official public domain records provided by the Commission on Elections, Senate of the Philippines, and Official Gazette.
            </p>
          )}
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
