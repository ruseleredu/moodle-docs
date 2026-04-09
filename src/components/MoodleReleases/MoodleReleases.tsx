import React, { useEffect, useMemo, useState } from "react";
import styles from "./MoodleReleases.module.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Release {
  name: string;
  releaseDate?: string;
  version?: number;
  upgradePath?: string;
  releaseNoteUrl?: string | false;
  notes?: string;
}

interface Version {
  name: string;
  releaseDate: string;
  generalEndDate: string;
  securityEndDate: string;
  isLTS?: boolean;
  isExperimental?: boolean;
  codeFreezeDate?: string;
  releases?: Release[];
}

interface VersionsJson {
  versions: Version[];
}

type Status = "future" | "active" | "security" | "eol" | "experimental";
type SortCol =
  | "name"
  | "status"
  | "releaseDate"
  | "generalEndDate"
  | "securityEndDate"
  | "count";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DATA_URL =
  "https://raw.githubusercontent.com/moodle/devdocs/refs/heads/main/data/versions.json";

const TODAY = new Date();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MONTHS: Record<string, number> = {
  January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
  July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
  // handle typo in source data ("JUne")
  JUne: 5,
};

function parseDate(s?: string): Date | null {
  if (!s) return null;
  const m = s.trim().match(/(\d+)\s+(\w+)\s+(\d{4})/);
  if (!m) return null;
  const month = MONTHS[m[2]];
  if (month === undefined) return null;
  return new Date(+m[3], month, +m[1]);
}

function getStatus(v: Version): Status {
  if (v.isExperimental) return "experimental";
  const rel = parseDate(v.releaseDate);
  const gen = parseDate(v.generalEndDate);
  const sec = parseDate(v.securityEndDate);
  if (rel && rel > TODAY) return "future";
  if (gen && TODAY <= gen) return "active";
  if (sec && TODAY <= sec) return "security";
  return "eol";
}

function semverParts(name: string): number[] {
  return name.split(".").map(Number);
}

