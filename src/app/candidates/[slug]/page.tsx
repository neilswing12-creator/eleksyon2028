"use client";

import React, { useEffect, useState } from "react";
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
  Sparkles,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-brand-slate font-medium">Loading candidate profile...</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-brand-border p-8 text-center max-w-md">
          <h2 className="text-lg font-bold text-brand-navy">Candidate Not Found</h2>
          <p className="text-xs text-brand-slate mt-1">
            The requested candidate profile does not exist or has been unpublished.
          </p>
          <Link
            href="/candidates"
            className="inline-block mt-4 px-4 py-2 bg-brand-blue text-white rounded-xl text-xs font-bold"
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
    <div className="min-h-screen bg-brand-light pb-16">
      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-brand-border py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href="/candidates"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-slate hover:text-brand-navy"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Candidates</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Verified Public Profile</span>
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              {candidate.position.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-subtle">
          <div className="h-2 w-full" style={{ backgroundColor: candidate.color }}></div>

          <div className="p-6 sm:p-8 flex flex-col md:flex-row items-start gap-6">
            {candidate.photoUrl ? (
              <img
                src={candidate.photoUrl}
                alt={candidate.name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover object-top border-2 border-slate-200 shadow-md flex-shrink-0"
              />
            ) : (
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-xl text-slate-600 flex-shrink-0">
                {candidate.name.slice(0, 2)}
              </div>
            )}

            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-brand-blue">
                  {candidate.position.replace("_", " ")}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                  {candidate.party || "Independent"}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: candidate.color }}
                  ></span>
                  Map Color
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-headline font-bold uppercase tracking-tight text-brand-navy">
                {candidate.name}
              </h1>
              <p className="text-xs sm:text-sm text-brand-slate leading-relaxed pt-1">
                {candidate.bio}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
                {candidate.officialWebsite && (
                  <a
                    href={candidate.officialWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-brand-blue hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Official Portal</span>
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
                className="w-full text-center px-6 py-2.5 rounded-xl bg-brand-blue text-white text-xs font-bold shadow-sm hover:bg-blue-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Vote className="w-4 h-4" />
                <span>Cast Survey Vote</span>
              </Link>
              <button
                onClick={handleOpenShare}
                className="w-full text-center px-6 py-2.5 rounded-xl bg-gma-red text-white text-xs font-headline font-bold uppercase tracking-wider shadow-sm hover:bg-red-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Share2 className="w-4 h-4 text-amber-300" />
                <span>Share Vote Card (1080×1350)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Credentials & Background */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Education */}
          <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-navy uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-brand-blue" />
                <span>Educational Background</span>
              </div>
              <span className="text-[10px] font-bold text-brand-blue bg-blue-50 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>
            {candidate.educations && candidate.educations.length > 0 ? (
              <ul className="space-y-3 pt-1">
                {candidate.educations.map((edu: any, i: number) => (
                  <li key={edu.id || i} className="flex items-start gap-2.5 text-xs text-brand-navy">
                    <span className="w-2 h-2 rounded-full bg-brand-blue mt-1 flex-shrink-0"></span>
                    <div className="space-y-0.5">
                      <div className="font-semibold text-brand-navy leading-snug">{edu.degree}</div>
                      {(edu.institution || edu.year) && (
                        <div className="text-[11px] text-brand-slate">
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
                  <li key={i} className="flex items-start gap-2.5 text-xs text-brand-navy">
                    <span className="w-2 h-2 rounded-full bg-brand-blue mt-1 flex-shrink-0"></span>
                    <span className="leading-relaxed font-semibold">{e.trim()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-brand-slate italic">
                Verified academic records under research review.
              </p>
            )}
          </div>

          {/* Public Service History */}
          <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-navy uppercase tracking-wider">
                <Briefcase className="w-4 h-4 text-brand-blue" />
                <span>Public Service Record</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Official Record
              </span>
            </div>
            {candidate.publicServices && candidate.publicServices.length > 0 ? (
              <ul className="space-y-3 pt-1">
                {candidate.publicServices.map((srv: any, i: number) => (
                  <li key={srv.id || i} className="flex items-start gap-2.5 text-xs text-brand-navy">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1 flex-shrink-0"></span>
                    <div className="space-y-0.5">
                      <div className="font-semibold text-brand-navy leading-snug">{srv.position}</div>
                      {(srv.organization || srv.years) && (
                        <div className="text-[11px] text-brand-slate">
                          {srv.organization} {srv.years ? `(${srv.years})` : ""}
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
                  <li key={i} className="flex items-start gap-2.5 text-xs text-brand-navy">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1 flex-shrink-0"></span>
                    <span className="leading-relaxed font-semibold">{s.trim()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-brand-slate italic">
                Previous elected or appointed public service details.
              </p>
            )}
          </div>
        </div>

        {/* Agendas & Policy Platforms */}
        <div className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-brand-border">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-blue" />
              <h3 className="text-lg font-bold text-brand-navy">Published Agendas &amp; Platforms</h3>
            </div>
            <span className="text-xs text-brand-slate font-medium">
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
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-brand-blue">
                      {p.category.replace("_", " ")}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{p.verificationStatus}</span>
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-brand-navy">{p.title}</h4>
                  <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">{p.description}</p>

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
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-blue hover:underline ml-auto"
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
            <p className="text-xs text-brand-slate italic py-4">
              No verified policy platform information has been submitted yet for this profile.
            </p>
          )}
        </div>

        {/* Sources & Public Domain Citations */}
        <div className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-brand-border">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-brand-navy">Sources &amp; Verification Citations</h3>
            </div>
            <span className="text-xs text-brand-slate font-medium">
              {candidate.sources?.length || 0} primary source{candidate.sources?.length !== 1 ? "s" : ""}
            </span>
          </div>

          <p className="text-xs text-brand-slate leading-relaxed">
            All educational credentials, public service records, portraits, and platform positions are verified
            against official Philippine government archives (Senate of the Philippines, House of Representatives,
            Official Gazette, Supreme Court of the Philippines, and official agency portals) under Section 176 of
            Republic Act No. 8293 (Intellectual Property Code of the Philippines).
          </p>

          {candidate.sources && candidate.sources.length > 0 ? (
            <div className="space-y-3 pt-2">
              {candidate.sources.map((src: any) => (
                <div
                  key={src.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700">
                        {src.category}
                      </span>
                      {src.publisher && (
                        <span className="text-[11px] font-semibold text-slate-600">
                          {src.publisher}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 font-bold">
                        <Check className="w-3 h-3 text-emerald-600" />
                        {src.verificationStatus}
                      </span>
                    </div>
                    <div className="font-semibold text-brand-navy">{src.title}</div>
                    {src.notes && <div className="text-[11px] text-slate-500 italic">{src.notes}</div>}
                  </div>

                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-brand-blue font-semibold hover:bg-blue-50 text-[11px] whitespace-nowrap self-start sm:self-center"
                  >
                    <span>View Primary Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500">
              Primary government sources and legislative records are currently being indexed for this profile.
            </div>
          )}

          {/* Last Verification Footer */}
          <div className="pt-4 border-t border-brand-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Last verified &amp; audited: <strong>{verifiedDateFormatted}</strong>
              </span>
            </div>
            <div>
              <span>Official portrait and legislative work public domain compliance</span>
            </div>
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
