import React, { useEffect, useMemo, useState } from "react";
import styles from "./MoodleReleases.module.css";
import {
  DATA_URL,
  FilterOptions,
  Release,
  SortCol,
  Status,
  Version,
  VersionsJson,
  applyFilters,
  getStatus,
} from "./moodleReleases.shared";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

/**
 * All props are optional — omitting a prop means "no filter / default sort".
 *
 * Usage examples:
 *
 * ```mdx
 * // Only currently-supported LTS branches, newest first
 * <MoodleReleasesFiltered filterStatus="lts" />
 *
 * // All 4.x branches, oldest first
 * <MoodleReleasesFiltered filterSeries="4" sortCol="releaseDate" sortDir={1} />
 *
 * // Upcoming releases only
 * <MoodleReleasesFiltered filterStatus="future" />
 *
 * // Security-only branches sorted by security end date
 * <MoodleReleasesFiltered filterStatus="security" sortCol="securityEndDate" />
 * ```
 */
export interface MoodleReleasesFilteredProps extends FilterOptions {
  /**
   * Hide the patch-releases expand column entirely.
   * Defaults to false (column shown).
   */
  hidePatchReleases?: boolean;
}

// ---------------------------------------------------------------------------
// Sub-components (local, no interactive state needed)
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

function PatchReleaseCell({
  version,
  index,
}: {
  version: Version;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const releases: Release[] = version.releases ?? [];

  if (releases.length === 0) {
    return <span className={styles.dash}>—</span>;
  }

  return (
    <>
      <button
        className={styles.releaseToggle}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`filtered-releases-${index}`}
      >
        {releases.length} release{releases.length !== 1 ? "s" : ""}
        <span aria-hidden="true">{open ? " ▲" : " ▼"}</span>
      </button>
      {open && (
        <table
          id={`filtered-releases-${index}`}
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

// Plain <th> — no sort interactivity
function StaticTh({ children }: { children: React.ReactNode }) {
  return <th className={styles.th}>{children}</th>;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function MoodleReleasesFiltered({
  search,
  filterStatus,
  filterSeries,
  sortCol = "name",
  sortDir = -1,
  hidePatchReleases = false,
}: MoodleReleasesFilteredProps): JSX.Element {
  const [data, setData] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo(
    () =>
      applyFilters(data, {
        search,
        filterStatus,
        filterSeries,
        sortCol,
        sortDir,
      }),
    [data, search, filterStatus, filterSeries, sortCol, sortDir],
  );

  // ── Render states ──────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className={styles.stateBox}>Loading Moodle release data…</div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.stateBox} ${styles.stateError}`}>
        Failed to load release data: {error}
      </div>
    );
  }

  if (rows.length === 0) {
    return <p className={styles.empty}>No versions match the given filter.</p>;
  }

  // ── Table ──────────────────────────────────────────────────────────────────

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <StaticTh>Version</StaticTh>
            <StaticTh>Status</StaticTh>
            <StaticTh>Released</StaticTh>
            <StaticTh>General end</StaticTh>
            <StaticTh>Security end</StaticTh>
            {!hidePatchReleases && <StaticTh>Patch releases</StaticTh>}
          </tr>
        </thead>
        <tbody>
          {rows.map((v, i) => {
            const status = getStatus(v);
            const releasePageUrl = `https://moodledev.io/general/releases/${v.name}`;

            return (
              <tr
                key={v.name}
                className={`${styles.tr} ${styles[`row_${status}`]}`}
              >
                {/* Version */}
                <td className={styles.td}>
                  <span className={styles.verCell}>
                    <span
                      className={`${styles.dot} ${styles[`dot_${status}`]}`}
                      aria-hidden="true"
                    />
                    <a
                      href={releasePageUrl}
                      className={styles.verLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {v.name}
                    </a>
                    {v.isLTS && (
                      <span
                        className={`${styles.badge} ${styles.badge_lts}`}
                      >
                        LTS
                      </span>
                    )}
                    {v.isExperimental && (
                      <span
                        className={`${styles.badge} ${styles.badge_experimental}`}
                      >
                        Exp
                      </span>
                    )}
                  </span>
                </td>

                {/* Status */}
                <td className={styles.td}>
                  <StatusBadge version={v} />
                </td>

                {/* Dates */}
                <td className={`${styles.td} ${styles.dateTd}`}>
                  {v.releaseDate ?? "—"}
                </td>
                <td className={`${styles.td} ${styles.dateTd}`}>
                  {v.generalEndDate ?? "—"}
                </td>
                <td className={`${styles.td} ${styles.dateTd}`}>
                  {v.securityEndDate ?? "—"}
                </td>

                {/* Patch releases */}
                {!hidePatchReleases && (
                  <td className={styles.td}>
                    <PatchReleaseCell version={v} index={i} />
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
