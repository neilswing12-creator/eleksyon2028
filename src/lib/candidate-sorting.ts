export type NormalizedPosition = "PRESIDENT" | "VICE_PRESIDENT" | "SENATOR" | "OTHER";

export interface CandidateGroup<T> {
  key: NormalizedPosition;
  label: string;
  candidates: T[];
}

export const POSITION_GROUP_CONFIG: Array<{ key: NormalizedPosition; label: string; rank: number }> = [
  { key: "PRESIDENT", label: "PRESIDENT", rank: 1 },
  { key: "VICE_PRESIDENT", label: "VICE PRESIDENT", rank: 2 },
  { key: "SENATOR", label: "SENATOR", rank: 3 },
  { key: "OTHER", label: "OTHER / UNCLASSIFIED", rank: 4 },
];

/**
 * Normalizes any string or null representation of position into one of the 4 standard categories.
 * Handles uppercase, lowercase, mixed case, hyphens, and whitespace.
 */
export function normalizeCandidatePosition(raw?: string | null): NormalizedPosition {
  if (!raw || typeof raw !== "string") return "OTHER";
  const cleaned = raw.trim().toUpperCase().replace(/[\s-]+/g, "_");
  if (cleaned === "PRESIDENT" || cleaned === "PRES") {
    return "PRESIDENT";
  }
  if (
    cleaned === "VICE_PRESIDENT" ||
    cleaned === "VP" ||
    cleaned === "VICEPRESIDENT" ||
    cleaned === "VICE_PRES"
  ) {
    return "VICE_PRESIDENT";
  }
  if (cleaned === "SENATOR" || cleaned === "SEN") {
    return "SENATOR";
  }
  return "OTHER";
}

/**
 * Clean candidate name for alphabetical comparison by removing leading quotes or punctuation.
 */
export function getComparableName(name: string): string {
  if (!name) return "";
  return name.replace(/^["'‘“\s]+/, "").trim();
}

/**
 * Compares two candidate names alphabetically (A-Z) in a case-insensitive manner.
 */
export function compareCandidateNames(aName?: string | null, bName?: string | null): number {
  const cleanA = getComparableName(aName || "");
  const cleanB = getComparableName(bName || "");
  const comp = cleanA.localeCompare(cleanB, "en-US", {
    sensitivity: "base",
    numeric: true,
  });
  if (comp !== 0) return comp;
  return (aName || "").localeCompare(bName || "");
}

/**
 * Sorts any array of candidate objects first by Position (President -> VP -> Senator -> Other)
 * and then alphabetically (A-Z) by Candidate Name within each group.
 */
export function sortCandidatesByPositionAndName<T extends { name: string; position?: string | null }>(
  candidates: T[]
): T[] {
  const getRank = (c: T) => {
    const pos = normalizeCandidatePosition(c.position);
    switch (pos) {
      case "PRESIDENT":
        return 1;
      case "VICE_PRESIDENT":
        return 2;
      case "SENATOR":
        return 3;
      default:
        return 4;
    }
  };

  return [...candidates].sort((a, b) => {
    const rankDiff = getRank(a) - getRank(b);
    if (rankDiff !== 0) return rankDiff;
    return compareCandidateNames(a.name, b.name);
  });
}

/**
 * Groups candidates into ordered groups:
 * 1. PRESIDENT (A-Z)
 * 2. VICE PRESIDENT (A-Z)
 * 3. SENATOR (A-Z)
 * 4. OTHER / UNCLASSIFIED (A-Z) (only present if candidates exist with unclassified position)
 */
export function groupCandidatesByPosition<T extends { name: string; position?: string | null }>(
  candidates: T[]
): CandidateGroup<T>[] {
  const sorted = sortCandidatesByPositionAndName(candidates);
  const buckets: Record<NormalizedPosition, T[]> = {
    PRESIDENT: [],
    VICE_PRESIDENT: [],
    SENATOR: [],
    OTHER: [],
  };

  for (const cand of sorted) {
    const pos = normalizeCandidatePosition(cand.position);
    buckets[pos].push(cand);
  }

  const result: CandidateGroup<T>[] = [];
  for (const config of POSITION_GROUP_CONFIG) {
    if (buckets[config.key].length > 0) {
      result.push({
        key: config.key,
        label: config.label,
        candidates: buckets[config.key],
      });
    }
  }

  return result;
}
