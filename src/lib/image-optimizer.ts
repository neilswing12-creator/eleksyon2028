import fs from "fs";
import path from "path";
import sharp from "sharp";

export interface StorageAuditResult {
  totalOriginalBytes: number;
  totalOriginalMB: string;
  totalOptimizedBytes: number;
  totalOptimizedMB: string;
  originalCount: number;
  optimizedCount: number;
  savingsBytes: number;
  savingsPercent: string;
  filesAwaitingOptimization: number;
  files: {
    name: string;
    originalBytes: number;
    optimizedBytes?: number;
    hasOptimized: boolean;
  }[];
}

export function getUploadsDir(): string {
  return path.join(process.cwd(), "public", "uploads", "candidates");
}

export function auditStorageUsage(): StorageAuditResult {
  const dir = getUploadsDir();
  if (!fs.existsSync(dir)) {
    return {
      totalOriginalBytes: 0,
      totalOriginalMB: "0 MB",
      totalOptimizedBytes: 0,
      totalOptimizedMB: "0 MB",
      originalCount: 0,
      optimizedCount: 0,
      savingsBytes: 0,
      savingsPercent: "0%",
      filesAwaitingOptimization: 0,
      files: [],
    };
  }

  const entries = fs.readdirSync(dir);
  let totalOriginalBytes = 0;
  let totalOptimizedBytes = 0;
  let originalCount = 0;
  let optimizedCount = 0;
  let filesAwaiting = 0;
  const fileList: StorageAuditResult["files"] = [];

  // Group by base name
  const originals = entries.filter((f) => f.endsWith(".jpg") || f.endsWith(".jpeg") || f.endsWith(".png"));
  const webpFiles = new Set(entries.filter((f) => f.endsWith(".webp")));

  for (const file of originals) {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);
    totalOriginalBytes += stats.size;
    originalCount++;

    const baseName = path.parse(file).name;
    const expectedWebp = `${baseName}.webp`;
    const hasWebp = webpFiles.has(expectedWebp);

    let optSize: number | undefined;
    if (hasWebp) {
      const optPath = path.join(dir, expectedWebp);
      const optStats = fs.statSync(optPath);
      optSize = optStats.size;
      totalOptimizedBytes += optSize;
      optimizedCount++;
    } else {
      filesAwaiting++;
    }

    fileList.push({
      name: file,
      originalBytes: stats.size,
      optimizedBytes: optSize,
      hasOptimized: hasWebp,
    });
  }

  const savingsBytes = totalOriginalBytes > totalOptimizedBytes && totalOptimizedBytes > 0
    ? totalOriginalBytes - totalOptimizedBytes
    : 0;

  const savingsPercent = totalOriginalBytes > 0 && totalOptimizedBytes > 0
    ? `${(((totalOriginalBytes - totalOptimizedBytes) / totalOriginalBytes) * 100).toFixed(1)}%`
    : "0%";

  return {
    totalOriginalBytes,
    totalOriginalMB: `${(totalOriginalBytes / (1024 * 1024)).toFixed(2)} MB`,
    totalOptimizedBytes,
    totalOptimizedMB: `${(totalOptimizedBytes / (1024 * 1024)).toFixed(2)} MB`,
    originalCount,
    optimizedCount,
    savingsBytes,
    savingsPercent,
    filesAwaitingOptimization: filesAwaiting,
    files: fileList,
  };
}

/**
 * Optimizes all candidate images into modern WebP format
 * Strictly preserves all original JPG/PNG files intact without deleting them.
 */
export async function optimizeCandidateImages(): Promise<{
  processed: number;
  skipped: number;
  errors: { file: string; error: string }[];
  audit: StorageAuditResult;
}> {
  const dir = getUploadsDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const entries = fs.readdirSync(dir);
  const images = entries.filter((f) => f.endsWith(".jpg") || f.endsWith(".jpeg") || f.endsWith(".png"));

  let processed = 0;
  let skipped = 0;
  const errors: { file: string; error: string }[] = [];

  for (const img of images) {
    const srcPath = path.join(dir, img);
    const baseName = path.parse(img).name;
    const destWebp = path.join(dir, `${baseName}.webp`);

    try {
      const srcStat = fs.statSync(srcPath);

      // Check if existing webp is newer than source
      if (fs.existsSync(destWebp)) {
        const destStat = fs.statSync(destWebp);
        if (destStat.mtime >= srcStat.mtime && destStat.size > 0) {
          skipped++;
          continue;
        }
      }

      // Convert and compress using sharp
      // Max 600x600 for sharp portraits on retina displays
      await sharp(srcPath)
        .resize(600, 600, {
          fit: "cover",
          position: "top",
          withoutEnlargement: true,
        })
        .webp({
          quality: 85,
          effort: 4,
        })
        .toFile(destWebp);

      processed++;
    } catch (err: any) {
      errors.push({ file: img, error: err.message || "Failed to convert" });
    }
  }

  const audit = auditStorageUsage();

  return {
    processed,
    skipped,
    errors,
    audit,
  };
}
