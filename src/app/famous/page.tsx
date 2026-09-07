import type { Metadata } from "next";
import Link from "next/link";
import { famousPassages } from "@/data/famous-passages";
import { TIMELINE_START, TIMELINE_END } from "@/data/witnesses";
import type { WitnessPassageStatus } from "@/types/famousPassages";
import styles from "./famous.module.css";

export const metadata: Metadata = {
  title: "Famous passages — Illustrative Manuscripts",
  description:
    "Block-level textual issues in the Greek New Testament — pericope adulterae, Mark’s ending, Comma Johanneum, and more — with honest early-witness status from our CNTR slice.",
};

const STATUS_LABEL: Record<WitnessPassageStatus, string> = {
  present: "Present",
  absent: "Absent",
  lacunose: "Lacunose",
  not_in_corpus: "Not in corpus",
};

function witnessHref(ga: string) {
  return `/?q=${encodeURIComponent(ga)}`;
}

function variantsHref(link: { book: string; q?: string; kind?: string }) {
  const params = new URLSearchParams();
  params.set("book", link.book);
  if (link.q) params.set("q", link.q);
  if (link.kind) params.set("kind", link.kind);
  return `/variants/?${params.toString()}`;
}

function compareHref(link: { a: string; b: string; book: string }) {
  const params = new URLSearchParams({
    a: link.a,
    b: link.b,
    book: link.book,
  });
  return `/compare/?${params.toString()}`;
}

export default function FamousPassagesPage() {
  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Block-level textual issues</p>
        <h1 className={styles.title}>Famous passages</h1>
        <p className={styles.lead}>
          Whole passages that are missing, inserted, or disputed in early
          manuscripts — not the word-by-word disagreements counted in our{" "}
          <Link href="/variants/">variant census</Link>. Each entry below is
          hand-curated; witness status is checked against CNTR transcriptions in
          our <strong>{TIMELINE_START}–{TIMELINE_END} CE</strong> Greek NT slice.
        </p>
      </header>

      <aside className={styles.callout}>
        <p>
          <strong>Word-level census</strong> lives on{" "}
          <Link href="/variants/">Variants</Link> — omissions and additions of
          individual words where extant letters disagree with SR GNT.{" "}
          <strong>These entries</strong> teach larger blocks that never appear as
          neat variant rows.
        </p>
      </aside>

      <nav className={styles.toc} aria-label="Passage list">
        <h2 className={styles.tocTitle}>On this page</h2>
        <ol>
          {famousPassages.entries.map((entry) => (
            <li key={entry.slug}>
              <a href={`#${entry.slug}`}>{entry.title}</a>
              <span className={styles.tocRef}>{entry.passage_ref}</span>
            </li>
          ))}
        </ol>
      </nav>

      {famousPassages.entries.map((entry) => (
        <article
          key={entry.slug}
          id={entry.slug}
          className={styles.entry}
          aria-labelledby={`${entry.slug}-title`}
        >
          <header className={styles.entryHeader}>
            <h2 id={`${entry.slug}-title`} className={styles.entryTitle}>
              {entry.title}
            </h2>
            <p className={styles.entryRef}>{entry.passage_ref}</p>
          </header>

          <div className={styles.entryBody}>
            <section>
              <h3 className={styles.subheading}>The issue</h3>
              <p>{entry.story}</p>
            </section>

            <section>
              <h3 className={styles.subheading}>
                Early witnesses ({TIMELINE_START}–{TIMELINE_END} CE)
              </h3>
              <p className={styles.witnessIntro}>
                Status in CNTR transcriptions we hold — not later Byzantine
                minuscules outside our window.
              </p>
              <table className={styles.witnessTable}>
                <thead>
                  <tr>
                    <th scope="col">Witness</th>
                    <th scope="col">Status</th>
                    <th scope="col">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {entry.witnesses.map((w) => (
                    <tr key={w.ga}>
                      <td>
                        <Link href={witnessHref(w.ga)} className={styles.witnessLink}>
                          {w.ga}
                        </Link>
                      </td>
                      <td>
                        <span
                          className={styles.statusBadge}
                          data-status={w.status}
                        >
                          {STATUS_LABEL[w.status]}
                        </span>
                      </td>
                      <td className={styles.witnessNote}>{w.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {entry.compare_link && (
                <p className={styles.actionLink}>
                  <Link href={compareHref(entry.compare_link)}>
                    Compare {entry.compare_link.a} &amp; {entry.compare_link.b} in{" "}
                    {entry.compare_link.book} →
                  </Link>
                </p>
              )}
            </section>

            <section>
              <h3 className={styles.subheading}>Later tradition</h3>
              <p>{entry.later_tradition}</p>
            </section>

            <section>
              <h3 className={styles.subheading}>Further reading</h3>
              <ul className={styles.scholarshipList}>
                {entry.scholarship.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
              {entry.variants_link && (
                <p className={styles.actionLink}>
                  <Link href={variantsHref(entry.variants_link)}>
                    Nearby word-level variants in {entry.variants_link.book} →
                  </Link>
                </p>
              )}
            </section>
          </div>
        </article>
      ))}

      <footer className={styles.footer}>
        <Link href="/coverage/">Coverage &amp; scope →</Link>
        {" · "}
        <Link href="/variants/">Variant explorer →</Link>
        {" · "}
        <Link href="/">← Back to timeline</Link>
      </footer>
    </main>
  );
}
