import Link from "next/link";
import { variantIndex } from "@/data/variant-index";
import { kindLabel } from "@/lib/variantTaxonomy";
import styles from "./VariantExamples.module.css";

export default function VariantExamples() {
  const examples = variantIndex.featured_examples;

  if (!examples.length) return null;

  return (
    <section className={styles.variantExamples} aria-labelledby="variant-examples-heading">
      <h2 id="variant-examples-heading" className={styles.heading}>
        Real disagreements — not abstract numbers
      </h2>
      <p className={styles.intro}>
        Each row below is one counted variation unit from our CNTR slice. Click
        through to browse all{" "}
        {variantIndex.total.toLocaleString()} in the variant explorer.
      </p>
      <ul className={styles.list}>
        {examples.map((ex) => (
          <li key={ex.unit_id} className={styles.item}>
            <div className={styles.itemHeader}>
              <span className={styles.kindBadge}>{kindLabel(ex.kind)}</span>
              <span className={styles.ref}>{ex.verse_ref}</span>
              <span className={styles.witness}>{ex.witness_id}</span>
            </div>
            <p className={styles.readings}>
              <span title="Witness reading">{ex.witness_reading || "—"}</span>
              <span className={styles.sep}>vs SR</span>
              <span title="SR GNT reading">{ex.sr_reading || "—"}</span>
            </p>
            <Link
              href={`/variants/?id=${encodeURIComponent(ex.unit_id)}`}
              className={styles.link}
            >
              Open in explorer →
            </Link>
          </li>
        ))}
      </ul>
      <p className={styles.footer}>
        <Link href="/variants/">Browse all variants →</Link>
      </p>
    </section>
  );
}
