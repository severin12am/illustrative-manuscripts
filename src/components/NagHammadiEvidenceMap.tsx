import Link from "next/link";
import { coverage } from "@/data/coverage";
import {
  NAG_HAMMADI_TIMELINE_START,
  NAG_HAMMADI_TIMELINE_END,
} from "@/data/nag-hammadi-witnesses";
import styles from "./QuranEvidenceMap.module.css";

type NagHammadiEvidenceMapProps = {
  variant?: "strip" | "cards";
  showHeading?: boolean;
  className?: string;
};

const WINDOW_LABEL = `${NAG_HAMMADI_TIMELINE_START}–${NAG_HAMMADI_TIMELINE_END} CE`;

export default function NagHammadiEvidenceMap({
  variant = "cards",
  showHeading = true,
  className,
}: NagHammadiEvidenceMapProps) {
  const { nag_hammadi: nh } = coverage;
  const tractateCount = nh.tractate_witness_count;

  if (variant === "strip") {
    return (
      <p
        className={`${styles.strip} ${className ?? ""}`}
        aria-label="Nag Hammadi evidence map"
      >
        <span className={styles.stripStep}>
          <span className={styles.stripNum} aria-hidden="true">
            1
          </span>
          <Link href="/nag-hammadi/evidence/#library">Codex library</Link>
        </span>
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
        <span className={styles.stripStep}>
          <span className={styles.stripNum} aria-hidden="true">
            2
          </span>
          <Link href="/?corpus=nag-hammadi">Tractates ({tractateCount})</Link>
        </span>
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
        <span className={styles.stripStep}>
          <span className={styles.stripNum} aria-hidden="true">
            3
          </span>
          <Link href="/nag-hammadi/evidence/#vs-greek-nt">vs Greek NT</Link>
        </span>
        <span className={styles.arrow} aria-hidden="true">
          ·
        </span>
        <Link href="/use/#nag-hammadi-lost-nt-books" className={styles.stripAside}>
          ≠ lost NT books
        </Link>
      </p>
    );
  }

  return (
    <div className={`${styles.wrap} ${className ?? ""}`}>
      {showHeading ? (
        <p className={styles.heading}>Nag Hammadi evidence map</p>
      ) : null}
      <div className={styles.cards}>
        <article className={styles.card} data-layer="1">
          <h3 className={styles.cardTitle}>
            <Link href="/nag-hammadi/evidence/#library">
              1 · The library &amp; codices
            </Link>
          </h3>
          <p className={styles.cardMeta}>
            Jabal al-Tarif find (Dec. 1945) · {WINDOW_LABEL} paleography on cards
          </p>
          <p className={styles.cardBody}>
            Thirteen leather-bound Coptic codices (52 tractates total in the
            discovery). Our timeline dates the <strong>physical witnesses</strong>{" "}
            (mid–4th c. copy), not speculative composition dates for every text —
            many tractates may be 2nd–3rd c. in origin.
          </p>
        </article>
        <article className={styles.card} data-layer="2">
          <h3 className={styles.cardTitle}>
            <Link href="/use/#nag-hammadi-lost-nt-books">
              2 · Not “lost NT books”
            </Link>
          </h3>
          <p className={styles.cardMeta}>Gnostic &amp; apocryphal Christian literature</p>
          <p className={styles.cardBody}>
            Mostly Sahidic Coptic tractates — a different genre stream from Greek
            NT papyri this site collates against CNTR. Overlap with canonical
            sayings (e.g. Thomas) is a scholarly question, not a built-in verse
            collation.
          </p>
        </article>
        <article className={styles.card} data-layer="3">
          <h3 className={styles.cardTitle}>
            <Link href="/nag-hammadi/evidence/#tractates">
              3 · {tractateCount} tractates in our seed
            </Link>
          </h3>
          <p className={styles.cardMeta}>
            {nh.leaf_image_count}/{tractateCount} with leaf image (
            {nh.hosted_leaf_image_count ?? 0} Commons hosted,{" "}
            {nh.iiif_leaf_image_count ?? nh.leaf_image_count} Claremont IIIF)
          </p>
          <p className={styles.cardBody}>
            Gospel of Thomas, Apocryphon of John (multiple codices), Gospel of
            Truth, Thunder Perfect Mind, and more — diplomatic Coptic + English on
            cards. Pair mentally with early Greek gospel fragments on the NT
            timeline; no Thomas↔John compare engine.
          </p>
        </article>
      </div>
      <p className={styles.note}>
        Discovery story → curated tractate cards → honest boundary with Greek NT (
        {WINDOW_LABEL} CNTR slice).{" "}
        <Link href="/nag-hammadi/evidence/">Full evidence page</Link> ·{" "}
        <Link href="/methodology/#nag-hammadi-evidence">Methods</Link> ·{" "}
        <Link href="/teach/nag-hammadi-vs-canon/">Teaching brief</Link>
      </p>
    </div>
  );
}
