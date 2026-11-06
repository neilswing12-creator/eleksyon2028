/**
 * Imports official Senate bill records (collected from senate.gov.ph's LIS API, see
 * docs in the commit) into CandidateLegislativeRecord. ADD OR CORRECT ONLY: it never
 * deletes. Existing Senate records for a fully-covered candidate that are not in the
 * official data are set to NEEDS_REVIEW (hidden from the public page) with a note.
 *
 *   node scripts/import-senate-bills.cjs <records.json> [--db file:/path/live.db] [--apply]
 *
 * Without --apply it only prints what it would do.
 */
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require(path.join(__dirname, "../src/generated/prisma"));

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const apply = args.includes("--apply");
const dbArg = args[args.indexOf("--db") + 1];
if (!file) throw new Error("Pass the records JSON file");
const prisma = new PrismaClient(args.includes("--db") ? { datasources: { db: { url: dbArg } } } : undefined);

// Senate LIS senator code -> candidate slugs (one person can have several candidacy rows)
const SENATOR_TO_SLUGS = {
  HANAT: ["risa-hontiveros", "risa-hontiveros-vp"],
  TRAFF: ["raffy-tulfo", "raffy-tulfo-sen"],
  TERWI: ["erwin-tulfo"],
  BAQUI: ["bam-aquino"],
  APAOL: ["bam-aquino"],
  PGRAC: ["grace-poe", "grace-poe-sen"],
  PROBI: ["robinhood-vp", "robinhood-sen"],
  EFRAN: ["francis-escudero", "francis-escudero-sen"],
  PEMMA: ["manny-pacquiao", "manny-pacquiao-sen"],
  CALAN: ["alan-cayetano"],
  CPIAS: ["pia-cayetano"],
  DRONA: ["bato-dela-rosa"],
  EJING: ["jinggoy-estrada"],
  GCHRI: ["bong-go"],
  LLORE: ["loren-legarda"],
  PFRAN: ["kiko-pangilinan"],
  VMARK: ["mark-villar"],
  ASONN: ["sonny-angara"],
  BMARI: ["nancy-binay"],
  PAQUI: ["koko-pimentel"],
  TFRAN: ["francis-tolentino"],
  DLEIL: ["leila-de-lima"],
  HGREG: ["gringo-honasan"],
  TANTO: ["antonio-trillanes"],
};

function mapStatus(raw) {
  const s = (raw || "").toUpperCase();
  if (/APPROVED BY THE PRESIDENT|LAPSED INTO LAW/.test(s) && !/^CONSOLIDATED/.test(s)) return "ENACTED_INTO_LAW";
  if (/^CONSOLIDATED/.test(s)) return "CONSOLIDATED";
  if (/VETOED/.test(s)) return "VETOED";
  if (/WITHDRAWN/.test(s)) return "WITHDRAWN";
  if (/ARCHIVES/.test(s)) return "ARCHIVED";
  if (/THIRD READING BY THE SENATE|PENDING IN THE HOUSE|PASSED BY BOTH HOUSES|CONFERENCE|CONFEREES/.test(s)) return "PASSED_SENATE";
  return "PENDING";
}

const decode = (t) =>
  t == null
    ? null
    : String(t)
        .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;|&apos;/g, "'")
        // Cyrillic look-alikes that appear in some LIS titles (e.g. "ОТHERWISE")
        .replace(/[АВЕКМНОРСТХ]/g, (c) => "ABEKMHOPCTX"["АВЕКМНОРСТХ".indexOf(c)])
        .trim();

// Older records used "SB-123"; the Senate's own format is "SBN-123".
const normBill = (no) => String(no).trim().toUpperCase().replace(/^S\.?\s*B\.?\s*N?\.?\s*(NO\.?)?\s*-?\s*(\d+)$/, "SBN-$2");
const isSenateBill = (no) => /^SBN-\d+$/.test(normBill(no));

const sourceUrl = (no, congress) =>
  `https://senate.gov.ph/legislative-documents/bills?q=${encodeURIComponent(no)}&congress=${encodeURIComponent(congress + "th Congress")}`;

