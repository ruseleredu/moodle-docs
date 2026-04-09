// moodleReleases.shared.ts
// Shared types, constants, and pure helpers used by both
// MoodleReleases (interactive) and MoodleReleasesFiltered (static).

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Release {
  name: string;
  releaseDate?: string;
  version?: number;
  upgradePath?: string;
  releaseNoteUrl?: string | false;
  notes?: string;
}

export interface Version {
  name: string;
  releaseDate: string;
  generalEndDate: string;
  securityEndDate: string;
  isLTS?: boolean;
  isExperimental?: boolean;
  codeFreezeDate?: string;
  releases?: Release[];
}

export interface VersionsJson {
  versions: Version[];
}

export type Status =
  | "future"
  | "active"
  | "security"
  | "eol"
  | "experimental";

export type SortCol =
  | "name"
  | "status"
  | "releaseDate"
  | "generalEndDate"
  | "securityEndDate"
  | "count";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const DATA_URL =
  "https://raw.githubusercontent.com/moodle/devdocs/refs/heads/main/data/versions.json";

const MONTHS: Record<string, number> = {
  January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
  July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
  JUne: 5, // typo present in upstream data
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function parseDate(s?: string): Date | null {
  if (!s) return null;
  const m = s.trim().match(/(\d+)\s+(\w+)\s+(\d{4})/);
  if (!m) return null;
  const month = MONTHS[m[2]];
  if (month === undefined) return null;
  return new Date(+m[3], month, +m[1]);
}

export function getStatus(v: Version): Status {
  const today = new Date();
  if (v.isExperimental) return "experimental";
  const rel = parseDate(v.releaseDate);
  const gen = parseDate(v.generalEndDate);
  const sec = parseDate(v.securityEndDate);
  if (rel && rel > today) return "future";
  if (gen && today <= gen) return "active";
  if (sec && today <= sec) return "security";
  return "eol";
}

export function semverCmp(a: string, b: string): number {
  const ap = a.split(".").map(Number);
  const bp = b.split(".").map(Number);
  for (let i = 0; i < Math.max(ap.length, bp.length); i++) {
    const d = (ap[i] ?? 0) - (bp[i] ?? 0);
    if (d !== 0) return d;
  }
  return 0;
}

// ---------------------------------------------------------------------------
// Filter + sort
// ---------------------------------------------------------------------------

export interface FilterOptions {
  /** Plain-text search against version name */
  search?: string;
  /** "active" | "security" | "lts" | "eol" | "future" | "experimental" | "" */
  filterStatus?: string;
  /** Major series number as a string, e.g. "4" or "5" */
  filterSeries?: string;
  sortCol?: SortCol;
  /** -1 = descending (default), 1 = ascending */
  sortDir?: 1 | -1;
}

export function applyFilters(
  versions: Version[],
  opts: FilterOptions = {},
): Version[] {
  const {
    search = "",
    filterStatus = "",
    filterSeries = "",
    sortCol = "name",
    sortDir = -1,
  } = opts;

  const filtered = versions.filter((v) => {
    if (search && !v.name.includes(search)) return false;
    if (filterSeries && !v.name.startsWith(filterSeries + ".")) return false;
    if (filterStatus) {
      if (filterStatus === "lts") return v.isLTS === true;
      return getStatus(v) === filterStatus;
    }
    return true;
  });

  filtered.sort((a, b) => {
    let cmp = 0;
    switch (sortCol) {
      case "name":
        cmp = semverCmp(a.name, b.name);
        break;
      case "status":
        cmp = getStatus(a).localeCompare(getStatus(b));
        break;
      case "releaseDate":
        cmp =
          (parseDate(a.releaseDate)?.getTime() ?? 0) -
          (parseDate(b.releaseDate)?.getTime() ?? 0);
        break;
      case "generalEndDate":
        cmp =
          (parseDate(a.generalEndDate)?.getTime() ?? 0) -
          (parseDate(b.generalEndDate)?.getTime() ?? 0);
        break;
      case "securityEndDate":
        cmp =
          (parseDate(a.securityEndDate)?.getTime() ?? 0) -
          (parseDate(b.securityEndDate)?.getTime() ?? 0);
        break;
      case "count":
        cmp = (a.releases?.length ?? 0) - (b.releases?.length ?? 0);
        break;
    }
    return cmp * sortDir;
  });

  return filtered;
}
