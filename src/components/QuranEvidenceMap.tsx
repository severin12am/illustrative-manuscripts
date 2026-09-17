import Link from "next/link";
import { coverage } from "@/data/coverage";
import styles from "./QuranEvidenceMap.module.css";

type QuranEvidenceMapProps = {
  /** Compact arrow strip vs three-card layout */
  variant?: "strip" | "cards";
  /** Show “Qurʾān evidence map” eyebrow (cards only) */
  showHeading?: boolean;
  className?: string;
};

export default function QuranEvidenceMap({
  variant = "cards",
  showHeading = true,
  className,
}: QuranEvidenceMapProps) {
  const leafCount = coverage.quran.witness_count;
  const regionalCount =
    coverage.curated_layers?.uthmani_regional_rasm.count ?? 40;
  const archetypeCount =
    coverage.curated_layers?.quran_shared_orthography?.count ?? 23;

  if (variant === "strip") {
    return (
      <p
        className={`${styles.strip} ${className ?? ""}`}
        aria-label="Qurʾān evidence layers"
      >
        <span className={styles.stripStep}>
          <span className={styles.stripNum} aria-hidden="true">
            1
          </span>
          <Link href="/?corpus=quran">Leaves</Link>
        </span>
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
        <span className={styles.stripStep}>
          <span className={styles.stripNum} aria-hidden="true">
            2
          </span>
          <Link href="/quran/uthmani/">Regional rasm</Link>
        </span>
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
        <span className={styles.stripStep}>
          <span className={styles.stripNum} aria-hidden="true">
            3
          </span>
          <Link href="/quran/archetype/">Shared orthography</Link>
        </span>
      </p>
    );
  }

  return (
    <div className={`${styles.wrap} ${className ?? ""}`}>
      {showHeading ? (
        <p className={styles.heading}>Qurʾān evidence map</p>
      ) : null}
      <div className={styles.cards}>
        <article className={styles.card} data-layer="1">
          <h3 className={styles.cardTitle}>
            <Link href="/?corpus=quran">1 · Hijazi leaves</Link>
          </h3>
          <p className={styles.cardMeta}>
            {leafCount} catalog witnesses · 1–100 AH window
          </p>
          <p className={styles.cardBody}>
            Timeline cards with rasm excerpts, photos, and Corpus Coranicum
            metadata — not a full mushaf collation.
          </p>
        </article>
        <article className={styles.card} data-layer="2">
          <h3 className={styles.cardTitle}>
            <Link href="/quran/uthmani/">2 · Regional Uthmanic rasm</Link>
          </h3>
          <p className={styles.cardMeta}>
            {regionalCount} published split examples
          </p>
          <p className={styles.cardBody}>
            Places where stemmatics report Syria, Medina, Basra, and Kufa{" "}
            <em>differ</em> (Cook / Sidky framing) — layer two of UT evidence.
          </p>
        </article>
        <article className={styles.card} data-layer="3">
          <h3 className={styles.cardTitle}>
            <Link href="/quran/archetype/">3 · Shared orthography</Link>
          </h3>
          <p className={styles.cardMeta}>
            niʿmat matrix · {archetypeCount} verse rows (Table 2)
          </p>
          <p className={styles.cardBody}>
            Early witnesses agreeing on the same quirky spelling — written-archetype
            case study (van Putten 2019), transcribed from the published table.
          </p>
        </article>
      </div>
      <p className={styles.note}>
        Three layers stack: catalog → regional splits → shared idiosyncrasies.{" "}
        <Link href="/methodology/#quran-evidence-layers">Methods</Link> ·{" "}
        <Link href="/teach/quran-three-evidence-layers/">Teaching brief</Link>
      </p>
    </div>
  );
}
