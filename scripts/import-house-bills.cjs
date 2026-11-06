/**
 * Imports House of Representatives bill records (collected from congress.gov.ph's
 * legislative-documents list, which shows principal authors) into
 * CandidateLegislativeRecord. ADD OR CORRECT ONLY: never deletes. Old House records of a
 * covered candidate that are not in the official data become NEEDS_REVIEW.
 *
 *   node scripts/import-house-bills.cjs <house.json> [--db file:/path/live.db] [--apply]
 */
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require(path.join(__dirname, "../src/generated/prisma"));

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const apply = args.includes("--apply");
const prisma = new PrismaClient(args.includes("--db") ? { datasources: { db: { url: args[args.indexOf("--db") + 1] } } } : undefined);

// House author-name patterns (as printed on congress.gov.ph) -> candidate slugs.
// Patterns use the given name too, so relatives with the same surname never match.
const AUTHOR_TO_SLUGS = [
  [/^MARCOS,\s*FERDINAND ALEXANDER/i, ["sandro-marcos", "sandro-marcos-sen"]],
  [/^(GERONA-)?ROBREDO,\s*(MARIA LEONOR|LENI)/i, ["leni-robredo", "leni-robredo-pres"]],
  [/^PACQUIAO,\s*EMMANUEL/i, ["manny-pacquiao", "manny-pacquiao-sen"]],
  [/^VILLAR,\s*MARK/i, ["mark-villar"]],
  [/^CAYETANO,\s*ALAN PETER/i, ["alan-cayetano"]],
  [/^CAYETANO,\s*(PIA|PILAR)/i, ["pia-cayetano"]],
  [/^BINAY,\s*(MAR-LEN ABIGAIL|ABIGAIL|ABBY)/i, ["abby-binay"]],
  [/^TULFO,\s*ERWIN/i, ["erwin-tulfo"]],
  [/^BOSITA,\s*BONIFACIO/i, ["bonifacio-bosita"]],
  [/^DIOKNO,\s*JOSE MANUEL/i, ["chel-diokno"]],
  [/^TEODORO,\s*GILBERTO/i, ["gibo-teodoro"]],
  [/^ANGARA,\s*(JUAN EDGARDO|SONNY)/i, ["sonny-angara"]],
  [/^LEGARDA,\s*LOREN/i, ["loren-legarda"]],
];

const normHouse = (no) => {
  const m = String(no).toUpperCase().replace(/\s|\./g, "").match(/^(HB|HR|HBN|HRN)-?(?:NO)?0*(\d+)$/);
  return m ? `${m[1].slice(0, 2)}${m[2].padStart(5, "0")}` : String(no).toUpperCase();
};

function mapStatus(rec) {
  const s = (rec.status || "").toUpperCase();
  if (rec.ra || /REPUBLIC ACT|SIGNED INTO LAW|LAPSED INTO LAW/.test(s)) return "ENACTED_INTO_LAW";
  if (/SUBSTITUTED|CONSOLIDATED/.test(s)) return "CONSOLIDATED";
  if (/APPROVED BY THE HOUSE|TRANSMITTED TO THE SENATE|THIRD READING/.test(s)) return "PASSED_HOUSE";
  if (/WITHDRAWN/.test(s)) return "WITHDRAWN";
  if (/ADOPTED/.test(s)) return "ADOPTED";
  return "PENDING";
}

