import Link from "next/link";
import type { BookDisagreementSummary } from "@/types/coverage";
import { kindLabel } from "@/lib/variantTaxonomy";
import styles from "./BookVariantSummary.module.css";

interface BookVariantSummaryProps {
  books: BookDisagreementSummary[];
  totalUnits: number;
  /** Show compact bar chart (variants page) vs full table (coverage). */
  variant?: "table" | "chart";
  /** Link book rows to /variants?book=… */
  linkToExplorer?: boolean;
}

const KIND_ORDER = [
  "substitution",
  "orthography",
  "omission",
  "addition",
  "transposition",
  "uncertain",
];

function pct(count: number, total: number) {
  if (!total) return "0%";
  return `${Math.round((count / total) * 1000) / 10}%`;
}

export default function BookVariantSummary({
  books,
  totalUnits,
  variant = "table",
  linkToExplorer = false,
}: BookVariantSummaryProps) {
  const activeBooks = books.filter((b) => b.total > 0);
  const maxTotal = activeBooks.reduce((m, b) => Math.max(m, b.total), 0);

  if (variant === "chart") {
    return (
      <div className={styles.chartBlock}>
        <p className={styles.chartLead}>
          Disagreement units by NT book in this slice — taller bars mean more
          word-aligned differences vs SR GNT across all witnesses.
        </p>
        <ul className={styles.barList} aria-label="Variation units by book">
          {activeBooks.map((row) => {
            const width = maxTotal ? Math.max(4, (row.total / maxTotal) * 100) : 0;
            const label = (
              <>
                <span className={styles.barBook}>{row.abbr}</span>
                <span className={styles.barCount}>{row.total.toLocaleString()}</span>
              </>
            );
            return (
              <li key={row.book_id} className={styles.barRow}>
                {linkToExplorer ? (
                  <Link
                    href={`/variants/?book=${encodeURIComponent(row.book)}`}
                    className={styles.barLabelLink}
                  >
                    {label}
                  </Link>
                ) : (
                  <span className={styles.barLabel}>{label}</span>
                )}
                <div className={styles.barTrack} aria-hidden>
                  <div className={styles.barFill} style={{ width: `${width}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  const kindColumns = KIND_ORDER.filter((k) =>
    books.some((b) => (b.by_kind[k] ?? 0) > 0)
  );

  return (
    <div className={styles.tableWrap}>
      <table className={styles.bookTable}>
        <thead>
          <tr>
            <th>Book</th>
            <th>Total</th>
            <th>% of slice</th>
            {kindColumns.map((k) => (
              <th key={k}>{kindLabel(k)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {activeBooks.map((row) => (
            <tr key={row.book_id}>
              <td>
                {linkToExplorer ? (
                  <Link
                    href={`/variants/?book=${encodeURIComponent(row.book)}`}
                    className={styles.bookLink}
                  >
                    {row.book}
                  </Link>
                ) : (
                  row.book
                )}
              </td>
              <td>{row.total.toLocaleString()}</td>
              <td>{pct(row.total, totalUnits)}</td>
              {kindColumns.map((k) => (
                <td key={k}>{(row.by_kind[k] ?? 0).toLocaleString()}</td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <strong>All books</strong>
            </td>
            <td>
              <strong>{totalUnits.toLocaleString()}</strong>
            </td>
            <td>100%</td>
            {kindColumns.map((k) => {
              const sum = books.reduce((n, b) => n + (b.by_kind[k] ?? 0), 0);
              return (
                <td key={k}>
                  <strong>{sum.toLocaleString()}</strong>
                </td>
              );
            })}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
