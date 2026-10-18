import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

// Helper to parse public service strings into discrete positions
// Handles "(year-year), Position (year)" without splitting commas inside parentheses
export function parsePublicService(text: string | null): string[] {
  if (!text) return [];
  // Split on semicolons OR commas immediately preceded by a closing parenthesis
  // e.g. "Vice President (2022-present), Davao City Mayor (2010-2013, 2016-2022)"
  const parts: string[] = [];
  let current = "";
  let parenDepth = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === "(") parenDepth++;
    if (char === ")") parenDepth = Math.max(0, parenDepth - 1);

    if (parenDepth === 0 && (char === ";" || (char === "," && i + 1 < text.length && text[i + 1] === " "))) {
      // Check if this comma is between distinct entries
      const nextWord = text.slice(i + 2).trim();
      // If next word starts with uppercase or standard role words
      if (char === ";" || /^[A-Z]/.test(nextWord)) {
        if (current.trim()) parts.push(current.trim());
        current = "";
        if (char === ",") i++; // skip the space
        continue;
      }
    }
    current += char;
  }
  if (current.trim()) parts.push(current.trim());
  return parts.filter(Boolean);
}

// Helper to parse education strings into discrete entries
export function parseEducation(text: string | null): string[] {
  if (!text) return [];
  const parts: string[] = [];
  let current = "";
  let parenDepth = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === "(") parenDepth++;
    if (char === ")") parenDepth = Math.max(0, parenDepth - 1);

    if (parenDepth === 0 && (char === ";" || (char === "," && i + 1 < text.length && text[i + 1] === " "))) {
      const nextWord = text.slice(i + 2).trim();
      // Check if next part is an institution or degree (starts with uppercase)
      if (char === ";" || /^(University|Ateneo|San Beda|De La Salle|Harvard|Philippine|Boston|Georgetown|London|City|Trinity|Northern|UP|DLSU)/i.test(nextWord)) {
        if (current.trim()) parts.push(current.trim());
        current = "";
        if (char === ",") i++;
        continue;
      }
    }
    current += char;
  }
  if (current.trim()) parts.push(current.trim());
  return parts.filter(Boolean);
}

async function main() {
  console.log("=== STARTING NON-DESTRUCTIVE CANDIDATE EDUCATION & SERVICE MIGRATION ===");
  const candidates = await prisma.candidate.findMany({
    include: { educations: true, publicServices: true },
  });

  let totalEducationsCreated = 0;
  let totalServicesCreated = 0;

  for (const c of candidates) {
    console.log(`\nProcessing candidate: ${c.name} [${c.slug}]`);

    // 1. Education conversion
    if (c.educations.length === 0 && c.education) {
      const eduEntries = parseEducation(c.education);
      console.log(`  Parsed ${eduEntries.length} education entries:`, eduEntries);

      for (let idx = 0; idx < eduEntries.length; idx++) {
        const entry = eduEntries[idx];
        await prisma.candidateEducation.create({
          data: {
            candidateId: c.id,
            degree: entry,
            displayOrder: idx + 1,
          },
        });
        totalEducationsCreated++;
      }
    } else {
      console.log(`  Already has ${c.educations.length} structured education entries.`);
    }

    // 2. Public Service conversion
    if (c.publicServices.length === 0 && c.publicService) {
      const serviceEntries = parsePublicService(c.publicService);
      console.log(`  Parsed ${serviceEntries.length} public service entries:`, serviceEntries);

      for (let idx = 0; idx < serviceEntries.length; idx++) {
        const entry = serviceEntries[idx];
        await prisma.candidatePublicService.create({
          data: {
            candidateId: c.id,
            position: entry,
            displayOrder: idx + 1,
          },
        });
        totalServicesCreated++;
      }
    } else {
      console.log(`  Already has ${c.publicServices.length} structured service entries.`);
    }
  }

  console.log("\n=======================================================");
  console.log(`MIGRATION COMPLETE! Created ${totalEducationsCreated} education entries and ${totalServicesCreated} service entries.`);
  console.log("Original text fields preserved intact.");
  console.log("=======================================================");
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
