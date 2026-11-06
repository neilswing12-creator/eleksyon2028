"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Vote,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Copy,
  ShieldCheck,
  User,
  Users,
  Flame,
  Share2,
  Globe,
  Search,
  Building2,
  MapPin,
} from "@/components/icons";
import SurveyBallot, { BallotReceipt } from "@/components/SurveyBallot";
import ShareVoteCardModal, {
  ShareCandidateData,
  CompetitorData,
} from "@/components/ShareVoteCardModal";
import { PHILIPPINE_REGIONS, PHILIPPINE_PROVINCES } from "@/lib/philippines-geo";
import {
  OVERSEAS_COUNTRIES,
  searchOverseasCountries,
  getCountryByCode,
  OverseasCountry,
} from "@/lib/overseas-geo";

interface Candidate {
  id: string;
  slug: string;
  name: string;
  position: "PRESIDENT" | "VICE_PRESIDENT" | "SENATOR";
  party: string | null;
  color: string;
  photoUrl: string | null;
  bio: string | null;
}

export default function SurveyPage() {
  const [step, setStep] = useState(1);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [participantName, setParticipantName] = useState("");
  const [residenceType, setResidenceType] = useState<"DOMESTIC" | "OVERSEAS">("DOMESTIC");
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [overseasCity, setOverseasCity] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState("");
  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [gender, setGender] = useState("");
  const [civilStatus, setCivilStatus] = useState("");
  const [isFirstTimeVoter, setIsFirstTimeVoter] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  // Selections
  const [presidentialChoice, setPresidentialChoice] = useState<string>("");
  const [vicePresidentialChoice, setVicePresidentialChoice] = useState<string>("");
  const [senatorialChoices, setSenatorialChoices] = useState<string[]>([]);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [duplicateIPError, setDuplicateIPError] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    submissionId: string;
    managementToken: string;
    participantName: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Live Analytics & Share Modal State
  const [analytics, setAnalytics] = useState<any>(null);
  const [shareCandidate, setShareCandidate] = useState<ShareCandidateData | null>(null);
  const [shareCompetitors, setShareCompetitors] = useState<CompetitorData[]>([]);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await fetch("/api/analytics");
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadAnalytics();
  }, []);

  const openShareModal = (candidateId: string, position: string) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate) return;

    let rank = 1;
    let votes = 0;
    let percentage = 0;
    let compList: CompetitorData[] = [];

    if (analytics) {
      if (position === "PRESIDENT") {
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
      } else if (position === "VICE_PRESIDENT") {
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
      position,
      party: candidate.party,
      color: candidate.color,
      photoUrl: candidate.photoUrl,
      votes,
      percentage,
      rank,
    });
    setShareCompetitors(compList);
  };

  // Fetch candidates
  useEffect(() => {
    async function loadCandidates() {
      try {
        const res = await fetch("/api/candidates");
        if (res.ok) {
          const data = await res.json();
          setCandidates(data.candidates || []);
        }
      } catch (err) {
        console.error("Failed to load candidates:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCandidates();
  }, []);

  const presCandidates = candidates.filter((c) => c.position === "PRESIDENT");
  const vpCandidates = candidates.filter((c) => c.position === "VICE_PRESIDENT");
  const senCandidates = candidates.filter((c) => c.position === "SENATOR");

  const availableProvinces = selectedRegionId
    ? PHILIPPINE_PROVINCES.filter((p) => p.regionId === selectedRegionId)
    : PHILIPPINE_PROVINCES;

  const currentProvince = PHILIPPINE_PROVINCES.find((p) => p.id === selectedProvinceId);
  const availableCities = currentProvince ? currentProvince.cities : [];

  const toggleSenator = (id: string) => {
    if (senatorialChoices.includes(id)) {
      setSenatorialChoices(senatorialChoices.filter((s) => s !== id));
    } else {
      if (senatorialChoices.length >= 12) return;
      setSenatorialChoices([...senatorialChoices, id]);
    }
  };

  const filteredCountries = searchOverseasCountries(countrySearch);

  const handleSubmit = async () => {
    setSubmitting(true);
    setErrorMessage("");
    setDuplicateIPError(false);

    try {
      if (residenceType === "OVERSEAS" && !selectedCountryCode) {
        setErrorMessage("Please select your country of residence outside the Philippines (OFW / Overseas Filipino).");
        setSubmitting(false);
        return;
      }

      const regionObj = PHILIPPINE_REGIONS.find((r) => r.id === selectedRegionId);
      const provinceObj = PHILIPPINE_PROVINCES.find((p) => p.id === selectedProvinceId);

      const res = await fetch("/api/survey/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantName,
          residenceType,
          countryCode: residenceType === "OVERSEAS" ? selectedCountryCode : undefined,
          overseasCity: residenceType === "OVERSEAS" ? (overseasCity || undefined) : undefined,
          regionId: residenceType === "DOMESTIC" ? (selectedRegionId || undefined) : undefined,
          regionName: residenceType === "DOMESTIC" ? regionObj?.name : undefined,
          provinceId: residenceType === "DOMESTIC" ? (selectedProvinceId || undefined) : undefined,
          provinceName: residenceType === "DOMESTIC" ? provinceObj?.name : undefined,
          cityId: residenceType === "DOMESTIC" ? (selectedCity || undefined) : undefined,
          cityName: residenceType === "DOMESTIC" ? (selectedCity || undefined) : undefined,
          ageGroup: ageGroup || undefined,
          gender: gender || undefined,
          civilStatus: civilStatus || undefined,
          isFirstTimeVoter,
          presidentialCandidateId: presidentialChoice || undefined,
          vicePresidentialCandidateId: vicePresidentialChoice || undefined,
          senatorialCandidateIds: senatorialChoices,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409 && data.isDuplicateIP) {
          setDuplicateIPError(true);
        }
        setErrorMessage(data.error || "Failed to submit survey.");
        setSubmitting(false);
        return;
      }

      setSubmissionResult(data);
      setStep(6);
    } catch (err) {
      setErrorMessage("Network error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyManagementLink = () => {
    if (!submissionResult) return;
    const url = `${window.location.origin}/survey/manage/${submissionResult.managementToken}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
            Loading Eleksyon Ballot Candidates...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper py-8 px-4 sm:px-6 lg:px-8">
      <div className={`mx-auto ${step === 2 ? "max-w-5xl" : "max-w-3xl"}`}>
        {/* Step Progress Tracker */}
        {step <= 5 && (
          <ol className="mb-8 grid grid-cols-3 gap-2 text-xs" aria-label="Mga hakbang">
            {[
              { n: 1, s: 1, fil: "Impormasyon", en: "Your details" },
              { n: 2, s: 2, fil: "Balota", en: "Ballot" },
              { n: 3, s: 5, fil: "Resibo", en: "Review & submit" },
            ].map((it) => {
              const done = step > it.s;
              const active = step === it.s;
              return (
                <li key={it.n} className={`border-t-4 pt-2 ${active ? "border-[#0038A8]" : done ? "border-[#0038A8]/40" : "border-line"}`}>
                  <span className={`font-semibold ${active ? "text-[#0038A8]" : "text-ink-muted"}`}>
                    {it.n}. {it.fil}
                  </span>
                  <span className="block text-[11px] text-ink-faint">{it.en}</span>
                </li>
              );
            })}
          </ol>
        )}

        {/* STEP 1: Basic Info & Location */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-line p-6 sm:p-8 shadow-subtle space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-ph-blue text-xs font-semibold tracking-normal mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Anonymous Civic Participation</span>
              </div>
              <h2 className="text-3xl font-bold text-ink">
                2028 National Election Survey Ballot
              </h2>
              <p className="text-xs text-ink-soft font-sans mt-1 leading-relaxed">
                Participation is voluntary and completely anonymous. No email or password is required.
                Only your declared name and geographical location are recorded to aggregate provincial trends.
              </p>
            </div>

            <div className="space-y-4 pt-2 font-sans">
              <div>
                <label className="block text-xs font-semibold tracking-wide text-ink mb-1.5">
                  Your Full Name or Pseudonym <span className="text-ph-blue">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3.5 text-ink-faint" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Juan dela Cruz"
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
                  />
                </div>
                <p className="text-[11px] text-ink-faint mt-1">
                  Used strictly to identify your ballot and issue your private vote management link.
                </p>
              </div>

              {/* Location Type Selection: Domestic vs Overseas */}
              <div>
                <label className="block text-xs font-semibold tracking-wide text-ink mb-2">
                  Voting Location / Sector <span className="text-ph-blue">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setResidenceType("DOMESTIC");
                      setSelectedCountryCode("");
                      setOverseasCity("");
                    }}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all flex items-start gap-3 ${
                      residenceType === "DOMESTIC"
                        ? "border-[#004B93] bg-blue-50/60 ring-2 ring-[#004B93]/20"
                        : "border-line bg-white hover:border-slate-300"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg flex-shrink-0 ${
                        residenceType === "DOMESTIC" ? "bg-[#004B93] text-white" : "bg-slate-100 text-ink-muted"
                      }`}
                    >
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs uppercase text-ink">
                        Within the Philippines
                      </div>
                      <div className="text-[11px] text-ink-muted font-sans mt-0.5">
                        Resident citizen residing in Philippine provinces and cities
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setResidenceType("OVERSEAS");
                      setSelectedRegionId("");
                      setSelectedProvinceId("");
                      setSelectedCity("");
                    }}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all flex items-start gap-3 ${
                      residenceType === "OVERSEAS"
                        ? "border-[#004B93] bg-blue-50/60 ring-2 ring-[#004B93]/20"
                        : "border-line bg-white hover:border-slate-300"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg flex-shrink-0 ${
                        residenceType === "OVERSEAS" ? "bg-[#004B93] text-white" : "bg-slate-100 text-ink-muted"
                      }`}
                    >
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs uppercase text-ink">
                        Outside the Philippines (OFW / Overseas Filipino)
                      </div>
                      <div className="text-[11px] text-ink-muted font-sans mt-0.5">
                        Filipino migrant workers, permanent residents, and diaspora worldwide
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* DOMESTIC: Philippine Region, Province, City */}
              {residenceType === "DOMESTIC" ? (
                <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-line">
                  <div className="text-[11px] font-semibold tracking-normal text-ink-soft flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-ph-blue" />
                    <span>Philippine Geographic Location (Domestic)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold tracking-wide text-ink mb-1.5">
                        Region <span className="text-ink-faint font-normal lowercase">(optional)</span>
                      </label>
                      <select
                        value={selectedRegionId}
                        onChange={(e) => {
                          setSelectedRegionId(e.target.value);
                          setSelectedProvinceId("");
                          setSelectedCity("");
                        }}
                        className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                      >
                        <option value="">Select Region...</option>
                        {PHILIPPINE_REGIONS.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.code} - {r.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Province */}
                    <div>
                      <label className="block text-xs font-semibold tracking-wide text-ink mb-1.5">
                        Province <span className="text-ink-faint font-normal lowercase">(optional)</span>
                      </label>
                      <select
                        value={selectedProvinceId}
                        onChange={(e) => {
                          setSelectedProvinceId(e.target.value);
                          setSelectedCity("");
                        }}
                        className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                      >
                        <option value="">Select Province...</option>
                        {availableProvinces.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* City / Municipality */}
                  {availableCities.length > 0 && (
                    <div>
                      <label className="block text-xs font-semibold tracking-wide text-ink mb-1.5">
                        City / Municipality <span className="text-ink-faint font-normal lowercase">(optional)</span>
                      </label>
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                      >
                        <option value="">Select City or Municipality...</option>
                        {availableCities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ) : (
                /* OVERSEAS: Country Selector & Optional City Abroad */
                <div className="space-y-4 p-4 rounded-xl bg-blue-50/50 border border-blue-200">
                  <div className="text-[11px] font-semibold tracking-normal text-blue-900 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-ph-blue" />
                      <span>Overseas Filipino Country of Residence</span>
                    </span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                      OFW / Diaspora
                    </span>
                  </div>

                  {/* Searchable Country Selector */}
                  <div>
                    <label className="block text-xs font-semibold tracking-wide text-ink mb-1.5">
                      Country Abroad <span className="text-ph-blue">*</span>
                    </label>

                    {/* Filter Input */}
                    <div className="relative mb-2">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-ink-faint" />
                      <input
                        type="text"
                        placeholder="Search country (e.g. Saudi Arabia, UAE, USA, Japan, Singapore, Canada)..."
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <select
                      value={selectedCountryCode}
                      onChange={(e) => setSelectedCountryCode(e.target.value)}
                      required={residenceType === "OVERSEAS"}
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none font-sans"
                    >
                      <option value="">Select Country Abroad...</option>
                      {filteredCountries.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.name} ({c.region})
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-ink-muted mt-1">
                      No Philippine province is required. Overseas submissions are tallied independently under the Global Diaspora breakdown.
                    </p>
                  </div>

                  {/* Optional City or Region Abroad */}
                  <div>
                    <label className="block text-xs font-semibold tracking-wide text-ink mb-1.5">
                      City, State, or Region Abroad <span className="text-ink-faint font-normal lowercase">(optional)</span>
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3 top-3 text-ink-faint" />
                      <input
                        type="text"
                        placeholder="e.g. Dubai, Riyadh, Los Angeles, Toronto, Hong Kong, Sydney"
                        value={overseasCity}
                        onChange={(e) => setOverseasCity(e.target.value)}
                        maxLength={100}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
              {/* Optional Demographic Profile for Voters Research */}
              <div className="pt-3 border-t border-line space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold tracking-normal text-ink">
                    Optional Demographic Profile
                  </span>
                  <span className="text-[10px] text-ink-faint font-sans font-medium">
                    (Helps map national generational cohorts &amp; voter demographics)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Age Group */}
                  <div>
                    <label className="block text-[11px] font-bold text-ink-soft uppercase mb-1">
                      Age Bracket
                    </label>
                    <select
                      value={ageGroup}
                      onChange={(e) => setAgeGroup(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                    >
                      <option value="">Prefer not to say</option>
                      <option value="18-25">Gen Z (18–25 years old)</option>
                      <option value="26-41">Millennial (26–41 years old)</option>
                      <option value="42-57">Generation X (42–57 years old)</option>
                      <option value="58+">Boomers &amp; Elders (58+ years old)</option>
                    </select>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-[11px] font-bold text-ink-soft uppercase mb-1">
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                    >
                      <option value="">Prefer not to say</option>
                      <option value="FEMALE">Female</option>
                      <option value="MALE">Male</option>
                      <option value="PREFER_NOT_TO_SAY">Non-Binary / Other</option>
                    </select>
                  </div>
                </div>

                {/* First-time voter */}
                <label className="flex items-center gap-2 cursor-pointer select-none pt-1">
                  <input
                    type="checkbox"
                    checked={isFirstTimeVoter}
                    onChange={(e) => setIsFirstTimeVoter(e.target.checked)}
                    className="rounded text-ph-blue focus:ring-blue-500 w-4 h-4 border-slate-300"
                  />
                  <span className="text-xs text-ink-soft font-medium">
                    I am a first-time voter in the Philippine National Elections
                  </span>
                </label>
              </div>

              {/* Privacy Notice */}
              <div className="pt-3 border-t border-line">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={privacyAgreed}
                    onChange={(e) => setPrivacyAgreed(e.target.checked)}
                    className="mt-0.5 rounded text-ph-blue focus:ring-blue-500 w-4 h-4 border-slate-300"
                  />
                  <span className="text-xs text-ink-soft leading-relaxed font-sans">
                    I understand that this is an independent, unofficial public opinion survey and not an official
                    election ballot. I agree to have my survey preferences aggregated anonymously.
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                disabled={!participantName.trim() || !privacyAgreed}
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-ph-blue hover:bg-ph-blueDeep text-white font-semibold text-sm tracking-wider uppercase shadow disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <span>Proceed to Presidential Ballot</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Ballot (all positions on one sheet, like the printed ballot) */}
        {step === 2 && (
          <div className="space-y-6">
            <SurveyBallot
              candidates={candidates}
              president={presidentialChoice}
              vicePresident={vicePresidentialChoice}
              senators={senatorialChoices}
              maxSenators={12}
              onPresident={setPresidentialChoice}
              onVicePresident={setVicePresidentialChoice}
              onToggleSenator={toggleSenator}
            />
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold text-ink-soft hover:text-ink"
              >
                <ArrowLeft className="h-4 w-4" /> Bumalik
              </button>
              <button
                onClick={() => {
                  setErrorMessage("");
                  setStep(5);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={!presidentialChoice && !vicePresidentialChoice && senatorialChoices.length === 0}
                className="flex items-center gap-2 rounded-md bg-[#0038A8] px-6 py-3 text-sm font-semibold text-white hover:bg-[#002c86] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Suriin ang balota <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Review (voter's receipt) & submit */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-ink">Suriin ang iyong balota</h2>
              <p className="mt-1 text-sm text-ink-muted">
                Check your choices. After you submit you get a private link to change or withdraw your vote anytime.
              </p>
            </div>

            <BallotReceipt
              candidates={candidates}
              president={presidentialChoice}
              vicePresident={vicePresidentialChoice}
              senators={senatorialChoices}
              voterLine={participantName || "—"}
              locationLine={
                residenceType === "OVERSEAS"
                  ? `${getCountryByCode(selectedCountryCode)?.name || "Overseas"}${overseasCity ? `, ${overseasCity}` : ""}`
                  : [selectedCity, PHILIPPINE_PROVINCES.find((p) => p.id === selectedProvinceId)?.name]
                      .filter(Boolean)
                      .join(", ") || "Pilipinas"
              }
            />

            {errorMessage && (
              <div role="alert" className="flex items-start gap-3 rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-900">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                <div className="min-w-0 flex-1 space-y-2">
                  <p className="font-semibold">Hindi naisumite · Not submitted</p>
                  <p className="text-red-700">{errorMessage}</p>
                  {duplicateIPError ? (
                    <p className="text-xs text-ink-soft">
                      One vote is allowed per internet connection for the whole survey. If you already voted, use your
                      private vote link to change or withdraw it.
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {submitting ? "Sinusubukan muli…" : "Subukan muli · Retry"}
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold text-ink-soft hover:text-ink"
              >
                <ArrowLeft className="h-4 w-4" /> Baguhin ang balota
              </button>
              <button
                disabled={submitting}
                onClick={handleSubmit}
                className="flex items-center gap-2 rounded-md bg-[#CE1126] px-7 py-3 text-sm font-semibold text-white hover:bg-[#b00e20] disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Isinusumite…
                  </>
                ) : (
                  <>
                    <Vote className="h-4 w-4" /> Isumite ang boto
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Confirmation */}
        {step === 6 && submissionResult && (
          <div className="bg-white rounded-2xl border border-line p-4 sm:p-10 shadow-sm text-center space-y-6 animate-in zoom-in-95 duration-200 font-sans">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-300">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                SURVEY RESPONSE RECORDED
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink mt-1 break-words">
                Thank You, {submissionResult.participantName}!
              </h2>
              <p className="text-xs text-ink-soft font-sans mt-1 max-w-md mx-auto leading-relaxed">
                Your vote has been verified and securely recorded under survey integrity rules. It is
                now officially included in active public results and Philippine map statistics.
              </p>
            </div>

            {/* Management Link Card */}
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 text-left space-y-2.5 font-sans">
              <div className="flex flex-wrap items-center justify-between gap-1.5 font-sans">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  YOUR PRIVATE VOTE MANAGEMENT LINK
                </span>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold uppercase flex-shrink-0">
                  CONFIDENTIAL
                </span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                Bookmark or copy this link. If you change your mind while the survey is active, you can use this
                private link to <strong>modify your selections</strong> or <strong>retract your vote</strong>.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                <input
                  type="text"
                  readOnly
                  value={
                    typeof window !== "undefined"
                      ? `${window.location.origin}/survey/manage/${submissionResult.managementToken}`
                      : ""
                  }
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-amber-300 bg-white font-mono text-ink select-all overflow-x-auto min-h-[44px]"
                />
                <button
                  onClick={copyManagementLink}
                  className="min-h-[44px] px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 flex-shrink-0 transition-colors shadow active:scale-95"
                >
                  <Copy className="w-4 h-4 flex-shrink-0" />
                  <span>{copiedLink ? "Copied Link!" : "Copy Link"}</span>
                </button>
              </div>
            </div>

            {/* Share Your Vote 1080x1350 Banner */}
            <div className="">
              <div className="flex flex-wrap items-center justify-between gap-2 font-sans">
                <div className="flex items-center gap-2 min-w-0">
                  <Vote className="w-5 h-5 text-amber-300 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 truncate">
                    SHARE WHO YOU VOTED FOR (1080×1350)
                  </span>
                </div>
                <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0">
                  VIRAL CAMPAIGN CARD (4:5)
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Generate a premium 1080×1350 (4:5) election card with your candidate&apos;s official colors, live ranking,
                vote tally vs competitors, and an instant voting QR code for your social media.
              </p>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-sans">
                {presidentialChoice && (
                  <button
                    onClick={() => openShareModal(presidentialChoice, "PRESIDENT")}
                    className="p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-left flex items-center justify-between transition-all group min-h-[44px]"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <span className="text-[10px] font-bold text-amber-300 uppercase block">Presidential Choice</span>
                      <span className="text-xs font-bold text-white uppercase group-hover:text-amber-200 truncate block">
                        {candidates.find((c) => c.id === presidentialChoice)?.name || "President"}
                      </span>
                    </div>
                    <Share2 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform flex-shrink-0" />
                  </button>
                )}

                {vicePresidentialChoice && (
                  <button
                    onClick={() => openShareModal(vicePresidentialChoice, "VICE_PRESIDENT")}
                    className="p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-left flex items-center justify-between transition-all group min-h-[44px]"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <span className="text-[10px] font-bold text-amber-300 uppercase block">Vice President Choice</span>
                      <span className="text-xs font-bold text-white uppercase group-hover:text-amber-200 truncate block">
                        {candidates.find((c) => c.id === vicePresidentialChoice)?.name || "Vice President"}
                      </span>
                    </div>
                    <Share2 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform flex-shrink-0" />
                  </button>
                )}
              </div>

              {senatorialChoices.length > 0 && (
                <div className="pt-2 border-t border-white/10">
                  <span className="text-[10px] font-bold text-ink-faint uppercase tracking-wider block mb-2 font-sans">
                    Senatorial Slate ({senatorialChoices.length} candidates) - Click to generate share card:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {senatorialChoices.map((sId) => {
                      const senCand = candidates.find((c) => c.id === sId);
                      if (!senCand) return null;
                      return (
                        <button
                          key={sId}
                          onClick={() => openShareModal(sId, "SENATOR")}
                          className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-amber-400/20 border border-white/10 hover:border-amber-400 text-[11px] font-semibold text-slate-200 hover:text-white flex items-center gap-1 transition-all min-h-[36px]"
                        >
                          <span
                            className="w-2 h-2 rounded-full inline-block flex-shrink-0"
                            style={{ backgroundColor: senCand.color }}
                          ></span>
                          <span className="break-words">{senCand.name}</span>
                          <Share2 className="w-3 h-3 text-amber-400 ml-0.5 flex-shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/survey/manage/${submissionResult.managementToken}`}
                className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-xs font-bold uppercase tracking-wider text-ink hover:bg-slate-50 transition-colors flex items-center justify-center"
              >
                Manage or Retract Vote
              </Link>
              <Link
                href="/results"
                className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl bg-ph-blue text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-800 transition-colors shadow flex items-center justify-center"
              >
                View Live Tallies &rarr;
              </Link>
              <Link
                href="/map"
                className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl bg-[#0B1E36] text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-900 transition-colors shadow flex items-center justify-center"
              >
                Explore Live Map &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* Share 1080x1350 Vote Card Modal */}
        <ShareVoteCardModal
          isOpen={!!shareCandidate}
          onClose={() => setShareCandidate(null)}
          candidate={shareCandidate}
          competitors={shareCompetitors}
          voterName={participantName}
          provinceName={
            residenceType === "OVERSEAS"
              ? `${getCountryByCode(selectedCountryCode)?.flag || "🌐"} ${
                  getCountryByCode(selectedCountryCode)?.name || "Overseas"
                } (OFW)`
              : PHILIPPINE_PROVINCES.find((p) => p.id === selectedProvinceId)?.name || ""
          }
        />
      </div>
    </div>
  );
}
