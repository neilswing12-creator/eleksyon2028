"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Users,
  Settings,
  BookOpen,
  FileText,
  Lock,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  LogOut,
  Palette,
  Eye,
  Archive,
  Copy,
  BarChart2,
  Sliders,
  ArrowUp,
  ArrowDown,
  Upload,
  Image as ImageIcon,
  X,
  Clock,
  MapPin,
  Globe,
  History,
  Shield,
  ShieldCheck,
  Play,
  Pause,
  XCircle,
  HelpCircle,
  Check,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { PHILIPPINE_PROVINCES, PHILIPPINE_REGIONS } from "@/lib/philippines-geo";

export default function AdminPage() {
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // Active Tab: SURVEY_MGMT | ADJUSTMENTS | CANDIDATES | PLATFORMS | SETTINGS | LOGS
  const [activeTab, setActiveTab] = useState<
    "SURVEY_MGMT" | "ADJUSTMENTS" | "CANDIDATES" | "PLATFORMS" | "SETTINGS" | "LOGS"
  >("SURVEY_MGMT");

  // Admin Data State
  const [candidates, setCandidates] = useState<any[]>([]);
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [campaign, setCampaign] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [adjustments, setAdjustments] = useState<any[]>([]);
  const [candidateSummaries, setCandidateSummaries] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modals & Action States
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [candidateForm, setCandidateForm] = useState<any>({
    id: null,
    name: "",
    slug: "",
    position: "PRESIDENT",
    party: "",
    color: "#1455D9",
    photoUrl: "",
    bio: "",
    officialWebsite: "",
    socialLinks: "",
    displayOrder: 1,
    educations: [] as string[],
    publicServices: [] as string[],
    platforms: [] as any[],
    sources: [] as any[],
    lastVerifiedAt: "",
    newEduInput: "",
    newServiceInput: "",
    newSourceTitle: "",
    newSourceUrl: "",
    newSourceCategory: "GENERAL",
    newSourcePublisher: "",
  });

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [platformForm, setPlatformForm] = useState<any>({
    id: null,
    candidateId: "",
    title: "",
    description: "",
    category: "ECONOMY",
    sourceUrl: "",
    verificationStatus: "VERIFIED",
  });

  // Manual Adjustment Form State
  const [adjustmentForm, setAdjustmentForm] = useState({
    candidateId: "",
    category: "PRESIDENT",
    amount: 0,
    reason: "",
    geographicScope: "NATIONAL",
    regionId: "",
    provinceId: "",
  });
  const [showAdjustmentConfirmModal, setShowAdjustmentConfirmModal] = useState(false);
  const [submittingAdjustment, setSubmittingAdjustment] = useState(false);

  // Reversal Modal State
  const [reversalTarget, setReversalTarget] = useState<any | null>(null);
  const [reversalReason, setReversalReason] = useState("");
  const [submittingReversal, setSubmittingReversal] = useState(false);

  // Consequential Survey Status Confirm Modal
  const [statusChangeTarget, setStatusChangeTarget] = useState<"ACTIVE" | "PAUSED" | "CLOSED" | null>(null);

  const isAnalyst = adminUser?.role === "ANALYST";

  // Verify Admin Session on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/auth");
        if (res.ok) {
          const data = await res.json();
          setAdminUser(data.admin);
          loadAdminData();
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const loadAdminData = async () => {
    try {
      const [candRes, platRes, campRes, logsRes, adjRes, analyticsRes] = await Promise.all([
        fetch("/api/admin/candidates"),
        fetch("/api/admin/platforms"),
        fetch("/api/admin/campaign"),
        fetch("/api/admin/logs"),
        fetch("/api/admin/adjustments"),
        fetch("/api/analytics"),
      ]);

      if (candRes.ok) setCandidates((await candRes.json()).candidates || []);
      if (platRes.ok) setPlatforms((await platRes.json()).platforms || []);
      if (campRes.ok) setCampaign((await campRes.json()).campaign);
      if (logsRes.ok) setAuditLogs((await logsRes.json()).logs || []);
      if (adjRes.ok) {
        const adjData = await adjRes.json();
        setAdjustments(adjData.adjustments || []);
        setCandidateSummaries(adjData.candidateSummaries || []);
      }
      if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
    } catch (e) {
      console.error("Error loading admin data:", e);
    }
  };

  const showNotify = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Login failed.");
        setLoggingIn(false);
        return;
      }

      setAdminUser(data.admin);
      loadAdminData();
    } catch (err) {
      setLoginError("Network connection error.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    document.cookie = "admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    setAdminUser(null);
  };

  // Direct Photo Upload Handler
  const handlePhotoUpload = async (file: File) => {
    setUploadingPhoto(true);
    setUploadError("");

    try {
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Image file size exceeds the 5 MB limit.");
        setUploadingPhoto(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      if (candidateForm.photoUrl) {
        formData.append("oldPhotoUrl", candidateForm.photoUrl);
      }

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || "Failed to upload image.");
        return;
      }

      setCandidateForm((prev: any) => ({
        ...prev,
        photoUrl: data.url,
      }));
      showNotify("success", "Photograph uploaded successfully.");
    } catch (err: any) {
      setUploadError("Network error while uploading photo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Education list editor handlers
  const handleAddEducation = () => {
    if (!candidateForm.newEduInput?.trim()) return;
    setCandidateForm((prev: any) => ({
      ...prev,
      educations: [...prev.educations, prev.newEduInput.trim()],
      newEduInput: "",
    }));
  };

  const handleRemoveEducation = (index: number) => {
    setCandidateForm((prev: any) => ({
      ...prev,
      educations: prev.educations.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleMoveEducation = (index: number, direction: "up" | "down") => {
    setCandidateForm((prev: any) => {
      const arr = [...prev.educations];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= arr.length) return prev;
      const temp = arr[index];
      arr[index] = arr[target];
      arr[target] = temp;
      return { ...prev, educations: arr };
    });
  };

  // Public Service list editor handlers
  const handleAddPublicService = () => {
    if (!candidateForm.newServiceInput?.trim()) return;
    setCandidateForm((prev: any) => ({
      ...prev,
      publicServices: [...prev.publicServices, prev.newServiceInput.trim()],
      newServiceInput: "",
    }));
  };

  const handleRemovePublicService = (index: number) => {
    setCandidateForm((prev: any) => ({
      ...prev,
      publicServices: prev.publicServices.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleMovePublicService = (index: number, direction: "up" | "down") => {
    setCandidateForm((prev: any) => {
      const arr = [...prev.publicServices];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= arr.length) return prev;
      const temp = arr[index];
      arr[index] = arr[target];
      arr[target] = temp;
      return { ...prev, publicServices: arr };
    });
  };

  // Candidate Source list editor handlers
  const handleAddSource = () => {
    if (!candidateForm.newSourceTitle?.trim() || !candidateForm.newSourceUrl?.trim()) {
      alert("Source title and URL are required.");
      return;
    }
    const newSrc = {
      title: candidateForm.newSourceTitle.trim(),
      url: candidateForm.newSourceUrl.trim(),
      category: candidateForm.newSourceCategory || "GENERAL",
      publisher: candidateForm.newSourcePublisher?.trim() || "",
      verificationStatus: "VERIFIED",
    };
    setCandidateForm((prev: any) => ({
      ...prev,
      sources: [...(prev.sources || []), newSrc],
      newSourceTitle: "",
      newSourceUrl: "",
      newSourcePublisher: "",
    }));
  };

  const handleRemoveSource = (index: number) => {
    setCandidateForm((prev: any) => {
      const arr = [...(prev.sources || [])];
      arr.splice(index, 1);
      return { ...prev, sources: arr };
    });
  };

  // Candidate Save
  const handleSaveCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnalyst) return;

    const isEdit = !!candidateForm.id;
    const method = isEdit ? "PUT" : "POST";

    const payload = {
      id: candidateForm.id,
      name: candidateForm.name,
      slug: candidateForm.slug,
      position: candidateForm.position,
      party: candidateForm.party,
      color: candidateForm.color,
      photoUrl: candidateForm.photoUrl ? candidateForm.photoUrl.trim() : "",
      bio: candidateForm.bio,
      officialWebsite: candidateForm.officialWebsite ? candidateForm.officialWebsite.trim() : "",
      socialLinks: candidateForm.socialLinks,
      displayOrder: candidateForm.displayOrder,
      isPublished: candidateForm.isPublished !== false,
      educations: candidateForm.educations || [],
      publicServices: candidateForm.publicServices || [],
      platforms: candidateForm.platforms || [],
      sources: candidateForm.sources || [],
      lastVerifiedAt: candidateForm.lastVerifiedAt || new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/admin/candidates", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setShowCandidateModal(false);
        const syncMsg =
          data.syncedSiblingsCount > 0
            ? ` (automatically synchronized across ${data.syncedSiblingsCount + 1} ballot positions)`
            : "";
        showNotify("success", `Candidate ${candidateForm.name} saved successfully${syncMsg}.`);
        loadAdminData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save candidate.");
      }
    } catch (err) {
      console.error("Save candidate error:", err);
      alert("Network or server error while saving candidate.");
    }
  };

  // Candidate Archive
  const handleArchiveCandidate = async (id: string, name: string) => {
    if (isAnalyst) return;
    if (!confirm(`Are you sure you want to unpublish/archive ${name}? Historical survey votes will be safely preserved.`)) {
      return;
    }

    const res = await fetch(`/api/admin/candidates?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      showNotify("success", `Candidate ${name} archived.`);
      loadAdminData();
    } else {
      alert("Failed to archive candidate.");
    }
  };

  // Add candidate to another position (Survey multi-position entry)
  const handleAddCandidateToPosition = (c: any, targetPosition: string) => {
    const posSuffix = targetPosition === "PRESIDENT" ? "pres" : targetPosition === "VICE_PRESIDENT" ? "vp" : "sen";
    const baseSlug = c.slug.replace(/-(pres|vp|sen)$/, "");
    const newSlug = `${baseSlug}-${posSuffix}`;

    // Cleanly copy platforms without old candidate IDs
    const copiedPlatforms = (c.platforms || []).map((p: any) => ({
      title: p.title,
      description: p.description,
      category: p.category,
      sourceUrl: p.sourceUrl,
      sourceTitle: p.sourceTitle,
      sourceType: p.sourceType,
      publicationDate: p.publicationDate,
      verificationStatus: p.verificationStatus,
      verifiedAt: p.verifiedAt,
    }));

    // Cleanly copy sources and citations without old candidate IDs
    const copiedSources = (c.sources || []).map((s: any) => ({
      category: s.category,
      title: s.title,
      url: s.url,
      publisher: s.publisher,
      publicationDate: s.publicationDate,
      verificationStatus: s.verificationStatus,
      notes: s.notes,
      displayOrder: s.displayOrder,
    }));

    setCandidateForm({
      id: null, // New candidate entry
      name: c.name,
      slug: newSlug,
      position: targetPosition,
      party: c.party || "",
      color: c.color || "#1455D9",
      photoUrl: c.photoUrl || "",
      bio: c.bio || "",
      officialWebsite: c.officialWebsite || "",
      socialLinks: c.socialLinks || "",
      displayOrder: (candidates?.length || 0) + 1,
      isPublished: true,
      educations: c.educations?.map((e: any) => (typeof e === "string" ? e : e.degree)) || [],
      publicServices: c.publicServices?.map((s: any) => (typeof s === "string" ? s : s.position)) || [],
      platforms: copiedPlatforms,
      sources: copiedSources,
      lastVerifiedAt: c.lastVerifiedAt || new Date().toISOString(),
      newEduInput: "",
      newServiceInput: "",
      newSourceTitle: "",
      newSourceUrl: "",
      newSourceCategory: "GENERAL",
      newSourcePublisher: "",
    });
    setShowCandidateModal(true);
    showNotify("success", `Ready to add ${c.name} as ${targetPosition.replace("_", " ")} (${copiedPlatforms.length} platforms and ${copiedSources.length} citations copied). Click 'Save Candidate' to confirm.`);
  };

  // Platform Save
  const handleSavePlatform = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnalyst) return;

    const isEdit = !!platformForm.id;
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch("/api/admin/platforms", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(platformForm),
    });

    if (res.ok) {
      setShowPlatformModal(false);
      showNotify("success", "Platform proposal saved.");
      loadAdminData();
    } else {
      const err = await res.json();
      alert(err.error || "Failed to save platform.");
    }
  };

  const handleDeletePlatform = async (id: string) => {
    if (isAnalyst) return;
    if (!confirm("Are you sure you want to delete this policy platform?")) return;

    const res = await fetch(`/api/admin/platforms?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      showNotify("success", "Platform deleted.");
      loadAdminData();
    }
  };

  // Campaign Save
  const handleSaveCampaign = async (customSettings?: any) => {
    if (isAnalyst) return;
    const payload = customSettings || campaign;

    const res = await fetch("/api/admin/campaign", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      setCampaign(data.campaign);
      showNotify("success", "Survey campaign configuration updated.");
      loadAdminData();
    } else {
      const err = await res.json();
      alert(err.error || "Failed to update campaign configuration.");
    }
  };

  // Survey Status Change Handler with Confirmation
  const executeStatusChange = async (newStatus: "ACTIVE" | "PAUSED" | "CLOSED") => {
    if (isAnalyst) return;
    await handleSaveCampaign({ ...campaign, status: newStatus });
    setStatusChangeTarget(null);
  };

  // Manual Adjustment Submission Handler
  const handleConfirmAdjustment = async () => {
    if (isAnalyst) return;
    setSubmittingAdjustment(true);

    try {
      const res = await fetch("/api/admin/adjustments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adjustmentForm),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to record manual adjustment.");
        return;
      }

      setShowAdjustmentConfirmModal(false);
      setAdjustmentForm({
        candidateId: "",
        category: "PRESIDENT",
        amount: 0,
        reason: "",
        geographicScope: "NATIONAL",
        regionId: "",
        provinceId: "",
      });
      showNotify("success", `Adjustment of ${data.newTotal - data.previousTotal} votes applied successfully.`);
      loadAdminData();
    } catch (e: any) {
      alert("Network error submitting adjustment.");
    } finally {
      setSubmittingAdjustment(false);
    }
  };

  // Reversal Submission Handler
  const handleConfirmReversal = async () => {
    if (isAnalyst || !reversalTarget) return;
    setSubmittingReversal(true);

    try {
      const res = await fetch("/api/admin/adjustments/reverse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adjustmentId: reversalTarget.id,
          reason: reversalReason,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to reverse adjustment.");
        return;
      }

      setReversalTarget(null);
      setReversalReason("");
      showNotify("success", `Adjustment reversed. Restored count to ${data.restoredTotal}.`);
      loadAdminData();
    } catch (e: any) {
      alert("Network error reversing adjustment.");
    } finally {
      setSubmittingReversal(false);
    }
  };

  // Selected candidate preview details for adjustment form
  const selectedCandidateForAdjustment = candidates.find((c) => c.id === adjustmentForm.candidateId);
  const selectedCandidateSummary = candidateSummaries.find((c) => c.id === adjustmentForm.candidateId);
  const currentDisplayedVotes = selectedCandidateSummary?.displayedTotal ?? 0;
  const proposedNewVotes = currentDisplayedVotes + (adjustmentForm.amount || 0);

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-brand-slate font-medium">Checking administrator credentials...</p>
        </div>
      </div>
    );
  }

  // Not Logged In: Show Admin Login Form
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white rounded-2xl border border-brand-border p-5 sm:p-8 max-w-md w-full shadow-elevated space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-brand-blue text-white flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-brand-navy">Administrator Portal</h1>
            <p className="text-xs text-brand-slate">
              Enter your authorized credentials to manage survey campaigns, candidates, and platforms.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1.5">Admin Email</label>
              <input
                type="email"
                required
                placeholder="admin@survey2028.ph"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1.5">Password</label>
              <input
                type="password"
                required
                placeholder="Enter admin password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-2.5 rounded-xl bg-brand-blue text-white text-xs font-bold shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-all"
            >
              {loggingIn ? "Verifying..." : "Sign In to Admin Portal"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light pb-20">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-2 animate-bounce ${
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-300 text-emerald-900"
              : "bg-red-50 border-red-300 text-red-900"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Admin Broadcast Header */}
      <div className="bg-[#0B132B] text-white py-6 border-b-2 border-gma-red">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <span>2028 National Election Survey Administration</span>
              <span>&bull;</span>
              <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] text-amber-300 font-mono">
                Role: {adminUser.role}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black mt-1 text-white uppercase font-headline">
              Control &amp; Governance Center
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-300 hidden sm:inline font-mono">{adminUser.email}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="bg-white border-b border-brand-border sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none">
          {[
            { id: "SURVEY_MGMT", label: "Survey Operations & Overview", icon: BarChart2 },
            { id: "ADJUSTMENTS", label: "Manual Voting Adjustments", icon: Sliders },
            { id: "CANDIDATES", label: "Candidate Profiles & Photos", icon: Users },
            { id: "PLATFORMS", label: "Platforms & Agendas", icon: BookOpen },
            { id: "SETTINGS", label: "Survey Campaign Settings", icon: Settings },
            { id: "LOGS", label: "Audit Logs", icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#004B93] text-white shadow-sm"
                    : "text-brand-slate hover:text-brand-navy hover:bg-slate-100"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Admin Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* ========================================================= */}
        {/* TAB 1: SURVEY OPERATIONS & OVERVIEW                      */}
        {/* ========================================================= */}
        {activeTab === "SURVEY_MGMT" && (
          <div className="space-y-6">
            {/* Survey Status Banner with Consequential Action Controls */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      campaign?.status === "ACTIVE"
                        ? "bg-emerald-500 animate-pulse"
                        : campaign?.status === "PAUSED"
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                  ></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Live Polling State:
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-headline font-bold uppercase tracking-wide ${
                      campaign?.status === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-800"
                        : campaign?.status === "PAUSED"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {campaign?.status || "ACTIVE"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {campaign?.status === "ACTIVE" && "Accepting verified survey submissions nationwide."}
                  {campaign?.status === "PAUSED" && "Submissions are temporarily paused. Public tallies remain visible."}
                  {campaign?.status === "CLOSED" && "The survey campaign is closed. No new responses are accepted."}
                </p>
              </div>

              {/* Status Toggles (Disabled for Analysts) */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  disabled={isAnalyst || campaign?.status === "ACTIVE"}
                  onClick={() => setStatusChangeTarget("ACTIVE")}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Open Survey</span>
                </button>
                <button
                  disabled={isAnalyst || campaign?.status === "PAUSED"}
                  onClick={() => setStatusChangeTarget("PAUSED")}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Voting</span>
                </button>
                <button
                  disabled={isAnalyst || campaign?.status === "CLOSED"}
                  onClick={() => setStatusChangeTarget("CLOSED")}
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Close Survey</span>
                </button>
              </div>
            </div>

            {/* Real-Time Database Metrics Ticker */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-slate block truncate">
                  Active Submissions
                </span>
                <div className="text-2xl sm:text-3xl font-black text-brand-navy mt-1 tabular-nums">
                  {(analytics?.summary?.totalActiveSubmissions ?? 0).toLocaleString()}
                </div>
                <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Contributing to official tallies</p>
              </div>

              <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-slate block truncate">
                  Retracted Submissions
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-500 mt-1 tabular-nums">
                  {(analytics?.summary?.totalRetractedSubmissions ?? 0).toLocaleString()}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Excluded from tallies</p>
              </div>

              <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-slate block truncate">
                  Today&apos;s Responses
                </span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1 tabular-nums">
                  {(analytics?.summary?.todaySubmissions ?? 0).toLocaleString()}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Last 24 hours</p>
              </div>

              <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-slate block truncate">
                  Approved Adjustments
                </span>
                <div className="text-2xl sm:text-3xl font-black text-brand-blue mt-1 tabular-nums">
                  {adjustments.filter((a) => a.status === "APPROVED").length}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Auditable corrections</p>
              </div>
            </div>

            {/* Presidential & Vice-Presidential Candidate Tallies Table */}
            <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-brand-navy uppercase tracking-wide">
                    National Executive Tallies: Raw vs. Displayed
                  </h3>
                  <p className="text-xs text-brand-slate">
                    Verification of the defined aggregation rule: <code>Displayed Total = Eligible Selections + Approved Adjustments</code>
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  Last Sync: {new Date().toLocaleTimeString()}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[650px]">
                  <thead>
                    <tr className="border-b border-brand-border text-slate-400 uppercase text-[10px] tracking-wider">
                      <th className="py-2.5 px-3">Candidate</th>
                      <th className="py-2.5 px-3">Position</th>
                      <th className="py-2.5 px-3 text-right">Raw Participant Votes</th>
                      <th className="py-2.5 px-3 text-right">Admin Adjustments</th>
                      <th className="py-2.5 px-3 text-right">Displayed Total</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {candidateSummaries
                      .filter((c) => c.position !== "SENATOR")
                      .map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 font-bold text-brand-navy flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: c.color }}
                            ></span>
                            <span>{c.name}</span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 font-semibold">{c.position.replace("_", " ")}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-700">
                            {c.rawVotes.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold">
                            {c.adjustmentAmount !== 0 ? (
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] ${
                                  c.adjustmentAmount > 0
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {c.adjustmentAmount > 0 ? `+${c.adjustmentAmount}` : c.adjustmentAmount}
                              </span>
                            ) : (
                              <span className="text-slate-400">&plusmn;0</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-black text-brand-navy text-sm">
                            {c.displayedTotal.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {c.hasAdjustments ? (
                              <span className="px-2 py-0.5 rounded bg-blue-50 text-brand-blue text-[10px] font-bold">
                                Adjusted
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                                Organic
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Senatorial Selections Table */}
            <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-4">
              <h3 className="text-base font-bold text-brand-navy uppercase tracking-wide">
                Senatorial Slate Selections (Magic 12 &amp; Contenders)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[650px]">
                  <thead>
                    <tr className="border-b border-brand-border text-slate-400 uppercase text-[10px] tracking-wider">
                      <th className="py-2.5 px-3">Candidate</th>
                      <th className="py-2.5 px-3 text-right">Raw Ballot Selections</th>
                      <th className="py-2.5 px-3 text-right">Approved Adjustments</th>
                      <th className="py-2.5 px-3 text-right">Final Displayed Count</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {candidateSummaries
                      .filter((c) => c.position === "SENATOR")
                      .map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 font-bold text-brand-navy flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: c.color }}
                            ></span>
                            <span>{c.name}</span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-700">
                            {c.rawVotes.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold">
                            {c.adjustmentAmount !== 0 ? (
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] ${
                                  c.adjustmentAmount > 0
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {c.adjustmentAmount > 0 ? `+${c.adjustmentAmount}` : c.adjustmentAmount}
                              </span>
                            ) : (
                              <span className="text-slate-400">&plusmn;0</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-black text-brand-navy text-sm">
                            {c.displayedTotal.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {c.hasAdjustments ? (
                              <span className="px-2 py-0.5 rounded bg-blue-50 text-brand-blue text-[10px] font-bold">
                                Adjusted
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                                Organic
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: MANUAL VOTING ADJUSTMENTS & AUDIT HISTORY          */}
        {/* ========================================================= */}
        {activeTab === "ADJUSTMENTS" && (
          <div className="space-y-6">
            {/* Header & Explanation */}
            <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-2">
              <div className="flex items-center gap-2 text-brand-blue">
                <Sliders className="w-5 h-5" />
                <h2 className="text-lg font-bold text-brand-navy">Manual Voting Count Adjustments</h2>
              </div>
              <p className="text-xs text-brand-slate leading-relaxed">
                Authorized administrators can enter auditable count adjustments to correct survey counts. Original
                participant submissions remain completely untouched and immutable. All adjustments are transparently
                aggregated and logged with reasons, timestamps, and administrator references.
              </p>
            </div>

            {/* New Adjustment Entry Form */}
            <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-6">
              <h3 className="text-sm font-bold text-brand-navy uppercase tracking-wider">
                Create Auditable Count Adjustment
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1.5">
                      Select Affected Candidate <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={adjustmentForm.candidateId}
                      onChange={(e) => {
                        const cand = candidates.find((c) => c.id === e.target.value);
                        setAdjustmentForm({
                          ...adjustmentForm,
                          candidateId: e.target.value,
                          category: cand?.position || "PRESIDENT",
                        });
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-blue/30 bg-white"
                    >
                      <option value="">-- Choose Candidate --</option>
                      {candidates.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.position}) &bull; {c.party || "Ind"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1.5">
                      Adjustment Amount (+ or -) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="1"
                      placeholder="e.g. +50 or -25"
                      value={adjustmentForm.amount || ""}
                      onChange={(e) =>
                        setAdjustmentForm({ ...adjustmentForm, amount: parseInt(e.target.value, 10) || 0 })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-blue/30"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Enter a positive value to increment count, or negative value to decrement count.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1.5">
                      Geographic Scope
                    </label>
                    <select
                      value={adjustmentForm.geographicScope}
                      onChange={(e) => {
                        const scope = e.target.value;
                        setAdjustmentForm({
                          ...adjustmentForm,
                          geographicScope: scope,
                          provinceId: "",
                          regionId: "",
                        });
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-blue/30 bg-white"
                    >
                      <option value="NATIONAL">National Level (Aggregated nationally, no area alteration)</option>
                      <option value="REGION">Specific Region (Alters regional maps & child provinces)</option>
                      <option value="PROVINCE">Specific Province (Alters provincial map & parent region)</option>
                    </select>
                  </div>

                  {adjustmentForm.geographicScope === "REGION" && (
                    <div>
                      <label className="block text-xs font-bold text-brand-navy mb-1.5">
                        Select Target Region
                      </label>
                      <select
                        value={adjustmentForm.regionId}
                        onChange={(e) => {
                          const rId = e.target.value;
                          const provsInReg = PHILIPPINE_PROVINCES.filter((p) => p.regionId === rId);
                          setAdjustmentForm({
                            ...adjustmentForm,
                            regionId: rId,
                            provinceId: provsInReg.length === 1 ? provsInReg[0].id : "",
                          });
                        }}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-blue/30 bg-white"
                      >
                        <option value="">-- Choose Region --</option>
                        {PHILIPPINE_REGIONS.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.code} &bull; {r.name} ({r.islandGroup})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {adjustmentForm.geographicScope === "PROVINCE" && (
                    <div>
                      <label className="block text-xs font-bold text-brand-navy mb-1.5">
                        Select Target Province
                      </label>
                      <select
                        value={adjustmentForm.provinceId}
                        onChange={(e) => {
                          const pId = e.target.value;
                          const prov = PHILIPPINE_PROVINCES.find((p) => p.id === pId);
                          setAdjustmentForm({
                            ...adjustmentForm,
                            provinceId: pId,
                            regionId: prov?.regionId || "",
                          });
                        }}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-blue/30 bg-white"
                      >
                        <option value="">-- Choose Province --</option>
                        {PHILIPPINE_PROVINCES.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.islandGroup})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1.5">
                      Justified Reason for Adjustment <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Document verified reason for this count correction..."
                      value={adjustmentForm.reason}
                      onChange={(e) => setAdjustmentForm({ ...adjustmentForm, reason: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-blue/30"
                    ></textarea>
                  </div>
                </div>

                {/* Live Preview Card Before Confirming */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                      <Eye className="w-4 h-4 text-brand-blue" />
                      <span className="font-headline font-bold text-xs uppercase tracking-wide text-brand-navy">
                        Live Adjustment Preview
                      </span>
                    </div>

                    {selectedCandidateForAdjustment ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span
                            className="w-3.5 h-3.5 rounded-full"
                            style={{ backgroundColor: selectedCandidateForAdjustment.color }}
                          ></span>
                          <div>
                            <div className="font-bold text-sm text-brand-navy">
                              {selectedCandidateForAdjustment.name}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {selectedCandidateForAdjustment.position.replace("_", " ")} &bull;{" "}
                              {selectedCandidateForAdjustment.party || "Ind"}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="p-3 rounded-xl bg-white border border-slate-200">
                            <span className="text-[10px] text-slate-500 font-bold uppercase block">
                              Current Displayed
                            </span>
                            <span className="font-mono font-bold text-lg text-slate-800">
                              {currentDisplayedVotes.toLocaleString()}
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-white border border-slate-200">
                            <span className="text-[10px] text-slate-500 font-bold uppercase block">
                              Proposed New Total
                            </span>
                            <span
                              className={`font-mono font-bold text-lg ${
                                proposedNewVotes < 0 ? "text-red-600" : "text-brand-blue"
                              }`}
                            >
                              {proposedNewVotes.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {proposedNewVotes < 0 && (
                          <div className="p-3 rounded-xl bg-red-100 text-red-800 text-xs flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                            <span>Invalid: Displayed total cannot become negative.</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic py-6 text-center">
                        Select a candidate to view before and after count calculations.
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      disabled={
                        isAnalyst ||
                        !adjustmentForm.candidateId ||
                        !adjustmentForm.reason.trim() ||
                        adjustmentForm.amount === 0 ||
                        proposedNewVotes < 0
                      }
                      onClick={() => setShowAdjustmentConfirmModal(true)}
                      className="w-full py-2.5 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-40 transition-colors shadow-sm"
                    >
                      Review &amp; Confirm Adjustment &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Adjustment History Table */}
            <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-brand-blue" />
                  <h3 className="text-sm font-bold text-brand-navy uppercase tracking-wider">
                    Administrative Adjustment History
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {adjustments.length} total adjustment record{adjustments.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead>
                    <tr className="border-b border-brand-border text-slate-400 uppercase text-[10px] tracking-wider">
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3">Candidate</th>
                      <th className="py-2.5 px-3">Scope</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                      <th className="py-2.5 px-3">Reason</th>
                      <th className="py-2.5 px-3">Administrator</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {adjustments.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-xs text-slate-400 italic">
                          No manual adjustments recorded. All survey results reflect 100% organic participant votes.
                        </td>
                      </tr>
                    ) : (
                      adjustments.map((adj) => (
                        <tr key={adj.id} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                            {new Date(adj.createdAt).toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-brand-navy">
                            {adj.candidate?.name || "Unknown"}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 font-mono text-[10px]">
                            {adj.provinceId ? `Province: ${adj.provinceId}` : "National"}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] ${
                                adj.amount > 0 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {adj.amount > 0 ? `+${adj.amount}` : adj.amount}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 max-w-xs truncate" title={adj.reason}>
                            {adj.reason}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[10px] text-slate-500">{adj.adminEmail}</td>
                          <td className="py-2.5 px-3 text-center">
                            {adj.status === "APPROVED" ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                Active
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-600 text-[10px] font-bold">
                                Reversed
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {adj.status === "APPROVED" && (
                              <button
                                disabled={isAnalyst}
                                onClick={() => {
                                  setReversalTarget(adj);
                                  setReversalReason(`Reversal of adjustment: ${adj.reason}`);
                                }}
                                className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] transition-colors"
                              >
                                Reverse
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: CANDIDATE PROFILE MANAGEMENT                       */}
        {/* ========================================================= */}
        {activeTab === "CANDIDATES" && (
          <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-brand-navy">Candidate Profiles &amp; Photographs</h2>
                <p className="text-xs text-brand-slate">
                  Manage candidates, upload high-resolution photographs to the server, and curate structured education
                  and public service records.
                </p>
              </div>
              <button
                disabled={isAnalyst}
                onClick={() => {
                  setCandidateForm({
                    id: null,
                    name: "",
                    slug: "",
                    position: "PRESIDENT",
                    party: "",
                    color: "#1455D9",
                    photoUrl: "",
                    bio: "",
                    officialWebsite: "",
                    socialLinks: "",
                    displayOrder: candidates.length + 1,
                    platforms: [],
                    sources: [],
                    lastVerifiedAt: "",
                    newEduInput: "",
                    newServiceInput: "",
                    newSourceTitle: "",
                    newSourceUrl: "",
                    newSourceCategory: "GENERAL",
                    newSourcePublisher: "",
                  });
                  setShowCandidateModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-brand-blue text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-blue-700 disabled:opacity-40 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Candidate</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[750px]">
                <thead>
                  <tr className="border-b border-brand-border text-brand-slate uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">Candidate</th>
                    <th className="py-3 px-3">Position</th>
                    <th className="py-3 px-3">Party</th>
                    <th className="py-3 px-3">Assigned Map Color</th>
                    <th className="py-3 px-3">Education</th>
                    <th className="py-3 px-3">Public Service</th>
                    <th className="py-3 px-3">Platforms</th>
                    <th className="py-3 px-3">Sources</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {candidates.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          {c.photoUrl ? (
                            <img
                              src={c.photoUrl}
                              alt={c.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-[10px]">
                              {c.name.slice(0, 2)}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-brand-navy block">{c.name}</span>
                            <span className="text-[10px] font-mono text-slate-400">/{c.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700">
                        {c.position.replace("_", " ")}
                      </td>
                      <td className="py-3 px-3 text-brand-slate">{c.party || "Independent"}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full border border-slate-300 shadow-sm"
                            style={{ backgroundColor: c.color }}
                          ></span>
                          <span className="font-mono text-slate-600 text-[11px] font-bold">{c.color}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-brand-blue font-bold text-[11px]">
                          {c.educations?.length || 0} entries
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[11px]">
                          {c.publicServices?.length || 0} positions
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold text-[11px]">
                          {c.platforms?.length || 0} agendas
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold text-[11px] inline-flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-purple-600" />
                          <span>{c.sources?.length || 0} sources</span>
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {c.isPublished ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            Published
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                            Archived
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right space-x-2">
                        <button
                          disabled={isAnalyst}
                          onClick={() => {
                            setCandidateForm({
                              ...c,
                              platforms: c.platforms || [],
                              educations: c.educations?.map((e: any) => e.degree) || [],
                              publicServices: c.publicServices?.map((s: any) => s.position) || [],
                              sources: c.sources || [],
                              lastVerifiedAt: c.lastVerifiedAt || "",
                              newEduInput: "",
                              newServiceInput: "",
                              newSourceTitle: "",
                              newSourceUrl: "",
                              newSourceCategory: "GENERAL",
                              newSourcePublisher: "",
                            });
                            setShowCandidateModal(true);
                          }}
                          className="p-1 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-30 inline-flex items-center"
                          title="Edit Profile, Photo & Credentials"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {/* Quick Add To Other Position (Survey Multi-Position Support) */}
                        {!isAnalyst && (
                          <span className="inline-flex items-center gap-1 border-l border-slate-200 pl-2">
                            {c.position !== "PRESIDENT" && (
                              <button
                                onClick={() => handleAddCandidateToPosition(c, "PRESIDENT")}
                                className="px-1.5 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-brand-blue text-[10px] font-bold"
                                title={`Add ${c.name} as Presidential survey candidate`}
                              >
                                +Pres
                              </button>
                            )}
                            {c.position !== "VICE_PRESIDENT" && (
                              <button
                                onClick={() => handleAddCandidateToPosition(c, "VICE_PRESIDENT")}
                                className="px-1.5 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold"
                                title={`Add ${c.name} as Vice-Presidential survey candidate`}
                              >
                                +VP
                              </button>
                            )}
                            {c.position !== "SENATOR" && (
                              <button
                                onClick={() => handleAddCandidateToPosition(c, "SENATOR")}
                                className="px-1.5 py-0.5 rounded bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10px] font-bold"
                                title={`Add ${c.name} as Senatorial survey candidate`}
                              >
                                +Senator
                              </button>
                            )}
                          </span>
                        )}
                        {c.isPublished && (
                          <button
                            disabled={isAnalyst}
                            onClick={() => handleArchiveCandidate(c.id, c.name)}
                            className="p-1 rounded hover:bg-red-50 text-red-600 disabled:opacity-30 inline-flex items-center"
                            title="Archive Candidate"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: PLATFORMS & AGENDAS                                */}
        {/* ========================================================= */}
        {activeTab === "PLATFORMS" && (
          <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-brand-navy">Agendas &amp; Platforms Manager</h2>
                <p className="text-xs text-brand-slate">
                  Manage policy proposals, assign policy categories, and maintain verified citations.
                </p>
              </div>
              <button
                disabled={isAnalyst}
                onClick={() => {
                  setPlatformForm({
                    id: null,
                    candidateId: candidates[0]?.id || "",
                    title: "",
                    description: "",
                    category: "ECONOMY",
                    sourceUrl: "",
                    verificationStatus: "VERIFIED",
                  });
                  setShowPlatformModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-brand-blue text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-blue-700 disabled:opacity-40"
              >
                <Plus className="w-4 h-4" />
                <span>Add Platform</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[650px]">
                <thead>
                  <tr className="border-b border-brand-border text-brand-slate uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">Title</th>
                    <th className="py-3 px-3">Candidate</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {platforms.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-bold text-brand-navy max-w-xs">{p.title}</td>
                      <td className="py-3 px-3 font-semibold text-slate-700">
                        {p.candidate?.name || "Unknown"}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-brand-blue font-bold text-[10px]">
                          {p.category.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                          {p.verificationStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right space-x-2">
                        <button
                          disabled={isAnalyst}
                          onClick={() => {
                            setPlatformForm(p);
                            setShowPlatformModal(true);
                          }}
                          className="p-1 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-30"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={isAnalyst}
                          onClick={() => handleDeletePlatform(p.id)}
                          className="p-1 rounded hover:bg-red-50 text-red-600 disabled:opacity-30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: SURVEY CONFIGURATION & CONTROLS                    */}
        {/* ========================================================= */}
        {activeTab === "SETTINGS" && (
          <div className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-6 max-w-3xl">
            <div>
              <h2 className="text-lg font-bold text-brand-navy">Survey Campaign Configuration</h2>
              <p className="text-xs text-brand-slate">
                Control active polling parameters, visibility toggles, and anti-abuse safeguards.
              </p>
            </div>

            {campaign && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveCampaign();
                }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">Campaign Title</label>
                  <input
                    type="text"
                    value={campaign.title || ""}
                    onChange={(e) => setCampaign({ ...campaign, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-blue/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1.5">Scheduled Start Date</label>
                    <input
                      type="datetime-local"
                      value={campaign.startDate ? new Date(campaign.startDate).toISOString().slice(0, 16) : ""}
                      onChange={(e) => setCampaign({ ...campaign, startDate: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1.5">Scheduled Closing Date</label>
                    <input
                      type="datetime-local"
                      value={campaign.endDate ? new Date(campaign.endDate).toISOString().slice(0, 16) : ""}
                      onChange={(e) => setCampaign({ ...campaign, endDate: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border outline-none"
                    />
                  </div>
                </div>

                {/* Visibility Controls */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-xs font-headline font-bold text-brand-navy uppercase block">
                    Public Result Visibility Controls
                  </span>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={campaign.publicResultsVisible ?? true}
                      onChange={(e) => setCampaign({ ...campaign, publicResultsVisible: e.target.checked })}
                      className="rounded text-brand-blue focus:ring-brand-blue w-4 h-4"
                    />
                    <span className="text-xs font-bold text-brand-navy">
                      Enable Public Live Results Display (/results and homepage leaderboards)
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={campaign.geographicResultsVisible ?? true}
                      onChange={(e) => setCampaign({ ...campaign, geographicResultsVisible: e.target.checked })}
                      className="rounded text-brand-blue focus:ring-brand-blue w-4 h-4"
                    />
                    <span className="text-xs font-bold text-brand-navy">
                      Enable Interactive Geographic Heatmap Results (/map)
                    </span>
                  </label>
                </div>

                {/* Category Participation Controls */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-xs font-headline font-bold text-brand-navy uppercase block">
                    Election Category Inclusions
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-brand-navy">
                      <input
                        type="checkbox"
                        checked={campaign.enablePresident ?? true}
                        onChange={(e) => setCampaign({ ...campaign, enablePresident: e.target.checked })}
                        className="rounded text-brand-blue w-4 h-4"
                      />
                      <span>President</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-brand-navy">
                      <input
                        type="checkbox"
                        checked={campaign.enableVicePresident ?? true}
                        onChange={(e) => setCampaign({ ...campaign, enableVicePresident: e.target.checked })}
                        className="rounded text-brand-blue w-4 h-4"
                      />
                      <span>Vice President</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-brand-navy">
                      <input
                        type="checkbox"
                        checked={campaign.enableSenators ?? true}
                        onChange={(e) => setCampaign({ ...campaign, enableSenators: e.target.checked })}
                        className="rounded text-brand-blue w-4 h-4"
                      />
                      <span>Senatorial Slate</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Max Senatorial Selections Allowed (Strict limit: 12)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={campaign.maxSenatorSelections}
                    onChange={(e) =>
                      setCampaign({ ...campaign, maxSenatorSelections: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Minimum Response Threshold for Map Leader Display
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={campaign.minResponseThreshold}
                    onChange={(e) =>
                      setCampaign({ ...campaign, minResponseThreshold: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Areas with fewer active votes will display an &quot;Insufficient Sample&quot; advisory.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Methodology &amp; Disclaimers Notice
                  </label>
                  <textarea
                    rows={3}
                    value={campaign.methodologyDisclaimer || ""}
                    onChange={(e) => setCampaign({ ...campaign, methodologyDisclaimer: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isAnalyst}
                  className="px-6 py-2.5 rounded-xl bg-brand-blue text-white text-xs font-bold shadow-sm hover:bg-blue-700 disabled:opacity-40 transition-colors"
                >
                  Save Campaign Configuration
                </button>
              </form>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: AUDIT LOGS                                         */}
        {/* ========================================================= */}
        {activeTab === "LOGS" && (
          <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-4">
            <h2 className="text-lg font-bold text-brand-navy">Administrative Audit Trail</h2>
            <p className="text-xs text-brand-slate">
              Immutable log of configuration updates, candidate color changes, manual count adjustments, and reversals.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[650px]">
                <thead>
                  <tr className="border-b border-brand-border text-brand-slate uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Admin</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">Details</th>
                    <th className="py-2.5 px-3">IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-brand-navy">{log.adminEmail}</td>
                      <td className="py-2.5 px-3 font-bold text-brand-blue">{log.action}</td>
                      <td className="py-2.5 px-3 text-slate-700">{log.details}</td>
                      <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400">
                        {log.ipAddress || "127.0.0.1"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* CANDIDATE MODAL: DIRECT PHOTO UPLOAD & REPEATABLE LISTS   */}
      {/* ========================================================= */}
      {showCandidateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl border border-brand-border p-5 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-elevated space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-brand-navy">
                {candidateForm.id ? `Edit Candidate: ${candidateForm.name}` : "Add New Candidate"}
              </h3>
              <button
                onClick={() => setShowCandidateModal(false)}
                className="p-1 rounded hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCandidate} noValidate className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-brand-navy mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={candidateForm.name}
                    onChange={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-blue/30"
                  />
                </div>

                <div>
                  <label className="block font-bold text-brand-navy mb-1">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={candidateForm.slug}
                    onChange={(e) => setCandidateForm({ ...candidateForm, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-blue/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-brand-navy mb-1">
                    Election Position
                  </label>
                  <select
                    value={candidateForm.position}
                    onChange={(e) => {
                      const newPos = e.target.value;
                      setCandidateForm((prev: any) => {
                        // Automatically update slug suffix if adding candidate to multiple positions
                        const baseSlug = prev.slug ? prev.slug.replace(/-(pres|vp|sen)$/, "") : "";
                        const posSuffix = newPos === "PRESIDENT" ? "pres" : newPos === "VICE_PRESIDENT" ? "vp" : "sen";
                        return {
                          ...prev,
                          position: newPos,
                          slug: baseSlug ? `${baseSlug}-${posSuffix}` : prev.slug,
                        };
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-brand-border outline-none bg-white font-medium"
                  >
                    <option value="PRESIDENT">President of the Philippines</option>
                    <option value="VICE_PRESIDENT">Vice President of the Philippines</option>
                    <option value="SENATOR">Senator of the Philippines</option>
                  </select>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Tip: Candidates can run across multiple survey positions. Profile edits (photo, party, color, bio, education, platforms, sources) automatically reflect across all ballot slots.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-brand-navy mb-1">Political Party</label>
                  <input
                    type="text"
                    value={candidateForm.party || ""}
                    onChange={(e) => setCandidateForm({ ...candidateForm, party: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-brand-border outline-none"
                  />
                </div>
              </div>

              {/* DIRECT PHOTO UPLOAD SECTION */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="font-bold text-brand-navy block uppercase text-[11px]">
                  Official Candidate Photograph
                </span>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {candidateForm.photoUrl ? (
                    <div className="relative group">
                      <img
                        src={candidateForm.photoUrl}
                        alt="Candidate preview"
                        className="w-20 h-20 rounded-full object-cover border-2 shadow-sm"
                        style={{ borderColor: candidateForm.color }}
                      />
                      <button
                        type="button"
                        onClick={() => setCandidateForm({ ...candidateForm, photoUrl: "" })}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs shadow hover:bg-red-700"
                        title="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-slate-200 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                      <ImageIcon className="w-6 h-6" />
                      <span className="text-[9px] uppercase font-bold mt-1">No Photo</span>
                    </div>
                  )}

                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePhotoUpload(file);
                      }}
                    />

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={uploadingPhoto}
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-brand-blue text-white font-bold flex items-center gap-1.5 hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingPhoto ? "Uploading..." : "Upload from Computer"}</span>
                      </button>

                      {candidateForm.photoUrl && (
                        <button
                          type="button"
                          onClick={() => setCandidateForm({ ...candidateForm, photoUrl: "" })}
                          className="px-3 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-slate-100"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="text-[10px] text-slate-500">
                      Supports JPG, PNG, and WebP (Max 5 MB). File is verified and saved permanently on server storage.
                    </div>

                    {uploadError && <div className="text-[11px] text-red-600 font-bold">{uploadError}</div>}

                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">Or enter image URL or local server path:</span>
                      <input
                        type="text"
                        placeholder="/uploads/candidates/... or https://..."
                        value={candidateForm.photoUrl || ""}
                        onChange={(e) => setCandidateForm({ ...candidateForm, photoUrl: e.target.value })}
                        className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-300 outline-none font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* REPEATABLE LIST EDITOR: EDUCATIONAL BACKGROUND */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-brand-navy block uppercase text-[11px]">
                    Educational Background (Individual Line Entries)
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {candidateForm.educations?.length || 0} entries
                  </span>
                </div>

                <div className="space-y-2">
                  {candidateForm.educations?.map((edu: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 shadow-2xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={edu}
                        onChange={(e) => {
                          const updated = [...candidateForm.educations];
                          updated[idx] = e.target.value;
                          setCandidateForm({ ...candidateForm, educations: updated });
                        }}
                        className="flex-1 px-2 py-1 text-xs rounded border border-transparent focus:border-brand-blue outline-none"
                      />
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveEducation(idx, "up")}
                          className="p-1 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-20"
                          title="Move up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === candidateForm.educations.length - 1}
                          onClick={() => handleMoveEducation(idx, "down")}
                          className="p-1 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-20"
                          title="Move down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveEducation(idx)}
                          className="p-1 rounded hover:bg-red-50 text-red-500"
                          title="Remove entry"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add New Education Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="e.g. University of the Philippines Diliman (Bachelor of Laws)"
                      value={candidateForm.newEduInput || ""}
                      onChange={(e) => setCandidateForm({ ...candidateForm, newEduInput: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddEducation();
                        }
                      }}
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-blue/30"
                    />
                    <button
                      type="button"
                      onClick={handleAddEducation}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-900"
                    >
                      Add Entry
                    </button>
                  </div>
                </div>
              </div>

              {/* REPEATABLE LIST EDITOR: PUBLIC SERVICE RECORD */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-brand-navy block uppercase text-[11px]">
                    Public Service Record (Individual Positions)
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {candidateForm.publicServices?.length || 0} positions
                  </span>
                </div>

                <div className="space-y-2">
                  {candidateForm.publicServices?.map((service: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 shadow-2xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={service}
                        onChange={(e) => {
                          const updated = [...candidateForm.publicServices];
                          updated[idx] = e.target.value;
                          setCandidateForm({ ...candidateForm, publicServices: updated });
                        }}
                        className="flex-1 px-2 py-1 text-xs rounded border border-transparent focus:border-brand-blue outline-none"
                      />
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMovePublicService(idx, "up")}
                          className="p-1 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-20"
                          title="Move up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === candidateForm.publicServices.length - 1}
                          onClick={() => handleMovePublicService(idx, "down")}
                          className="p-1 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-20"
                          title="Move down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemovePublicService(idx)}
                          className="p-1 rounded hover:bg-red-50 text-red-500"
                          title="Remove position"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add New Public Service Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="e.g. Vice President of the Philippines (2022-present)"
                      value={candidateForm.newServiceInput || ""}
                      onChange={(e) => setCandidateForm({ ...candidateForm, newServiceInput: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddPublicService();
                        }
                      }}
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-blue/30"
                    />
                    <button
                      type="button"
                      onClick={handleAddPublicService}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-900"
                    >
                      Add Position
                    </button>
                  </div>
                </div>
              </div>

              {/* Biography */}
              <div>
                <label className="block font-bold text-brand-navy mb-1">Biography</label>
                <textarea
                  rows={2}
                  value={candidateForm.bio || ""}
                  onChange={(e) => setCandidateForm({ ...candidateForm, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-brand-border outline-none"
                ></textarea>
              </div>

              {/* Color & Website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-brand-navy mb-1">Assigned Map Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={candidateForm.color}
                      onChange={(e) => setCandidateForm({ ...candidateForm, color: e.target.value })}
                      className="w-8 h-8 rounded border border-brand-border cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={candidateForm.color}
                      onChange={(e) => setCandidateForm({ ...candidateForm, color: e.target.value })}
                      className="w-24 px-2 py-1 text-xs rounded border border-brand-border font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-brand-navy mb-1">Official Website</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={candidateForm.officialWebsite || ""}
                    onChange={(e) => setCandidateForm({ ...candidateForm, officialWebsite: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-brand-border outline-none"
                  />
                </div>
              </div>

              {/* POLICY PLATFORMS & AGENDAS */}
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-brand-navy block uppercase text-[11px]">
                    Policy Platforms &amp; Agendas
                  </span>
                  <span className="text-[10px] font-mono text-amber-900 font-bold px-2 py-0.5 rounded bg-amber-100">
                    {candidateForm.platforms?.length || 0} attached
                  </span>
                </div>

                {(!candidateForm.platforms || candidateForm.platforms.length === 0) ? (
                  <div className="text-xs text-slate-500 italic p-3 bg-white rounded-lg border border-amber-200/60">
                    No policy platforms currently attached. Any platforms added in the Platforms tab or copied from candidate cross-position assignments will appear here.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {candidateForm.platforms.map((plat: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-white rounded-xl border border-amber-200 text-xs shadow-2xs space-y-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 uppercase">
                            {plat.category || "GOVERNANCE"}
                          </span>
                          {plat.verificationStatus && (
                            <span className="text-[9px] text-emerald-700 font-bold uppercase">
                              ✓ {plat.verificationStatus}
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-brand-navy">{plat.title}</div>
                        {plat.description && plat.description !== plat.title && (
                          <div className="text-[11px] text-slate-600 line-clamp-2">{plat.description}</div>
                        )}
                        {plat.sourceUrl && (
                          <a
                            href={plat.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-brand-blue truncate block hover:underline"
                          >
                            Source: {plat.sourceTitle || plat.sourceUrl}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SOURCES & CITATIONS MANAGER */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-brand-navy block uppercase text-[11px]">
                    Verified Primary Sources &amp; Public Records
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {candidateForm.sources?.length || 0} sources
                  </span>
                </div>

                <div className="space-y-2">
                  {candidateForm.sources?.map((src: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-2 p-2.5 bg-white rounded-xl border border-slate-200 text-xs shadow-2xs"
                    >
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700 uppercase">
                            {src.category || "GENERAL"}
                          </span>
                          {src.publisher && (
                            <span className="text-[10px] text-slate-500 font-semibold truncate">
                              {src.publisher}
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-brand-navy truncate">{src.title}</div>
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-brand-blue truncate block hover:underline"
                        >
                          {src.url}
                        </a>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveSource(idx)}
                        className="p-1 rounded hover:bg-red-50 text-red-500 flex-shrink-0"
                        title="Remove source citation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Add New Source Input Row */}
                  <div className="pt-2 border-t border-slate-200/60 space-y-2">
                    <span className="text-[10px] font-bold text-slate-600 uppercase block">Add Source Citation</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <select
                        value={candidateForm.newSourceCategory || "GENERAL"}
                        onChange={(e) => setCandidateForm({ ...candidateForm, newSourceCategory: e.target.value })}
                        className="px-2.5 py-1.5 text-xs rounded-xl border border-brand-border outline-none bg-white"
                      >
                        <option value="GENERAL">General Reference</option>
                        <option value="EDUCATION">Education Record</option>
                        <option value="PUBLIC_SERVICE">Public Service</option>
                        <option value="PLATFORM">Legislative Platform</option>
                        <option value="PORTRAIT">Official Portrait</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Publisher (e.g. Senate, House, Supreme Court)"
                        value={candidateForm.newSourcePublisher || ""}
                        onChange={(e) => setCandidateForm({ ...candidateForm, newSourcePublisher: e.target.value })}
                        className="px-2.5 py-1.5 text-xs rounded-xl border border-brand-border outline-none sm:col-span-2"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Source Title (e.g. 19th Congress Official Profile)"
                        value={candidateForm.newSourceTitle || ""}
                        onChange={(e) => setCandidateForm({ ...candidateForm, newSourceTitle: e.target.value })}
                        className="px-2.5 py-1.5 text-xs rounded-xl border border-brand-border outline-none"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="https://..."
                          value={candidateForm.newSourceUrl || ""}
                          onChange={(e) => setCandidateForm({ ...candidateForm, newSourceUrl: e.target.value })}
                          className="flex-1 px-2.5 py-1.5 text-xs rounded-xl border border-brand-border outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddSource}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-900 flex-shrink-0"
                        >
                          Add Source
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* VERIFICATION AUDIT TIMESTAMP */}
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-emerald-900 block">Fact-Checking &amp; Verification Audit</span>
                  <span className="text-[11px] text-emerald-700">
                    Status:{" "}
                    <strong>
                      {candidateForm.lastVerifiedAt
                        ? `Audited on ${new Date(candidateForm.lastVerifiedAt).toLocaleDateString()}`
                        : "Verified against public records"}
                    </strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setCandidateForm({ ...candidateForm, lastVerifiedAt: new Date().toISOString() })
                  }
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold text-[11px] hover:bg-emerald-800 flex items-center gap-1 shadow-2xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verify Now</span>
                </button>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setShowCandidateModal(false)}
                  className="px-4 py-2 rounded-xl border border-brand-border hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAnalyst}
                  className="px-5 py-2 rounded-xl bg-brand-blue text-white font-bold hover:bg-blue-700 shadow-sm disabled:opacity-40"
                >
                  Save Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ADJUSTMENT CONFIRMATION MODAL                             */}
      {/* ========================================================= */}
      {showAdjustmentConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-brand-border p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-600">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <h3 className="font-headline font-bold text-base text-brand-navy uppercase">
                Confirm Manual Survey Count Adjustment
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Please review the proposed adjustment before confirming. This correction will be permanently logged in the
              audit trail under your administrator credentials.
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Candidate:</span>
                <span className="font-bold text-brand-navy">{selectedCandidateForAdjustment?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-bold text-brand-navy">{adjustmentForm.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Scope:</span>
                <span className="font-mono font-bold text-slate-700">
                  {adjustmentForm.geographicScope === "NATIONAL"
                    ? "National Level"
                    : adjustmentForm.geographicScope === "REGION"
                    ? `Region: ${PHILIPPINE_REGIONS.find((r) => r.id === adjustmentForm.regionId)?.name || adjustmentForm.regionId}`
                    : `Province: ${PHILIPPINE_PROVINCES.find((p) => p.id === adjustmentForm.provinceId)?.name || adjustmentForm.provinceId}`}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1.5">
                <span className="text-slate-500">Adjustment Amount:</span>
                <span
                  className={`font-mono font-bold ${
                    adjustmentForm.amount > 0 ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {adjustmentForm.amount > 0 ? `+${adjustmentForm.amount}` : adjustmentForm.amount} votes
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1.5">
                <span className="text-slate-500">Resulting Total:</span>
                <span className="font-mono font-black text-brand-blue text-sm">
                  {proposedNewVotes.toLocaleString()} votes
                </span>
              </div>
              <div className="border-t border-slate-200 pt-1.5">
                <span className="text-slate-500 block mb-0.5">Recorded Reason:</span>
                <span className="text-slate-800 italic block">{adjustmentForm.reason}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAdjustmentConfirmModal(false)}
                className="px-4 py-2 rounded-xl border border-brand-border text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submittingAdjustment}
                onClick={handleConfirmAdjustment}
                className="px-5 py-2 rounded-xl bg-brand-blue hover:bg-blue-700 text-white text-xs font-bold shadow transition-colors"
              >
                {submittingAdjustment ? "Applying..." : "Confirm & Apply"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* REVERSAL CONFIRMATION MODAL                               */}
      {/* ========================================================= */}
      {reversalTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-brand-border p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-600">
              <History className="w-5 h-5 flex-shrink-0" />
              <h3 className="font-headline font-bold text-base text-brand-navy uppercase">
                Reverse Previous Adjustment
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This will compensate the {reversalTarget.amount > 0 ? `+${reversalTarget.amount}` : reversalTarget.amount}{" "}
              votes adjustment for <strong>{reversalTarget.candidate?.name}</strong> and restore the previous tally.
            </p>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1.5">
                Reason for Reversal <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={reversalReason}
                onChange={(e) => setReversalReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-blue/30"
              ></textarea>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setReversalTarget(null)}
                className="px-4 py-2 rounded-xl border border-brand-border text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submittingReversal || !reversalReason.trim()}
                onClick={handleConfirmReversal}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow transition-colors"
              >
                {submittingReversal ? "Reversing..." : "Confirm Reversal"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SURVEY STATUS CHANGE CONFIRMATION MODAL                  */}
      {/* ========================================================= */}
      {statusChangeTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-brand-border p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <h3 className="font-headline font-bold text-base text-brand-navy uppercase">
                Confirm Survey Status Transition
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to transition the survey polling state to{" "}
              <strong className="uppercase text-brand-navy">{statusChangeTarget}</strong>?
              {statusChangeTarget === "PAUSED" && " Public submissions will be temporarily suspended."}
              {statusChangeTarget === "CLOSED" && " Public submissions will be permanently closed."}
              {statusChangeTarget === "ACTIVE" && " The survey will resume accepting verified participant votes."}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStatusChangeTarget(null)}
                className="px-4 py-2 rounded-xl border border-brand-border text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => executeStatusChange(statusChangeTarget)}
                className={`px-5 py-2 rounded-xl text-white text-xs font-bold shadow transition-colors ${
                  statusChangeTarget === "ACTIVE"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : statusChangeTarget === "PAUSED"
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Confirm {statusChangeTarget}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PLATFORM MODAL                                            */}
      {/* ========================================================= */}
      {showPlatformModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl border border-brand-border p-4 sm:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-elevated space-y-4">
            <h3 className="text-lg font-bold text-brand-navy">
              {platformForm.id ? "Edit Policy Platform" : "Add Policy Platform"}
            </h3>

            <form onSubmit={handleSavePlatform} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-brand-navy mb-1">Select Candidate</label>
                <select
                  value={platformForm.candidateId}
                  onChange={(e) => setPlatformForm({ ...platformForm, candidateId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-brand-border outline-none bg-white"
                >
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.position.replace("_", " ")})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-brand-navy mb-1">Platform Proposal Title</label>
                <input
                  type="text"
                  required
                  value={platformForm.title}
                  onChange={(e) => setPlatformForm({ ...platformForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-navy mb-1">Policy Category</label>
                <select
                  value={platformForm.category}
                  onChange={(e) => setPlatformForm({ ...platformForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-brand-border outline-none bg-white"
                >
                  <option value="ECONOMY">Economy &amp; Jobs</option>
                  <option value="HEALTHCARE">Healthcare</option>
                  <option value="EDUCATION">Education</option>
                  <option value="AGRICULTURE">Agriculture &amp; Fisheries</option>
                  <option value="INFRASTRUCTURE">Infrastructure</option>
                  <option value="GOVERNANCE">Governance &amp; Anti-Corruption</option>
                  <option value="DIGITAL_TRANSFORMATION">Digital Transformation</option>
                  <option value="PUBLIC_SAFETY">Public Safety &amp; Defense</option>
                  <option value="ENVIRONMENT">Environment &amp; Climate</option>
                  <option value="OTHER">Other Reforms</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-brand-navy mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  required
                  value={platformForm.description}
                  onChange={(e) => setPlatformForm({ ...platformForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-brand-border outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-brand-navy mb-1">Official Citation / Source URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={platformForm.sourceUrl || ""}
                  onChange={(e) => setPlatformForm({ ...platformForm, sourceUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-brand-border outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setShowPlatformModal(false)}
                  className="px-4 py-2 rounded-xl border border-brand-border hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAnalyst}
                  className="px-5 py-2 rounded-xl bg-brand-blue text-white font-bold hover:bg-blue-700 shadow-sm disabled:opacity-40"
                >
                  Save Platform
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
