"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import { groupCandidatesByPosition, sortCandidatesByPositionAndName } from "@/lib/candidate-sorting";
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
  ChevronUp,
  ChevronDown,
  TrendingUp,
  Activity,
  Layers,
  RotateCcw,
  CheckCircle,
  Landmark,
  FileCheck,
  Search,
  ExternalLink,
  Info,
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

  // Active Tab: SURVEY_MGMT | STATISTICS | ADJUSTMENTS | CANDIDATES | LEGISLATIVE | PLATFORMS | SETTINGS | LOGS
  const [activeTab, setActiveTab] = useState<
    "SURVEY_MGMT" | "STATISTICS" | "ADJUSTMENTS" | "CANDIDATES" | "LEGISLATIVE" | "PLATFORMS" | "SETTINGS" | "LOGS"
  >("SURVEY_MGMT");

  // Admin Data State
  const [candidates, setCandidates] = useState<any[]>([]);

  // Grouped and sorted candidates (Presidents A-Z, Vice Presidents A-Z, Senators A-Z, Other A-Z)
  const groupedCandidates = useMemo(() => {
    return groupCandidatesByPosition(candidates);
  }, [candidates]);
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [campaign, setCampaign] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [adjustments, setAdjustments] = useState<any[]>([]);
  const [candidateSummaries, setCandidateSummaries] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [surveyStats, setSurveyStats] = useState<any>(null);
  const [statsAuditLogs, setStatsAuditLogs] = useState<any[]>([]);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Statistics Management Form State
  const [activeVotesMode, setActiveVotesMode] = useState<"TARGET" | "ADJUSTMENT">("TARGET");
  const [activeVotesInput, setActiveVotesInput] = useState<string>("");
  const [activeVotesReason, setActiveVotesReason] = useState<string>("");

  const [todayVotesMode, setTodayVotesMode] = useState<"TARGET" | "ADJUSTMENT">("TARGET");
  const [todayVotesInput, setTodayVotesInput] = useState<string>("");
  const [todayVotesReason, setTodayVotesReason] = useState<string>("");

  const [provincesOverrideInput, setProvincesOverrideInput] = useState<string>("");
  const [provincesReason, setProvincesReason] = useState<string>("");

  const [domesticVotesMode, setDomesticVotesMode] = useState<"TARGET" | "ADJUSTMENT">("TARGET");
  const [domesticVotesInput, setDomesticVotesInput] = useState<string>("");
  const [domesticVotesReason, setDomesticVotesReason] = useState<string>("");

  const [overseasVotesMode, setOverseasVotesMode] = useState<"TARGET" | "ADJUSTMENT">("TARGET");
  const [overseasVotesInput, setOverseasVotesInput] = useState<string>("");
  const [overseasVotesReason, setOverseasVotesReason] = useState<string>("");

  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const [savingStatKey, setSavingStatKey] = useState<string | null>(null);
  const [statsConfirmModal, setStatsConfirmModal] = useState<{
    open: boolean;
    title: string;
    statisticName: string;
    action: "ADJUST" | "RESET";
    calculatedValue: number | string;
    currentAdjustment: number | string;
    newAdjustment: number | string;
    currentDisplayed: number | string;
    resultingDisplayed: number | string;
    reason: string;
    onConfirm: () => Promise<void>;
  } | null>(null);

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

  // Overseas / Geographic Participation Filter State
  const [adminGeoFilter, setAdminGeoFilter] = useState<"ALL" | "DOMESTIC" | "OVERSEAS">("ALL");
  const [adminCountrySearch, setAdminCountrySearch] = useState("");
  const [submittingReversal, setSubmittingReversal] = useState(false);

  // Consequential Survey Status Confirm Modal
  const [statusChangeTarget, setStatusChangeTarget] = useState<"ACTIVE" | "PAUSED" | "CLOSED" | null>(null);

  // Legislative Records Importer & Management State
  const [importModalCandidate, setImportModalCandidate] = useState<any | null>(null);
  const [importingLegislative, setImportingLegislative] = useState(false);
  const [importResult, setImportResult] = useState<any | null>(null);
  const [importError, setImportError] = useState("");

  // Storage Audit State
  const [storageAudit, setStorageAudit] = useState<any | null>(null);
  const [optimizingImages, setOptimizingImages] = useState(false);

  // Assisted File Upload State
  const [showFileImportModal, setShowFileImportModal] = useState(false);
  const [fileImportPreview, setFileImportPreview] = useState<any | null>(null);
  const [fileImportError, setFileImportError] = useState("");
  const [processingFileImport, setProcessingFileImport] = useState(false);

  const [selectedLegCandidateId, setSelectedLegCandidateId] = useState<string>("");
  const [legRecords, setLegRecords] = useState<any[]>([]);
  const [legSummary, setLegSummary] = useState<any | null>(null);
  const [loadingLegRecords, setLoadingLegRecords] = useState(false);
  const [legFilterReviewStatus, setLegFilterReviewStatus] = useState<string>("ALL");
  const [legFilterChamber, setLegFilterChamber] = useState<string>("ALL");
  const [legSearchQuery, setLegSearchQuery] = useState<string>("");

  const [showManualBillModal, setShowManualBillModal] = useState(false);
  const [manualBillForm, setManualBillForm] = useState({
    candidateId: "",
    chamber: "SENATE",
    congress: 19,
    billNo: "",
    title: "",
    longTitle: "",
    role: "PRINCIPAL_AUTHOR",
    status: "PENDING",
    republicActNo: "",
    filedDate: "",
    sourceUrl: "",
    pdfUrl: "",
  });
  const [submittingManualBill, setSubmittingManualBill] = useState(false);

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
      const [candRes, platRes, campRes, logsRes, adjRes, analyticsRes, statsRes] = await Promise.all([
        fetch("/api/admin/candidates"),
        fetch("/api/admin/platforms"),
        fetch("/api/admin/campaign"),
        fetch("/api/admin/logs"),
        fetch("/api/admin/adjustments"),
        fetch("/api/analytics"),
        fetch("/api/admin/statistics"),
      ]);

      if (candRes.ok) {
        const rawCands = (await candRes.json()).candidates || [];
        setCandidates(sortCandidatesByPositionAndName(rawCands));
      }
      if (platRes.ok) setPlatforms((await platRes.json()).platforms || []);
      if (campRes.ok) setCampaign((await campRes.json()).campaign);
      if (logsRes.ok) setAuditLogs((await logsRes.json()).logs || []);
      if (adjRes.ok) {
        const adjData = await adjRes.json();
        setAdjustments(adjData.adjustments || []);
        setCandidateSummaries(adjData.candidateSummaries || []);
      }
      if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
      await loadStorageAudit();
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setSurveyStats(statsData.statistics || null);
        setStatsAuditLogs(statsData.auditLogs || []);
      }
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

  // Legislative Records Handlers
  const loadStorageAudit = async () => {
    try {
      const res = await fetch("/api/admin/storage");
      if (res.ok) {
        const data = await res.json();
        setStorageAudit(data.audit);
      }
    } catch (e) {
      console.error("Failed to load storage audit:", e);
    }
  };

  const triggerOptimizeImages = async () => {
    if (isAnalyst) return;
    setOptimizingImages(true);
    try {
      const res = await fetch("/api/admin/storage", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setStorageAudit(data.result.audit);
        showNotify("success", `Optimized ${data.result.processed} portraits. Saved ${data.result.audit.savingsPercent} disk storage!`);
      } else {
        showNotify("error", data.error || "Optimization failed.");
      }
    } catch (e: any) {
      showNotify("error", e.message || "Optimization failed.");
    } finally {
      setOptimizingImages(false);
    }
  };

  const handleFileSelectForPreview = async (e: React.ChangeEvent<HTMLInputElement>, candId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const format = file.name.endsWith(".json") ? "json" : "csv";
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const rawContent = evt.target?.result as string;
      setProcessingFileImport(true);
      setFileImportError("");
      try {
        const res = await fetch(`/api/admin/candidates/${candId}/import-legislative`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "PREVIEW_FILE", rawContent, fileFormat: format }),
        });
        const data = await res.json();
        if (res.ok && data.validation) {
          setFileImportPreview({
            filename: file.name,
            format,
            rawContent,
            validation: data.validation,
          });
        } else {
          setFileImportError(data.error || "Failed to parse file.");
        }
      } catch (err: any) {
        setFileImportError(err.message || "Failed to parse file.");
      } finally {
        setProcessingFileImport(false);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmFileImport = async (candId: string) => {
    if (!fileImportPreview?.rawContent) return;
    setProcessingFileImport(true);
    try {
      const res = await fetch(`/api/admin/candidates/${candId}/import-legislative`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawContent: fileImportPreview.rawContent,
          fileFormat: fileImportPreview.format,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setImportResult(data.result);
        setShowFileImportModal(false);
        setFileImportPreview(null);
        showNotify("success", `Imported ${data.result.insertedCount} measures from ${fileImportPreview.filename}`);
        await loadAdminData();
        if (selectedLegCandidateId === candId) {
          await loadCandidateLegislativeRecords(candId);
        }
      } else {
        setFileImportError(data.error || "Failed to commit import.");
      }
    } catch (err: any) {
      setFileImportError(err.message || "Failed to commit import.");
    } finally {
      setProcessingFileImport(false);
    }
  };

  const triggerImportLegislative = async (cand: any) => {
    if (isAnalyst) {
      showNotify("error", "Analyst role is read-only.");
      return;
    }
    setImportModalCandidate(cand);
    setImportingLegislative(true);
    setImportResult(null);
    setImportError("");
    try {
      const res = await fetch(`/api/admin/candidates/${cand.id}/import-legislative`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to import legislative records.");
      }
      setImportResult(data.result);
      showNotify("success", `Imported legislative records for ${cand.name}`);
      await loadAdminData();
      if (selectedLegCandidateId === cand.id) {
        await loadCandidateLegislativeRecords(cand.id);
      }
    } catch (err: any) {
      setImportError(err.message || "An unexpected error occurred during import.");
      showNotify("error", err.message || "Failed to import legislative records.");
    } finally {
      setImportingLegislative(false);
    }
  };

  const loadCandidateLegislativeRecords = async (candId: string) => {
    if (!candId) return;
    setLoadingLegRecords(true);
    try {
      const res = await fetch(`/api/admin/candidates/${candId}/legislative`);
      if (res.ok) {
        const data = await res.json();
        setLegRecords(data.records || []);
        setLegSummary(data.summary || null);
      }
    } catch (e) {
      console.error("Failed to load candidate legislative records:", e);
    } finally {
      setLoadingLegRecords(false);
    }
  };

  const handleUpdateRecordStatus = async (candId: string, recordId: string, reviewStatus: string) => {
    if (isAnalyst) return;
    try {
      const res = await fetch(`/api/admin/candidates/${candId}/legislative`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordId, reviewStatus }),
      });
      if (res.ok) {
        showNotify("success", `Updated record status to ${reviewStatus}`);
        await loadCandidateLegislativeRecords(candId);
        await loadAdminData();
      }
    } catch (e) {
      console.error("Failed to update legislative record status:", e);
      showNotify("error", "Failed to update record status.");
    }
  };

  const handleDeleteRecord = async (candId: string, recordId: string) => {
    if (isAnalyst) return;
    if (!confirm("Are you sure you want to delete this legislative record?")) return;
    try {
      const res = await fetch(`/api/admin/candidates/${candId}/legislative?recordId=${recordId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showNotify("success", "Legislative record deleted.");
        await loadCandidateLegislativeRecords(candId);
        await loadAdminData();
      }
    } catch (e) {
      console.error("Failed to delete record:", e);
      showNotify("error", "Failed to delete record.");
    }
  };

  const handleSaveManualBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnalyst) return;
    setSubmittingManualBill(true);
    try {
      const res = await fetch(`/api/admin/candidates/${manualBillForm.candidateId}/legislative`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manualBillForm),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add legislative record.");
      }
      showNotify("success", "Legislative record created.");
      setShowManualBillModal(false);
      await loadCandidateLegislativeRecords(manualBillForm.candidateId);
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || "Failed to create record.");
    } finally {
      setSubmittingManualBill(false);
    }
  };

  // Survey Statistics Management Handlers
  const handleApplyStat = async (
    statistic: "ACTIVE_VOTES" | "TODAY_VOTES" | "DOMESTIC_VOTES" | "OVERSEAS_VOTES" | "PROVINCES_REPORTING",
    payload: { adjustment?: number; targetTotal?: number; override?: number; reason: string }
  ) => {
    if (isAnalyst) {
      showNotify("error", "Analyst role is read-only. Cannot modify statistics.");
      return;
    }
    setSavingStatKey(statistic);
    try {
      const res = await fetch("/api/admin/statistics", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          statistic,
          action: "ADJUST",
          ...payload,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showNotify("error", data.error || "Failed to update statistic.");
        return;
      }

      showNotify("success", data.message || "Statistic updated successfully.");
      await loadAdminData();
    } catch (err) {
      showNotify("error", "Network connection error.");
    } finally {
      setSavingStatKey(null);
    }
  };

  const handleResetStat = async (
    statistic: "ACTIVE_VOTES" | "TODAY_VOTES" | "DOMESTIC_VOTES" | "OVERSEAS_VOTES" | "PROVINCES_REPORTING" | "ALL",
    reason: string
  ) => {
    if (isAnalyst) {
      showNotify("error", "Analyst role is read-only.");
      return;
    }
    setSavingStatKey(statistic);
    try {
      const res = await fetch("/api/admin/statistics", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          statistic,
          action: "RESET",
          reason,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showNotify("error", data.error || "Failed to reset statistic.");
        return;
      }

      showNotify("success", data.message || "Statistic reset to system-calculated value.");
      await loadAdminData();
    } catch (err) {
      showNotify("error", "Network connection error.");
    } finally {
      setSavingStatKey(null);
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
      <div className="bg-[#0B1E36] text-white py-6 border-b border-slate-700">
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
            { id: "STATISTICS", label: "Survey Statistics Management", icon: Activity },
            { id: "ADJUSTMENTS", label: "Candidate Voting Adjustments", icon: Sliders },
            { id: "CANDIDATES", label: "Candidate Profiles & Photos", icon: Users },
            { id: "LEGISLATIVE", label: "Legislative Records & Review", icon: Landmark },
            { id: "PLATFORMS", label: "Platforms & Agendas", icon: BookOpen },
            { id: "SETTINGS", label: "Survey Campaign Settings", icon: Settings },
            { id: "LOGS", label: "Audit Logs", icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === "LEGISLATIVE" && candidates.length > 0 && !selectedLegCandidateId) {
                    const firstId = candidates[0].id;
                    setSelectedLegCandidateId(firstId);
                    loadCandidateLegislativeRecords(firstId);
                  }
                }}
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-slate block truncate">
                    Active Submissions
                  </span>
                  <button
                    onClick={() => setActiveTab("STATISTICS")}
                    className="text-[10px] text-brand-blue font-bold hover:underline"
                    title="Open Survey Statistics Management"
                  >
                    Manage &rarr;
                  </button>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-brand-navy mt-1 tabular-nums">
                  {(analytics?.summary?.totalActiveSubmissions ?? 0).toLocaleString()}
                </div>
                <p className="text-[10px] text-emerald-600 font-semibold mt-0.5 truncate">
                  {(analytics?.summary?.activeVotesAdjustment ?? 0) !== 0
                    ? `Calculated: ${(analytics?.summary?.rawActiveSubmissions ?? 0).toLocaleString()} (Adj: ${(analytics?.summary?.activeVotesAdjustment ?? 0) >= 0 ? `+${analytics?.summary?.activeVotesAdjustment}` : analytics?.summary?.activeVotesAdjustment})`
                    : "100% organic verified submissions"}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 block truncate flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Domestic (PH)</span>
                </span>
                <div className="text-2xl sm:text-3xl font-black text-sky-700 mt-1 tabular-nums">
                  {(analytics?.summary?.domesticSubmissionsCount ?? 0).toLocaleString()}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                  Philippine provinces &amp; cities
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block truncate flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Overseas (OFW)</span>
                </span>
                <div className="text-2xl sm:text-3xl font-black text-blue-700 mt-1 tabular-nums">
                  {(analytics?.summary?.overseasSubmissionsCount ?? 0).toLocaleString()}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                  {analytics?.overseas?.percentageOfTotal ?? 0}% of active survey responses
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-slate block truncate">
                    Today&apos;s Responses
                  </span>
                  <button
                    onClick={() => setActiveTab("STATISTICS")}
                    className="text-[10px] text-brand-blue font-bold hover:underline"
                    title="Open Survey Statistics Management"
                  >
                    Manage &rarr;
                  </button>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1 tabular-nums">
                  {(analytics?.summary?.todaySubmissions ?? 0).toLocaleString()}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                  {(analytics?.summary?.todayVotesAdjustment ?? 0) !== 0
                    ? `Calculated: ${(analytics?.summary?.rawTodaySubmissions ?? 0).toLocaleString()} (Adj: ${(analytics?.summary?.todayVotesAdjustment ?? 0) >= 0 ? `+${analytics?.summary?.todayVotesAdjustment}` : analytics?.summary?.todayVotesAdjustment})`
                    : "Philippine calendar day (PST)"}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-slate block truncate">
                    Provinces Reporting
                  </span>
                  <button
                    onClick={() => setActiveTab("STATISTICS")}
                    className="text-[10px] text-brand-blue font-bold hover:underline"
                    title="Open Survey Statistics Management"
                  >
                    Manage &rarr;
                  </button>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#0B1E36] mt-1 tabular-nums">
                  {analytics?.summary?.provincesReporting ?? 0} / {analytics?.summary?.totalProvinces ?? 82}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                  {analytics?.summary?.provincesReportingOverride !== null && analytics?.summary?.provincesReportingOverride !== undefined
                    ? `Manual override: ${analytics.summary.provincesReportingOverride} / 82`
                    : `Domestic provinces only`}
                </p>
              </div>
            </div>

            {/* Geographic & Sectoral Participation Management Card */}
            <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-700" />
                    <h3 className="text-base font-bold text-brand-navy uppercase tracking-wide">
                      Geographic &amp; Sectoral Participation (Domestic vs. Overseas / OFW)
                    </h3>
                  </div>
                  <p className="text-xs text-brand-slate mt-0.5">
                    Filters and aggregate breakdown of voluntary survey participation across Philippine regions and overseas diaspora destinations.
                  </p>
                </div>

                {/* Domestic vs Overseas Sector Filters */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold">
                  {(
                    [
                      { id: "ALL", label: "All Submissions" },
                      { id: "DOMESTIC", label: "Domestic (PH)" },
                      { id: "OVERSEAS", label: "Overseas (OFW)" },
                    ] as const
                  ).map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setAdminGeoFilter(f.id)}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        adminGeoFilter === f.id
                          ? "bg-white text-brand-navy shadow-xs font-black"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sector Summary Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Domestic Active Votes
                  </span>
                  <div className="text-lg font-black text-slate-800 mt-0.5 tabular-nums">
                    {(analytics?.summary?.domesticSubmissionsCount ?? 0).toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {analytics?.summary?.totalActiveSubmissions > 0
                      ? (
                          ((analytics?.summary?.domesticSubmissionsCount || 0) /
                            analytics?.summary?.totalActiveSubmissions) *
                          100
                        ).toFixed(1)
                      : 100}
                    % of total active votes
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                    Overseas (OFW) Votes
                  </span>
                  <div className="text-lg font-black text-blue-900 mt-0.5 tabular-nums">
                    {(analytics?.overseas?.totalSubmissions ?? 0).toLocaleString()}
                  </div>
                  <span className="text-[10px] text-blue-600">
                    {analytics?.overseas?.percentageOfTotal ?? 0}% of total active votes
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Participating Countries
                  </span>
                  <div className="text-lg font-black text-slate-800 mt-0.5 tabular-nums">
                    {analytics?.overseas?.countries?.length ?? 0}
                  </div>
                  <span className="text-[10px] text-slate-500">Active diaspora nations</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Philippine Coverage
                  </span>
                  <div className="text-lg font-black text-slate-800 mt-0.5 tabular-nums">
                    {analytics?.summary?.provincesReporting ?? 0} / 82
                  </div>
                  <span className="text-[10px] text-slate-500">Excludes overseas from count</span>
                </div>
              </div>

              {/* Aggregate Country Breakdown Table (Shown for ALL or OVERSEAS filter) */}
              {(adminGeoFilter === "ALL" || adminGeoFilter === "OVERSEAS") && (
                <div className="space-y-3 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-navy">
                      Aggregate Participation by Country (Global Diaspora)
                    </span>
                    <input
                      type="text"
                      placeholder="Filter countries by name, code, or region..."
                      value={adminCountrySearch}
                      onChange={(e) => setAdminCountrySearch(e.target.value)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 w-full sm:w-64 outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                  </div>

                  {!analytics?.overseas?.countries || analytics.overseas.countries.length === 0 ? (
                    <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400 italic">
                      No overseas survey responses recorded yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left text-xs min-w-[550px]">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                            <th className="py-2.5 px-3">Country</th>
                            <th className="py-2.5 px-3">ISO Code</th>
                            <th className="py-2.5 px-3">Region Abroad</th>
                            <th className="py-2.5 px-3 text-right">Eligible Submissions</th>
                            <th className="py-2.5 px-3 text-right">% of Overseas</th>
                            <th className="py-2.5 px-3 text-right">% of Overall Survey</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {analytics.overseas.countries
                            .filter((c: any) => {
                              const q = adminCountrySearch.toLowerCase().trim();
                              if (!q) return true;
                              return (
                                c.name.toLowerCase().includes(q) ||
                                c.code.toLowerCase().includes(q) ||
                                c.region.toLowerCase().includes(q)
                              );
                            })
                            .map((c: any) => (
                              <tr key={c.code} className="hover:bg-slate-50/50">
                                <td className="py-2.5 px-3 font-bold text-brand-navy flex items-center gap-2">
                                  <span className="text-base">{c.flag}</span>
                                  <span>{c.name}</span>
                                </td>
                                <td className="py-2.5 px-3 font-mono text-slate-500 font-semibold">{c.code}</td>
                                <td className="py-2.5 px-3 text-slate-600">{c.region}</td>
                                <td className="py-2.5 px-3 text-right font-mono font-bold text-brand-navy">
                                  {c.count.toLocaleString()}
                                </td>
                                <td className="py-2.5 px-3 text-right font-mono text-blue-700 font-semibold">
                                  {c.percentage}%
                                </td>
                                <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                                  {c.percentageOfTotal}%
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Domestic Summary Notice (Shown for DOMESTIC filter) */}
              {adminGeoFilter === "DOMESTIC" && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                  <p className="font-bold text-brand-navy">Domestic Philippine Geographic Submissions</p>
                  <p>
                    Showing valid resident participants residing within the 17 administrative regions and 82 Philippine provinces. All province-level cartograms, heatmaps, and regional leader calculations are derived exclusively from this domestic cohort.
                  </p>
                </div>
              )}

              {/* Data Privacy & Security Notice */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>Privacy &amp; Security Compliance (RA 10173):</strong> Individual participant ballots and private tokens remain strictly confidential. Only aggregated statistical summaries are accessible.
                </span>
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
        {/* TAB: SURVEY STATISTICS MANAGEMENT (VOTES & COVERAGE)      */}
        {/* ========================================================= */}
        {activeTab === "STATISTICS" && (
          <div className="space-y-6">
            {/* Header & Control Center Banner */}
            <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-brand-blue" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue bg-blue-50 px-2.5 py-0.5 rounded-full">
                    Official Survey Counter Calibration
                  </span>
                </div>
                <h2 className="text-lg font-bold text-brand-navy">Survey Statistics Management</h2>
                <p className="text-xs text-brand-slate max-w-3xl leading-relaxed">
                  Calibrate and audit high-level nationwide survey statistics displayed on the live public results page.
                  Each counter separates pure system-calculated baseline records from authorized administrative adjustments,
                  ensuring complete auditability and integrity without fabricating participant responses.
                </p>
              </div>

              {!isAnalyst && (
                <button
                  type="button"
                  disabled={savingStatKey === "ALL"}
                  onClick={() => {
                    setStatsConfirmModal({
                      open: true,
                      title: "Reset All Survey Statistics",
                      statisticName: "All High-Level Survey Counters",
                      action: "RESET",
                      calculatedValue: "All Organic Baselines",
                      currentAdjustment: "All Custom Adjustments",
                      newAdjustment: "0 / None",
                      currentDisplayed: "Current Displayed Values",
                      resultingDisplayed: "100% Calculated Database Counts",
                      reason: "Administrative reset of all counters to pure system-calculated baselines",
                      onConfirm: async () => {
                        await handleResetStat("ALL", "Administrative reset of all survey counters to system-calculated baselines");
                        setStatsConfirmModal(null);
                      },
                    });
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 transition-colors self-start md:self-auto flex-shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reset All to Calculated</span>
                </button>
              )}
            </div>

            {/* THREE PRIMARY STATISTIC CONTROLS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* STATISTIC 1: ACTIVE VERIFIED VOTES */}
              <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-brand-navy">Active Verified Votes</h3>
                        <span className="text-[10px] text-slate-400">Total Valid Voter Submissions</span>
                      </div>
                    </div>
                    {surveyStats?.activeVotes?.isAdjusted ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        Manual Adjustment
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        100% Organic
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Accurately reflects unique, eligible active submissions in the survey database. Multiple candidate
                    selections across races are deduplicated into a single verified submission.
                  </p>

                  {/* 3 Metric Pills */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block truncate">Calculated</span>
                      <span className="font-mono font-black text-sm text-slate-700">
                        {(surveyStats?.activeVotes?.calculated ?? analytics?.summary?.rawActiveSubmissions ?? 0).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block truncate">Adjustment</span>
                      <span
                        className={`font-mono font-bold text-sm ${
                          (surveyStats?.activeVotes?.adjustment ?? 0) !== 0
                            ? (surveyStats?.activeVotes?.adjustment ?? 0) > 0
                              ? "text-emerald-600"
                              : "text-amber-600"
                            : "text-slate-400"
                        }`}
                      >
                        {(surveyStats?.activeVotes?.adjustment ?? 0) > 0
                          ? `+${(surveyStats?.activeVotes?.adjustment ?? 0).toLocaleString()}`
                          : (surveyStats?.activeVotes?.adjustment ?? 0).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-brand-blue block truncate">Public Total</span>
                      <span className="font-mono font-black text-sm text-brand-blue">
                        {(surveyStats?.activeVotes?.displayed ?? analytics?.summary?.totalActiveSubmissions ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Adjustment Controls */}
                  <div className="pt-2 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-brand-navy">
                      <span>Adjust Statistic</span>
                      <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setActiveVotesMode("TARGET")}
                          className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                            activeVotesMode === "TARGET"
                              ? "bg-white text-brand-navy shadow-xs"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          Target Total
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveVotesMode("ADJUSTMENT")}
                          className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                            activeVotesMode === "ADJUSTMENT"
                              ? "bg-white text-brand-navy shadow-xs"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          Adjustment (+/-)
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        {activeVotesMode === "TARGET"
                          ? "Approved Displayed Total (e.g. 1000)"
                          : "Manual Count Adjustment (+/-)"}
                      </label>
                      <input
                        type="number"
                        min="0"
                        disabled={isAnalyst}
                        placeholder={
                          activeVotesMode === "TARGET"
                            ? `Current displayed: ${(surveyStats?.activeVotes?.displayed ?? 0).toLocaleString()}`
                            : "e.g. +250 or -50"
                        }
                        value={activeVotesInput}
                        onChange={(e) => setActiveVotesInput(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-blue/30 font-mono font-bold"
                      />
                      {activeVotesInput !== "" && !isNaN(parseInt(activeVotesInput, 10)) && (
                        <p className="text-[10px] text-brand-blue mt-1 font-mono">
                          {activeVotesMode === "TARGET" ? (
                            <>
                              Calculated (
                              {(surveyStats?.activeVotes?.calculated ?? 0).toLocaleString()}) + Adjustment (
                              {parseInt(activeVotesInput, 10) - (surveyStats?.activeVotes?.calculated ?? 0) >= 0
                                ? `+${parseInt(activeVotesInput, 10) - (surveyStats?.activeVotes?.calculated ?? 0)}`
                                : parseInt(activeVotesInput, 10) - (surveyStats?.activeVotes?.calculated ?? 0)}
                              ) = <strong>{Math.max(0, parseInt(activeVotesInput, 10)).toLocaleString()} displayed</strong>
                            </>
                          ) : (
                            <>
                              Calculated (
                              {(surveyStats?.activeVotes?.calculated ?? 0).toLocaleString()}) + Adjustment (
                              {parseInt(activeVotesInput, 10) >= 0
                                ? `+${parseInt(activeVotesInput, 10)}`
                                : parseInt(activeVotesInput, 10)}
                              ) ={" "}
                              <strong>
                                {Math.max(
                                  0,
                                  (surveyStats?.activeVotes?.calculated ?? 0) + parseInt(activeVotesInput, 10)
                                ).toLocaleString()}{" "}
                                displayed
                              </strong>
                            </>
                          )}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Audit Reason <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        disabled={isAnalyst}
                        placeholder="e.g. Turnout calibration against verified precinct census"
                        value={activeVotesReason}
                        onChange={(e) => setActiveVotesReason(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-blue/30"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    disabled={
                      isAnalyst ||
                      savingStatKey === "ACTIVE_VOTES" ||
                      (surveyStats?.activeVotes?.adjustment ?? 0) === 0
                    }
                    onClick={() => {
                      const calc = surveyStats?.activeVotes?.calculated ?? 0;
                      const curAdj = surveyStats?.activeVotes?.adjustment ?? 0;
                      setStatsConfirmModal({
                        open: true,
                        title: "Reset Active Verified Votes",
                        statisticName: "Active Verified Votes",
                        action: "RESET",
                        calculatedValue: calc.toLocaleString(),
                        currentAdjustment: curAdj >= 0 ? `+${curAdj}` : curAdj,
                        newAdjustment: "0 (Zero Adjustment)",
                        currentDisplayed: (calc + curAdj).toLocaleString(),
                        resultingDisplayed: calc.toLocaleString(),
                        reason: "Reset to system-calculated baseline count",
                        onConfirm: async () => {
                          await handleResetStat("ACTIVE_VOTES", "Reset to calculated baseline");
                          setActiveVotesInput("");
                          setActiveVotesReason("");
                          setStatsConfirmModal(null);
                        },
                      });
                    }}
                    className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-slate-600 text-xs font-bold"
                  >
                    Reset
                  </button>

                  <button
                    type="button"
                    disabled={isAnalyst || savingStatKey === "ACTIVE_VOTES" || activeVotesInput === ""}
                    onClick={() => {
                      if (!activeVotesReason.trim() || activeVotesReason.trim().length < 3) {
                        alert("Please provide an audit reason (minimum 3 characters) explaining this adjustment.");
                        return;
                      }
                      const calc = surveyStats?.activeVotes?.calculated ?? 0;
                      const curAdj = surveyStats?.activeVotes?.adjustment ?? 0;
                      let newAdj = 0;
                      let newTotal = 0;
                      if (activeVotesMode === "TARGET") {
                        const target = parseInt(activeVotesInput, 10);
                        if (isNaN(target) || target < 0) {
                          alert("Target must be a non-negative number.");
                          return;
                        }
                        newAdj = target - calc;
                        newTotal = target;
                      } else {
                        const adj = parseInt(activeVotesInput, 10);
                        if (isNaN(adj)) {
                          alert("Adjustment must be a valid integer.");
                          return;
                        }
                        newAdj = adj;
                        newTotal = Math.max(0, calc + adj);
                      }

                      setStatsConfirmModal({
                        open: true,
                        title: "Confirm Active Verified Votes Adjustment",
                        statisticName: "Active Verified Votes",
                        action: "ADJUST",
                        calculatedValue: calc.toLocaleString(),
                        currentAdjustment: curAdj >= 0 ? `+${curAdj}` : curAdj,
                        newAdjustment: newAdj >= 0 ? `+${newAdj}` : newAdj,
                        currentDisplayed: Math.max(0, calc + curAdj).toLocaleString(),
                        resultingDisplayed: newTotal.toLocaleString(),
                        reason: activeVotesReason.trim(),
                        onConfirm: async () => {
                          await handleApplyStat("ACTIVE_VOTES", {
                            adjustment: newAdj,
                            reason: activeVotesReason.trim(),
                          });
                          setActiveVotesInput("");
                          setActiveVotesReason("");
                          setStatsConfirmModal(null);
                        },
                      });
                    }}
                    className="px-4 py-2 rounded-xl bg-brand-blue hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    {savingStatKey === "ACTIVE_VOTES" ? "Saving..." : "Save Adjustment"}
                  </button>
                </div>
              </div>

              {/* STATISTIC 2: VOTES RECEIVED TODAY */}
              <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-brand-navy">Votes Received Today</h3>
                        <span className="text-[10px] text-emerald-600 font-semibold font-mono">Asia/Manila (PST, UTC+08:00)</span>
                      </div>
                    </div>
                    {surveyStats?.todayVotes?.isAdjusted ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        Manual Adjustment
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        100% Organic
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Calculated strictly using the Philippine calendar day boundary (00:00:00 PST). Submissions from
                    previous calendar days are accurately partitioned.
                  </p>

                  {/* 3 Metric Pills */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block truncate">Calculated</span>
                      <span className="font-mono font-black text-sm text-slate-700">
                        {(surveyStats?.todayVotes?.calculated ?? analytics?.summary?.rawTodaySubmissions ?? 0).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block truncate">Adjustment</span>
                      <span
                        className={`font-mono font-bold text-sm ${
                          (surveyStats?.todayVotes?.adjustment ?? 0) !== 0
                            ? (surveyStats?.todayVotes?.adjustment ?? 0) > 0
                              ? "text-emerald-600"
                              : "text-amber-600"
                            : "text-slate-400"
                        }`}
                      >
                        {(surveyStats?.todayVotes?.adjustment ?? 0) > 0
                          ? `+${(surveyStats?.todayVotes?.adjustment ?? 0).toLocaleString()}`
                          : (surveyStats?.todayVotes?.adjustment ?? 0).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-emerald-600 block truncate">Public Total</span>
                      <span className="font-mono font-black text-sm text-emerald-600">
                        {(surveyStats?.todayVotes?.displayed ?? analytics?.summary?.todaySubmissions ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Adjustment Controls */}
                  <div className="pt-2 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-brand-navy">
                      <span>Adjust Today&apos;s Counter</span>
                      <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setTodayVotesMode("TARGET")}
                          className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                            todayVotesMode === "TARGET"
                              ? "bg-white text-brand-navy shadow-xs"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          Target Total
                        </button>
                        <button
                          type="button"
                          onClick={() => setTodayVotesMode("ADJUSTMENT")}
                          className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                            todayVotesMode === "ADJUSTMENT"
                              ? "bg-white text-brand-navy shadow-xs"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          Adjustment (+/-)
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        {todayVotesMode === "TARGET"
                          ? "Approved Displayed Today (e.g. 500)"
                          : "Manual Daily Adjustment (+/-)"}
                      </label>
                      <input
                        type="number"
                        min="0"
                        disabled={isAnalyst}
                        placeholder={
                          todayVotesMode === "TARGET"
                            ? `Current displayed: ${(surveyStats?.todayVotes?.displayed ?? 0).toLocaleString()}`
                            : "e.g. +100 or -20"
                        }
                        value={todayVotesInput}
                        onChange={(e) => setTodayVotesInput(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-blue/30 font-mono font-bold"
                      />
                      {todayVotesInput !== "" && !isNaN(parseInt(todayVotesInput, 10)) && (
                        <p className="text-[10px] text-emerald-600 mt-1 font-mono">
                          {todayVotesMode === "TARGET" ? (
                            <>
                              Calculated Today (
                              {(surveyStats?.todayVotes?.calculated ?? 0).toLocaleString()}) + Adjustment (
                              {parseInt(todayVotesInput, 10) - (surveyStats?.todayVotes?.calculated ?? 0) >= 0
                                ? `+${parseInt(todayVotesInput, 10) - (surveyStats?.todayVotes?.calculated ?? 0)}`
                                : parseInt(todayVotesInput, 10) - (surveyStats?.todayVotes?.calculated ?? 0)}
                              ) = <strong>{Math.max(0, parseInt(todayVotesInput, 10)).toLocaleString()} displayed</strong>
                            </>
                          ) : (
                            <>
                              Calculated Today (
                              {(surveyStats?.todayVotes?.calculated ?? 0).toLocaleString()}) + Adjustment (
                              {parseInt(todayVotesInput, 10) >= 0
                                ? `+${parseInt(todayVotesInput, 10)}`
                                : parseInt(todayVotesInput, 10)}
                              ) ={" "}
                              <strong>
                                {Math.max(
                                  0,
                                  (surveyStats?.todayVotes?.calculated ?? 0) + parseInt(todayVotesInput, 10)
                                ).toLocaleString()}{" "}
                                displayed
                              </strong>
                            </>
                          )}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Audit Reason <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        disabled={isAnalyst}
                        placeholder="e.g. Daily synchronization with regional verification hubs"
                        value={todayVotesReason}
                        onChange={(e) => setTodayVotesReason(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-blue/30"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    disabled={
                      isAnalyst ||
                      savingStatKey === "TODAY_VOTES" ||
                      (surveyStats?.todayVotes?.adjustment ?? 0) === 0
                    }
                    onClick={() => {
                      const calc = surveyStats?.todayVotes?.calculated ?? 0;
                      const curAdj = surveyStats?.todayVotes?.adjustment ?? 0;
                      setStatsConfirmModal({
                        open: true,
                        title: "Reset Votes Received Today",
                        statisticName: "Votes Received Today",
                        action: "RESET",
                        calculatedValue: calc.toLocaleString(),
                        currentAdjustment: curAdj >= 0 ? `+${curAdj}` : curAdj,
                        newAdjustment: "0 (Zero Adjustment)",
                        currentDisplayed: (calc + curAdj).toLocaleString(),
                        resultingDisplayed: calc.toLocaleString(),
                        reason: "Reset to calculated Philippine calendar day baseline",
                        onConfirm: async () => {
                          await handleResetStat("TODAY_VOTES", "Reset to calculated baseline");
                          setTodayVotesInput("");
                          setTodayVotesReason("");
                          setStatsConfirmModal(null);
                        },
                      });
                    }}
                    className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-slate-600 text-xs font-bold"
                  >
                    Reset
                  </button>

                  <button
                    type="button"
                    disabled={isAnalyst || savingStatKey === "TODAY_VOTES" || todayVotesInput === ""}
                    onClick={() => {
                      if (!todayVotesReason.trim() || todayVotesReason.trim().length < 3) {
                        alert("Please provide an audit reason (minimum 3 characters) explaining this adjustment.");
                        return;
                      }
                      const calc = surveyStats?.todayVotes?.calculated ?? 0;
                      const curAdj = surveyStats?.todayVotes?.adjustment ?? 0;
                      let newAdj = 0;
                      let newTotal = 0;
                      if (todayVotesMode === "TARGET") {
                        const target = parseInt(todayVotesInput, 10);
                        if (isNaN(target) || target < 0) {
                          alert("Target must be a non-negative number.");
                          return;
                        }
                        newAdj = target - calc;
                        newTotal = target;
                      } else {
                        const adj = parseInt(todayVotesInput, 10);
                        if (isNaN(adj)) {
                          alert("Adjustment must be a valid integer.");
                          return;
                        }
                        newAdj = adj;
                        newTotal = Math.max(0, calc + adj);
                      }

                      setStatsConfirmModal({
                        open: true,
                        title: "Confirm Votes Received Today Adjustment",
                        statisticName: "Votes Received Today",
                        action: "ADJUST",
                        calculatedValue: calc.toLocaleString(),
                        currentAdjustment: curAdj >= 0 ? `+${curAdj}` : curAdj,
                        newAdjustment: newAdj >= 0 ? `+${newAdj}` : newAdj,
                        currentDisplayed: Math.max(0, calc + curAdj).toLocaleString(),
                        resultingDisplayed: newTotal.toLocaleString(),
                        reason: todayVotesReason.trim(),
                        onConfirm: async () => {
                          await handleApplyStat("TODAY_VOTES", {
                            adjustment: newAdj,
                            reason: todayVotesReason.trim(),
                          });
                          setTodayVotesInput("");
                          setTodayVotesReason("");
                          setStatsConfirmModal(null);
                        },
                      });
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    {savingStatKey === "TODAY_VOTES" ? "Saving..." : "Save Adjustment"}
                  </button>
                </div>
              </div>

              {/* STATISTIC 3: PROVINCES REPORTING */}
              <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-brand-navy">Provinces Reporting</h3>
                        <span className="text-[10px] text-purple-700 font-semibold font-mono">82 Provinces Configured</span>
                      </div>
                    </div>
                    {surveyStats?.provincesReporting?.isOverridden ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        Coverage Override
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        100% Calculated
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Calculates distinct provinces with at least one active, qualifying submission. Submissions without
                    a province are excluded from geographic coverage tallies.
                  </p>

                  {/* 3 Metric Pills */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block truncate">Calculated</span>
                      <span className="font-mono font-black text-sm text-slate-700">
                        {surveyStats?.provincesReporting?.calculated ?? analytics?.summary?.rawProvincesReporting ?? 0} / 82
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block truncate">Override</span>
                      <span
                        className={`font-mono font-bold text-sm ${
                          surveyStats?.provincesReporting?.override !== null && surveyStats?.provincesReporting?.override !== undefined
                            ? "text-purple-700"
                            : "text-slate-400"
                        }`}
                      >
                        {surveyStats?.provincesReporting?.override !== null && surveyStats?.provincesReporting?.override !== undefined
                          ? `${surveyStats.provincesReporting.override} / 82`
                          : "None"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-[#0B1E36] block truncate">Public Total</span>
                      <span className="font-mono font-black text-sm text-[#0B1E36]">
                        {surveyStats?.provincesReporting?.displayed ?? analytics?.summary?.provincesReporting ?? 0} / 82
                      </span>
                    </div>
                  </div>

                  {/* Override Controls */}
                  <div className="pt-2 border-t border-slate-100 space-y-3">
                    <span className="text-xs font-bold text-brand-navy block">Configure Coverage Override</span>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Approved Provinces Reporting (0 to 82)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="82"
                        disabled={isAnalyst}
                        placeholder={`e.g. 66 (out of 82 total provinces)`}
                        value={provincesOverrideInput}
                        onChange={(e) => setProvincesOverrideInput(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-blue/30 font-mono font-bold"
                      />
                      {provincesOverrideInput !== "" && !isNaN(parseInt(provincesOverrideInput, 10)) && (
                        <p className="text-[10px] text-purple-700 mt-1 font-mono">
                          Public display will show:{" "}
                          <strong>
                            {Math.min(82, Math.max(0, parseInt(provincesOverrideInput, 10)))} / 82 provinces (
                            {((Math.min(82, Math.max(0, parseInt(provincesOverrideInput, 10))) / 82) * 100).toFixed(1)}% coverage)
                          </strong>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Audit Reason <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        disabled={isAnalyst}
                        placeholder="e.g. Verification of provincial return coverage across island groups"
                        value={provincesReason}
                        onChange={(e) => setProvincesReason(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-blue/30"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    disabled={
                      isAnalyst ||
                      savingStatKey === "PROVINCES_REPORTING" ||
                      surveyStats?.provincesReporting?.override === null ||
                      surveyStats?.provincesReporting?.override === undefined
                    }
                    onClick={() => {
                      const calc = surveyStats?.provincesReporting?.calculated ?? 0;
                      const curOver = surveyStats?.provincesReporting?.override;
                      setStatsConfirmModal({
                        open: true,
                        title: "Reset Provinces Reporting Override",
                        statisticName: "Provinces Reporting",
                        action: "RESET",
                        calculatedValue: `${calc} / 82`,
                        currentAdjustment: curOver !== null && curOver !== undefined ? `${curOver} / 82` : "None",
                        newAdjustment: "None (Calculated)",
                        currentDisplayed: `${surveyStats?.provincesReporting?.displayed ?? calc} / 82`,
                        resultingDisplayed: `${calc} / 82`,
                        reason: "Reset to calculated distinct reporting provinces",
                        onConfirm: async () => {
                          await handleResetStat("PROVINCES_REPORTING", "Reset to calculated baseline");
                          setProvincesOverrideInput("");
                          setProvincesReason("");
                          setStatsConfirmModal(null);
                        },
                      });
                    }}
                    className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-slate-600 text-xs font-bold"
                  >
                    Reset
                  </button>

                  <button
                    type="button"
                    disabled={isAnalyst || savingStatKey === "PROVINCES_REPORTING" || provincesOverrideInput === ""}
                    onClick={() => {
                      if (!provincesReason.trim() || provincesReason.trim().length < 3) {
                        alert("Please provide an audit reason (minimum 3 characters) explaining this coverage override.");
                        return;
                      }
                      const val = parseInt(provincesOverrideInput, 10);
                      if (isNaN(val) || val < 0 || val > 82) {
                        alert("Provinces Reporting must be an integer between 0 and 82.");
                        return;
                      }
                      const calc = surveyStats?.provincesReporting?.calculated ?? 0;
                      const curOver = surveyStats?.provincesReporting?.override;

                      setStatsConfirmModal({
                        open: true,
                        title: "Confirm Provinces Reporting Override",
                        statisticName: "Provinces Reporting",
                        action: "ADJUST",
                        calculatedValue: `${calc} / 82`,
                        currentAdjustment: curOver !== null && curOver !== undefined ? `${curOver} / 82` : "None",
                        newAdjustment: `${val} / 82 override`,
                        currentDisplayed: `${surveyStats?.provincesReporting?.displayed ?? calc} / 82`,
                        resultingDisplayed: `${val} / 82`,
                        reason: provincesReason.trim(),
                        onConfirm: async () => {
                          await handleApplyStat("PROVINCES_REPORTING", {
                            override: val,
                            reason: provincesReason.trim(),
                          });
                          setProvincesOverrideInput("");
                          setProvincesReason("");
                          setStatsConfirmModal(null);
                        },
                      });
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-40 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    {savingStatKey === "PROVINCES_REPORTING" ? "Saving..." : "Save Override"}
                  </button>
                </div>
              </div>

              {/* STATISTIC 4: DOMESTIC (PH) VOTES */}
              <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-brand-navy">Domestic (PH)</h3>
                        <span className="text-[10px] text-sky-700 font-semibold font-mono">Philippine Provinces &amp; Cities</span>
                      </div>
                    </div>
                    {(surveyStats?.domesticVotes?.adjustment ?? 0) !== 0 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        Manual Adjustment
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        100% Organic
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Accurately reflects unique, eligible active submissions originating within Philippine provinces and chartered cities.
                  </p>

                  {/* 3 Metric Pills */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block truncate">Calculated</span>
                      <span className="font-mono font-black text-sm text-slate-700">
                        {(surveyStats?.domesticVotes?.calculated ?? analytics?.summary?.rawDomesticSubmissions ?? 0).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block truncate">Adjustment</span>
                      <span
                        className={`font-mono font-bold text-sm ${
                          (surveyStats?.domesticVotes?.adjustment ?? 0) !== 0
                            ? (surveyStats?.domesticVotes?.adjustment ?? 0) > 0
                              ? "text-sky-700"
                              : "text-amber-600"
                            : "text-slate-400"
                        }`}
                      >
                        {(surveyStats?.domesticVotes?.adjustment ?? 0) > 0
                          ? `+${(surveyStats?.domesticVotes?.adjustment ?? 0).toLocaleString()}`
                          : (surveyStats?.domesticVotes?.adjustment ?? 0).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-sky-700 block truncate">Public Total</span>
                      <span className="font-mono font-black text-sm text-sky-700">
                        {(surveyStats?.domesticVotes?.displayed ?? analytics?.summary?.domesticSubmissionsCount ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Adjustment Controls */}
                  <div className="pt-2 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-navy">Adjust Domestic Counter</span>
                      <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                        <button
                          type="button"
                          onClick={() => setDomesticVotesMode("TARGET")}
                          className={`px-2 py-0.5 rounded ${
                            domesticVotesMode === "TARGET" ? "bg-white text-brand-navy shadow-xs" : "text-slate-500"
                          }`}
                        >
                          Target Total
                        </button>
                        <button
                          type="button"
                          onClick={() => setDomesticVotesMode("ADJUSTMENT")}
                          className={`px-2 py-0.5 rounded ${
                            domesticVotesMode === "ADJUSTMENT" ? "bg-white text-brand-navy shadow-xs" : "text-slate-500"
                          }`}
                        >
                          Adjustment (+/-)
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        {domesticVotesMode === "TARGET"
                          ? "Approved Displayed Total (e.g. 500)"
                          : "Manual Delta (+/- to add/subtract)"}
                      </label>
                      <input
                        type="number"
                        disabled={isAnalyst}
                        placeholder={
                          domesticVotesMode === "TARGET"
                            ? `Current displayed: ${surveyStats?.domesticVotes?.displayed ?? 0}`
                            : "e.g. +50 or -10"
                        }
                        value={domesticVotesInput}
                        onChange={(e) => setDomesticVotesInput(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-blue/30 font-mono font-bold"
                      />
                      {domesticVotesInput !== "" && !isNaN(parseInt(domesticVotesInput, 10)) && (
                        <p className="text-[10px] text-sky-700 mt-1 font-mono">
                          {domesticVotesMode === "TARGET" ? (
                            <>
                              Calculated ({(surveyStats?.domesticVotes?.calculated ?? 0).toLocaleString()}) + Adjustment (
                              {parseInt(domesticVotesInput, 10) - (surveyStats?.domesticVotes?.calculated ?? 0) >= 0
                                ? `+${parseInt(domesticVotesInput, 10) - (surveyStats?.domesticVotes?.calculated ?? 0)}`
                                : parseInt(domesticVotesInput, 10) - (surveyStats?.domesticVotes?.calculated ?? 0)}
                              ) = <strong>{Math.max(0, parseInt(domesticVotesInput, 10)).toLocaleString()} displayed</strong>
                            </>
                          ) : (
                            <>
                              Calculated ({(surveyStats?.domesticVotes?.calculated ?? 0).toLocaleString()}) + (
                              {parseInt(domesticVotesInput, 10) >= 0
                                ? `+${parseInt(domesticVotesInput, 10)}`
                                : parseInt(domesticVotesInput, 10)}
                              ) ={" "}
                              <strong>
                                {Math.max(
                                  0,
                                  (surveyStats?.domesticVotes?.calculated ?? 0) + parseInt(domesticVotesInput, 10)
                                ).toLocaleString()}{" "}
                                displayed
                              </strong>
                            </>
                          )}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Audit Reason <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        disabled={isAnalyst}
                        placeholder="e.g. Turnout verification for domestic precinct reporting"
                        value={domesticVotesReason}
                        onChange={(e) => setDomesticVotesReason(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-blue/30"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    disabled={
                      isAnalyst ||
                      savingStatKey === "DOMESTIC_VOTES" ||
                      (surveyStats?.domesticVotes?.adjustment ?? 0) === 0
                    }
                    onClick={() => {
                      const calc = surveyStats?.domesticVotes?.calculated ?? 0;
                      const curAdj = surveyStats?.domesticVotes?.adjustment ?? 0;
                      setStatsConfirmModal({
                        open: true,
                        title: "Reset Domestic (PH) Votes",
                        statisticName: "Domestic (PH) Votes",
                        action: "RESET",
                        calculatedValue: calc.toLocaleString(),
                        currentAdjustment: curAdj >= 0 ? `+${curAdj}` : curAdj,
                        newAdjustment: "0 (Zero Adjustment)",
                        currentDisplayed: (calc + curAdj).toLocaleString(),
                        resultingDisplayed: calc.toLocaleString(),
                        reason: "Reset to calculated domestic baseline",
                        onConfirm: async () => {
                          await handleResetStat("DOMESTIC_VOTES", "Reset to calculated baseline");
                          setDomesticVotesInput("");
                          setDomesticVotesReason("");
                          setStatsConfirmModal(null);
                        },
                      });
                    }}
                    className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-slate-600 text-xs font-bold"
                  >
                    Reset
                  </button>

                  <button
                    type="button"
                    disabled={isAnalyst || savingStatKey === "DOMESTIC_VOTES" || domesticVotesInput === ""}
                    onClick={() => {
                      if (!domesticVotesReason.trim() || domesticVotesReason.trim().length < 3) {
                        alert("Please provide an audit reason (minimum 3 characters) explaining this adjustment.");
                        return;
                      }
                      const calc = surveyStats?.domesticVotes?.calculated ?? 0;
                      const curAdj = surveyStats?.domesticVotes?.adjustment ?? 0;
                      let newAdj = 0;
                      let newTotal = 0;
                      if (domesticVotesMode === "TARGET") {
                        const target = parseInt(domesticVotesInput, 10);
                        if (isNaN(target) || target < 0) {
                          alert("Target must be a non-negative number.");
                          return;
                        }
                        newAdj = target - calc;
                        newTotal = target;
                      } else {
                        const adj = parseInt(domesticVotesInput, 10);
                        if (isNaN(adj)) {
                          alert("Adjustment must be a valid integer.");
                          return;
                        }
                        newAdj = adj;
                        newTotal = Math.max(0, calc + adj);
                      }

                      setStatsConfirmModal({
                        open: true,
                        title: "Confirm Domestic (PH) Votes Adjustment",
                        statisticName: "Domestic (PH) Votes",
                        action: "ADJUST",
                        calculatedValue: calc.toLocaleString(),
                        currentAdjustment: curAdj >= 0 ? `+${curAdj}` : curAdj,
                        newAdjustment: newAdj >= 0 ? `+${newAdj}` : newAdj,
                        currentDisplayed: Math.max(0, calc + curAdj).toLocaleString(),
                        resultingDisplayed: newTotal.toLocaleString(),
                        reason: domesticVotesReason.trim(),
                        onConfirm: async () => {
                          await handleApplyStat("DOMESTIC_VOTES", {
                            adjustment: newAdj,
                            reason: domesticVotesReason.trim(),
                          });
                          setDomesticVotesInput("");
                          setDomesticVotesReason("");
                          setStatsConfirmModal(null);
                        },
                      });
                    }}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    {savingStatKey === "DOMESTIC_VOTES" ? "Saving..." : "Save Adjustment"}
                  </button>
                </div>
              </div>

              {/* STATISTIC 5: OVERSEAS (OFW) VOTES */}
              <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-brand-navy">Overseas (OFW)</h3>
                        <span className="text-[10px] text-indigo-700 font-semibold font-mono">Global Filipino Diaspora</span>
                      </div>
                    </div>
                    {(surveyStats?.overseasVotes?.adjustment ?? 0) !== 0 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        Manual Adjustment
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        100% Organic
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Calculates eligible voluntary survey submissions from overseas Filipino workers (OFW) and diaspora across global regions.
                  </p>

                  {/* 3 Metric Pills */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block truncate">Calculated</span>
                      <span className="font-mono font-black text-sm text-slate-700">
                        {(surveyStats?.overseasVotes?.calculated ?? analytics?.summary?.rawOverseasSubmissions ?? 0).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block truncate">Adjustment</span>
                      <span
                        className={`font-mono font-bold text-sm ${
                          (surveyStats?.overseasVotes?.adjustment ?? 0) !== 0
                            ? (surveyStats?.overseasVotes?.adjustment ?? 0) > 0
                              ? "text-indigo-700"
                              : "text-amber-600"
                            : "text-slate-400"
                        }`}
                      >
                        {(surveyStats?.overseasVotes?.adjustment ?? 0) > 0
                          ? `+${(surveyStats?.overseasVotes?.adjustment ?? 0).toLocaleString()}`
                          : (surveyStats?.overseasVotes?.adjustment ?? 0).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-indigo-700 block truncate">Public Total</span>
                      <span className="font-mono font-black text-sm text-indigo-700">
                        {(surveyStats?.overseasVotes?.displayed ?? analytics?.summary?.overseasSubmissionsCount ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Adjustment Controls */}
                  <div className="pt-2 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-navy">Adjust Overseas Counter</span>
                      <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                        <button
                          type="button"
                          onClick={() => setOverseasVotesMode("TARGET")}
                          className={`px-2 py-0.5 rounded ${
                            overseasVotesMode === "TARGET" ? "bg-white text-brand-navy shadow-xs" : "text-slate-500"
                          }`}
                        >
                          Target Total
                        </button>
                        <button
                          type="button"
                          onClick={() => setOverseasVotesMode("ADJUSTMENT")}
                          className={`px-2 py-0.5 rounded ${
                            overseasVotesMode === "ADJUSTMENT" ? "bg-white text-brand-navy shadow-xs" : "text-slate-500"
                          }`}
                        >
                          Adjustment (+/-)
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        {overseasVotesMode === "TARGET"
                          ? "Approved Displayed Total (e.g. 100)"
                          : "Manual Delta (+/- to add/subtract)"}
                      </label>
                      <input
                        type="number"
                        disabled={isAnalyst}
                        placeholder={
                          overseasVotesMode === "TARGET"
                            ? `Current displayed: ${surveyStats?.overseasVotes?.displayed ?? 0}`
                            : "e.g. +20 or -5"
                        }
                        value={overseasVotesInput}
                        onChange={(e) => setOverseasVotesInput(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-blue/30 font-mono font-bold"
                      />
                      {overseasVotesInput !== "" && !isNaN(parseInt(overseasVotesInput, 10)) && (
                        <p className="text-[10px] text-indigo-700 mt-1 font-mono">
                          {overseasVotesMode === "TARGET" ? (
                            <>
                              Calculated ({(surveyStats?.overseasVotes?.calculated ?? 0).toLocaleString()}) + Adjustment (
                              {parseInt(overseasVotesInput, 10) - (surveyStats?.overseasVotes?.calculated ?? 0) >= 0
                                ? `+${parseInt(overseasVotesInput, 10) - (surveyStats?.overseasVotes?.calculated ?? 0)}`
                                : parseInt(overseasVotesInput, 10) - (surveyStats?.overseasVotes?.calculated ?? 0)}
                              ) = <strong>{Math.max(0, parseInt(overseasVotesInput, 10)).toLocaleString()} displayed</strong>
                            </>
                          ) : (
                            <>
                              Calculated ({(surveyStats?.overseasVotes?.calculated ?? 0).toLocaleString()}) + (
                              {parseInt(overseasVotesInput, 10) >= 0
                                ? `+${parseInt(overseasVotesInput, 10)}`
                                : parseInt(overseasVotesInput, 10)}
                              ) ={" "}
                              <strong>
                                {Math.max(
                                  0,
                                  (surveyStats?.overseasVotes?.calculated ?? 0) + parseInt(overseasVotesInput, 10)
                                ).toLocaleString()}{" "}
                                displayed
                              </strong>
                            </>
                          )}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Audit Reason <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        disabled={isAnalyst}
                        placeholder="e.g. Calibration of global diaspora and seafarer voter submissions"
                        value={overseasVotesReason}
                        onChange={(e) => setOverseasVotesReason(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-blue/30"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    disabled={
                      isAnalyst ||
                      savingStatKey === "OVERSEAS_VOTES" ||
                      (surveyStats?.overseasVotes?.adjustment ?? 0) === 0
                    }
                    onClick={() => {
                      const calc = surveyStats?.overseasVotes?.calculated ?? 0;
                      const curAdj = surveyStats?.overseasVotes?.adjustment ?? 0;
                      setStatsConfirmModal({
                        open: true,
                        title: "Reset Overseas (OFW) Votes",
                        statisticName: "Overseas (OFW) Votes",
                        action: "RESET",
                        calculatedValue: calc.toLocaleString(),
                        currentAdjustment: curAdj >= 0 ? `+${curAdj}` : curAdj,
                        newAdjustment: "0 (Zero Adjustment)",
                        currentDisplayed: (calc + curAdj).toLocaleString(),
                        resultingDisplayed: calc.toLocaleString(),
                        reason: "Reset to calculated overseas baseline",
                        onConfirm: async () => {
                          await handleResetStat("OVERSEAS_VOTES", "Reset to calculated baseline");
                          setOverseasVotesInput("");
                          setOverseasVotesReason("");
                          setStatsConfirmModal(null);
                        },
                      });
                    }}
                    className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-slate-600 text-xs font-bold"
                  >
                    Reset
                  </button>

                  <button
                    type="button"
                    disabled={isAnalyst || savingStatKey === "OVERSEAS_VOTES" || overseasVotesInput === ""}
                    onClick={() => {
                      if (!overseasVotesReason.trim() || overseasVotesReason.trim().length < 3) {
                        alert("Please provide an audit reason (minimum 3 characters) explaining this adjustment.");
                        return;
                      }
                      const calc = surveyStats?.overseasVotes?.calculated ?? 0;
                      const curAdj = surveyStats?.overseasVotes?.adjustment ?? 0;
                      let newAdj = 0;
                      let newTotal = 0;
                      if (overseasVotesMode === "TARGET") {
                        const target = parseInt(overseasVotesInput, 10);
                        if (isNaN(target) || target < 0) {
                          alert("Target must be a non-negative number.");
                          return;
                        }
                        newAdj = target - calc;
                        newTotal = target;
                      } else {
                        const adj = parseInt(overseasVotesInput, 10);
                        if (isNaN(adj)) {
                          alert("Adjustment must be a valid integer.");
                          return;
                        }
                        newAdj = adj;
                        newTotal = Math.max(0, calc + adj);
                      }

                      setStatsConfirmModal({
                        open: true,
                        title: "Confirm Overseas (OFW) Votes Adjustment",
                        statisticName: "Overseas (OFW) Votes",
                        action: "ADJUST",
                        calculatedValue: calc.toLocaleString(),
                        currentAdjustment: curAdj >= 0 ? `+${curAdj}` : curAdj,
                        newAdjustment: newAdj >= 0 ? `+${newAdj}` : newAdj,
                        currentDisplayed: Math.max(0, calc + curAdj).toLocaleString(),
                        resultingDisplayed: newTotal.toLocaleString(),
                        reason: overseasVotesReason.trim(),
                        onConfirm: async () => {
                          await handleApplyStat("OVERSEAS_VOTES", {
                            adjustment: newAdj,
                            reason: overseasVotesReason.trim(),
                          });
                          setOverseasVotesInput("");
                          setOverseasVotesReason("");
                          setStatsConfirmModal(null);
                        },
                      });
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    {savingStatKey === "OVERSEAS_VOTES" ? "Saving..." : "Save Adjustment"}
                  </button>
                </div>
              </div>
            </div>

            {/* AUDIT LOG TABLE FOR SURVEY STATISTICS */}
            <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-brand-blue" />
                  <h3 className="text-sm font-bold text-brand-navy uppercase tracking-wider">
                    Survey Statistics Calibration Audit Trail
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {statsAuditLogs.length} audit record{statsAuditLogs.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead>
                    <tr className="border-b border-brand-border text-slate-400 uppercase text-[10px] tracking-wider">
                      <th className="py-2.5 px-3">Timestamp (UTC+8)</th>
                      <th className="py-2.5 px-3">Administrator</th>
                      <th className="py-2.5 px-3">Action</th>
                      <th className="py-2.5 px-3">Calibration Audit Details &amp; Reason</th>
                      <th className="py-2.5 px-3 text-right">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {statsAuditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-xs text-slate-400 italic">
                          No statistics adjustments recorded. All survey counters currently reflect 100% organic system-calculated baselines.
                        </td>
                      </tr>
                    ) : (
                      statsAuditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                            {new Date(log.createdAt).toLocaleString("en-US", { timeZone: "Asia/Manila" })}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-brand-navy">
                            {log.adminEmail}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-brand-blue">
                              {log.action.replace("STATISTICS_", "")}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 text-xs">
                            {log.details}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-400 text-[10px]">
                            {log.ipAddress || "::1"}
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
                      {groupedCandidates.map((group) => (
                        <optgroup key={group.key} label={group.label} className="font-bold text-brand-navy">
                          {group.candidates.map((c) => (
                            <option key={c.id} value={c.id} className="font-normal text-slate-800">
                              {c.name} ({c.position}) &bull; {c.party || "Ind"}
                            </option>
                          ))}
                        </optgroup>
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
            {/* Storage Optimization Audit Panel */}
            {storageAudit && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center flex-shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#0B1E36] flex items-center gap-2">
                      <span>Candidate Media Storage &amp; Optimization</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {storageAudit.savingsPercent} Saved
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Original Storage: <strong>{storageAudit.totalOriginalMB}</strong> ({storageAudit.originalCount} portraits) &bull; 
                      Optimized WebP: <strong>{storageAudit.totalOptimizedMB}</strong> ({storageAudit.optimizedCount} WebP) &bull; 
                      Net Saved: <strong>{((storageAudit.savingsBytes || 0) / (1024 * 1024)).toFixed(2)} MB</strong>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isAnalyst || optimizingImages}
                  onClick={triggerOptimizeImages}
                  className="px-3.5 py-1.5 rounded-xl bg-[#004B93] hover:bg-sky-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-40 flex-shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${optimizingImages ? "animate-spin" : ""}`} />
                  <span>{optimizingImages ? "Compressing Images..." : "Re-optimize Candidate Media"}</span>
                </button>
              </div>
            )}

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
                    <th className="py-3 px-3">Legislative Records</th>
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
                        <button
                          onClick={() => {
                            setSelectedLegCandidateId(c.id);
                            loadCandidateLegislativeRecords(c.id);
                            setActiveTab("LEGISLATIVE");
                          }}
                          className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 hover:bg-sky-100 font-bold text-[11px] inline-flex items-center gap-1 border border-sky-200/60 transition-colors"
                          title="View & Review Legislative Records"
                        >
                          <Landmark className="w-3 h-3 text-sky-600" />
                          <span>{c.legislativeRecords?.length ?? c._count?.legislativeRecords ?? 0} bills</span>
                        </button>
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
                        <button
                          disabled={isAnalyst}
                          onClick={() => triggerImportLegislative(c)}
                          className="p-1 rounded hover:bg-sky-50 text-sky-700 disabled:opacity-30 inline-flex items-center"
                          title="One-Click Import Legislative Records from Senate & House"
                        >
                          <Landmark className="w-3.5 h-3.5 text-sky-600" />
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
        {/* TAB: LEGISLATIVE RECORDS & REVIEW                         */}
        {/* ========================================================= */}
        {activeTab === "LEGISLATIVE" && (
          <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-[#004B93]" />
                  <h2 className="text-lg font-bold text-brand-navy">
                    Official Candidate Legislative Records
                  </h2>
                </div>
                <p className="text-xs text-brand-slate mt-1">
                  Automated one-click retrieval and verification of legislative bills, resolutions, and Republic Acts from the Senate and House of Representatives document repositories.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  disabled={isAnalyst || !selectedLegCandidateId || importingLegislative}
                  onClick={() => {
                    const c = candidates.find((cand) => cand.id === selectedLegCandidateId);
                    if (c) triggerImportLegislative(c);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#004B93] hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-40"
                >
                  <Landmark className="w-4 h-4 text-amber-300" />
                  <span>One-Click Import Records</span>
                </button>
                <button
                  disabled={isAnalyst || !selectedLegCandidateId}
                  onClick={() => {
                    setManualBillForm({
                      candidateId: selectedLegCandidateId,
                      chamber: "SENATE",
                      congress: 19,
                      billNo: "",
                      title: "",
                      longTitle: "",
                      role: "PRINCIPAL_AUTHOR",
                      status: "PENDING",
                      republicActNo: "",
                      filedDate: "",
                      sourceUrl: "",
                      pdfUrl: "",
                    });
                    setShowManualBillModal(true);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-40"
                >
                  <Plus className="w-4 h-4 text-sky-600" />
                  <span>Add Bill Manually</span>
                </button>
              </div>
            </div>

            {/* Candidate Selector Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <label className="text-xs font-bold text-brand-navy uppercase tracking-wider flex-shrink-0">
                Select Candidate:
              </label>
              <select
                value={selectedLegCandidateId}
                onChange={(e) => {
                  setSelectedLegCandidateId(e.target.value);
                  loadCandidateLegislativeRecords(e.target.value);
                }}
                className="w-full sm:max-w-md px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {groupedCandidates.map((group) => (
                  <optgroup key={group.key} label={group.label} className="font-bold text-brand-navy">
                    {group.candidates.map((cand) => (
                      <option key={cand.id} value={cand.id} className="font-normal text-slate-800">
                        {cand.name} ({cand.position.replace("_", " ")}) — {cand.party || "Ind."} [{cand.legislativeRecords?.length ?? cand._count?.legislativeRecords ?? 0} bills]
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Selected Candidate Summary Cards */}
            {selectedLegCandidateId && legSummary && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/60 text-center">
                  <div className="text-2xl font-bold text-[#0B1E36]">{legSummary.total}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                    Total Bills
                  </div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-100 text-center">
                  <div className="text-2xl font-bold text-emerald-800">{legSummary.enacted}</div>
                  <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mt-0.5">
                    Republic Acts (RA)
                  </div>
                </div>
                <div className="bg-sky-50 rounded-xl p-3.5 border border-sky-100 text-center">
                  <div className="text-2xl font-bold text-sky-800">{legSummary.confirmed}</div>
                  <div className="text-[10px] font-bold text-sky-700 uppercase tracking-wider mt-0.5">
                    Confirmed Matches
                  </div>
                </div>
                <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-100 text-center">
                  <div className="text-2xl font-bold text-amber-800">{legSummary.needsReview}</div>
                  <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mt-0.5">
                    Needs Review
                  </div>
                </div>
              </div>
            )}

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={legSearchQuery}
                  onChange={(e) => setLegSearchQuery(e.target.value)}
                  placeholder="Filter bills by keyword, bill #, RA..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={legFilterChamber}
                  onChange={(e) => setLegFilterChamber(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-700"
                >
                  <option value="ALL">All Chambers</option>
                  <option value="SENATE">Senate</option>
                  <option value="HOUSE">House</option>
                </select>

                <select
                  value={legFilterReviewStatus}
                  onChange={(e) => setLegFilterReviewStatus(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-700"
                >
                  <option value="ALL">All Match Statuses</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="NEEDS_REVIEW">Needs Review</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>

            {/* Legislative Records Table */}
            {loadingLegRecords ? (
              <div className="text-center py-10 space-y-2">
                <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-slate-500 font-medium">Loading legislative records...</p>
              </div>
            ) : legRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[800px]">
                  <thead>
                    <tr className="border-b border-brand-border text-brand-slate uppercase text-[10px] tracking-wider">
                      <th className="py-2.5 px-3">Bill No.</th>
                      <th className="py-2.5 px-3">Title &amp; Description</th>
                      <th className="py-2.5 px-3">Chamber &amp; Congress</th>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3">Status / Law</th>
                      <th className="py-2.5 px-3">Match Confidence</th>
                      <th className="py-2.5 px-3">Review Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {legRecords
                      .filter((r) => {
                        if (legFilterChamber !== "ALL" && r.chamber !== legFilterChamber) return false;
                        if (legFilterReviewStatus !== "ALL" && r.reviewStatus !== legFilterReviewStatus) return false;
                        if (legSearchQuery.trim()) {
                          const q = legSearchQuery.toLowerCase();
                          return (
                            r.title?.toLowerCase().includes(q) ||
                            r.billNo?.toLowerCase().includes(q) ||
                            r.republicActNo?.toLowerCase().includes(q)
                          );
                        }
                        return true;
                      })
                      .map((rec) => (
                        <tr key={rec.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-3">
                            <div className="space-y-1">
                              {rec.republicActNo && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 font-mono border border-emerald-200">
                                  {rec.republicActNo}
                                </span>
                              )}
                              {rec.billNo && rec.billNo !== rec.republicActNo ? (
                                <span className="font-mono font-semibold text-slate-600 block text-[11px]">
                                  {rec.billNo}
                                </span>
                              ) : !rec.republicActNo ? (
                                <span className="font-mono font-bold text-[#0B1E36] block text-xs">
                                  {rec.billNo}
                                </span>
                              ) : null}
                            </div>
                          </td>
                          <td className="py-3 px-3 max-w-sm" title={rec.title}>
                            <div className="font-semibold text-[#0B1E36] line-clamp-3 leading-snug">
                              {rec.title}
                            </div>
                            {rec.sourceUrl && (
                              <a
                                href={rec.sourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] font-semibold text-sky-700 hover:underline mt-1"
                              >
                                <span>Official Source Link</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-700">
                            {rec.chamber === "SENATE" ? "Senate" : "House"} ({rec.congress}th)
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                                rec.role.includes("CO_AUTHOR")
                                  ? "bg-purple-50 text-purple-700 border border-purple-200"
                                  : rec.role.includes("SPONSOR")
                                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                  : "bg-sky-50 text-sky-800 border border-sky-200"
                              }`}
                            >
                              {rec.role.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                rec.status.includes("ENACTED") || rec.status.includes("REPUBLIC_ACT") || rec.republicActNo
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  : rec.status.includes("PASSED")
                                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                                  : "bg-amber-100 text-amber-800 border border-amber-200"
                              }`}
                            >
                              {rec.status.includes("REPUBLIC_ACT") || (rec.republicActNo && !rec.status.includes("PASSED"))
                                ? "REPUBLIC ACT (ENACTED)"
                                : rec.status.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-mono text-[11px] font-semibold text-slate-600">
                              {Math.round((rec.matchConfidence || 1.0) * 100)}%
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                rec.reviewStatus === "CONFIRMED"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : rec.reviewStatus === "NEEDS_REVIEW"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {rec.reviewStatus.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                            {rec.reviewStatus !== "CONFIRMED" && (
                              <button
                                disabled={isAnalyst}
                                onClick={() =>
                                  handleUpdateRecordStatus(selectedLegCandidateId, rec.id, "CONFIRMED")
                                }
                                className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold disabled:opacity-30"
                                title="Confirm this legislative record match"
                              >
                                Confirm
                              </button>
                            )}
                            {rec.reviewStatus !== "NEEDS_REVIEW" && (
                              <button
                                disabled={isAnalyst}
                                onClick={() =>
                                  handleUpdateRecordStatus(selectedLegCandidateId, rec.id, "NEEDS_REVIEW")
                                }
                                className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10px] font-bold disabled:opacity-30"
                                title="Flag for manual review"
                              >
                                Review
                              </button>
                            )}
                            <button
                              disabled={isAnalyst}
                              onClick={() => handleDeleteRecord(selectedLegCandidateId, rec.id)}
                              className="p-1 rounded hover:bg-red-50 text-red-600 disabled:opacity-30 inline-flex items-center"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 rounded-xl border border-dashed border-slate-200 text-center space-y-3 bg-slate-50/50">
                <Landmark className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="max-w-md mx-auto space-y-1">
                  <h4 className="text-sm font-bold text-brand-navy">
                    No Legislative Records Imported Yet
                  </h4>
                  <p className="text-xs text-slate-500">
                    Click &ldquo;One-Click Import Records&rdquo; to query official Senate and House archives, or add bills manually.
                  </p>
                </div>
                <button
                  disabled={isAnalyst || importingLegislative}
                  onClick={() => {
                    const c = candidates.find((cand) => cand.id === selectedLegCandidateId);
                    if (c) triggerImportLegislative(c);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#004B93] hover:bg-sky-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Landmark className="w-4 h-4 text-amber-300" />
                  <span>Import Official Legislative Records</span>
                </button>
              </div>
            )}
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
      {/* SURVEY STATISTICS ADJUSTMENT CONFIRMATION MODAL           */}
      {/* ========================================================= */}
      {statsConfirmModal?.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-brand-border p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-brand-blue">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-500" />
              <h3 className="font-headline font-bold text-base text-brand-navy uppercase">
                {statsConfirmModal.title}
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Please review the proposed survey counter calibration. This action will be permanently recorded in the
              official audit trail under your administrator credentials.
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Target Statistic:</span>
                <span className="font-bold text-brand-navy">{statsConfirmModal.statisticName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Calculated Baseline:</span>
                <span className="font-mono font-bold text-slate-700">{statsConfirmModal.calculatedValue}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/80 pt-1.5">
                <span className="text-slate-500">Current Adjustment / Override:</span>
                <span className="font-mono font-bold text-slate-600">{statsConfirmModal.currentAdjustment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">New Adjustment / Override:</span>
                <span className="font-mono font-bold text-emerald-600">{statsConfirmModal.newAdjustment}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/80 pt-1.5">
                <span className="text-slate-500">Resulting Public Display:</span>
                <span className="font-mono font-black text-brand-blue text-sm">
                  {statsConfirmModal.resultingDisplayed}
                </span>
              </div>
              <div className="border-t border-slate-200/80 pt-1.5">
                <span className="text-slate-500 block mb-0.5">Audit Reason:</span>
                <span className="text-slate-800 italic block">{statsConfirmModal.reason}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStatsConfirmModal(null)}
                className="px-4 py-2 rounded-xl border border-brand-border text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={statsConfirmModal.onConfirm}
                className="px-5 py-2 rounded-xl bg-brand-blue hover:bg-blue-700 text-white text-xs font-bold shadow transition-colors"
              >
                Confirm &amp; Apply
              </button>
            </div>
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
                  <option value="">-- Choose Candidate --</option>
                  {groupedCandidates.map((group) => (
                    <optgroup key={group.key} label={group.label} className="font-bold text-brand-navy">
                      {group.candidates.map((c) => (
                        <option key={c.id} value={c.id} className="font-normal text-slate-800">
                          {c.name} ({c.position.replace("_", " ")})
                        </option>
                      ))}
                    </optgroup>
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

      {/* ========================================================= */}
      {/* MODAL: ONE-CLICK LEGISLATIVE RECORDS IMPORTER PROGRESS    */}
      {/* ========================================================= */}
      {importModalCandidate && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B1E36]">
                    Legislative Records Importer
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Senate &amp; House of Representatives Registry
                  </p>
                </div>
              </div>
              {!importingLegislative && (
                <button
                  onClick={() => {
                    setImportModalCandidate(null);
                    setShowDiagnostics(false);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Target Candidate Bar */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 flex items-center gap-3">
              <div
                className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: importModalCandidate.color || "#004B93" }}
              ></div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-[#0B1E36] truncate">
                  {importModalCandidate.name}
                </div>
                <div className="text-[11px] text-slate-500">
                  {importModalCandidate.position.replace("_", " ")} &bull; {importModalCandidate.party || "Independent"}
                </div>
              </div>
            </div>

            {/* In-Progress State */}
            {importingLegislative && (
              <div className="text-center py-6 space-y-3">
                <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-[#0B1E36]">
                    Querying Official Legislative Archives...
                  </p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Inspecting Senate LIS, House Bills repository, and authentic public acts archive.
                  </p>
                </div>
              </div>
            )}

            {/* Error State */}
            {!importingLegislative && importError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Import Failed</span>
                </div>
                <p className="text-red-700">{importError}</p>
              </div>
            )}

            {/* Completed Result State */}
            {!importingLegislative && importResult && (
              <div className="space-y-4">
                {/* Truthful Status Banner */}
                {importResult.status === "COMPLETED" && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-emerald-900 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Import Completed</span>
                        <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase">
                          Live Verified
                        </span>
                      </div>
                      <p className="text-emerald-800 text-[11px]">{importResult.coverageNotes}</p>
                    </div>
                  </div>
                )}

                {(importResult.status === "COMPLETED_PARTIAL" || importResult.status === "PARTIAL_RESULTS") && (
                  <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-sky-900 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Completed with Partial Results</span>
                        <span className="text-[10px] bg-sky-200 text-sky-800 px-2 py-0.5 rounded font-bold uppercase">
                          Statutory Archive Fallback
                        </span>
                      </div>
                      <p className="text-sky-800 text-[11px]">{importResult.coverageNotes}</p>
                    </div>
                  </div>
                )}

                {importResult.status === "BLOCKED_BY_SOURCE" && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-rose-900 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Automated Queries Blocked by Source (HTTP 403)</span>
                        <span className="text-[10px] bg-rose-200 text-rose-800 px-2 py-0.5 rounded font-bold uppercase">
                          WAF Anti-Bot Defense
                        </span>
                      </div>
                      <p className="text-rose-800 text-[11px]">{importResult.coverageNotes}</p>
                    </div>
                  </div>
                )}

                {importResult.status === "NO_MATCHES" && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-amber-900 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">No Matches Found</span>
                        <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold uppercase">
                          Verified Non-Legislator
                        </span>
                      </div>
                      <p className="text-amber-800 text-[11px]">{importResult.coverageNotes}</p>
                    </div>
                  </div>
                )}

                {importResult.status === "NEEDS_REVIEW" && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-amber-900 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Needs Review</span>
                        <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold uppercase">
                          Check Author Attribution
                        </span>
                      </div>
                      <p className="text-amber-800 text-[11px]">{importResult.coverageNotes}</p>
                    </div>
                  </div>
                )}

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/80 text-center">
                    <div className="text-base font-bold text-[#0B1E36]">{importResult.totalFound}</div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase">Discovered</div>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-100 text-center">
                    <div className="text-base font-bold text-emerald-800">{importResult.insertedCount}</div>
                    <div className="text-[9px] font-bold text-emerald-700 uppercase">Inserted</div>
                  </div>
                  <div className="bg-sky-50 rounded-xl p-2.5 border border-sky-100 text-center">
                    <div className="text-base font-bold text-sky-800">{importResult.updatedCount}</div>
                    <div className="text-[9px] font-bold text-sky-700 uppercase">Updated</div>
                  </div>
                  <div className="bg-slate-100 rounded-xl p-2.5 border border-slate-200 text-center">
                    <div className="text-base font-bold text-slate-700">{importResult.skippedCount || 0}</div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase">Duplicates</div>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-100 text-center">
                    <div className="text-base font-bold text-amber-800">{importResult.needsReviewCount}</div>
                    <div className="text-[9px] font-bold text-amber-700 uppercase">Needs Review</div>
                  </div>
                  <div className="bg-rose-50 rounded-xl p-2.5 border border-rose-100 text-center">
                    <div className="text-base font-bold text-rose-800">{importResult.sourcesBlockedCount || 0}</div>
                    <div className="text-[9px] font-bold text-rose-700 uppercase">Blocked WAF</div>
                  </div>
                </div>

                {/* Diagnostics Toggle */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowDiagnostics(!showDiagnostics)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    <span>{showDiagnostics ? "Hide Technical Diagnostics" : "View Technical Diagnostics & Source Logs"}</span>
                    {showDiagnostics ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showDiagnostics && (
                    <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 border-b border-slate-200/80 pb-2 gap-2">
                        <span>Candidate Slug: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-slate-700">{importResult.candidateSlug}</code></span>
                        <span>Execution Duration: <strong className="text-slate-800 font-mono">{importResult.durationMs}ms</strong></span>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Official Sources Queried
                        </span>
                        {(importResult.sourcesChecked || []).map((s: any, idx: number) => (
                          <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1.5">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="font-semibold text-slate-800">{s.name}</span>
                                <div className="text-[10px] font-mono text-slate-400 break-all">{s.url}</div>
                              </div>
                              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                                s.httpStatus?.includes("200")
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : s.httpStatus?.includes("403")
                                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                                  : "bg-slate-100 text-slate-600 border border-slate-200"
                              }`}>
                                {s.httpStatus}
                              </span>
                            </div>
                            {s.parsingErrors && (
                              <div className="text-[10px] text-rose-600 bg-rose-50/50 p-1.5 rounded border border-rose-100">
                                <span className="font-semibold">Security Challenge: </span>{s.parsingErrors}
                              </div>
                            )}
                            {s.coverageLimitations && (
                              <div className="text-[10px] text-slate-500">
                                <span className="font-semibold text-slate-600">Scope: </span>{s.coverageLimitations}
                              </div>
                            )}
                            <p className="text-[11px] text-slate-600 leading-normal">{s.notes}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Assisted File Upload View */}
            {showFileImportModal && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-[#0B1E36] flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-sky-600" />
                    <span>Administrator-Assisted CSV/JSON File Import</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowFileImportModal(false);
                      setFileImportPreview(null);
                      setFileImportError("");
                    }}
                    className="text-slate-400 hover:text-slate-600 text-xs"
                  >
                    Cancel
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Upload a certified CSV or JSON export containing legislative records for {importModalCandidate.name}. Required columns/keys: <code>billNo, title, chamber, congress, role, sourceUrl</code>.
                </p>

                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={(e) => handleFileSelectForPreview(e, importModalCandidate.id)}
                  disabled={processingFileImport}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
                />

                {processingFileImport && (
                  <div className="flex items-center gap-2 text-xs text-sky-700 py-2">
                    <div className="w-3.5 h-3.5 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Parsing and validating records...</span>
                  </div>
                )}

                {fileImportError && (
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    {fileImportError}
                  </div>
                )}

                {fileImportPreview && (
                  <div className="space-y-3 pt-1 border-t border-slate-200/80">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-slate-700">Preview: {fileImportPreview.filename}</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {fileImportPreview.validation.validRecords.length} Valid Records
                        </span>
                        {fileImportPreview.validation.summary?.enactedLawsCount > 0 && (
                          <span className="text-[11px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                            {fileImportPreview.validation.summary.enactedLawsCount} Enacted Law(s)
                          </span>
                        )}
                        {fileImportPreview.validation.summary?.billsCount > 0 && (
                          <span className="text-[11px] text-sky-800 font-bold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                            {fileImportPreview.validation.summary.billsCount} Pending Bill(s)
                          </span>
                        )}
                        {fileImportPreview.validation.summary?.needsReviewCount > 0 && (
                          <span className="text-[11px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            {fileImportPreview.validation.summary.needsReviewCount} Needs Review
                          </span>
                        )}
                      </div>
                    </div>

                    {fileImportPreview.validation.invalidRows.length > 0 && (
                      <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-[11px] space-y-1">
                        <span className="font-bold">{fileImportPreview.validation.invalidRows.length} Row Validation Warning(s):</span>
                        {fileImportPreview.validation.invalidRows.slice(0, 3).map((inv: any, i: number) => (
                          <div key={i}>Row {inv.row}: {inv.errors.join(", ")}</div>
                        ))}
                      </div>
                    )}

                    {fileImportPreview.validation.warnings && fileImportPreview.validation.warnings.length > 0 && (
                      <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] space-y-1">
                        <span className="font-bold">{fileImportPreview.validation.warnings.length} Quality Warning(s) Flagged for Review:</span>
                        {fileImportPreview.validation.warnings.slice(0, 3).map((w: any, i: number) => (
                          <div key={i}>Row {w.row} ({w.billNo}): {w.warning}</div>
                        ))}
                      </div>
                    )}

                    <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-lg bg-white">
                      <table className="w-full text-left text-[11px]">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 sticky top-0 z-10">
                          <tr>
                            <th className="p-1.5">Bill / RA No</th>
                            <th className="p-1.5">Full Title</th>
                            <th className="p-1.5">Chamber</th>
                            <th className="p-1.5">Congress</th>
                            <th className="p-1.5">Role</th>
                            <th className="p-1.5">Type / Law</th>
                            <th className="p-1.5">Review</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {fileImportPreview.validation.validRecords.map((r: any, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="p-1.5 font-bold font-mono text-[#0B1E36] whitespace-nowrap">
                                {r.republicActNo ? (
                                  <span className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    {r.republicActNo}
                                  </span>
                                ) : (
                                  <span>{r.billNo}</span>
                                )}
                              </td>
                              <td className="p-1.5 max-w-xs font-medium text-slate-800 leading-snug" title={r.title}>
                                <div className="line-clamp-2">{r.title}</div>
                              </td>
                              <td className="p-1.5 whitespace-nowrap">{r.chamber}</td>
                              <td className="p-1.5 whitespace-nowrap">{r.congress}th</td>
                              <td className="p-1.5 whitespace-nowrap">
                                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-semibold">
                                  {r.role.replace(/_/g, " ")}
                                </span>
                              </td>
                              <td className="p-1.5 whitespace-nowrap">
                                <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  r.republicActNo || r.status.includes("ENACTED") || r.status.includes("REPUBLIC_ACT")
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                    : "bg-amber-100 text-amber-800 border border-amber-200"
                                }`}>
                                  {r.republicActNo ? "REPUBLIC ACT" : r.status.replace(/_/g, " ")}
                                </span>
                              </td>
                              <td className="p-1.5 whitespace-nowrap">
                                <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  r.reviewStatus === "CONFIRMED"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-amber-50 text-amber-800 border border-amber-200"
                                }`}>
                                  {r.reviewStatus === "CONFIRMED" ? "Confirmed" : "Needs Review"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-[11px] text-slate-500">
                        Safe import mode: existing matching records will be updated with full official titles and roles without creating duplicates.
                      </div>
                      <button
                        type="button"
                        disabled={processingFileImport || fileImportPreview.validation.validRecords.length === 0}
                        onClick={() => handleConfirmFileImport(importModalCandidate.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-40"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm &amp; Import ({fileImportPreview.validation.validRecords.length} Records)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 flex-wrap">
              {!importingLegislative && importResult && (
                <button
                  type="button"
                  onClick={() => triggerImportLegislative(importModalCandidate)}
                  className="px-3.5 py-2 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs transition-colors inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Search</span>
                </button>
              )}
              {!importingLegislative && (
                <button
                  type="button"
                  onClick={() => setShowFileImportModal(!showFileImportModal)}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-xs transition-colors inline-flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-sky-600" />
                  <span>Upload CSV/JSON (Assisted)</span>
                </button>
              )}
              {!importingLegislative && importResult && (importResult.status === "BLOCKED_BY_SOURCE" || importResult.status === "NO_MATCHES") && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLegCandidateId(importModalCandidate.id);
                    setManualBillForm((prev) => ({ ...prev, candidateId: importModalCandidate.id }));
                    setShowManualBillModal(true);
                    setImportModalCandidate(null);
                    setShowDiagnostics(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Add Measure Manually (Fallback)
                </button>
              )}
              {!importingLegislative && importResult && importResult.totalFound > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLegCandidateId(importModalCandidate.id);
                    loadCandidateLegislativeRecords(importModalCandidate.id);
                    setActiveTab("LEGISLATIVE");
                    setImportModalCandidate(null);
                    setShowDiagnostics(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Review Records in Dashboard
                </button>
              )}
              <button
                type="button"
                disabled={importingLegislative}
                onClick={() => {
                  setImportModalCandidate(null);
                  setShowDiagnostics(false);
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors disabled:opacity-40"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD MANUAL LEGISLATIVE RECORD                      */}
      {/* ========================================================= */}
      {showManualBillModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#0B1E36]">Add Legislative Bill Manually</h3>
              <button
                onClick={() => setShowManualBillModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveManualBill} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chamber</label>
                  <select
                    value={manualBillForm.chamber}
                    onChange={(e) => setManualBillForm({ ...manualBillForm, chamber: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none"
                  >
                    <option value="SENATE">Senate</option>
                    <option value="HOUSE">House of Representatives</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Congress Number</label>
                  <input
                    type="number"
                    value={manualBillForm.congress}
                    onChange={(e) =>
                      setManualBillForm({ ...manualBillForm, congress: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none"
                    min="1"
                    max="25"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bill Number (e.g. SB-1304)</label>
                  <input
                    type="text"
                    value={manualBillForm.billNo}
                    onChange={(e) => setManualBillForm({ ...manualBillForm, billNo: e.target.value })}
                    placeholder="SB-1304"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Republic Act No. (Optional)</label>
                  <input
                    type="text"
                    value={manualBillForm.republicActNo}
                    onChange={(e) => setManualBillForm({ ...manualBillForm, republicActNo: e.target.value })}
                    placeholder="RA 10931"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short / Official Title</label>
                <input
                  type="text"
                  value={manualBillForm.title}
                  onChange={(e) => setManualBillForm({ ...manualBillForm, title: e.target.value })}
                  placeholder="e.g. Universal Access to Quality Tertiary Education Act"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Long Title / Description</label>
                <textarea
                  value={manualBillForm.longTitle}
                  onChange={(e) => setManualBillForm({ ...manualBillForm, longTitle: e.target.value })}
                  placeholder="An Act promoting universal access to quality tertiary education..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role</label>
                  <select
                    value={manualBillForm.role}
                    onChange={(e) => setManualBillForm({ ...manualBillForm, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none"
                  >
                    <option value="PRINCIPAL_AUTHOR">Principal Author</option>
                    <option value="CO_AUTHOR">Co-Author</option>
                    <option value="SPONSOR">Sponsor</option>
                    <option value="CO_SPONSOR">Co-Sponsor</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={manualBillForm.status}
                    onChange={(e) => setManualBillForm({ ...manualBillForm, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PASSED_SENATE">Passed Senate</option>
                    <option value="PASSED_HOUSE">Passed House</option>
                    <option value="ENACTED_INTO_LAW">Enacted into Law</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Document URL</label>
                <input
                  type="url"
                  value={manualBillForm.sourceUrl}
                  onChange={(e) => setManualBillForm({ ...manualBillForm, sourceUrl: e.target.value })}
                  placeholder="https://legacy.senate.gov.ph/lis/..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official PDF Link (Optional)</label>
                <input
                  type="url"
                  value={manualBillForm.pdfUrl}
                  onChange={(e) => setManualBillForm({ ...manualBillForm, pdfUrl: e.target.value })}
                  placeholder="https://legacy.senate.gov.ph/lisdata/..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowManualBillModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingManualBill}
                  className="px-5 py-2 rounded-xl bg-[#004B93] hover:bg-sky-700 text-white font-bold transition-colors disabled:opacity-40"
                >
                  {submittingManualBill ? "Saving..." : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
