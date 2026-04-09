import React, { useEffect, useMemo, useState } from "react";
import styles from "./MoodleReleases.module.css";
import {
  DATA_URL,
  SortCol,
  Status,
  Version,
  VersionsJson,
  applyFilters,
  getStatus,
} from "./moodleReleases.shared";

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatusBadge({ version }: { version: Version }) {
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

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

function SortHeader({
  col,
  label,
  currentCol,
  currentDir,
  onSort,
}: {
  col: SortCol;
  label: string;
  currentCol: SortCol;
  currentDir: 1 | -1;
  onSort: (col: SortCol) => void;
}) {
  const active = currentCol === col;
  return (
    <th
      className={`${styles.th} ${active ? styles.thActive : ""}`}
      onClick={() => onSort(col)}
      aria-sort={
        active ? (currentDir === -1 ? "descending" : "ascending") : "none"
      }
    >
      {label}
      <span className={styles.sortIcon} aria-hidden="true">
        {active ? (currentDir === -1 ? " ↓" : " ↑") : " ↕"}
      </span>
    </th>
  );
}

function PatchRow({ version, index }: { version: Version; index: number }) {
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
        <table
          id={`releases-${index}`}
          className={styles.subTable}
          aria-label={`Patch releases for Moodle ${version.name}`}
        >
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
                <td className={styles.subTd} style={{ fontWeight: 500 }}>
                  {r.name}
                </td>
                <td className={styles.subTd}>{r.releaseDate ?? "—"}</td>
                <td className={styles.subTd}>
                  {r.notes && (
                    <span className={styles.notePill}>{r.notes}</span>
                  )}
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

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterSeries, setFilterSeries] = useState<string>("");
  const [sortCol, setSortCol] = useState<SortCol>("name");
  const [sortDir, setSortDir] = useState<1 | -1>(-1);

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

  const seriesList = useMemo(() => {
    const seen = new Set<string>();
    data.forEach((v) => seen.add(v.name.split(".")[0]));
    return [...seen].sort((a, b) => +b - +a);
  }, [data]);

  const stats = useMemo(() => {
    const active = data.filter((v) => getStatus(v) === "active").length;
    const security = data.filter((v) => getStatus(v) === "security").length;
    const lts = data.filter((v) => v.isLTS).length;
    const totalReleases = data.reduce((s, v) => s + (v.releases?.length ?? 0), 0);
    return { total: data.length, supported: active + security, lts, totalReleases };
  }, [data]);

  const rows = useMemo(
    () => applyFilters(data, { search, filterStatus, filterSeries, sortCol, sortDir }),
    [data, search, filterStatus, filterSeries, sortCol, sortDir],
  );

  function handleSort(col: SortCol) {
    if (sortCol === col) {
      setSortDir((d) => (d === -1 ? 1 : -1));
    } else {
      setSortCol(col);
      setSortDir(-1);
    }
  }

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
      <div className={styles.statsRow}>
        <StatCard value={stats.total} label="Total branches" />
        <StatCard value={stats.supported} label="Currently supported" />
        <StatCard value={stats.lts} label="LTS branches" />
        <StatCard value={stats.totalReleases} label="Total patch releases" />
      </div>

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
            <span
              className={`${styles.dot} ${styles[`dot_${status}`]}`}
              aria-hidden="true"
            />
            {label}
          </span>
        ))}
      </div>

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
              </tr>
            </thead>
            <tbody>
              {rows.map((v, i) => {
                const status = getStatus(v);
                const releasePageUrl = `https://moodledev.io/general/releases/${v.name}`;
                return (
                  <tr key={v.name} className={`${styles.tr} ${styles[`row_${status}`]}`}>
                    <td className={styles.td}>
                      <span className={styles.verCell}>
                        <span className={`${styles.dot} ${styles[`dot_${status}`]}`} aria-hidden="true" />
                        <a href={releasePageUrl} className={styles.verLink} target="_blank" rel="noopener noreferrer">
                          {v.name}
                        </a>
                        {v.isLTS && <span className={`${styles.badge} ${styles.badge_lts}`}>LTS</span>}
                        {v.isExperimental && <span className={`${styles.badge} ${styles.badge_experimental}`}>Exp</span>}
                      </span>
                    </td>
                    <td className={styles.td}><StatusBadge version={v} /></td>
                    <td className={`${styles.td} ${styles.dateTd}`}>{v.releaseDate ?? "—"}</td>
                    <td className={`${styles.td} ${styles.dateTd}`}>{v.generalEndDate ?? "—"}</td>
                    <td className={`${styles.td} ${styles.dateTd}`}>{v.securityEndDate ?? "—"}</td>
                    <td className={styles.td}>
                      <PatchRow version={v} index={i} />
                      {(!v.releases || v.releases.length === 0) && (
                        <span className={styles.dash}>—</span>
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