(async () => {
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const done = new Set((data.batchesDone || []).map((b) => b.split(":")[0]));
  const candidates = await prisma.candidate.findMany({ select: { id: true, slug: true } });
  const bySlug = new Map(candidates.map((c) => [c.slug, c.id]));

  // Which (senator, congress) pairs are fully covered, per candidate
  const coverage = new Map(); // candidateId -> { complete: bool, congresses:Set }
  for (const sen of data.senators || []) {
    const slugs = SENATOR_TO_SLUGS[sen.code];
    if (!slugs) continue;
    for (const slug of slugs) {
      const id = bySlug.get(slug);
      if (!id) continue;
      const cov = coverage.get(id) || { complete: true, congresses: new Set() };
      for (const c of sen.congresses) {
        cov.congresses.add(c);
        if (!done.has(`${sen.code}-${c}-author`) || !done.has(`${sen.code}-${c}-co_author`)) cov.complete = false;
      }
      coverage.set(id, cov);
    }
  }

  // Build the official record set
  const wanted = new Map(); // key -> record
  const missingSlugs = new Set();
  for (const r of data.records) {
    const slugs = SENATOR_TO_SLUGS[r.senatorCode];
    if (!slugs) continue;
    for (const slug of slugs) {
      const candidateId = bySlug.get(slug);
      if (!candidateId) { missingSlugs.add(slug); continue; }
      const key = `${candidateId}|${r.no}|${r.congress}|${r.role}`;
      const statusRaw = decode(r.status) || "";
      wanted.set(key, {
        candidateId,
        chamber: "SENATE",
        congress: r.congress,
        billNo: r.no,
        title: decode(r.title) || r.no,
        longTitle: decode(r.longTitle),
        role: r.role,
        status: mapStatus(statusRaw),
        filedDate: r.dateFiled ? new Date(r.dateFiled + " UTC") : null,
        sourceInstitution: "SENATE_PH",
        sourceUrl: sourceUrl(r.no, r.congress),
        reviewStatus: "CONFIRMED",
        matchConfidence: 1.0,
        matchNotes: `Senate LIS: ${statusRaw}${r.statusDate ? ` (${r.statusDate})` : ""}. Principal author: ${decode(r.author) || "n/a"}.`,
      });
    }
  }

  const existing = await prisma.candidateLegislativeRecord.findMany({
    where: { chamber: "SENATE", candidateId: { in: [...coverage.keys()] } },
  });
  const existingByKey = new Map();
  const duplicates = []; // two old rows that are the same bill once "SB-" is read as "SBN-"
  for (const e of existing) {
    const k = `${e.candidateId}|${normBill(e.billNo)}|${e.congress}|${e.role}`;
    const prev = existingByKey.get(k);
    if (!prev) { existingByKey.set(k, e); continue; }
    const keep = prev.billNo === normBill(prev.billNo) ? prev : e; // prefer the row already in SBN- form
    duplicates.push(keep === prev ? e : prev);
    existingByKey.set(k, keep);
  }
  const officialBills = new Set([...wanted.values()].map((w) => `${w.candidateId}|${w.billNo}|${w.congress}`));

  let create = 0, update = 0, unchanged = 0;
  const ops = [];
  for (const [key, w] of wanted) {
    const e = existingByKey.get(key);
    if (!e) { create++; ops.push(prisma.candidateLegislativeRecord.create({ data: w })); continue; }
    const changed = ["billNo", "title", "longTitle", "status", "sourceUrl", "reviewStatus"].some((f) => (e[f] || null) !== (w[f] || null));
    if (changed) { update++; ops.push(prisma.candidateLegislativeRecord.update({ where: { id: e.id }, data: { ...w, candidateId: undefined } })); }
    else unchanged++;
  }

  for (const d of duplicates) {
    if (d.reviewStatus === "NEEDS_REVIEW" && (d.matchNotes || "").startsWith("Duplicate of")) continue;
    ops.unshift(prisma.candidateLegislativeRecord.update({
      where: { id: d.id },
      data: { reviewStatus: "NEEDS_REVIEW", matchNotes: `Duplicate of ${normBill(d.billNo)} (${d.congress}th Congress) after bill-number normalisation. Previous note: ${d.matchNotes || "none"}` },
    }));
  }

  // Flag (never delete) old Senate records the official data does not contain
  const flagged = [];
  const dupIds = new Set(duplicates.map((d) => d.id));
  for (const e of existing) {
    const cov = coverage.get(e.candidateId);
    if (!cov || !cov.complete || dupIds.has(e.id)) continue;
    if (!isSenateBill(e.billNo)) continue; // laws (RA ...) and resolutions are not in this data set
    if (officialBills.has(`${e.candidateId}|${normBill(e.billNo)}|${e.congress}`)) continue;
    if (e.reviewStatus === "NEEDS_REVIEW" && (e.matchNotes || "").startsWith("Not found in Senate LIS")) continue;
    flagged.push(e);
    ops.push(prisma.candidateLegislativeRecord.update({
      where: { id: e.id },
      data: { reviewStatus: "NEEDS_REVIEW", matchNotes: `Not found in Senate LIS for this senator in the ${e.congress}th Congress (checked ${new Date().toISOString().slice(0, 10)}). Previous note: ${e.matchNotes || "none"}` },
    }));
  }

  const perCandidate = {};
  for (const w of wanted.values()) {
    const slug = candidates.find((c) => c.id === w.candidateId).slug;
    perCandidate[slug] = (perCandidate[slug] || 0) + 1;
  }
  console.log(JSON.stringify({
    officialRecords: wanted.size, create, update, unchanged, duplicatesHidden: duplicates.length, flaggedNotFound: flagged.length,
    flagged: flagged.map((f) => `${f.billNo} (${f.congress}th) ${f.title.slice(0, 70)}`),
    candidatesNotFullyCovered: [...coverage].filter(([, c]) => !c.complete).map(([id]) => candidates.find((c) => c.id === id).slug),
    slugsMissingInDb: [...missingSlugs],
    perCandidate,
    mode: apply ? "APPLY" : "DRY RUN",
  }, null, 1));

  if (apply) {
    for (let i = 0; i < ops.length; i += 500) await prisma.$transaction(ops.slice(i, i + 500));
    console.log(`applied ${ops.length} changes`);
  }
  await prisma.$disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
