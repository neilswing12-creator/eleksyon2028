/**
 * Philippine Standard Time (PST / Asia/Manila, UTC+08:00) Utility Functions
 * Used to ensure all date boundaries and day statistics strictly follow
 * the Philippine calendar day rather than the server's local or UTC timezone.
 */

export const PHILIPPINES_TIMEZONE = "Asia/Manila";

/**
 * Returns the exact Date object representing 00:00:00 (midnight) of the current
 * Philippine calendar day (Asia/Manila).
 */
export function getStartOfManilaToday(now = new Date()): Date {
  const manilaDateStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: PHILIPPINES_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now); // Returns "YYYY-MM-DD" in Manila time
  
  return new Date(`${manilaDateStr}T00:00:00+08:00`);
}

/**
 * Returns YYYY-MM-DD string for a given date in Philippine timezone.
 */
export function getManilaDateString(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PHILIPPINES_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/**
 * Formats a Date or ISO string into a human-readable Philippine time string.
 * Example: "Oct 21, 2026, 5:25:00 PM PST"
 */
export function formatManilaDateTime(date: Date | string | null | undefined): string {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Invalid Date";

  return new Intl.DateTimeFormat("en-US", {
    timeZone: PHILIPPINES_TIMEZONE,
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(d);
}
