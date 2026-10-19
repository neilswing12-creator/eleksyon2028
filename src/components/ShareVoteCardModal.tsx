"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download, Share2, X, Check, Loader2, Sparkles } from "lucide-react";

export interface ShareCandidateData {
  id: string;
  name: string;
  slug?: string;
  position: string; // PRESIDENT, VICE_PRESIDENT, SENATOR
  party?: string | null;
  color: string;
  photoUrl?: string | null;
  votes: number;
  percentage?: number;
  rank?: number;
}

export interface CompetitorData {
  id: string;
  name: string;
  party?: string | null;
  color: string;
  photoUrl?: string | null;
  votes: number;
  percentage?: number;
  rank?: number;
}

interface ShareVoteCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: ShareCandidateData | null;
  competitors?: CompetitorData[];
  voterName?: string;
  provinceName?: string;
}

export default function ShareVoteCardModal({
  isOpen,
  onClose,
  candidate,
  competitors = [],
  voterName,
  provinceName,
}: ShareVoteCardModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [generating, setGenerating] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || !candidate) {
      setPreviewUrl(null);
      return;
    }

    let isMounted = true;
    setGenerating(true);

    const renderCard = async () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 1080;
        canvas.height = 1080;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Position name formatting
        const posLabel =
          candidate.position === "PRESIDENT"
            ? "PRESIDENTIAL CONTENDER"
            : candidate.position === "VICE_PRESIDENT"
            ? "VICE PRESIDENTIAL CONTENDER"
            : "SENATORIAL SLATE CONTENDER";

        const candColor = candidate.color || "#004B93";

        // 1. Base Background - Deep Midnight Navy Radial
        const bgGrad = ctx.createRadialGradient(540, 420, 100, 540, 540, 780);
        bgGrad.addColorStop(0, "#0F1A36");
        bgGrad.addColorStop(0.7, "#090E1E");
        bgGrad.addColorStop(1, "#05070E");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 1080, 1080);

        // 2. Candidate Ambient Color Aura Glow in upper canvas
        const auraGrad = ctx.createRadialGradient(540, 320, 40, 540, 320, 440);
        auraGrad.addColorStop(0, `${candColor}55`); // 33% opacity
        auraGrad.addColorStop(0.5, `${candColor}22`);
        auraGrad.addColorStop(1, "transparent");
        ctx.fillStyle = auraGrad;
        ctx.fillRect(0, 0, 1080, 700);

        // 3. Subtle Geometric Tech Grid & Stripes
        ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
        ctx.lineWidth = 1;
        for (let x = 60; x < 1080; x += 60) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, 1080);
          ctx.stroke();
        }
        for (let y = 60; y < 1080; y += 60) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(1080, y);
          ctx.stroke();
        }

        // Top Gold & Candidate Color Accent Bar (Double stripe)
        ctx.fillStyle = candColor;
        ctx.fillRect(0, 0, 1080, 10);
        ctx.fillStyle = "#FFC82C";
        ctx.fillRect(0, 10, 1080, 4);

        // 4. Header Section: ELEKSYON 2028 Broadcast Branding
        // Broadcast Brand Tag
        ctx.fillStyle = "#ED1C24"; // GMA Red
        roundRect(ctx, 60, 40, 190, 42, 8);
        ctx.fill();

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 20px 'Impact', 'Arial Black', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("ELEKSYON 2028", 155, 68);

        // Verified Survey Badge
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        roundRect(ctx, 260, 40, 240, 42, 8);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.stroke();

        ctx.fillStyle = "#38BDF8";
        ctx.beginPath();
        ctx.arc(280, 61, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#E2E8F0";
        ctx.font = "bold 15px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("LIVE VERIFIED SURVEY", 298, 67);

        // Right side: Official Voter Stance Stamp
        ctx.fillStyle = "rgba(255, 200, 44, 0.12)";
        roundRect(ctx, 770, 40, 250, 42, 21);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 200, 44, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = "#FFC82C";
        ctx.font = "bold 15px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("★ VOTED BALLOT SELECTION", 895, 67);

        // Position Sub-Header
        ctx.fillStyle = "#94A3B8";
        ctx.font = "bold 15px 'Impact', sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(posLabel, 60, 122);

        // 5. Candidate Big Showcase Card (Hero Section)
        // Background container
        const heroBoxGrad = ctx.createLinearGradient(60, 140, 1020, 430);
        heroBoxGrad.addColorStop(0, "rgba(255, 255, 255, 0.06)");
        heroBoxGrad.addColorStop(1, "rgba(255, 255, 255, 0.02)");
        ctx.fillStyle = heroBoxGrad;
        roundRect(ctx, 60, 140, 960, 290, 24);
        ctx.fill();
        ctx.strokeStyle = `${candColor}88`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Left Glow Border Indicator
        ctx.fillStyle = candColor;
        roundRect(ctx, 60, 140, 12, 290, { tl: 24, bl: 24, tr: 0, br: 0 });
        ctx.fill();

        // Candidate Portrait Avatar with circular glow ring
        const avatarX = 200;
        const avatarY = 285;
        const avatarRadius = 105;

        // Outer Aura Ring
        ctx.strokeStyle = candColor;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, avatarRadius + 6, 0, Math.PI * 2);
        ctx.stroke();

        // Inner Gold Halo
        ctx.strokeStyle = "#FFC82C";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, avatarRadius + 11, 0, Math.PI * 2);
        ctx.stroke();

        // Load & Draw Photo
        const photoImg = await loadImage(candidate.photoUrl || "");
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
        ctx.clip();
        if (photoImg) {
          ctx.drawImage(
            photoImg,
            avatarX - avatarRadius,
            avatarY - avatarRadius,
            avatarRadius * 2,
            avatarRadius * 2
          );
        } else {
          ctx.fillStyle = "#1E293B";
          ctx.fill();
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "bold 60px 'Arial Black', sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(candidate.name.slice(0, 2).toUpperCase(), avatarX, avatarY + 20);
        }
        ctx.restore();

        // Candidate Rank Badge overlay on photo
        if (candidate.rank) {
          const rankX = avatarX + 75;
          const rankY = avatarY + 75;
          ctx.fillStyle = candidate.rank === 1 ? "#FFC82C" : candColor;
          ctx.beginPath();
          ctx.arc(rankX, rankY, 28, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#0B132B";
          ctx.lineWidth = 4;
          ctx.stroke();

          ctx.fillStyle = candidate.rank === 1 ? "#0B132B" : "#FFFFFF";
          ctx.font = "black 22px 'Arial Black', sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(`#${candidate.rank}`, rankX, rankY + 8);
        }

        // Candidate Name & Details
        ctx.textAlign = "left";

        // "I VOTED FOR" Tag
        ctx.fillStyle = "#FFC82C";
        ctx.font = "black 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillText("OFFICIAL CITIZEN VOTE • 2028 RUNNER", 345, 190);

        // Candidate Name (Auto fit font size)
        ctx.fillStyle = "#FFFFFF";
        let nameFontSize = 46;
        if (candidate.name.length > 24) nameFontSize = 36;
        if (candidate.name.length > 32) nameFontSize = 30;
        ctx.font = `black ${nameFontSize}px 'Impact', 'Arial Black', sans-serif`;
        ctx.fillText(candidate.name.toUpperCase(), 345, 238);

        // Party Tag
        ctx.fillStyle = "#94A3B8";
        ctx.font = "bold 19px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillText(candidate.party ? `Party: ${candidate.party}` : "Independent Candidate", 345, 272);

        // Metric Pill: Live Vote Count
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        roundRect(ctx, 345, 295, 290, 105, 14);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = "#94A3B8";
        ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillText("LIVE VERIFIED VOTES", 365, 324);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "black 42px 'Impact', 'Arial Black', sans-serif";
        ctx.fillText(candidate.votes.toLocaleString(), 365, 375);

        // Metric Pill: Overall Percentage / Share
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        roundRect(ctx, 655, 295, 335, 105, 14);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = "#94A3B8";
        ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillText("NATIONAL VOTE SHARE", 675, 324);

        ctx.fillStyle = candColor;
        ctx.font = "black 42px 'Impact', 'Arial Black', sans-serif";
        const pctText =
          candidate.percentage !== undefined ? `${candidate.percentage}%` : "LEADING";
        ctx.fillText(pctText, 675, 375);

        if (candidate.rank) {
          ctx.fillStyle = "#FFC82C";
          ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, sans-serif";
          ctx.fillText(`RANK #${candidate.rank}`, 860, 370);
        }

        // 6. Comparative Live Leaderboard Section (vs Top Contenders)
        ctx.fillStyle = "#E2E8F0";
        ctx.font = "bold 20px 'Impact', 'Arial Black', sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("LIVE TALLY COMPARISON vs CONTENDERS", 60, 475);

        ctx.fillStyle = "#94A3B8";
        ctx.font = "14px -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.textAlign = "right";
        ctx.fillText("Real-time nationwide aggregated ballot counts", 1020, 475);

        // Competitor rows (up to 4 rows)
        const displayList = buildComparisonList(candidate, competitors);
        const maxListVotes = Math.max(...displayList.map((c) => c.votes), 1);

        let rowY = 500;
        displayList.forEach((c) => {
          const isSelected = c.id === candidate.id;
          const rowHeight = 62;

          // Row background
          ctx.fillStyle = isSelected
            ? "rgba(255, 200, 44, 0.1)"
            : "rgba(255, 255, 255, 0.03)";
          roundRect(ctx, 60, rowY, 960, rowHeight, 12);
          ctx.fill();

          if (isSelected) {
            ctx.strokeStyle = "rgba(255, 200, 44, 0.6)";
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }

          // Rank number
          ctx.fillStyle = isSelected ? "#FFC82C" : "#94A3B8";
          ctx.font = "black 20px 'Impact', 'Arial Black', sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(`${c.rank || "-"}`, 95, rowY + 39);

          // Color pip
          ctx.fillStyle = c.color || "#64748B";
          ctx.beginPath();
          ctx.arc(135, rowY + 31, 8, 0, Math.PI * 2);
          ctx.fill();

          // Name & Party
          ctx.textAlign = "left";
          ctx.fillStyle = isSelected ? "#FFFFFF" : "#CBD5E1";
          ctx.font = `bold 18px 'Impact', 'Arial Black', sans-serif`;
          ctx.fillText(c.name.toUpperCase(), 160, rowY + 38);

          if (isSelected) {
            ctx.fillStyle = "#FFC82C";
            ctx.font = "bold 12px sans-serif";
            ctx.fillText("★ MY CHOICE", 440, rowY + 37);
          }

          // Horizontal Progress Bar
          const barX = 560;
          const barWidth = 230;
          const barProgress = Math.max(8, Math.round((c.votes / maxListVotes) * barWidth));

          ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
          roundRect(ctx, barX, rowY + 22, barWidth, 18, 9);
          ctx.fill();

          ctx.fillStyle = isSelected ? candColor : "#64748B";
          roundRect(ctx, barX, rowY + 22, barProgress, 18, 9);
          ctx.fill();

          // Votes & Share Text
          ctx.textAlign = "right";
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "black 18px 'Impact', 'Arial Black', sans-serif";
          ctx.fillText(`${c.votes.toLocaleString()}`, 900, rowY + 38);

          ctx.fillStyle = isSelected ? "#FFC82C" : "#94A3B8";
          ctx.font = "bold 15px -apple-system, BlinkMacSystemFont, sans-serif";
          ctx.fillText(c.percentage !== undefined ? `${c.percentage}%` : "", 1000, rowY + 38);

          rowY += rowHeight + 12;
        });

        // 7. Footer Call-to-Action Bar with QR Code & Ballot Verification
        const footerY = 825;
        const footerHeight = 215;

        // Footer Card Container
        const footerGrad = ctx.createLinearGradient(60, footerY, 1020, footerY + footerHeight);
        footerGrad.addColorStop(0, "rgba(15, 23, 42, 0.95)");
        footerGrad.addColorStop(1, "rgba(30, 41, 59, 0.95)");
        ctx.fillStyle = footerGrad;
        roundRect(ctx, 60, footerY, 960, footerHeight, 20);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Left Voter Certificate Stamp
        ctx.textAlign = "left";
        ctx.fillStyle = "#38BDF8";
        ctx.font = "black 16px 'Impact', 'Arial Black', sans-serif";
        ctx.fillText("CERTIFIED CITIZEN SURVEY SUBMISSION", 95, footerY + 45);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 26px 'Impact', sans-serif";
        const voterDisplay = voterName ? `BALLOT CAST BY: ${voterName.toUpperCase()}` : "ANONYMOUS VERIFIED FILIPINO VOTER";
        ctx.fillText(voterDisplay, 95, footerY + 85);

        ctx.fillStyle = "#94A3B8";
        ctx.font = "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        const locationText = provinceName ? `Location Reporting: ${provinceName} • 100% Tamper-Proof HMAC Verified` : "Nationwide Geographic Network • 100% Tamper-Proof HMAC Verified";
        ctx.fillText(locationText, 95, footerY + 115);

        // Vote URL Callout
        const originUrl = typeof window !== "undefined" ? window.location.origin : "https://eleksyon2028.ph";
        const voteUrl = `${originUrl}/survey`;

        ctx.fillStyle = "#FFC82C";
        ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, monospace";
        ctx.fillText(`CAST YOUR VOTE NOW: ${voteUrl}`, 95, footerY + 160);

        ctx.fillStyle = "#64748B";
        ctx.font = "12px sans-serif";
        ctx.fillText("Scan QR code with phone camera to participate instantly", 95, footerY + 185);

        // 8. Generate & Draw QR Code on the right of footer
        const qrCanvas = document.createElement("canvas");
        await QRCode.toCanvas(qrCanvas, voteUrl, {
          width: 165,
          margin: 1,
          color: {
            dark: "#0B132B",
            light: "#FFFFFF",
          },
        });

        // QR Code backing card
        const qrX = 825;
        const qrY = footerY + 25;
        ctx.fillStyle = "#FFFFFF";
        roundRect(ctx, qrX - 8, qrY - 8, 181, 181, 12);
        ctx.fill();
        ctx.drawImage(qrCanvas, qrX, qrY, 165, 165);

        // Clean border around QR
        ctx.strokeStyle = "#FFC82C";
        ctx.lineWidth = 2;
        roundRect(ctx, qrX - 8, qrY - 8, 181, 181, 12);
        ctx.stroke();

        // 9. Watermark Bottom Edge
        ctx.fillStyle = "#475569";
        ctx.font = "11px -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          "Eleksyon 2028 Digital Survey Initiative • Real-time Civic Data • Independent and Non-Partisan",
          540,
          1065
        );

        if (isMounted) {
          const dataUrl = canvas.toDataURL("image/png");
          setPreviewUrl(dataUrl);
          setGenerating(false);
        }
      } catch (err) {
        console.error("Error generating share canvas:", err);
        if (isMounted) setGenerating(false);
      }
    };

    renderCard();

    return () => {
      isMounted = false;
    };
  }, [isOpen, candidate, competitors, voterName, provinceName]);

  const handleDownload = () => {
    if (!previewUrl || !candidate) return;
    const a = document.createElement("a");
    a.href = previewUrl;
    const candSlug = candidate.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    a.download = `eleksyon2028-voted-${candSlug}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = async () => {
    if (!previewUrl || !candidate) return;
    const shareText = `I voted for ${candidate.name} in the Eleksyon 2028 Survey! See live rankings and cast your vote here:`;
    const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/survey` : "https://eleksyon2028.ph/survey";

    if (navigator.share && navigator.canShare) {
      try {
        const blob = await (await fetch(previewUrl)).blob();
        const file = new File([blob], `eleksyon2028-${candidate.name}.png`, { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Eleksyon 2028: I Voted for ${candidate.name}!`,
            text: shareText,
            url: shareUrl,
            files: [file],
          });
          return;
        }
      } catch (e) {
        // Fallback to text share or clipboard
      }
    }

    // Fallback: Copy link & download image
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    handleDownload();
  };

  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0B132B] border-2 border-slate-700 rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gma-red flex items-center justify-center text-white shadow">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-headline font-bold text-white uppercase tracking-wider">
                Official 1080x1080 Election Share Card
              </h3>
              <p className="text-[11px] text-slate-400">
                Premium social media graphic for {candidate.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Preview Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-[#070B16]">
          {generating || !previewUrl ? (
            <div className="py-24 text-center space-y-3">
              <Loader2 className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
              <p className="text-xs font-headline font-bold uppercase tracking-wider text-slate-300">
                Generating 1080x1080 Broadcast Graphic...
              </p>
              <p className="text-[11px] text-slate-500">
                Rendering live rankings, candidate branding, and QR ballot code
              </p>
            </div>
          ) : (
            <div className="relative group max-w-md w-full aspect-square rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80">
              <img
                src={previewUrl}
                alt={`I voted for ${candidate.name}`}
                className="w-full h-full object-contain bg-black"
              />
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-bold text-amber-400 uppercase tracking-widest border border-amber-400/30">
                1080 x 1080 HD
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left text-xs text-slate-400">
            Share on <strong className="text-white">Facebook, X, Instagram, or TikTok</strong>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownload}
              disabled={generating || !previewUrl}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-headline font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download Image</span>
            </button>
            <button
              onClick={handleShare}
              disabled={generating || !previewUrl}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gma-red hover:bg-red-700 text-white text-xs font-headline font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-900/30 disabled:opacity-50"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-amber-300" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-amber-300" />
                  <span>Share My Vote</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helpers
function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (!url) return resolve(null);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number | { tl: number; tr: number; br: number; bl: number }
) {
  let r = { tl: 0, tr: 0, br: 0, bl: 0 };
  if (typeof radius === "number") {
    r = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    r = { ...r, ...radius };
  }
  ctx.beginPath();
  ctx.moveTo(x + r.tl, y);
  ctx.lineTo(x + width - r.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r.tr);
  ctx.lineTo(x + width, y + height - r.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r.br, y + height);
  ctx.lineTo(x + r.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r.bl);
  ctx.lineTo(x, y + r.tl);
  ctx.quadraticCurveTo(x, y, x + r.tl, y);
  ctx.closePath();
}

function buildComparisonList(
  selected: ShareCandidateData,
  allCompetitors: CompetitorData[]
): CompetitorData[] {
  // Ensure candidate is in the list
  const combined: CompetitorData[] = [...allCompetitors];
  const exists = combined.some((c) => c.id === selected.id);
  if (!exists) {
    combined.push(selected);
  }

  // Sort by votes descending
  combined.sort((a, b) => b.votes - a.votes);

  // Assign ranks
  combined.forEach((c, i) => {
    c.rank = i + 1;
  });

  // Top 3 + selected (if not in top 3)
  const top3 = combined.slice(0, 3);
  const selectedIndex = combined.findIndex((c) => c.id === selected.id);

  if (selectedIndex < 3) {
    return combined.slice(0, 4);
  }

  return [...top3, combined[selectedIndex]];
}
