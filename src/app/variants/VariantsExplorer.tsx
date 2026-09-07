"use client";

import { useCallback, useEffect, useMemo, useState, Fragment } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { variantIndex } from "@/data/variant-index";
import { coverage } from "@/data/coverage";
import type { VariantIndexEntry } from "@/types/variantIndex";
import {
  kindLabel,
  sortKindEntries,
  VARIANT_KIND_DEFINITIONS,
} from "@/lib/variantTaxonomy";
import styles from "./variants.module.css";

const PAGE_SIZE = 50;

export default function VariantsExplorer() {
  const searchParams = useSearchParams();
  const [kindFilter, setKindFilter] = useState<string>("all");
  const [witnessFilter, setWitnessFilter] = useState<string>("all");
  const [bookFilter, setBookFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const kind = searchParams.get("kind");
    const witness = searchParams.get("witness");
    const book = searchParams.get("book");
    const q = searchParams.get("q");
    const id = searchParams.get("id");
    if (kind) setKindFilter(kind);
    if (witness) setWitnessFilter(witness);
    if (book) setBookFilter(book);
    if (q) setSearch(q);
    if (id) setSelectedId(id);
  }, [searchParams]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return variantIndex.units.filter((u) => {
      if (kindFilter !== "all" && u.kind !== kindFilter) return false;
      if (witnessFilter !== "all" && u.witness_id !== witnessFilter) return false;
      if (bookFilter !== "all" && u.book !== bookFilter) return false;
      if (q) {
        const haystack = [
          u.verse_ref,
          u.witness_reading,
          u.sr_reading,
          u.witness_id,
          u.book,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [kindFilter, witnessFilter, bookFilter, search]);

  useEffect(() => {
    setPage(1);
  }, [kindFilter, witnessFilter, bookFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const selected = useMemo(
    () => variantIndex.units.find((u) => u.unit_id === selectedId) ?? null,
    [selectedId]
  );

  const toggleRow = useCallback((unit: VariantIndexEntry) => {
    setSelectedId((prev) => (prev === unit.unit_id ? null : unit.unit_id));
  }, []);

  const kindTotals = coverage.greek_nt.disagreements.by_kind;
  const kinds = sortKindEntries(kindTotals);

  return (
    <main className={styles.variantsExplorer}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Greek NT · 1–300 CE</p>
        <h1 className={styles.title}>Variant explorer</h1>
        <p className={styles.lead}>
          A browsable census of{" "}
          <strong>
            {coverage.greek_nt.disagreements.total.toLocaleString()}
          </strong>{" "}
          word-aligned disagreements between our CNTR witnesses and{" "}
          <strong>SR GNT</strong> — counted mechanically, not hand-typed. This
          answers Bart Ehrman&apos;s challenge at the scale of{" "}
          <em>this dataset</em>; it is not a count of every variant in every
          Greek manuscript. See{" "}
          <Link href="/coverage/">Coverage</Link> for limits.
        </p>

        <div className={styles.summaryGrid} role="group" aria-label="Totals by kind">
          <button
            type="button"
            className={`${styles.summaryCard} ${kindFilter === "all" ? styles.summaryCardActive : ""}`}
            onClick={() => setKindFilter("all")}
          >
            <span className={styles.summaryValue}>
              {coverage.greek_nt.disagreements.total.toLocaleString()}
            </span>
            <span className={styles.summaryLabel}>All kinds</span>
          </button>
          {kinds.map(([kind, count]) => (
            <button
              key={kind}
              type="button"
              className={`${styles.summaryCard} ${kindFilter === kind ? styles.summaryCardActive : ""}`}
              onClick={() => setKindFilter(kind)}
            >
              <span className={styles.summaryValue}>{count.toLocaleString()}</span>
              <span className={styles.summaryLabel}>{kindLabel(kind)}</span>
            </button>
          ))}
        </div>
      </header>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label htmlFor="kind-filter">Kind</label>
          <select
            id="kind-filter"
            value={kindFilter}
            onChange={(e) => setKindFilter(e.target.value)}
          >
            <option value="all">All kinds</option>
            {kinds.map(([kind]) => (
              <option key={kind} value={kind}>{kindLabel(kind)}</option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label htmlFor="witness-filter">Witness (GA)</label>
          <select
            id="witness-filter"
            value={witnessFilter}
            onChange={(e) => setWitnessFilter(e.target.value)}
          >
            <option value="all">All witnesses</option>
            {variantIndex.witnesses.map((ga) => (
              <option key={ga} value={ga}>{ga}</option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label htmlFor="book-filter">Book</label>
          <select
            id="book-filter"
            value={bookFilter}
            onChange={(e) => setBookFilter(e.target.value)}
          >
            <option value="all">All books</option>
            {variantIndex.books.map((book) => (
              <option key={book} value={book}>{book}</option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label htmlFor="search-filter">Search</label>
          <input
            id="search-filter"
            type="search"
            placeholder="Verse ref or reading…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <p className={styles.resultsMeta}>
        Showing {filtered.length.toLocaleString()} of{" "}
        {variantIndex.total.toLocaleString()} units
        {filtered.length > PAGE_SIZE &&
          ` · page ${page} of ${totalPages}`}
      </p>

      {pageItems.length === 0 ? (
        <p className={styles.empty}>No variants match these filters.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Witness</th>
                <th>Reference</th>
                <th>Kind</th>
                <th>Witness reading</th>
                <th>SR reading</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((unit) => {
                const isSelected = selectedId === unit.unit_id;
                return (
                  <Fragment key={unit.unit_id}>
                    <tr
                      className={isSelected ? styles.rowSelected : undefined}
                    >
                      <td>
                        <button
                          type="button"
                          className={styles.rowButton}
                          onClick={() => toggleRow(unit)}
                          aria-expanded={isSelected}
                        >
                          {unit.witness_id}
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={styles.rowButton}
                          onClick={() => toggleRow(unit)}
                        >
                          {unit.verse_ref}
                        </button>
                      </td>
                      <td>
                        <span className={styles.kindBadge}>{kindLabel(unit.kind)}</span>
                      </td>
                      <td className={styles.reading}>{unit.witness_reading || "—"}</td>
                      <td className={styles.reading}>{unit.sr_reading || "—"}</td>
                    </tr>
                    {isSelected && (
                      <tr>
                        <td colSpan={5}>
                          <VariantDetail unit={unit} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length > PAGE_SIZE && (
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

      {selected && !pageItems.some((u) => u.unit_id === selected.unit_id) && (
        <div className={styles.tableWrap} style={{ marginTop: "1rem" }}>
          <VariantDetail unit={selected} />
        </div>
      )}

      <aside className={styles.disclaimer}>
        <h2>What this is — and is not</h2>
        <p>
          These are extant-letter disagreements in Greek NT papyri (1–300 CE)
          with CNTR transcriptions, compared word-by-word to SR GNT. We do not
          claim a full-tradition census (~5,700+ manuscripts) or Peter
          Gurry&apos;s ~500,000-reading extrapolation. ECM/NA judgments and
          heuristic intentional tags are separate, provisional layers.
        </p>
      </aside>
    </main>
  );
}

function VariantDetail({ unit }: { unit: VariantIndexEntry }) {
  const witnessHref = unit.witness_slug ? `/#${unit.witness_slug}` : "/";
  const gloss =
    VARIANT_KIND_DEFINITIONS[unit.kind] ??
    "See DATA.md for taxonomy notes.";

  return (
    <div className={styles.detailPanel}>
      <div className={styles.detailGrid}>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Witness</span>
          <span>{unit.witness_id}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Verse</span>
          <span>{unit.verse_ref}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Kind</span>
          <span className={styles.kindBadge}>{kindLabel(unit.kind)}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Witness</span>
          <span className={styles.reading}>{unit.witness_reading || "—"}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>SR GNT</span>
          <span className={styles.reading}>{unit.sr_reading || "—"}</span>
        </div>
        {(unit.context_left || unit.context_right) && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Context</span>
            <span className={styles.reading}>
              {unit.context_left ? `…${unit.context_left} ` : ""}
              <strong>[{unit.witness_reading}]</strong>
              {unit.context_right ? ` ${unit.context_right}…` : ""}
            </span>
          </div>
        )}
        <p className={styles.gloss}>{gloss}</p>
      </div>
      <div className={styles.detailLinks}>
        <Link href={witnessHref}>View witness card →</Link>
        {unit.cntr_url && (
          <a href={unit.cntr_url} target="_blank" rel="noopener noreferrer">
            CNTR manuscript page →
          </a>
        )}
        <Link href={`/variants/?id=${encodeURIComponent(unit.unit_id)}`}>
          Permalink
        </Link>
      </div>
    </div>
  );
}
