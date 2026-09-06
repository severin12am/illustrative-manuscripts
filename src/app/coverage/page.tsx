import type { Metadata } from "next";
import Link from "next/link";
import { coverage } from "@/data/coverage";
import StudentPrimer from "@/components/StudentPrimer";
import {
  kindLabel,
  sortKindEntries,
  VARIANT_KIND_DEFINITIONS,
} from "@/lib/variantTaxonomy";
import styles from "./coverage.module.css";

export const metadata: Metadata = {
  title: "Coverage & scope — Illustrative Manuscripts",
  description:
    "Honest computed coverage numbers for our Greek NT, Qurʾān, and Nag Hammadi datasets — what we count, what we exclude, and what we are not claiming.",
};

const GURRY_DOI = "https://doi.org/10.1017/S0028688516000216";
const GURRY_OPEN =
  "https://www.repository.cam.ac.uk/bitstreams/fbac7937-110b-48a0-81f5-656677f85d8e/download";

function formatPercent(n: number) {
  return `${n}%`;
}

function pct(count: number, total: number) {
  if (!total) return "0%";
  return formatPercent(Math.round((count / total) * 1000) / 10);
}

export default function CoveragePage() {
  const { greek_nt, quran, nag_hammadi, generated_at } = coverage;
  const kinds = sortKindEntries(greek_nt.disagreements.by_kind);
  const disagreementTotal = greek_nt.disagreements.total;

  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Dataset honesty</p>
        <h1 className={styles.title}>Coverage &amp; scope</h1>
        <p className={styles.lead}>
          Every number below is computed from our committed data files at build
          time — not hand-typed estimates. Regenerate with{" "}
          <code>npm run coverage</code> after changing witness text or Liste
          cache.
        </p>
        <p className={styles.meta}>
          Last computed: {new Date(generated_at).toLocaleString("en-GB", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>How to use this site</h2>
        <ol className={styles.steps}>
          <li>
            Pick a corpus on the{" "}
            <Link href="/">timeline</Link> (Greek NT, Qurʾān, or Nag
            Hammadi).
          </li>
          <li>
            Scrub the year slider — a witness appears only if its published date{" "}
            <em>range</em> overlaps that year.
          </li>
          <li>
            Open a card: photograph (when we have legal rights), diplomatic
            text, and English where available.
          </li>
          <li>
            For Greek NT, read variant strips under verses — each is one counted
            disagreement vs <strong>SR GNT</strong> in surviving letters.
          </li>
          <li>
            For serious collation, follow links to{" "}
            <a
              href="https://greekcntr.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CNTR
            </a>
            ,{" "}
            <a
              href="https://ntvmr.uni-muenster.de/"
              target="_blank"
              rel="noopener noreferrer"
            >
              INTF / NTVMR
            </a>
            , or{" "}
            <a href="https://igntp.org/" target="_blank" rel="noopener noreferrer">
              IGNTP
            </a>
            .
          </li>
        </ol>
      </section>

      <StudentPrimer />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Greek New Testament (1–300 CE)</h2>
        <div className={styles.statGrid}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{greek_nt.witness_count}</span>
            <span className={styles.statLabel}>witnesses in dataset</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>
              {greek_nt.cntr_transcription_count}
            </span>
            <span className={styles.statLabel}>with CNTR transcription</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{greek_nt.leaf_image_count}</span>
            <span className={styles.statLabel}>with leaf image</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>
              {greek_nt.nonzero_extant_comparison_count}
            </span>
            <span className={styles.statLabel}>with extant text compared</span>
          </div>
        </div>

        <div className={styles.detailBlock}>
          <h3>Extant text compared</h3>
          <p>
            <strong>
              {greek_nt.extant_word_tokens.total.toLocaleString()}
            </strong>{" "}
            {greek_nt.extant_word_tokens.definition}
          </p>
        </div>

        <div className={styles.detailBlock}>
          <h3>Disagreements vs SR GNT (our classifier)</h3>
          <p>{greek_nt.disagreements.definition}</p>
          <p className={styles.bigNumber}>
            <strong>
              {greek_nt.disagreements.total.toLocaleString()}
            </strong>{" "}
            total variation units across all stored CNTR verses (initial +
            lazy-load overflow)
          </p>
          <ul className={styles.inlineStats}>
            <li>
              Median per witness (CNTR witnesses):{" "}
              <strong>{greek_nt.disagreements.per_witness_median}</strong>
            </li>
            <li>
              Maximum per witness:{" "}
              <strong>{greek_nt.disagreements.per_witness_max}</strong>
            </li>
            <li>
              Witnesses with ≥1 disagreement:{" "}
              <strong>{greek_nt.disagreements.witnesses_with_any}</strong>
            </li>
          </ul>
          {kinds.length > 0 && (
            <div className={styles.kindBreakdown}>
              <h4>Taxonomy breakdown (v1 mechanical classifier)</h4>
              <table className={styles.kindTable}>
                <thead>
                  <tr>
                    <th>Kind</th>
                    <th>Count</th>
                    <th>% of total</th>
                  </tr>
                </thead>
                <tbody>
                  {kinds.map(([kind, count]) => (
                    <tr key={kind}>
                      <td>
                        <span className={styles.kindBadge}>{kindLabel(kind)}</span>
                        <p className={styles.kindDef}>
                          {VARIANT_KIND_DEFINITIONS[kind] ??
                            "See DATA.md for taxonomy notes."}
                        </p>
                      </td>
                      <td>{count.toLocaleString()}</td>
                      <td>{pct(count, disagreementTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className={styles.note}>
                Units are aligned at the word level after normalizing case,
                diacritics, and common Koine spelling equivalences. Transposition
                detection is intentionally weak (2–3 word windows only); some
                true transpositions may appear as substitution or omission/addition.
                Intentional-vs-error classification is deferred to a later pass.
              </p>
            </div>
          )}
        </div>

        <div className={styles.detailBlock}>
          <h3>INTF Liste papyri overlap</h3>
          <p>
            Of <strong>{greek_nt.intl_liste_papyri.liste_in_window}</strong>{" "}
            Gregory-Aland papyri whose Liste range overlaps{" "}
            {greek_nt.intl_liste_papyri.window[0]}–
            {greek_nt.intl_liste_papyri.window[1]} CE, we include{" "}
            <strong>{greek_nt.intl_liste_papyri.included}</strong> (
            {formatPercent(greek_nt.intl_liste_papyri.included_percent)}).
            {greek_nt.intl_liste_papyri.missing.length > 0 && (
              <>
                {" "}
                Missing: {greek_nt.intl_liste_papyri.missing.join(", ")}.
              </>
            )}
          </p>
        </div>

        {greek_nt.cntr_missing.length > 0 && (
          <div className={styles.detailBlock}>
            <h3>CNTR gaps in our build</h3>
            <p>
              No CNTR transcription file for:{" "}
              {greek_nt.cntr_missing.join(", ")}.
            </p>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Qurʾān (1–100 AH)</h2>
        <div className={styles.statGrid}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{quran.witness_count}</span>
            <span className={styles.statLabel}>witnesses</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>
              {quran.leaf_image_count}/{quran.witness_count}
            </span>
            <span className={styles.statLabel}>
              with leaf image (
              {Math.round(quran.leaf_image_fraction * 100)}%)
            </span>
          </div>
        </div>
        <p className={styles.note}>{quran.variant_census_note}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Nag Hammadi (~300–400 CE)</h2>
        <div className={styles.statGrid}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>
              {nag_hammadi.tractate_witness_count}
            </span>
            <span className={styles.statLabel}>tractate witnesses</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>
              {nag_hammadi.leaf_image_count}/
              {nag_hammadi.tractate_witness_count}
            </span>
            <span className={styles.statLabel}>
              with leaf image (
              {Math.round(nag_hammadi.leaf_image_fraction * 100)}%)
            </span>
          </div>
        </div>
        <p className={styles.note}>{nag_hammadi.collation_note}</p>
      </section>

      <aside className={styles.disclaimer}>
        <h2>What we are NOT claiming</h2>
        <ul>
          <li>
            We have <strong>not</strong> counted every variant in every Greek
            New Testament manuscript (~5,700+). Our numbers cover{" "}
            <strong>this site&apos;s CNTR slice</strong> only.
          </li>
          <li>
            We are <strong>not</strong> publishing Peter Gurry&apos;s ~500,000
            figure as our own. That is an extrapolation, not a census.
          </li>
          <li>
            No one has counted every reading in every witness — the famous
            Ehrman/Gurry talking point is about the scale of the tradition, not
            a problem this hobby site solves.
          </li>
        </ul>
        <blockquote className={styles.gurry}>
          <p>
            Peter J. Gurry (<em>NTS</em> 2016) estimates about 500,000 distinct
            readings in the Greek manuscript tradition of the NT, excluding
            spelling and nomina-sacra abbreviation differences, including
            nonsense and singular readings. This is an extrapolation from ~3% of
            the text, not a census. No one has counted every reading in every
            witness.
          </p>
          <p className={styles.gurryLinks}>
            <a href={GURRY_DOI} target="_blank" rel="noopener noreferrer">
              DOI: 10.1017/S0028688516000216
            </a>
            {" · "}
            <a href={GURRY_OPEN} target="_blank" rel="noopener noreferrer">
              Open accepted manuscript (Cambridge)
            </a>
          </p>
        </blockquote>
        <p>
          <strong>Prior art conclusion:</strong> reuse CNTR, NTVMR, and IGNTP for
          full critical work. Do not cite our papyrus-slice disagreement total
          as &ldquo;the number of NT variants.&rdquo;
        </p>
      </aside>

      <footer className={styles.footer}>
        <Link href="/">← Back to timeline</Link>
      </footer>
    </main>
  );
}