function semverCmp(a: string, b: string): number {
  const ap = semverParts(a);
  const bp = semverParts(b);
  for (let i = 0; i < Math.max(ap.length, bp.length); i++) {
    const d = (ap[i] ?? 0) - (bp[i] ?? 0);
    if (d !== 0) return d;
  }
  return 0;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface StatusBadgeProps {
  version: Version;
}

function StatusBadge({ version }: StatusBadgeProps) {
  const status = getStatus(version);
  const label: Record<Status, string> = {
    future: "Upcoming",
    active: version.isLTS ? "LTS · Active" : "Active",
    security: version.isLTS ? "LTS · Security only" : "Security only",
    eol: "End of life",
    experimental: "Experimental",
  };
  return (
    <span className={`${styles.badge} ${styles[`badge_${status}`]}`}>
      {label[status]}
    </span>
  );
}

interface StatCardProps {
  value: number;
  label: string;
}

function StatCard({ value, label }: StatCardProps) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

interface SortHeaderProps {
  col: SortCol;
  label: string;
  currentCol: SortCol;
  currentDir: 1 | -1;
  onSort: (col: SortCol) => void;
}

function SortHeader({ col, label, currentCol, currentDir, onSort }: SortHeaderProps) {
  const active = currentCol === col;
  return (
    <th
      className={`${styles.th} ${active ? styles.thActive : ""}`}
      onClick={() => onSort(col)}
      aria-sort={active ? (currentDir === -1 ? "descending" : "ascending") : "none"}
    >
      {label}
      <span className={styles.sortIcon} aria-hidden="true">
        {active ? (currentDir === -1 ? " ↓" : " ↑") : " ↕"}
      </span>
    </th>
  );
}

interface PatchRowProps {
  version: Version;
  index: number;
}

function PatchRow({ version, index }: PatchRowProps) {
  const [open, setOpen] = useState(false);
  const releases = version.releases ?? [];
  if (releases.length === 0) return null;
  return (
    <>
      <button
        className={styles.releaseToggle}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`releases-${index}`}
      >
        {releases.length} release{releases.length !== 1 ? "s" : ""}
        <span aria-hidden="true">{open ? " ▲" : " ▼"}</span>
      </button>
      {open && (
        <table id={`releases-${index}`} className={styles.subTable} aria-label={`Patch releases for Moodle ${version.name}`}>
          <thead>
            <tr>
              <th className={styles.subTh}>Release</th>
              <th className={styles.subTh}>Date</th>
              <th className={styles.subTh}>Note</th>
            </tr>
          </thead>
          <tbody>
            {releases.map((r) => (
              <tr key={r.name} className={styles.subTr}>
                <td className={styles.subTd} style={{ fontWeight: 500 }}>{r.name}</td>
                <td className={styles.subTd}>{r.releaseDate ?? "—"}</td>
                <td className={styles.subTd}>
                  {r.notes && <span className={styles.notePill}>{r.notes}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function MoodleReleases(): JSX.Element {
  const [data, setData] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterSeries, setFilterSeries] = useState<string>("");

  // Sort
  const [sortCol, setSortCol] = useState<SortCol>("name");
  const [sortDir, setSortDir] = useState<1 | -1>(-1);

  // Fetch
  useEffect(() => {
    let cancelled = false;
    fetch(DATA_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<VersionsJson>;
      })
      .then((json) => {
        if (!cancelled) {
          setData(json.versions);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  // Derived series list for filter dropdown
  const seriesList = useMemo(() => {
    const seen = new Set<string>();
    data.forEach((v) => seen.add(v.name.split(".")[0]));
    return [...seen].sort((a, b) => +b - +a);
  }, [data]);

  // Stats (always over full dataset)
  const stats = useMemo(() => {
    const active = data.filter((v) => getStatus(v) === "active").length;
    const security = data.filter((v) => getStatus(v) === "security").length;
    const lts = data.filter((v) => v.isLTS).length;
    const totalReleases = data.reduce((s, v) => s + (v.releases?.length ?? 0), 0);
    return { total: data.length, supported: active + security, lts, totalReleases };
  }, [data]);

  // Filtered + sorted rows
  const rows = useMemo(() => {
    let filtered = data.filter((v) => {
      if (search && !v.name.includes(search)) return false;
      if (filterSeries && !v.name.startsWith(filterSeries + ".")) return false;
      if (filterStatus) {
        const s = getStatus(v);
        if (filterStatus === "lts") return v.isLTS === true;
        return s === filterStatus;
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
          cmp = (parseDate(a.releaseDate)?.getTime() ?? 0) - (parseDate(b.releaseDate)?.getTime() ?? 0);
          break;
        case "generalEndDate":
          cmp = (parseDate(a.generalEndDate)?.getTime() ?? 0) - (parseDate(b.generalEndDate)?.getTime() ?? 0);
          break;
        case "securityEndDate":
          cmp = (parseDate(a.securityEndDate)?.getTime() ?? 0) - (parseDate(b.securityEndDate)?.getTime() ?? 0);
          break;
        case "count":
          cmp = (a.releases?.length ?? 0) - (b.releases?.length ?? 0);
          break;
      }
      return cmp * sortDir;
    });

    return filtered;
  }, [data, search, filterStatus, filterSeries, sortCol, sortDir]);

  function handleSort(col: SortCol) {
    if (sortCol === col) {
      setSortDir((d) => (d === -1 ? 1 : -1));
    } else {
      setSortCol(col);
      setSortDir(-1);
    }
  }

  // ---------------------------------------------------------------------------
  // Render states
  // ---------------------------------------------------------------------------

  if (loading) {
    return <div className={styles.stateBox}>Loading Moodle release data…</div>;
  }

  if (error) {
    return (
      <div className={`${styles.stateBox} ${styles.stateError}`}>
        Failed to load release data: {error}
      </div>
    );
  }

  return (
    <section aria-label="Moodle release versions">
      {/* Stats row */}
      <div className={styles.statsRow}>
        <StatCard value={stats.total} label="Total branches" />
        <StatCard value={stats.supported} label="Currently supported" />
        <StatCard value={stats.lts} label="LTS branches" />
        <StatCard value={stats.totalReleases} label="Total patch releases" />
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search version…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search versions"
        />
        <select
          className={styles.select}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          <option value="active">Active support</option>
          <option value="security">Security only</option>
          <option value="lts">LTS</option>
          <option value="eol">End of life</option>
          <option value="future">Upcoming</option>
          <option value="experimental">Experimental</option>
        </select>
        <select
          className={styles.select}
          value={filterSeries}
          onChange={(e) => setFilterSeries(e.target.value)}
          aria-label="Filter by series"
        >
          <option value="">All series</option>
          {seriesList.map((s) => (
            <option key={s} value={s}>
              Moodle {s}.x
            </option>
          ))}
        </select>
      </div>

      {/* Legend */}
      <div className={styles.legend} aria-label="Status legend">
        {(
          [
            ["future", "Upcoming"],
            ["active", "Active / LTS"],
            ["security", "Security only"],
            ["eol", "End of life"],
            ["experimental", "Experimental"],
          ] as const
        ).map(([status, label]) => (
          <span key={status} className={styles.legendItem}>
            <span className={`${styles.dot} ${styles[`dot_${status}`]}`} aria-hidden="true" />
            {label}
          </span>
        ))}
      </div>

      {/* Table */}
      {rows.length === 0 ? (
        <p className={styles.empty}>No versions match your filter.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <SortHeader col="name" label="Version" currentCol={sortCol} currentDir={sortDir} onSort={handleSort} />
                <SortHeader col="status" label="Status" currentCol={sortCol} currentDir={sortDir} onSort={handleSort} />
                <SortHeader col="releaseDate" label="Released" currentCol={sortCol} currentDir={sortDir} onSort={handleSort} />
                <SortHeader col="generalEndDate" label="General end" currentCol={sortCol} currentDir={sortDir} onSort={handleSort} />
                <SortHeader col="securityEndDate" label="Security end" currentCol={sortCol} currentDir={sortDir} onSort={handleSort} />
                <SortHeader col="count" label="Patch releases" currentCol={sortCol} currentDir={sortDir} onSort={handleSort} />
                <th className={styles.th}>Links</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((v, i) => {
                const status = getStatus(v);
                const firstRelease = v.releases?.[0];
                const upgradePath = firstRelease?.upgradePath;
                const majorMinor = v.name.replace(".", "");
                const docsUrl = `https://docs.moodle.org/${majorMinor}/en/`;

                return (
                  <tr key={v.name} className={`${styles.tr} ${styles[`row_${status}`]}`}>
                    <td className={styles.td}>
                      <span className={styles.verCell}>
                        <span className={`${styles.dot} ${styles[`dot_${status}`]}`} aria-hidden="true" />
                        <span className={styles.verNum}>{v.name}</span>
                        {v.isLTS && <span className={`${styles.badge} ${styles.badge_lts}`}>LTS</span>}
                        {v.isExperimental && <span className={`${styles.badge} ${styles.badge_experimental}`}>Exp</span>}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <StatusBadge version={v} />
                    </td>
                    <td className={`${styles.td} ${styles.dateTd}`}>{v.releaseDate ?? "—"}</td>
                    <td className={`${styles.td} ${styles.dateTd}`}>{v.generalEndDate ?? "—"}</td>
                    <td className={`${styles.td} ${styles.dateTd}`}>{v.securityEndDate ?? "—"}</td>
                    <td className={styles.td}>
                      <PatchRow version={v} index={i} />
                      {(!v.releases || v.releases.length === 0) && (
                        <span className={styles.dash}>—</span>
                      )}
                    </td>
                    <td className={`${styles.td} ${styles.linksTd}`}>
                      {upgradePath && (
                        <a href={upgradePath} className={styles.linkBtn} target="_blank" rel="noopener noreferrer">
                          Upgrade
                        </a>
                      )}
                      {v.releases && v.releases.length > 0 && (
                        <a href={docsUrl} className={styles.linkBtn} target="_blank" rel="noopener noreferrer">
                          Docs
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className={styles.footer}>
        Data sourced from{" "}
        <a href={DATA_URL} target="_blank" rel="noopener noreferrer">
          moodle/devdocs · data/versions.json
        </a>
      </p>
    </section>
  );
}
