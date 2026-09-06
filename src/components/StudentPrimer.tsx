import { coverage } from "@/data/coverage";
import styles from "./StudentPrimer.module.css";

interface Props {
  /** When true, show a shorter intro only (for expandable first-visit UI). */
  compact?: boolean;
}

export default function StudentPrimer({ compact = false }: Props) {
  const example = coverage.primer_example;

  return (
    <section className={styles.primer} aria-labelledby="student-primer-heading">
      <h2 id="student-primer-heading" className={styles.heading}>
        New to manuscripts?
      </h2>
      <p className={styles.lead}>
        A quick primer for students and curious readers. No prior coursework
        required.
      </p>

      <dl className={styles.list}>
        <div className={styles.item}>
          <dt>Manuscript, papyrus, codex</dt>
          <dd>
            A <strong>manuscript</strong> is any handwritten book or scrap
            before printing. <strong>Papyrus</strong> is plant-fiber sheets
            (common in Egypt). A <strong>codex</strong> is a bound book of
            pages — the ancestor of modern books. Most early NT scraps are
            papyrus fragments; later witnesses are often parchment codices.
          </dd>
        </div>

        <div className={styles.item}>
          <dt>Paleographic dates are ranges</dt>
          <dd>
            Scholars rarely know the exact year a scribe wrote. Cards show a{" "}
            <strong>range</strong> (e.g. 125–175 CE) from handwriting style,
            not a single “birth year” for the text.
          </dd>
        </div>

        <div className={styles.item}>
          <dt>Witness vs modern critical text</dt>
          <dd>
            A <strong>witness</strong> is one physical copy — P52, Codex
            Vaticanus, a Qurʾān leaf. A <strong>critical text</strong> (here,{" "}
            <strong>SR GNT</strong> from CNTR) is an editor’s reconstruction of
            the earliest recoverable Greek, built from many witnesses. Comparing
            one witness to SR GNT shows where <em>that copy</em> differs, not
            “the right reading” by itself.
          </dd>
        </div>

        <div className={styles.item}>
          <dt>Variation unit vs reading</dt>
          <dd>
            A <strong>variation unit</strong> is one spot where witnesses
            disagree (e.g. a word in John 1:1). Each possible spelling there is
            a <strong>reading</strong>. Our site counts{" "}
            <strong>word-aligned variation units</strong> in surviving text
            only — classified as orthography, omission, addition, substitution,
            or transposition (mechanical v1 rules). Intentional-vs-error labels
            are not assigned yet.
          </dd>
        </div>

        {!compact && example && (
          <div className={styles.item}>
            <dt>Tiny real example from our data</dt>
            <dd>
              <span className={styles.example}>
                {example.witness}, {example.reference}: witness letters{" "}
                <span className={styles.greek}>{example.witness_reading}</span>{" "}
                vs {example.base_text}{" "}
                <span className={styles.greek}>{example.base_reading}</span> (
                {example.kind.replace(/_/g, " ")}).
              </span>
            </dd>
          </div>
        )}

        <div className={styles.item}>
          <dt>Why lacunae matter</dt>
          <dd>
            Fragments have holes. If software treated every gap as a deliberate
            omission, you would get absurd “variant” counts. We{" "}
            <strong>only compare extant letters</strong> — lacunae (
            <code>[...]</code>) and editorially supplied reconstruction (
            <code>~</code>) are excluded. That is why our numbers are smaller
            and more honest than naive string diffs.
          </dd>
        </div>
      </dl>
    </section>
  );
}
