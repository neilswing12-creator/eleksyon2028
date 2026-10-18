"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowLeft,
  Calendar,
  MapPin,
  Vote,
  ExternalLink,
} from "lucide-react";

export default function ManageVotePage() {
  const params = useParams();
  const token = params.token as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState<any>(null);
  const [error, setError] = useState("");
  const [retracting, setRetracting] = useState(false);
  const [retractSuccess, setRetractSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    async function loadSubmission() {
      try {
        const res = await fetch(`/api/survey/manage/${token}`);
        if (!res.ok) {
          const errData = await res.json();
          setError(errData.error || "Submission not found.");
          return;
        }
        const data = await res.json();
        setSubmission(data.submission);
      } catch (e) {
        setError("Network error fetching submission.");
      } finally {
        setLoading(false);
      }
    }
    if (token) {
      loadSubmission();
    }
  }, [token]);

  const handleRetract = async () => {
    setRetracting(true);
    try {
      const res = await fetch(`/api/survey/manage/${token}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const d = await res.json();
        alert(d.error || "Failed to retract vote.");
        return;
      }

      setRetractSuccess(true);
      setShowConfirmModal(false);
      setSubmission((prev: any) => ({
        ...prev,
        status: "RETRACTED",
        retractedAt: new Date().toISOString(),
      }));
    } catch (e) {
      alert("Error retracting vote.");
    } finally {
      setRetracting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-brand-slate font-medium">Validating private token...</p>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-brand-border p-8 max-w-md w-full text-center space-y-4 shadow-card">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-brand-navy">Invalid Recovery Link</h2>
          <p className="text-xs text-brand-slate leading-relaxed">
            {error || "The private token provided does not match any active or historical survey record."}
          </p>
          <div className="pt-2">
            <Link
              href="/survey"
              className="inline-block px-5 py-2.5 rounded-xl bg-brand-blue text-white text-xs font-bold shadow-sm hover:bg-blue-700"
            >
              Return to Survey
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const presSelection = submission.selections?.find((s: any) => s.position === "PRESIDENT");
  const vpSelection = submission.selections?.find((s: any) => s.position === "VICE_PRESIDENT");
  const senSelections = submission.selections?.filter((s: any) => s.position === "SENATOR") || [];

  return (
    <div className="min-h-screen bg-brand-light py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/results"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-slate hover:text-brand-navy"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Live Results</span>
          </Link>
          <span className="text-[11px] text-slate-400 font-mono">Token: {token.slice(0, 10)}...</span>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-border">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-slate">
                Private Vote Management Record
              </div>
              <h1 className="text-2xl font-black text-brand-navy mt-1">
                {submission.participantName}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-xs text-brand-slate">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(submission.createdAt).toLocaleDateString()}
                </span>
                {submission.provinceName && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {submission.provinceName}
                  </span>
                )}
              </div>
            </div>

            {/* Status Pill */}
            <div>
              {submission.status === "ACTIVE" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Active &amp; Counted</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold">
                  <RotateCcw className="w-4 h-4" />
                  <span>Retracted (Excluded)</span>
                </span>
              )}
            </div>
          </div>

          {/* Success Retraction Banner */}
          {retractSuccess && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Vote Successfully Retracted</p>
                <p className="text-amber-800 mt-0.5">
                  Your survey response has been withdrawn. It has been excluded from all public candidate
                  rankings, percentages, and Philippine map statistics.
                </p>
              </div>
            </div>
          )}

          {/* Recorded Selections */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-brand-navy uppercase tracking-wider">
              Recorded Survey Selections
            </h3>

            {/* President */}
            <div className="p-4 rounded-xl border border-brand-border bg-slate-50/50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-brand-slate">President</span>
                {presSelection ? (
                  <div className="flex items-center gap-2.5 mt-1">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: presSelection.candidate.color }}
                    ></span>
                    <span className="font-bold text-sm text-brand-navy">
                      {presSelection.candidate.name}
                    </span>
                    <span className="text-xs text-brand-slate">({presSelection.candidate.party})</span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic mt-1">No selection recorded</p>
                )}
              </div>
            </div>

            {/* Vice President */}
            <div className="p-4 rounded-xl border border-brand-border bg-slate-50/50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-brand-slate">Vice President</span>
                {vpSelection ? (
                  <div className="flex items-center gap-2.5 mt-1">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: vpSelection.candidate.color }}
                    ></span>
                    <span className="font-bold text-sm text-brand-navy">
                      {vpSelection.candidate.name}
                    </span>
                    <span className="text-xs text-brand-slate">({vpSelection.candidate.party})</span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic mt-1">No selection recorded</p>
                )}
              </div>
            </div>

            {/* Senators */}
            <div className="p-4 rounded-xl border border-brand-border bg-slate-50/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase text-brand-slate">
                  Senatorial Slate ({senSelections.length} selected)
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {senSelections.map((s: any) => (
                  <span
                    key={s.candidate.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-brand-navy shadow-sm"
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: s.candidate.color }}
                    ></span>
                    <span>{s.candidate.name}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="pt-4 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <Link
              href="/map"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-brand-border text-xs font-bold text-brand-slate hover:text-brand-navy text-center transition-colors"
            >
              Explore Map
            </Link>

            {submission.status === "ACTIVE" ? (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Retract My Vote</span>
              </button>
            ) : (
              <Link
                href="/survey"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <Vote className="w-4 h-4" />
                <span>Submit New Survey Response</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Retraction Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-brand-border p-6 max-w-md w-full shadow-elevated space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-brand-navy">Confirm Vote Retraction</h3>
              <p className="text-xs text-brand-slate mt-1 leading-relaxed">
                Are you sure you want to retract your survey response? This action will immediately remove your
                vote from all candidate rankings, percentage totals, and live geographic maps.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="w-1/2 px-4 py-2.5 rounded-xl border border-brand-border text-xs font-bold text-brand-slate hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={retracting}
                onClick={handleRetract}
                className="w-1/2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                {retracting ? "Retracting..." : "Yes, Retract"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