(async () => {
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const candidates = await prisma.candidate.findMany({ select: { id: true, slug: true } });
  const bySlug = new Map(candidates.map((c) => [c.slug, c.id]));
  const coveredCongresses = new Set(data.congressesComplete || []);

  const wanted = new Map();
  const authorHits = {};
  for (const r of data.records) {
    if (!r.no || !coveredCongresses.has(r.congress)) continue;
    (r.authors || []).forEach((author, idx) => {
      for (const [re, slugs] of AUTHOR_TO_SLUGS) {
        if (!re.test(author)) continue;
        authorHits[author] = (authorHits[author] || 0) + 1;
        for (const slug of slugs) {
          const candidateId = bySlug.get(slug);
          if (!candidateId) continue;
          const billNo = normHouse(r.no);
          const pdf = (r.links || []).find((h) => /\/basic_\d+\//.test(h)) || (r.links || [])[0] || null;
          const raPdf = (r.links || []).find((h) => /\/ra_\d+\//.test(h)) || null;
          wanted.set(`${candidateId}|${billNo}|${r.congress}|PRINCIPAL_AUTHOR`, {
            candidateId,
            chamber: "HOUSE",
            congress: r.congress,
            billNo,
            title: (r.title || billNo).slice(0, 500),
            longTitle: r.title || null,
            role: "PRINCIPAL_AUTHOR",
            status: mapStatus(r),
            republicActNo: r.ra ? `RA ${Number(r.ra)}` : null,
            filedDate: r.dateFiled ? new Date(r.dateFiled + "T00:00:00Z") : null,
            sourceInstitution: "HOUSE_PH",
            sourceUrl: pdf || `https://www.congress.gov.ph/legislative-documents?congress=${r.congress}`,
            pdfUrl: raPdf || pdf,
            reviewStatus: "CONFIRMED",
            matchConfidence: 1.0,
            matchNotes: `House of Representatives: ${r.status || "status n/a"}. Principal author #${idx + 1} of ${(r.authors || []).length}.`,
          });
        }
      }
    });
  }

  const coveredIds = new Set([...wanted.values()].map((w) => w.candidateId));
  const existing = await prisma.candidateLegislativeRecord.findMany({ where: { chamber: "HOUSE", candidateId: { in: [...coveredIds] } } });
  const existingByKey = new Map();
  for (const e of existing) {
    const k = `${e.candidateId}|${normHouse(e.billNo)}|${e.congress}|${e.role}`;
    if (!existingByKey.has(k)) existingByKey.set(k, e);
  }
  const officialBills = new Set([...wanted.values()].map((w) => `${w.candidateId}|${w.billNo}|${w.congress}`));

  let create = 0, update = 0, unchanged = 0;
  const ops = [];
  for (const [key, w] of wanted) {
    const e = existingByKey.get(key);
    if (!e) { create++; ops.push(prisma.candidateLegislativeRecord.create({ data: w })); continue; }
    const changed = ["billNo", "title", "status", "sourceUrl", "republicActNo", "reviewStatus"].some((f) => (e[f] || null) !== (w[f] || null));
    if (changed) { update++; ops.push(prisma.candidateLegislativeRecord.update({ where: { id: e.id }, data: { ...w, candidateId: undefined } })); }
    else unchanged++;
  }
  const flagged = [];
  for (const e of existing) {
    if (!coveredCongresses.has(e.congress) || !/^H[BR]/i.test(e.billNo)) continue;
    if (e.role !== "PRINCIPAL_AUTHOR") continue; // the House list only shows principal authors
    if (officialBills.has(`${e.candidateId}|${normHouse(e.billNo)}|${e.congress}`)) continue;
    if (e.reviewStatus === "NEEDS_REVIEW" && (e.matchNotes || "").startsWith("Not found in House")) continue;
    flagged.push(e);
    ops.push(prisma.candidateLegislativeRecord.update({
      where: { id: e.id },
      data: { reviewStatus: "NEEDS_REVIEW", matchNotes: `Not found in House records as principal author in the ${e.congress}th Congress (checked ${new Date().toISOString().slice(0, 10)}). Previous note: ${e.matchNotes || "none"}` },
    }));
  }

  const perCandidate = {};
  for (const w of wanted.values()) {
    const slug = candidates.find((c) => c.id === w.candidateId).slug;
    perCandidate[slug] = (perCandidate[slug] || 0) + 1;
  }
  console.log(JSON.stringify({
    officialRecords: wanted.size, create, update, unchanged, flaggedNotFound: flagged.length,
    flagged: flagged.map((f) => `${f.billNo} (${f.congress}th) ${f.title.slice(0, 70)}`),
    authorNamesMatched: authorHits, perCandidate, congressesComplete: [...coveredCongresses],
    mode: apply ? "APPLY" : "DRY RUN",
  }, null, 1));

  if (apply) {
    for (let i = 0; i < ops.length; i += 500) await prisma.$transaction(ops.slice(i, i + 500));
    console.log(`applied ${ops.length} changes`);
  }
  await prisma.$disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
