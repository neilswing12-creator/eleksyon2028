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
        // Ensure web fonts are ready (Playfair Display / Serif, Inter / Sans)
        if (typeof document !== "undefined" && document.fonts) {
          try {
            await document.fonts.ready;
          } catch (e) {
            // continue
          }
        }

        const canvas = document.createElement("canvas");
        // Exact dimensions from FireShot template: 1080 x 1350
        canvas.width = 1080;
        canvas.height = 1350;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Colors from template:
        // --ink: #0A1730; --ink2: #10224A; --ivory: #F4EEDD; --mute: #9FAECB;
        // --gold: #D4AF5A; --red: #CE1126; --blue: #0038A8; --green: #23A573;
        const INK = "#0A1730";
        const IVORY = "#F4EEDD";
        const MUTE = "#9FAECB";
        const GOLD = "#D4AF5A";
        const RED = "#CE1126";
        const BLUE = "#0038A8";
        const GREEN = candidate.color || "#23A573"; // Use candidate's branding or green

        // 1. Background
        // Base fill
        ctx.fillStyle = INK;
        ctx.fillRect(0, 0, 1080, 1350);

        // radial-gradient(900px 600px at 80% 12%, #18346e 0%, transparent 70%)
        const rad1 = ctx.createRadialGradient(864, 162, 0, 864, 162, 600);
        rad1.addColorStop(0, "#18346e");
        rad1.addColorStop(0.7, "transparent");
        ctx.fillStyle = rad1;
        ctx.fillRect(0, 0, 1080, 1350);

        // radial-gradient(700px 500px at 0% 60%, #0f2a5c55 0%, transparent 70%)
        const rad2 = ctx.createRadialGradient(0, 810, 0, 0, 810, 500);
        rad2.addColorStop(0, "rgba(15, 42, 92, 0.33)");
        rad2.addColorStop(0.7, "transparent");
        ctx.fillStyle = rad2;
        ctx.fillRect(0, 0, 1080, 1350);

        // 2. Top Color Band: 10px height
        // linear-gradient(90deg, var(--blue) 0 40%, var(--red) 40% 80%, var(--gold) 80%)
        ctx.fillStyle = BLUE;
        ctx.fillRect(0, 0, 432, 10);
        ctx.fillStyle = RED;
        ctx.fillRect(432, 0, 432, 10);
        ctx.fillStyle = GOLD;
        ctx.fillRect(864, 0, 216, 10);

        // Inner Padding starts at x=64, y=58 + 10 = 68
        const inX = 64;
        let curY = 68;

        // 3. Top Header Bar
        // .mark: background: var(--red); padding: 11px 20px; font-weight:700; font-size:26px; border-radius:3px
        const markW = 210;
        const markH = 48;
        ctx.fillStyle = RED;
        roundRect(ctx, inX, curY, markW, markH, 4);
        ctx.fill();

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 26px 'Playfair Display', Georgia, serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Eleksyon 2028", inX + markW / 2, curY + markH / 2 + 1);

        // .live: display: flex; align-items: center; gap: 10px; font-size: 17px; color: var(--mute); letter-spacing: 2px; text-transform: uppercase
        const liveDotX = inX + markW + 28;
        const liveDotY = curY + markH / 2;

        // outer glow: box-shadow: 0 0 0 5px #43b5ff33
        ctx.fillStyle = "rgba(67, 181, 255, 0.2)";
        ctx.beginPath();
        ctx.arc(liveDotX, liveDotY, 10, 0, Math.PI * 2);
        ctx.fill();

        // inner dot: width: 10px; height: 10px; background: #43B5FF
        ctx.fillStyle = "#43B5FF";
        ctx.beginPath();
        ctx.arc(liveDotX, liveDotY, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = MUTE;
        ctx.font = "bold 17px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("LIVE VERIFIED SURVEY", liveDotX + 18, liveDotY);

        // .sel: border: 1.5px solid var(--gold); color: var(--gold); padding: 10px 20px; border-radius: 40px; font-size: 16px; letter-spacing: 2px; font-weight: 700
        const selW = 310;
        const selH = 46;
        const selX = 1080 - inX - selW;
        ctx.strokeStyle = GOLD;
        ctx.lineWidth = 1.5;
        roundRect(ctx, selX, curY, selW, selH, 23);
        ctx.stroke();

        ctx.fillStyle = GOLD;
        ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("★ VOTED BALLOT SELECTION", selX + selW / 2, curY + selH / 2 + 1);

        // 4. Position Label
        // .lab: margin: 34px 0 18px; font-size: 16px; letter-spacing: 3px; color: var(--mute); text-transform: uppercase
        curY += markH + 34;
        const posLabel =
          candidate.position === "PRESIDENT"
            ? "PRESIDENTIAL CONTENDER"
            : candidate.position === "VICE_PRESIDENT"
            ? "VICE PRESIDENTIAL CONTENDER"
            : "SENATORIAL CONTENDER";

        ctx.fillStyle = MUTE;
        ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(posLabel, inX, curY);

        // 5. Hero Container
        // .hero: padding: 46px 40px; border: 1px solid #D4AF5A66; border-radius: 6px; background: linear-gradient(135deg, #ffffff0d, #ffffff03); position: relative
        curY += 26;
        const heroX = inX;
        const heroY = curY;
        const heroW = 1080 - inX * 2; // 952px
        const heroH = 345;

        const heroBg = ctx.createLinearGradient(heroX, heroY, heroX + heroW, heroY + heroH);
        heroBg.addColorStop(0, "rgba(255, 255, 255, 0.05)");
        heroBg.addColorStop(1, "rgba(255, 255, 255, 0.01)");
        ctx.fillStyle = heroBg;
        roundRect(ctx, heroX, heroY, heroW, heroH, 6);
        ctx.fill();

        ctx.strokeStyle = "rgba(212, 175, 90, 0.4)";
        ctx.lineWidth = 1;
        roundRect(ctx, heroX, heroY, heroW, heroH, 6);
        ctx.stroke();

        // Left gold border stripe: width: 6px; background: var(--gold)
        ctx.fillStyle = GOLD;
        roundRect(ctx, heroX, heroY, 6, heroH, { tl: 6, bl: 6, tr: 0, br: 0 });
        ctx.fill();

        // Portrait: .ph: width: 260px; height: 260px;
        // border: 5px solid var(--gold); outline: 2px solid #D4AF5A55; outline-offset: 8px; border-radius: 50%
        const photoCenterX = heroX + 40 + 130;
        const photoCenterY = heroY + 46 + 130;
        const photoRadius = 125;

        // Outline ring
        ctx.strokeStyle = "rgba(212, 175, 90, 0.33)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(photoCenterX, photoCenterY, photoRadius + 12, 0, Math.PI * 2);
        ctx.stroke();

        // Solid gold border ring
        ctx.strokeStyle = GOLD;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(photoCenterX, photoCenterY, photoRadius + 2.5, 0, Math.PI * 2);
        ctx.stroke();

        // Draw candidate portrait image
        const photoImg = await loadImage(candidate.photoUrl || "");
        ctx.save();
        ctx.beginPath();
        ctx.arc(photoCenterX, photoCenterY, photoRadius, 0, Math.PI * 2);
        ctx.clip();
        if (photoImg) {
          ctx.drawImage(
            photoImg,
            photoCenterX - photoRadius,
            photoCenterY - photoRadius,
            photoRadius * 2,
            photoRadius * 2
          );
        } else {
          ctx.fillStyle = "#16284F";
          ctx.fill();
          ctx.fillStyle = IVORY;
          ctx.font = "bold 64px 'Playfair Display', Georgia, serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(candidate.name.slice(0, 2).toUpperCase(), photoCenterX, photoCenterY);
        }
        ctx.restore();

        // Rank Badge: .bd: width: 74px; height: 74px; border-radius: 50%; background: var(--green); border: 5px solid var(--ink); font-weight: 800; font-size: 26px
        const bdCenterX = photoCenterX + 130 - 15;
        const bdCenterY = photoCenterY + 130 - 18;
        const bdRadius = 37;

        ctx.fillStyle = GREEN;
        ctx.beginPath();
        ctx.arc(bdCenterX, bdCenterY, bdRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = INK;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(bdCenterX, bdCenterY, bdRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 26px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`#${candidate.rank || 1}`, bdCenterX, bdCenterY);

        // Right details in Hero
        const infoX = heroX + 40 + 260 + 44; // 408px
        let infoY = heroY + 46;

        // .kick: color: var(--gold); font-size: 16px; letter-spacing: 2.5px; text-transform: uppercase; font-weight: 700
        ctx.fillStyle = GOLD;
        ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("OFFICIAL CITIZEN VOTE • 2028 RUNNER", infoX, infoY);

        // h1: font-size: 54px with auto-fit so long names never clip or overflow the card
        infoY += 28;
        ctx.fillStyle = IVORY;
        const maxHeroW = heroW - 40 - 260 - 44 - 36; // 572px
        let candFontSize = 54;
        ctx.font = `bold ${candFontSize}px 'Playfair Display', Georgia, serif`;
        while (candFontSize > 26 && ctx.measureText(candidate.name).width > maxHeroW) {
          candFontSize -= 2;
          ctx.font = `bold ${candFontSize}px 'Playfair Display', Georgia, serif`;
        }
        ctx.fillText(candidate.name, infoX, infoY);

        // .party: color: var(--mute); font-size: 20px
        infoY += candFontSize + 12;
        ctx.fillStyle = MUTE;
        ctx.font = "20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        const partyStr = candidate.party ? `Party: ${candidate.party}` : "Independent Candidate";
        ctx.fillText(partyStr, infoX, infoY);

        // .stats: display: flex; gap: 16px
        // .st: flex: 1; border-top: 2px solid #D4AF5A88; padding-top: 12px
        infoY += 34;
        const st1X = infoX;
        const st1W = 230;
        const st2X = infoX + st1W + 24;
        const st2W = 250;

        // Stat 1: Live Verified Votes
        ctx.strokeStyle = "rgba(212, 175, 90, 0.53)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(st1X, infoY);
        ctx.lineTo(st1X + st1W, infoY);
        ctx.stroke();

        ctx.fillStyle = MUTE;
        ctx.font = "bold 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("LIVE VERIFIED VOTES", st1X, infoY + 12);

        // Stat 2: National Vote Share
        ctx.strokeStyle = "rgba(212, 175, 90, 0.53)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(st2X, infoY);
        ctx.lineTo(st2X + st2W, infoY);
        ctx.stroke();

        ctx.fillStyle = MUTE;
        ctx.font = "bold 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillText("NATIONAL VOTE SHARE", st2X, infoY + 12);

        // Unified baseline for numbers so stats are perfectly aligned without colliding
        const statBaseline = infoY + 84;
        ctx.textBaseline = "alphabetic";

        // Stat 1 Number
        ctx.fillStyle = IVORY;
        ctx.font = "bold 56px 'Playfair Display', Georgia, serif";
        ctx.fillText(candidate.votes.toLocaleString(), st1X, statBaseline);

        // Stat 2 Number + Rank (sitting side-by-side on the same baseline like template flex)
        ctx.fillStyle = IVORY;
        ctx.font = "bold 56px 'Playfair Display', Georgia, serif";
        const pctStr = candidate.percentage !== undefined ? `${candidate.percentage}%` : "0.0%";
        ctx.fillText(pctStr, st2X, statBaseline);

        const pctMeasure = ctx.measureText(pctStr).width;
        ctx.fillStyle = GOLD;
        ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillText(`Rank #${candidate.rank || 1}`, st2X + pctMeasure + 18, statBaseline - 4);

        // 6. Section Header for Comparison: .th
        // margin: 56px 0 16px; h2: font-size: 30px; span: color: var(--mute); font-size: 17px
        curY = heroY + heroH + 46;

        ctx.textBaseline = "middle";
        ctx.textAlign = "left";
        ctx.fillStyle = IVORY;
        ctx.font = "bold 30px 'Playfair Display', Georgia, serif";
        ctx.fillText("Live Tally Comparison vs Contenders", inX, curY);

        ctx.textAlign = "right";
        ctx.fillStyle = MUTE;
        ctx.font = "16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillText("Real-time nationwide aggregated ballot counts", 1080 - inX, curY + 2);

        // 7. Comparison Rows (4 rows with exact grid columns and balanced vertical spacing)
        curY += 38;
        const displayList = buildComparisonList(candidate, competitors);
        const maxVotes = Math.max(...displayList.map((c) => c.votes), 1);

        const rowH = 88;
        const rowGap = 10;
        const rowX = inX;
        const rowW = 1080 - inX * 2; // 952px

        displayList.forEach((c) => {
          const isMe = c.id === candidate.id;

          // Background & Border
          if (isMe) {
            // .row.me: border: 1.5px solid var(--gold); border-radius: 6px; background: #D4AF5A14
            ctx.fillStyle = "rgba(212, 175, 90, 0.1)";
            roundRect(ctx, rowX, curY, rowW, rowH, 6);
            ctx.fill();

            ctx.strokeStyle = GOLD;
            ctx.lineWidth = 1.5;
            roundRect(ctx, rowX, curY, rowW, rowH, 6);
            ctx.stroke();
          } else {
            // border-bottom: 1px solid #ffffff1c
            ctx.strokeStyle = "rgba(255, 255, 255, 0.11)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(rowX + 24, curY + rowH);
            ctx.lineTo(rowX + rowW - 24, curY + rowH);
            ctx.stroke();
          }

          const midY = curY + rowH / 2;

          // 1. Rank: .n { color: var(--mute) / var(--gold); font-size: 19px; } (centered in 36px col)
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = isMe ? GOLD : MUTE;
          ctx.font = isMe
            ? "bold 20px -apple-system, BlinkMacSystemFont, sans-serif"
            : "19px -apple-system, BlinkMacSystemFont, sans-serif";
          ctx.fillText(`${c.rank || 1}`, rowX + 42, midY);

          // 2. Color Dot: .d { width: 16px; height: 16px; border-radius: 50%; } (centered in 20px col)
          const dotColor = isMe ? GREEN : c.color || "#8795B3";
          ctx.fillStyle = dotColor;
          ctx.beginPath();
          ctx.arc(rowX + 84, midY, 8, 0, Math.PI * 2);
          ctx.fill();

          // 3. Right-Aligned Columns:
          const rightEdge = rowX + rowW - 20; // 996

          // Percentage: width 75px, right-aligned at rightEdge
          ctx.textAlign = "right";
          ctx.fillStyle = isMe ? GOLD : MUTE;
          ctx.font = isMe
            ? "bold 20px -apple-system, BlinkMacSystemFont, sans-serif"
            : "20px -apple-system, BlinkMacSystemFont, sans-serif";
          const pText = c.percentage !== undefined ? `${c.percentage}%` : "0.0%";
          ctx.fillText(pText, rightEdge, midY);

          // Vote Count: width 58px, right-aligned 12px before percentage
          const votesX = rightEdge - 82;
          ctx.fillStyle = IVORY;
          ctx.font = "bold 26px 'Playfair Display', Georgia, serif";
          ctx.fillText(c.votes.toLocaleString(), votesX, midY);

          // Progress Track: width 180px, ending 16px before votes
          const trW = 180;
          const trH = 10;
          const trRight = votesX - 68;
          const trX = trRight - trW;

          ctx.fillStyle = "rgba(255, 255, 255, 0.09)";
          roundRect(ctx, trX, midY - trH / 2, trW, trH, 5);
          ctx.fill();

          const fillProgress = Math.max(8, Math.round((c.votes / maxVotes) * trW));
          ctx.fillStyle = isMe ? GREEN : "#8795B3";
          roundRect(ctx, trX, midY - trH / 2, fillProgress, trH, 5);
          ctx.fill();

          // 4. Candidate Name & Choice Badge: from rowX + 102 to trX - 16 (up to 470px width!)
          const nameLeft = rowX + 102;
          const choiceBadgeW = isMe ? 104 : 0;
          const maxNameW = trX - 16 - nameLeft - choiceBadgeW;

          let nameFontSize = 21;
          ctx.font = `bold ${nameFontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
          while (nameFontSize > 15 && ctx.measureText(c.name).width > maxNameW) {
            nameFontSize -= 1;
            ctx.font = `bold ${nameFontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
          }

          ctx.textAlign = "left";
          ctx.fillStyle = IVORY;
          ctx.fillText(c.name, nameLeft, midY);

          // If isMe: draw pill badge "★ MY CHOICE" right beside the candidate's full name
          if (isMe) {
            const nameWidth = ctx.measureText(c.name).width;
            const badgeX = nameLeft + nameWidth + 10;
            const badgeW = 98;
            const badgeH = 22;

            ctx.fillStyle = "rgba(212, 175, 90, 0.15)";
            roundRect(ctx, badgeX, midY - badgeH / 2, badgeW, badgeH, 4);
            ctx.fill();

            ctx.strokeStyle = "rgba(212, 175, 90, 0.4)";
            ctx.lineWidth = 1;
            roundRect(ctx, badgeX, midY - badgeH / 2, badgeW, badgeH, 4);
            ctx.stroke();

            ctx.fillStyle = GOLD;
            ctx.font = "bold 11px -apple-system, BlinkMacSystemFont, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("★ MY CHOICE", badgeX + badgeW / 2, midY + 1);
          }

          curY += rowH + rowGap;
        });

        // 8. Footer: .ft (positioned cleanly after comparison rows with balanced 46px gap)
        curY = 1040;
        const ftX = inX;
        const ftY = curY;
        const ftW = 1080 - inX * 2;
        const ftH = 220;

        ctx.fillStyle = IVORY;
        roundRect(ctx, ftX, ftY, ftW, ftH, 6);
        ctx.fill();

        const textX = ftX + 36;
        let textY = ftY + 34;

        // .ft .k: font-size: 15px; letter-spacing: 2.5px; font-weight: 700; color: var(--blue); text-transform: uppercase
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillStyle = BLUE;
        ctx.font = "bold 15px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillText("CERTIFIED CITIZEN SURVEY SUBMISSION", textX, textY);

        // .ft h3: font-size: 34px; margin: 8px 0 8px; font-weight: 700; font-family: serif; color: var(--ink)
        textY += 26;
        ctx.fillStyle = INK;
        ctx.font = "bold 34px 'Playfair Display', Georgia, serif";
        const voterDisplay = voterName
          ? `Ballot Cast By: ${voterName}`
          : "Anonymous Verified Filipino Voter";
        ctx.fillText(voterDisplay, textX, textY);

        // .ft p: font-size: 16px; color: #41506f
        textY += 46;
        ctx.fillStyle = "#41506F";
        ctx.font = "16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        const locDisplay = provinceName
          ? `Reporting: ${provinceName} • 100% Tamper-Proof HMAC Verified`
          : "Nationwide Geographic Network • 100% Tamper-Proof HMAC Verified";
        ctx.fillText(locDisplay, textX, textY);

        // .ft .cta: margin-top: 16px; font-size: 18px; font-weight: 700; color: var(--ink); border-left: 4px solid var(--red); padding-left: 12px
        textY += 28;
        ctx.fillStyle = RED;
        ctx.fillRect(textX, textY, 4, 24);

        ctx.fillStyle = INK;
        ctx.font = "bold 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillText("Cast your vote now: ", textX + 16, textY + 2);

        // span: color: var(--red); font-family: monospace
        const originUrl =
          typeof window !== "undefined" ? window.location.origin : "https://eleksyon2028.ph";
        const voteUrl = `${originUrl}/survey`;
        const prefixWidth = ctx.measureText("Cast your vote now: ").width;

        ctx.fillStyle = RED;
        ctx.font = "bold 18px 'Courier New', Courier, monospace";
        ctx.fillText(voteUrl, textX + 16 + prefixWidth, textY + 2);

        // .ft .s: font-size: 14px; color: #5b6987; margin-top: 6px
        textY += 28;
        ctx.fillStyle = "#5B6987";
        ctx.font = "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillText("Scan QR code with phone camera to participate instantly", textX, textY);

        // QR Code on right: .ft img { width: 176px; height: 176px; border: 3px solid var(--ink); padding: 6px; background: #fff; border-radius: 4px }
        const qrCanvas = document.createElement("canvas");
        await QRCode.toCanvas(qrCanvas, voteUrl, {
          width: 152,
          margin: 1,
          color: {
            dark: INK,
            light: "#FFFFFF",
          },
        });

        const qrBoxSize = 164;
        const qrBoxX = ftX + ftW - 36 - qrBoxSize;
        const qrBoxY = ftY + (ftH - qrBoxSize) / 2;

        ctx.fillStyle = "#FFFFFF";
        roundRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 4);
        ctx.fill();

        ctx.strokeStyle = INK;
        ctx.lineWidth = 3;
        roundRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 4);
        ctx.stroke();

        ctx.drawImage(qrCanvas, qrBoxX + 6, qrBoxY + 6, 152, 152);

        // 9. Copyright / Watermark Footer: .cr
        // text-align: center; color: #7d8bab; font-size: 14px; margin-top: 30px; letter-spacing: .5px
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#7D8BAB";
        ctx.font = "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillText(
          "Eleksyon 2028 Digital Survey Initiative • Real-time Civic Data • Independent and Non-Partisan",
          540,
          1308
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
    a.download = `eleksyon2028-${candSlug}-card.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = async () => {
    if (!previewUrl || !candidate) return;
    const shareText = `I voted for ${candidate.name} in the Eleksyon 2028 Survey! See live rankings and cast your vote here:`;
    const shareUrl =
      typeof window !== "undefined" ? `${window.location.origin}/survey` : "https://eleksyon2028.ph/survey";

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

    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    handleDownload();
  };

  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0A1730] border-2 border-slate-700 rounded-3xl max-w-xl w-full max-h-[94vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#10224A]/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#CE1126] flex items-center justify-center text-white shadow">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-headline font-bold text-white uppercase tracking-wider">
                  Official Eleksyon 2028 Share Card
                </h3>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                  1080 × 1350 (4:5)
                </span>
              </div>
              <p className="text-[11px] text-[#9FAECB]">
                High-Definition verified election card for {candidate.name}
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
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-[#050B18]">
          {generating || !previewUrl ? (
            <div className="py-24 text-center space-y-3">
              <Loader2 className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
              <p className="text-xs font-headline font-bold uppercase tracking-wider text-slate-300">
                Rendering Official Eleksyon 2028 Card...
              </p>
              <p className="text-[11px] text-slate-500">
                Applying live candidate rankings, portrait styling, and verification stamp
              </p>
            </div>
          ) : (
            <div className="relative group max-w-[420px] w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80 aspect-[4/5] bg-[#0A1730] flex items-center justify-center">
              <img
                src={previewUrl}
                alt={`Eleksyon 2028 - ${candidate.name}`}
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#10224A]/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left text-xs text-slate-300">
            Share on <strong className="text-white">Facebook, Instagram, X, or TikTok</strong>
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
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#CE1126] hover:bg-red-700 text-white text-xs font-headline font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-900/30 disabled:opacity-50"
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

  const selectedIndex = combined.findIndex((c) => c.id === selected.id);
  if (selectedIndex < 3) {
    return combined.slice(0, 4);
  }

  const top3 = combined.slice(0, 3);
  return [...top3, combined[selectedIndex]];
}
