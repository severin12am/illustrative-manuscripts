"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { variantIndex } from "@/data/variant-index";
import { TIMELINE_START, TIMELINE_END } from "@/data/witnesses";
import { loadAllVerses } from "@/lib/witnessVerseLoader";
import {
  booksInOverlap,
  compareWitnessVerses,
  getWitnessEsns,
  loadSrWitnessEsns,
  overlapEsns,
} from "@/lib/witnessCompare";
import type { CompareResult } from "@/types/compare";
import type { SrWitnessEsnsBundle } from "@/types/srWitnessEsns";
import styles from "./compare.module.css";

const PAGE_SIZE = 75;
const PRESETS: [string, string, string][] = [
  ["P66", "P75", "John"],
  ["P75", "03", "Luke"],
  ["01", "03", "Matthew"],
  ["P66", "P45", "John"],
  ["P46", "P13", "Romans"],
  ["P46", "P49", "Ephesians"],
];

export default function CompareExplorer() {
  const searchParams = useSearchParams();
  const [srBundle, setSrBundle] = useState<SrWitnessEsnsBundle | null>(null);
  const [witnessA, setWitnessA] = useState("P66");
  const [witnessB, setWitnessB] = useState("P75");
  const [bookFilter, setBookFilter] = useState("all");
  const [showSr, setShowSr] = useState(true);
  const [disagreementsOnly, setDisagreementsOnly] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompareResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const witnesses = variantIndex.witnesses;

  useEffect(() => {
    loadSrWitnessEsns()
      .then(setSrBundle)
      .catch(() => setError("Could not load SR alignment index."));
  }, []);

  useEffect(() => {
    const a = searchParams.get("a");
    const b = searchParams.get("b");
    const book = searchParams.get("book");
    if (a && witnesses.includes(a)) setWitnessA(a);
    if (b && witnesses.includes(b)) setWitnessB(b);
    if (book) setBookFilter(book);
  }, [searchParams, witnesses]);

  const overlapCount = useMemo(() => {
    if (!srBundle) return 0;
    return overlapEsns(srBundle, witnessA, witnessB).length;
  }, [srBundle, witnessA, witnessB]);

  const bookOptions = useMemo(() => {
    if (!srBundle) return [];
    return booksInOverlap(srBundle, witnessA, witnessB);
  }, [srBundle, witnessA, witnessB]);

  useEffect(() => {
    if (bookFilter !== "all" && !bookOptions.includes(bookFilter)) {
      setBookFilter("all");
    }
  }, [bookFilter, bookOptions]);

  const runCompare = useCallback(async () => {
    if (!srBundle) return;
    if (witnessA === witnessB) {
      setError("Choose two different witnesses.");
      setResult(null);
      return;
    }
    setLoading(true);
    setError(null);
    setPage(1);
    try {
      const [versesA, versesB] = await Promise.all([
        loadAllVerses(witnessA),
        loadAllVerses(witnessB),
      ]);
      const compared = compareWitnessVerses(
        witnessA,
        witnessB,
        versesA,
        versesB,
        srBundle,
        { book: bookFilter, disagreementsOnly }
      );
      setResult(compared);
    } catch {
      setError("Comparison failed — check witness CNTR data.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [srBundle, witnessA, witnessB, bookFilter, disagreementsOnly]);

  useEffect(() => {
    if (srBundle) runCompare();
  }, [srBundle, runCompare]);

  const totalPages = result
    ? Math.max(1, Math.ceil(result.rows.length / PAGE_SIZE))
    : 1;
  const pageRows = result
    ? result.rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    : [];

  return (
    <main className={styles.compareExplorer}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Greek NT · {TIMELINE_START}–{TIMELINE_END} CE</p>
        <h1 className={styles.title}>Witness compare</h1>
        <p className={styles.lead}>
          Pick two CNTR witnesses and a book overlap to see side-by-side readings
          where both preserve extant text. Disagreements are highlighted; toggle{" "}
          <strong>SR GNT</strong> as a third column. Uses committed CNTR /
          witness-text JSON only — not a full-tradition collation. See{" "}
          <Link href="/coverage/">Coverage</Link> for scope.
        </p>
      </header>

      <div className={styles.controls}>
        <div className={styles.filterGroup}>
          <label htmlFor="witness-a">Witness A</label>
          <select
            id="witness-a"
            value={witnessA}
            onChange={(e) => setWitnessA(e.target.value)}
          >
            {witnesses.map((ga) => (
              <option key={ga} value={ga}>
                {ga}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label htmlFor="witness-b">Witness B</label>
          <select
            id="witness-b"
            value={witnessB}
            onChange={(e) => setWitnessB(e.target.value)}
          >
            {witnesses.map((ga) => (
              <option key={ga} value={ga}>
                {ga}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label htmlFor="book-filter">Book / passage</label>
          <select
            id="book-filter"
            value={bookFilter}
            onChange={(e) => setBookFilter(e.target.value)}
          >
            <option value="all">All overlapping books</option>
            {bookOptions.map((book) => (
              <option key={book} value={book}>
                {book}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.presets} role="group" aria-label="Preset pairs">
        <span className={styles.presetLabel}>Quick pairs:</span>
        {PRESETS.map(([a, b, book]) => (
          <button
            key={`${a}-${b}`}
            type="button"
            className={styles.presetBtn}
            onClick={() => {
              setWitnessA(a);
              setWitnessB(b);
              setBookFilter(book);
            }}
          >
            {a} vs {b}
          </button>
        ))}
      </div>

      <div className={styles.toggles}>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={showSr}
            onChange={(e) => setShowSr(e.target.checked)}
          />
          Show SR GNT column
        </label>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={disagreementsOnly}
            onChange={(e) => setDisagreementsOnly(e.target.checked)}
          />
          Disagreements only
        </label>
      </div>

      {srBundle && (
        <p className={styles.meta}>
          {witnessA}: {getWitnessEsns(srBundle, witnessA).length} verses ·{" "}
          {witnessB}: {getWitnessEsns(srBundle, witnessB).length} verses ·{" "}
          <strong>{overlapCount}</strong> overlapping
          {bookFilter !== "all" && ` in ${bookFilter}`}
        </p>
      )}

      {loading && <p className={styles.status}>Loading witness texts…</p>}
      {error && <p className={styles.error}>{error}</p>}

      {result && overlapCount === 0 && (
        <div className={styles.empty}>
          <p>
            No passage overlap between {witnessA} and {witnessB}
            {bookFilter !== "all" ? ` in ${bookFilter}` : ""}.
          </p>
          <p className={styles.emptyHint}>
            Try another pair (e.g. P66 vs P75 on John) or clear the book filter.
          </p>
        </div>
      )}

      {result && overlapCount > 0 && result.rows.length === 0 && (
        <div className={styles.empty}>
          <p>
            Overlap exists ({result.overlap_verses} verses) but no comparable
            rows match the current filters.
          </p>
          <p className={styles.emptyHint}>
            Turn off &ldquo;Disagreements only&rdquo; to see agreeing readings.
          </p>
        </div>
      )}

      {result && result.rows.length > 0 && (
        <>
          <p className={styles.resultsMeta}>
            {result.disagreement_rows.toLocaleString()} disagreements ·{" "}
            {result.rows.length.toLocaleString()} rows shown
            {result.rows.length > PAGE_SIZE &&
              ` · page ${page} of ${totalPages}`}
          </p>

          <div className={styles.tableWrap}>
            <table
              className={`${styles.table} ${showSr ? styles.tableWithSr : ""}`}
            >
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Word</th>
                  <th>{witnessA}</th>
                  <th>{witnessB}</th>
                  {showSr && <th>SR GNT</th>}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr
                    key={`${row.esn}-${row.word_index}`}
                    className={row.disagrees ? styles.rowDisagree : undefined}
                  >
                    <td>{row.verse_ref}</td>
                    <td>{row.word_index}</td>
                    <td className={styles.reading}>{row.reading_a || "—"}</td>
                    <td className={styles.reading}>{row.reading_b || "—"}</td>
                    {showSr && (
                      <td className={styles.reading}>{row.sr_reading || "—"}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {result.rows.length > PAGE_SIZE && (
            <nav className={styles.pagination} aria-label="Pagination">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}

      <aside className={styles.disclaimer}>
        <h2>Limits</h2>
        <p>
          Alignment follows SR GNT word positions in extant CNTR spans. Lacunae
          and supplied reconstruction are excluded. This is an illustrative slice
          for teaching — not ECM or NA apparatus.
        </p>
        <p>
          <Link href="/variants/">Variant explorer</Link>
          {" · "}
          <Link href="/coverage/">Coverage &amp; downloads</Link>
        </p>
      </aside>
    </main>
  );
}
