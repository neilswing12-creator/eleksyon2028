"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download, Share2, X, Check, Loader2, Vote } from "lucide-react";
import { SHARE_LOGO_DATA_URL, SHARE_SUN_DATA_URL } from "@/lib/share-card-assets";

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
        // Exact official dimensions from reference template: 1080 x 1350 (4:5 aspect ratio)
        canvas.width = 1080;
        canvas.height = 1350;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Color palette matching eleksyon2028-leni-robredo-card.html:
        // --ch: #3f3c3a; --mut: #6d6a66; --blue: #1f3d8f; --red: #cf2e35;
        // --gold: #c9a24b; --pink: #e0357a; --cream: #f3ecd8;
        const CH = "#3f3c3a";
        const MUT = "#6d6a66";
        const BLUE = "#1f3d8f";
        const RED = "#cf2e35";
        const GOLD = "#c9a24b";
        const CREAM = "#f3ecd8";
        const CAND_COLOR = candidate.color || "#e0357a";

        // Preload asset images: Logo, Sun, Candidate Portrait
        const [logoImg, sunImg, photoImg] = await Promise.all([
          loadImage(SHARE_LOGO_DATA_URL),
          loadImage(SHARE_SUN_DATA_URL),
          candidate.photoUrl ? loadImage(candidate.photoUrl) : Promise.resolve(null),
        ]);

        // 1. Warm Off-White Background
        // background: linear-gradient(180deg, #fefcfa 0%, #d5d4d0 100%)
        const bgGrad = ctx.createLinearGradient(0, 0, 0, 1350);
        bgGrad.addColorStop(0, "#fefcfa");
        bgGrad.addColorStop(1, "#d5d4d0");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 1080, 1350);

        // 2. Eleksyon 2028 Top Logo
        // .logo { display:block; margin:34px auto 0; width:132px; height:124px }
        const logoW = 132;
        const logoH = 124;
        const logoX = (1080 - logoW) / 2; // 474
        const logoY = 34;
        if (logoImg) {
          ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);
        }

        // 3. Large Heading: ELEKSYON 2028
        // h1 { text-align:center; font-size:128px; line-height:1; font-weight:700; letter-spacing:-3px; margin-top:36px; color:var(--ch) }
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = CH;
        ctx.font =
          "bold 124px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', 'Liberation Sans', Arial, sans-serif";
        ctx.fillText("ELEKSYON 2028", 540, 184);

        // 4. Blue-to-Red Horizontal Divider with Sun Accent
        // .ln { position:relative; margin:14px 80px 0; height:8px; border-radius:4px; background:linear-gradient(90deg,#34507c,#d5d8e0 48%,#f0d6d6 52%,#d4474a) }
        const lnX = 80;
        const lnY = 328;
        const lnW = 1080 - lnX * 2; // 920px
        const lnH = 8;

        const lnGrad = ctx.createLinearGradient(lnX, 0, lnX + lnW, 0);
        lnGrad.addColorStop(0, "#34507c");
        lnGrad.addColorStop(0.48, "#d5d8e0");
        lnGrad.addColorStop(0.52, "#f0d6d6");
        lnGrad.addColorStop(1, "#d4474a");
        ctx.fillStyle = lnGrad;
        roundRect(ctx, lnX, lnY, lnW, lnH, 4);
        ctx.fill();

        // Small Sun Accent centered on divider
        // .ln img { position:absolute; left:50%; top:50%; width:41px; height:34px; transform:translate(-50%,-50%) }
        if (sunImg) {
          const sunW = 41;
          const sunH = 34;
          const sunX = 540 - sunW / 2;
          const sunY = lnY + lnH / 2 - sunH / 2;
          ctx.drawImage(sunImg, sunX, sunY, sunW, sunH);
        }

        // 5. Featured Candidate Section (.hero)
        // .hero { display:flex; gap:44px; align-items:center; margin:34px 75px 0 }
        const heroX = 75;
        const heroY = 368;
        const photoSize = 294; // 294x295 with border-radius: 84px

        // Left: Profile photo squircle (.ph)
        ctx.save();
        roundRect(ctx, heroX, heroY, photoSize, photoSize, 84);
        ctx.clip();
        if (photoImg) {
          ctx.drawImage(photoImg, heroX, heroY, photoSize, photoSize);
        } else {
          ctx.fillStyle = "#e5e7eb";
          ctx.fillRect(heroX, heroY, photoSize, photoSize);
          ctx.fillStyle = CH;
          ctx.font = "bold 72px 'Playfair Display', Georgia, serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(candidate.name.slice(0, 2).toUpperCase(), heroX + photoSize / 2, heroY + photoSize / 2);
        }
        ctx.restore();

        // Ranking Badge (.bd)
        // .bd { position:absolute; right:-48px; bottom:-12px; width:92px; height:92px; border-radius:50%;
        // background:linear-gradient(160deg,#ff9ed1,#f25aa6); color:#fff; font-weight:700; font-size:32px }
        const bdSize = 92;
        const bdCenterX = heroX + photoSize - 18;
        const bdCenterY = heroY + photoSize - 18;
        const bdRadius = bdSize / 2;

        // Shadow: box-shadow: 0 6px 16px #e0357a55
        ctx.save();
        ctx.shadowColor = "rgba(224, 53, 122, 0.35)";
        ctx.shadowBlur = 16;
        ctx.shadowOffsetY = 6;

        const bdGrad = ctx.createLinearGradient(
          bdCenterX - bdRadius,
          bdCenterY - bdRadius,
          bdCenterX + bdRadius,
          bdCenterY + bdRadius
        );
        bdGrad.addColorStop(0, "#ff9ed1");
        bdGrad.addColorStop(1, CAND_COLOR || "#f25aa6");
        ctx.fillStyle = bdGrad;
        ctx.beginPath();
        ctx.arc(bdCenterX, bdCenterY, bdRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // White rank number
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillText(`#${candidate.rank || 1}`, bdCenterX, bdCenterY);

        // Right: White glass panel (.info)
        // .info { flex:1; margin-left:16px; background:#ffffffb8; border:1px solid #ffffff; border-radius:10px; padding:26px 30px; box-shadow:0 14px 34px #3f3c3a22 }
        const infoX = heroX + photoSize + 44 + 16; // 429
        const infoY = heroY + 8;
        const infoW = 1080 - 75 - infoX; // 576px
        const infoH = 276;

        ctx.save();
        ctx.shadowColor = "rgba(63, 60, 58, 0.13)";
        ctx.shadowBlur = 34;
        ctx.shadowOffsetY = 14;
        ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
        roundRect(ctx, infoX, infoY, infoW, infoH, 10);
        ctx.fill();

        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 1;
        roundRect(ctx, infoX, infoY, infoW, infoH, 10);
        ctx.stroke();
        ctx.restore();

        // Inside .info
        const textX = infoX + 30;
        let textY = infoY + 26;

        // .kick: font-size:14px; letter-spacing:2px; font-weight:700; color:var(--blue); text-transform:uppercase
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillStyle = BLUE;
        ctx.font = "bold 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        const posText =
          candidate.position === "PRESIDENT"
            ? "OFFICIAL CITIZEN VOTE • 2028 PRESIDENTIAL RUNNER"
            : candidate.position === "VICE_PRESIDENT"
            ? "OFFICIAL CITIZEN VOTE • 2028 VICE PRESIDENTIAL RUNNER"
            : "OFFICIAL CITIZEN VOTE • 2028 SENATORIAL RUNNER";
        ctx.fillText(posText, textX, textY);

        // .info h2: font-size:34px; margin:10px 0 4px; line-height:1.12; font-family: serif; color:var(--ch)
        textY += 24;
        ctx.fillStyle = CH;
        let candNameSize = 34;
        ctx.font = `bold ${candNameSize}px 'Playfair Display', Georgia, 'Liberation Serif', serif`;
        const maxNameWidth = infoW - 60;
        while (candNameSize > 20 && ctx.measureText(candidate.name).width > maxNameWidth) {
          candNameSize -= 2;
          ctx.font = `bold ${candNameSize}px 'Playfair Display', Georgia, 'Liberation Serif', serif`;
        }
        ctx.fillText(candidate.name, textX, textY);

        // .party: font-size:17px; color:var(--mut)
        textY += candNameSize + 8;
        ctx.fillStyle = MUT;
        ctx.font = "17px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        const partyLabel = candidate.party ? `Party: ${candidate.party}` : "Party: Independent Candidate";
        ctx.fillText(partyLabel, textX, textY);

        // .stats: display:flex; gap:22px; margin-top:20px
        textY += 26;
        const colW = (infoW - 60 - 22) / 2; // 247px
        const col1X = textX;
        const col2X = textX + colW + 22;

        // Stat Col 1: Live Verified Votes
        ctx.strokeStyle = "rgba(201, 162, 75, 0.53)"; // #c9a24b88
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(col1X, textY);
        ctx.lineTo(col1X + colW, textY);
        ctx.stroke();

        ctx.fillStyle = MUT;
        ctx.font = "bold 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillText("LIVE VERIFIED VOTES", col1X, textY + 10);

        ctx.fillStyle = CH;
        ctx.font = "bold 52px 'Playfair Display', Georgia, 'Liberation Serif', serif";
        ctx.fillText(candidate.votes.toLocaleString(), col1X, textY + 30);

        // Stat Col 2: National Vote Share
        ctx.strokeStyle = "rgba(201, 162, 75, 0.53)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(col2X, textY);
        ctx.lineTo(col2X + colW, textY);
        ctx.stroke();

        ctx.fillStyle = MUT;
        ctx.font = "bold 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillText("NATIONAL VOTE SHARE", col2X, textY + 10);

        ctx.fillStyle = CH;
        ctx.font = "bold 52px 'Playfair Display', Georgia, 'Liberation Serif', serif";
        const pctText = candidate.percentage !== undefined ? `${candidate.percentage}%` : "0.0%";
        ctx.fillText(pctText, col2X, textY + 30);

        // Inline rank tag: em { font-style:normal; font-size:16px; font-weight:700; color:var(--red) }
        const pctWidth = ctx.measureText(pctText).width;
        ctx.fillStyle = RED;
        ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillText(`Rank #${candidate.rank || 1}`, col2X + pctWidth + 12, textY + 54);

        // 6. Live Tally Comparison Panel (.panel)
        // .panel { margin:34px 75px 0; background:#ffffffa6; border:1px solid #fff; border-radius:10px; padding:26px 36px 30px; box-shadow:0 14px 34px #3f3c3a22 }
        const panelX = 75;
        const panelY = 696;
        const panelW = 1080 - panelX * 2; // 930px
        const panelH = 572;

        ctx.save();
        ctx.shadowColor = "rgba(63, 60, 58, 0.13)";
        ctx.shadowBlur = 34;
        ctx.shadowOffsetY = 14;
        ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
        roundRect(ctx, panelX, panelY, panelW, panelH, 10);
        ctx.fill();

        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 1;
        roundRect(ctx, panelX, panelY, panelW, panelH, 10);
        ctx.stroke();
        ctx.restore();

        // Header inside .panel (.th)
        // .th { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:12px }
        // .th h3 { font-size:26px } .th span { font-size:14px; color:var(--mut) }
        const pInnerX = panelX + 36;
        const pInnerW = panelW - 72; // 858px
        let curRowY = panelY + 26;

        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillStyle = CH;
        ctx.font = "bold 26px 'Playfair Display', Georgia, 'Liberation Serif', serif";
        ctx.fillText("Live Tally Comparison vs Contenders", pInnerX, curRowY);

        ctx.textAlign = "right";
        ctx.fillStyle = MUT;
        ctx.font = "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillText("Real-time nationwide aggregated ballot counts", pInnerX + pInnerW, curRowY + 8);

        // Rows inside .panel
        // .row { display:grid; grid-template-columns:28px 16px minmax(0,1fr) 140px 52px 66px; gap:12px; align-items:center; height:66px; border-bottom:1px solid #3f3c3a1a; padding:0 12px; font-size:19px; font-weight:600 }
        curRowY += 40;
        const displayList = buildComparisonList(candidate, competitors);
        const maxVotes = Math.max(...displayList.map((c) => c.votes), 1);
        const rowH = 66;

        displayList.forEach((c, idx) => {
          const isMe = c.id === candidate.id;
          const rowBoxX = pInnerX;
          const rowBoxW = pInnerW;

          // If .row.me:
          // border: 1.5px solid var(--gold); border-radius: 6px; background: #c9a24b14
          if (isMe) {
            ctx.fillStyle = "rgba(201, 162, 75, 0.08)";
            roundRect(ctx, rowBoxX, curRowY, rowBoxW, rowH, 6);
            ctx.fill();

            ctx.strokeStyle = GOLD;
            ctx.lineWidth = 1.5;
            roundRect(ctx, rowBoxX, curRowY, rowBoxW, rowH, 6);
            ctx.stroke();
          } else if (idx < displayList.length - 1) {
            // border-bottom: 1px solid #3f3c3a1a
            ctx.strokeStyle = "rgba(63, 60, 58, 0.1)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(rowBoxX + 12, curRowY + rowH);
            ctx.lineTo(rowBoxX + rowBoxW - 12, curRowY + rowH);
            ctx.stroke();
          }

          const midY = curRowY + rowH / 2;

          // Col 1: Rank .n (width 28px, centered at rowBoxX + 12 + 14 = 26)
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = isMe ? "#8a6a1c" : MUT;
          ctx.font = isMe
            ? "bold 18px -apple-system, BlinkMacSystemFont, sans-serif"
            : "18px -apple-system, BlinkMacSystemFont, sans-serif";
          ctx.fillText(`${c.rank || idx + 1}`, rowBoxX + 26, midY);

          // Col 2: Color Dot .d (width 16px, 14px diameter)
          // gap is 12px -> dot center at 26 + 14 + 12 + 8 = 60
          const dotColor = isMe ? CAND_COLOR : c.color || "#7f8aa6";
          ctx.fillStyle = dotColor;
          ctx.beginPath();
          ctx.arc(rowBoxX + 58, midY, 7, 0, Math.PI * 2);
          ctx.fill();

          // Col 6: Percentage .p (width ~72px, right-aligned at rowBoxX + rowBoxW - 16)
          const pRight = rowBoxX + rowBoxW - 16;
          ctx.textAlign = "right";
          ctx.fillStyle = isMe ? "#8a6a1c" : MUT;
          ctx.font = isMe
            ? "bold 18px -apple-system, BlinkMacSystemFont, sans-serif"
            : "18px -apple-system, BlinkMacSystemFont, sans-serif";
          const pStr = c.percentage !== undefined ? `${c.percentage}%` : "0.0%";
          ctx.fillText(pStr, pRight, midY);

          // Col 5: Vote count .c (right-aligned at pRight - 72 - 16)
          const cRight = pRight - 72 - 16;
          ctx.fillStyle = CH;
          ctx.font = "bold 26px 'Playfair Display', Georgia, 'Liberation Serif', serif";
          ctx.fillText(c.votes.toLocaleString(), cRight, midY);

          // Col 4: Progress Bar .tr (width 140px, ending at cRight - 100 - 16)
          const trRight = cRight - 100 - 16;
          const trW = 140;
          const trH = 9;
          const trX = trRight - trW;

          ctx.fillStyle = "rgba(63, 60, 58, 0.08)";
          roundRect(ctx, trX, midY - trH / 2, trW, trH, 5);
          ctx.fill();

          const fillW = Math.max(8, Math.round((c.votes / maxVotes) * trW));
          ctx.fillStyle = isMe ? CAND_COLOR : "#7f8aa6";
          roundRect(ctx, trX, midY - trH / 2, fillW, trH, 5);
          ctx.fill();

          // Col 3: Candidate Name .nm (from rowBoxX + 80 to trX - 16)
          const nameX = rowBoxX + 80;
          const maxNameW = trX - 16 - nameX - (isMe ? 112 : 0);

          ctx.textAlign = "left";
          ctx.fillStyle = CH;
          let nameSize = 19;
          ctx.font = `bold ${nameSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
          while (nameSize > 14 && ctx.measureText(c.name).width > maxNameW) {
            nameSize -= 1;
            ctx.font = `bold ${nameSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
          }
          ctx.fillText(c.name, nameX, midY);

          // If isMe: draw badge .nm u { text-decoration:none; font-size:10px; letter-spacing:.8px; color:#8a6a1c; border:1px solid var(--gold); background:#c9a24b22; padding:3px 8px; border-radius:3px; font-weight:700 }
          if (isMe) {
            const nameWidth = ctx.measureText(c.name).width;
            const badgeX = nameX + nameWidth + 10;
            const badgeW = 98;
            const badgeH = 22;

            ctx.fillStyle = "rgba(201, 162, 75, 0.13)";
            roundRect(ctx, badgeX, midY - badgeH / 2, badgeW, badgeH, 3);
            ctx.fill();

            ctx.strokeStyle = GOLD;
            ctx.lineWidth = 1;
            roundRect(ctx, badgeX, midY - badgeH / 2, badgeW, badgeH, 3);
            ctx.stroke();

            ctx.fillStyle = "#8a6a1c";
            ctx.font = "bold 10px -apple-system, BlinkMacSystemFont, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("★ MY CHOICE", badgeX + badgeW / 2, midY);
          }

          curRowY += rowH;
        });

        // 7. Cream-colored Citizen Participation Panel (.cert) inside .panel
        // .cert { margin-top:26px; background:var(--cream); color:#16254d; border-radius:6px; display:flex; align-items:center; gap:30px; padding:24px 30px }
        const certY = curRowY + 16;
        const certX = pInnerX;
        const certW = pInnerW;
        const certH = 188;

        ctx.fillStyle = CREAM;
        roundRect(ctx, certX, certY, certW, certH, 6);
        ctx.fill();

        // Inside .cert
        const certTextX = certX + 30;
        let certTextY = certY + 22;

        // .k: font-size:13px; letter-spacing:1.6px; font-weight:700; color:var(--blue); text-transform:uppercase
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillStyle = BLUE;
        ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillText("CERTIFIED CITIZEN SURVEY SUBMISSION", certTextX, certTextY);

        // h4: font-size:32px; margin:6px 0 6px; font-family: serif
        certTextY += 18;
        ctx.fillStyle = "#16254d";
        ctx.font = "bold 32px 'Playfair Display', Georgia, 'Liberation Serif', serif";
        const voterTitle = voterName ? `Survey Response By: ${voterName}` : "Verified Citizen Survey Submission";
        ctx.fillText(voterTitle, certTextX, certTextY);

        // p: font-size:15px; color:#41506f
        certTextY += 40;
        ctx.fillStyle = "#41506F";
        ctx.font = "15px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        const descText = provinceName
          ? `Reporting: ${provinceName} • Verified Public Survey Response`
          : "Nationwide Geographic Network • Verified Public Survey Response";
        ctx.fillText(descText, certTextX, certTextY);

        // .cta: margin-top:12px; font-size:17px; font-weight:700; border-left:4px solid var(--red); padding-left:10px
        certTextY += 26;
        ctx.fillStyle = RED;
        ctx.fillRect(certTextX, certTextY, 4, 22);

        ctx.fillStyle = "#16254d";
        ctx.font = "bold 17px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillText("Cast your vote now: ", certTextX + 12, certTextY + 1);

        const prefixW = ctx.measureText("Cast your vote now: ").width;
        const originUrl =
          typeof window !== "undefined" && window.location.origin && !window.location.origin.includes("localhost")
            ? window.location.origin
            : "https://eleksyon.swingneil.com";
        const participationUrl = `${originUrl}/survey`;

        ctx.fillStyle = RED;
        ctx.font = "bold 16px 'Liberation Mono', 'Courier New', monospace";
        ctx.fillText(participationUrl, certTextX + 12 + prefixW, certTextY + 2);

        // .s: font-size:13px; color:#5b6987; margin-top:6px
        certTextY += 26;
        ctx.fillStyle = "#5B6987";
        ctx.font = "13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillText("Scan QR code with phone camera to participate instantly", certTextX, certTextY);

        // QR Code on right inside .cert
        // .cert img { width:142px; height:142px; border:3px solid #16254d; background:#fff; border-radius:4px; padding:3px }
        const qrSize = 142;
        const qrX = certX + certW - 30 - qrSize;
        const qrY = certY + (certH - qrSize) / 2;

        const qrCanvas = document.createElement("canvas");
        await QRCode.toCanvas(qrCanvas, participationUrl, {
          width: 130,
          margin: 1,
          color: {
            dark: "#16254d",
            light: "#FFFFFF",
          },
        });

        ctx.fillStyle = "#FFFFFF";
        roundRect(ctx, qrX, qrY, qrSize, qrSize, 4);
        ctx.fill();

        ctx.strokeStyle = "#16254d";
        ctx.lineWidth = 3;
        roundRect(ctx, qrX, qrY, qrSize, qrSize, 4);
        ctx.stroke();

        ctx.drawImage(qrCanvas, qrX + 6, qrY + 6, 130, 130);

        // 8. Bottom Copyright Footer (.cr)
        // .cr { text-align:center; color:var(--mut); font-size:13px; margin-top:22px }
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = MUT;
        ctx.font = "13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillText(
          "Eleksyon 2028 Digital Survey Initiative • Real-time Civic Data • Independent and Non-Partisan",
          540,
          1306
        );

        if (isMounted) {
          const dataUrl = canvas.toDataURL("image/png");
          setPreviewUrl(dataUrl);
          setGenerating(false);
        }
      } catch (err) {
        console.error("Error generating official share card:", err);
        if (isMounted) setGenerating(false);
      }
    };

    renderCard();

    return () => {
      isMounted = false;
    };
  }, [isOpen, candidate, competitors, voterName, provinceName]);

  const handleDownload = async () => {
    if (!previewUrl || !candidate) return;
    const candSlug = candidate.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const filename = `eleksyon2028-${candSlug}-card.png`;

    try {
      const blob = dataURLtoBlob(previewUrl);
      const file = new File([blob], filename, { type: "image/png" });
      const isMobile =
        typeof navigator !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      // On mobile devices, native share sheet lets users tap "Save Image" straight into Photos / Gallery
      if (isMobile && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `Eleksyon 2028 - ${candidate.name}`,
            text: `Official Eleksyon 2028 Vote Card for ${candidate.name}`,
          });
          return;
        } catch (shareErr: any) {
          if (shareErr?.name === "AbortError") return;
        }
      }

      // Robust Blob Object URL download for desktop and Android browsers
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      }, 2000);
    } catch (e) {
      try {
        const a = document.createElement("a");
        a.href = previewUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => document.body.removeChild(a), 500);
      } catch (err) {
        window.open(previewUrl, "_blank");
      }
    }
  };

  const handleShare = async () => {
    if (!previewUrl || !candidate) return;
    const candSlug = candidate.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const filename = `eleksyon2028-${candSlug}-card.png`;
    const shareText = `I voted for ${candidate.name} in the Eleksyon 2028 Survey! See live rankings and cast your vote here:`;
    const shareUrl =
      typeof window !== "undefined" ? `${window.location.origin}/survey` : "https://eleksyon.swingneil.com/survey";

    try {
      const blob = dataURLtoBlob(previewUrl);
      const file = new File([blob], filename, { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Eleksyon 2028: I Voted for ${candidate.name}!`,
          text: shareText,
          url: shareUrl,
          files: [file],
        });
        return;
      }
    } catch (e: any) {
      if (e?.name === "AbortError") return;
    }

    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    handleDownload();
  };

  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#fefcfa] border border-slate-300 rounded-3xl max-w-xl w-full max-h-[94vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-3 sm:p-5 border-b border-slate-200 flex items-center justify-between gap-2 bg-[#f4eedd]/80">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-full bg-[#cf2e35] flex items-center justify-center text-white shadow flex-shrink-0">
              <Vote className="w-4 h-4 text-amber-300" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <h3 className="text-xs sm:text-sm md:text-base font-headline font-bold text-[#3f3c3a] uppercase tracking-wider truncate">
                  Official Eleksyon 2028 Share Card
                </h3>
                <span className="text-[9px] sm:text-[10px] bg-[#c9a24b]/20 text-[#8a6a1c] font-bold px-1.5 py-0.5 rounded-full border border-[#c9a24b]/40 flex-shrink-0">
                  1080 × 1350 (4:5)
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#6d6a66] truncate">
                High-definition verified election card for {candidate.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-slate-200 text-slate-600 hover:text-[#3f3c3a] hover:bg-slate-300 transition-colors flex-shrink-0"
            aria-label="Close share modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Preview Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-[#d5d4d0]/60">
          {generating || !previewUrl ? (
            <div className="py-24 text-center space-y-3">
              <Loader2 className="w-10 h-10 text-[#cf2e35] animate-spin mx-auto" />
              <p className="text-xs font-headline font-bold uppercase tracking-wider text-[#3f3c3a]">
                Rendering Official Eleksyon 2028 Card...
              </p>
              <p className="text-[11px] text-[#6d6a66]">
                Applying live candidate rankings, portrait styling, and verification stamp
              </p>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              <div className="relative group max-w-[420px] w-full rounded-2xl overflow-hidden shadow-xl border border-slate-300/80 aspect-[4/5] bg-white flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt={`Eleksyon 2028 - ${candidate.name}`}
                  className="w-full h-full object-contain select-none pointer-events-auto"
                />
              </div>
              <p className="text-[11px] text-[#6d6a66] mt-2 text-center sm:hidden">
                Tap &apos;Download Image&apos; to save to Photos, or long-press image
              </p>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="p-3 sm:p-5 border-t border-slate-200 bg-[#fefcfa] flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
          <div className="text-center sm:text-left text-[11px] sm:text-xs text-[#6d6a66] w-full sm:w-auto">
            Share on <strong className="text-[#3f3c3a]">Facebook, Instagram, X, or TikTok</strong>
          </div>
          <div className="flex flex-col xs:flex-row sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownload}
              disabled={generating || !previewUrl}
              className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-xl bg-[#3f3c3a] hover:bg-slate-800 text-white text-xs font-headline font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Download Image</span>
            </button>
            <button
              onClick={handleShare}
              disabled={generating || !previewUrl}
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-[#cf2e35] hover:bg-red-700 text-white text-xs font-headline font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-900/30 disabled:opacity-50"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-amber-300 flex-shrink-0" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-amber-300 flex-shrink-0" />
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

function dataURLtoBlob(dataurl: string): Blob {
  const parts = dataurl.split(",");
  const mime = parts[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
