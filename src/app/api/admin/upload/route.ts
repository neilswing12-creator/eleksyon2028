import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession, getClientIP } from "@/lib/security";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const ALLOWED_MIME_TYPES = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/jpg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function getAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  let token = "";
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    token = req.cookies.get("admin_session")?.value || "";
  }
  return verifyAdminSession(token);
}

// Validate magic bytes to ensure file content actually matches expected image format
function validateImageMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 12) return false;

  // JPEG: FF D8 FF
  if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (mimeType === "image/png") {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    );
  }

  // WebP: RIFF ... WEBP
  if (mimeType === "image/webp") {
    const isRiff = buffer.toString("ascii", 0, 4) === "RIFF";
    const isWebp = buffer.toString("ascii", 8, 12) === "WEBP";
    return isRiff && isWebp;
  }

  return false;
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (admin.role === "ANALYST") {
      return NextResponse.json(
        { error: "Forbidden: Analysts have read-only access." },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const oldPhotoUrl = (formData.get("oldPhotoUrl") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    // 1. File Size Validation
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds the 5 MB limit." },
        { status: 400 }
      );
    }

    // 2. MIME Type Validation
    const mimeType = (file.type || "").toLowerCase();
    const ext = ALLOWED_MIME_TYPES.get(mimeType);
    if (!ext) {
      return NextResponse.json(
        { error: "Invalid image format. Supported formats: JPG, PNG, and WebP." },
        { status: 400 }
      );
    }

    // 3. Binary Content Verification
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!validateImageMagicBytes(buffer, mimeType)) {
      return NextResponse.json(
        { error: "Corrupted or invalid image binary contents." },
        { status: 400 }
      );
    }

    // 4. Ensure upload directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "candidates");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // 5. Generate secure, collision-resistant unique filename
    const uniqueId = crypto.randomUUID();
    const filename = `${uniqueId}.${ext}`;
    const destinationPath = path.join(uploadsDir, filename);

    // 6. Write file to persistent storage
    fs.writeFileSync(destinationPath, buffer);

    const publicUrl = `/uploads/candidates/${filename}`;

    // 7. Cleanup old photo if requested and it is stored in our upload folder
    if (oldPhotoUrl && oldPhotoUrl.startsWith("/uploads/candidates/")) {
      try {
        const oldFilename = path.basename(oldPhotoUrl);
        // Ensure no path traversal
        if (/^[a-zA-Z0-9-]+\.[a-zA-Z0-9]+$/.test(oldFilename)) {
          const oldFilePath = path.join(uploadsDir, oldFilename);
          if (fs.existsSync(oldFilePath)) {
            // Verify if any other candidate uses this photo before deleting
            const otherCandidateUsing = await prisma.candidate.findFirst({
              where: { photoUrl: oldPhotoUrl },
            });
            if (!otherCandidateUsing) {
              fs.unlinkSync(oldFilePath);
            }
          }
        }
      } catch (cleanErr) {
        console.warn("Failed to remove old photo file:", cleanErr);
      }
    }

    // 8. Record audit log
    const clientIP = getClientIP(req.headers);
    await prisma.adminAuditLog.create({
      data: {
        adminEmail: admin.email,
        action: "CANDIDATE_PHOTO_UPLOADED",
        entityType: "CandidatePhoto",
        details: `Uploaded photograph ${filename} (${(file.size / 1024).toFixed(1)} KB)`,
        ipAddress: clientIP,
      },
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      size: file.size,
      filename,
    });
  } catch (error) {
    console.error("Candidate photo upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload photograph to server." },
      { status: 500 }
    );
  }
}
