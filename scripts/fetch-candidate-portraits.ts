import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const candidatesMap = [
  { slug: "sara-duterte", wiki: "Sara_Duterte" },
  { slug: "raffy-tulfo", wiki: "Raffy_Tulfo" },
  { slug: "risa-hontiveros", wiki: "Risa_Hontiveros" },
  { slug: "manny-pacquiao", wiki: "Manny_Pacquiao" },
  { slug: "francis-escudero", wiki: "Francis_Escudero" },
  { slug: "sandro-marcos", wiki: "Sandro_Marcos" },
  { slug: "bam-aquino", wiki: "Bam_Aquino" },
  { slug: "erwin-tulfo", wiki: "Erwin_Tulfo" },
  { slug: "grace-poe", wiki: "Grace_Poe" },
  { slug: "vico-sotto", wiki: "Vico_Sotto" },
  { slug: "chel-diokno", wiki: "Chel_Diokno" },
  { slug: "bong-go", wiki: "Bong_Go" },
  { slug: "bato-dela-rosa", wiki: "Ronald_dela_Rosa" },
  { slug: "leni-robredo", wiki: "Leni_Robredo" },
  { slug: "antonio-trillanes", wiki: "Antonio_Trillanes" },
  { slug: "leila-de-lima", wiki: "Leila_de_Lima" },
  { slug: "gibo-teodoro", wiki: "Gilbert_Teodoro" },
  { slug: "kiko-pangilinan", wiki: "Francis_Pangilinan" },
  { slug: "loren-legarda", wiki: "Loren_Legarda" },
  { slug: "alan-cayetano", wiki: "Alan_Peter_Cayetano" },
  { slug: "pia-cayetano", wiki: "Pia_Cayetano" },
];

async function main() {
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "candidates");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const results: Record<string, { localPath: string; sourceUrl: string }> = {};

  for (const c of candidatesMap) {
    try {
      console.log(`Checking ${c.slug} (${c.wiki})...`);
      const cmd = `curl.exe -s -H "User-Agent: PhilippineElectionSurveyPlatform/1.0 (survey2028@ph.gov)" "https://en.wikipedia.org/w/api.php?action=query&titles=${c.wiki}&prop=pageimages&pithumbsize=600&format=json"`;
      const output = execSync(cmd, { encoding: "utf-8" });
      const data = JSON.parse(output);
      const pages = data.query?.pages || {};
      const page: any = Object.values(pages)[0];
      const thumbUrl: string | undefined = page?.thumbnail?.source;

      if (!thumbUrl) {
        console.warn(`  [WARN] No thumb URL for ${c.slug}`);
        continue;
      }

      console.log(`  Found: ${thumbUrl.slice(0, 80)}...`);
      const targetExt = "jpg";
      const targetFileName = `${c.slug}-portrait.${targetExt}`;
      const targetFilePath = path.join(uploadsDir, targetFileName);

      // Download using curl.exe
      const cleanUrl = thumbUrl.split("?")[0];
      const downloadCmd = `curl.exe -L -s -H "User-Agent: PhilippineElectionSurveyPlatform/1.0 (survey2028@ph.gov)" "${cleanUrl}" -o "${targetFilePath}"`;
      execSync(downloadCmd);

      // Check file size
      const stat = fs.statSync(targetFilePath);
      console.log(`  Downloaded: ${targetFileName} (${(stat.size / 1024).toFixed(1)} KB)`);

      results[c.slug] = {
        localPath: `/uploads/candidates/${targetFileName}`,
        sourceUrl: cleanUrl,
      };

      // Gentle pause to respect rate limits
      await new Promise((r) => setTimeout(r, 600));
    } catch (e: any) {
      console.error(`  [ERROR] Failed for ${c.slug}:`, e.message);
    }
  }

  fs.writeFileSync(
    path.join(__dirname, "downloaded-portraits.json"),
    JSON.stringify(results, null, 2),
    "utf-8"
  );
  console.log(`\nCompleted! Downloaded ${Object.keys(results).length} / ${candidatesMap.length} portraits.`);
}

main();
