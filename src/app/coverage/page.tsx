import type { Metadata } from "next";
import Link from "next/link";
import { coverage } from "@/data/coverage";
import { TIMELINE_START, TIMELINE_END } from "@/data/witnesses";
import StudentPrimer from "@/components/StudentPrimer";
import VariantExamples from "@/components/VariantExamples";
import DownloadCensus from "@/components/DownloadCensus";
import BookVariantSummary from "@/components/BookVariantSummary";
import {
  kindLabel,
  sortKindEntries,
  VARIANT_KIND_DEFINITIONS,
} from "@/lib/variantTaxonomy";
import {
  INTENTIONAL_LABEL_DISPLAY,
  INTENTIONAL_LABEL_ORDER,
} from "@/lib/intentionalTags";
import styles from "./coverage.module.css";

export const metadata: Metadata = {
  title: "Coverage & scope — Illustrative Manuscripts",
  description:
    "What Bart Ehrman asked, what Gurry estimated, and what this site actually counts — honest computed numbers for Greek NT witnesses vs SR GNT.",
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
  const bookSummary = greek_nt.disagreements.by_book ?? [];
  const tagging = greek_nt.intentional_tagging;
  const taggedTotal = tagging?.tagged_count ?? 0;

  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Dataset honesty</p>
        <h1 className={styles.title}>Coverage &amp; scope</h1>
        <p className={styles.lead}>
          Every number below is computed from committed data at build time — not
          hand-typed. Regenerate with <code>npm run coverage</code> and{" "}
          <code>npm run variant-index</code> after changing witness text.
        </p>
        <p className={styles.meta}>
          Last computed:{" "}
          {new Date(generated_at).toLocaleString("en-GB", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>The Ehrman question — and what we answer</h2>
        <div className={styles.ehrmanGrid}>
          <div className={styles.ehrmanCard}>
            <h3>What Ehrman asked</h3>
            <p>
              Bart Ehrman&apos;s talking point is about <strong>volume</strong>:
              nobody has counted <em>all</em> variants across the entire Greek New
              Testament manuscript tradition (~5,700+ witnesses). The scale is
              enormous — and that claim is about the full tradition, not one
              papyrus fragment.
            </p>
          </div>
          <div className={styles.ehrmanCard}>
            <h3>What Gurry added</h3>
            <p>
              Peter J. Gurry (<em>NTS</em> 2016) extrapolated roughly{" "}
              <strong>500,000</strong> distinct readings from ~3% of the text —
              excluding spelling and nomina-sacra abbreviations, including
              nonsense and singular readings. That is an estimate, not a census.
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
          </div>
          <div className={styles.ehrmanCard} data-highlight>
            <h3>What this site answers</h3>
            <p>
              A <strong>defined census</strong> of extant-letter disagreements in
              Greek NT witnesses overlapping <strong>{TIMELINE_START}–{TIMELINE_END} CE</strong>, compared
              word-by-word to open <strong>SR GNT</strong> via CNTR transcriptions:
            </p>
            <p className={styles.bigNumber}>
              <strong>{greek_nt.witness_count}</strong> witnesses ·{" "}
              <strong>{disagreementTotal.toLocaleString()}</strong> variation units
            </p>
            <p>
              Classified by kind (omission, addition, substitution, orthography,
              transposition), browsable in the{" "}
              <Link href="/variants/">variant explorer</Link> or{" "}
              <Link href="/compare/">witness compare</Link>.
            </p>
          </div>
          <div className={styles.ehrmanCard}>
            <h3>What we do NOT claim</h3>
            <ul className={styles.notClaimList}>
              <li>A full-tradition NT census (~5,700+ manuscripts)</li>
              <li>Gurry&apos;s ~500,000 as our own number</li>
              <li>ECM or NA apparatus judgments</li>
              <li>
                Heuristic intentional tags as settled scholarship (see experimental
                section below)
              </li>
            </ul>
          </div>
        </div>
      </section>

      <VariantExamples />

      <DownloadCensus />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>How to use this site</h2>
        <ol className={styles.steps}>
          <li>
            Pick a corpus on the{" "}
            <Link href="/">timeline</Link> (Greek NT, Qurʾān, or Nag Hammadi).
          </li>
          <li>
            Browse counted disagreements in the{" "}
            <Link href="/variants/">variant explorer</Link> — filter by kind,
            witness, or book.
          </li>
          <li>
            Open a witness card: photograph (when legal), diplomatic text, and
            variant strips under verses.
          </li>
          <li>
            For full critical work, follow links to{" "}
            <a href="https://greekcntr.org/" target="_blank" rel="noopener noreferrer">
              CNTR
            </a>
            ,{" "}
            <a href="https://ntvmr.uni-muenster.de/" target="_blank" rel="noopener noreferrer">
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
        <h2 className={styles.sectionTitle}>Greek New Testament ({TIMELINE_START}–{TIMELINE_END} CE)</h2>
        <p className={styles.sliceSummary}>
          <strong>{greek_nt.witness_count}</strong> witnesses ·{" "}
          <strong>{disagreementTotal.toLocaleString()}</strong> variation units vs
          SR GNT · <strong>{greek_nt.leaf_image_count}</strong> with leaf image
        </p>
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
              {disagreementTotal.toLocaleString()}
            </span>
            <span className={styles.statLabel}>variation units vs SR GNT</span>
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
          <h3>Taxonomy census (mechanical classifier)</h3>
          <p>{greek_nt.disagreements.definition}</p>
          <p className={styles.bigNumber}>
            <strong>{disagreementTotal.toLocaleString()}</strong> total variation
            units —{" "}
            <Link href="/variants/">browse in the explorer →</Link>
          </p>
          <ul className={styles.inlineStats}>
            <li>
              Median per witness:{" "}
              <strong>{greek_nt.disagreements.per_witness_median}</strong>
            </li>
            <li>
              Maximum per witness:{" "}
              <strong>{greek_nt.disagreements.per_witness_max}</strong>
            </li>
            <li>
              Witnesses with ≥1:{" "}
              <strong>{greek_nt.disagreements.witnesses_with_any}</strong>
            </li>
          </ul>
          {kinds.length > 0 && (
            <div className={styles.kindBreakdown}>
              <h4>By kind</h4>
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
            </div>
          )}
        </div>

        {bookSummary.length > 0 && (
          <div className={styles.detailBlock}>
            <h3>By book (Matthew → Revelation)</h3>
            <p>
              Per-book totals of word-aligned disagreement units in our CNTR slice —
              computed from the same census as the{" "}
              <Link href="/variants/">variant explorer</Link>, not hand-typed.
            </p>
            <BookVariantSummary
              books={bookSummary}
              totalUnits={disagreementTotal}
              linkToExplorer
            />
          </div>
        )}

        <div className={styles.detailBlock} data-experimental>
          <h3>Experimental: intentional vs error tagging</h3>
          <p className={styles.experimentalNote}>
            <strong>Provisional only.</strong> {tagging?.definition} These labels
            are model-assisted hypotheses — not ECM, NA28, or IGNTP judgments. Do
            not cite tag counts as scholarship.
          </p>
          {tagging?.not_run ? (
            <p className={styles.note}>
              Tagging not run — <code>src/data/intentional-tags.json</code> is
              empty. Local workflow: <code>npm run export-taggable</code> then{" "}
              <code>npm run tag-intentional</code>. See DATA.md.
            </p>
          ) : (
            <>
              <p>
                <strong>{taggedTotal.toLocaleString()}</strong> units tagged of{" "}
                <strong>{tagging.taggable_total.toLocaleString()}</strong>{" "}
                taggable non-orthography units (
                {tagging.coverage_percent}% of taggable subset)
              </p>
              <ul className={styles.inlineStats}>
                {INTENTIONAL_LABEL_ORDER.map((label) => (
                  <li key={label}>
                    {INTENTIONAL_LABEL_DISPLAY[label].short}:{" "}
                    <strong>{tagging.by_label[label].toLocaleString()}</strong>
                  </li>
                ))}
              </ul>
            </>
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
        <h2>Prior art</h2>
        <p>
          Reuse CNTR, NTVMR, and IGNTP for full critical work. Do not cite our
          papyrus-slice disagreement total as &ldquo;the number of NT variants.&rdquo;
          Gurry&apos;s ~500,000 remains an extrapolation; Ehrman&apos;s point about
          uncounted tradition-scale volume stands for the full manuscript corpus.
        </p>
      </aside>

      <footer className={styles.footer}>
        <Link href="/compare/">Witness compare →</Link>
        {" · "}
        <Link href="/variants/">Variant explorer →</Link>
        {" · "}
        <Link href="/">← Back to timeline</Link>
      </footer>
    </main>
  );
}
