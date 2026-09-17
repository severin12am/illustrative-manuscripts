import Link from "next/link";
import { coverage } from "@/data/coverage";
import styles from "./QuranEvidenceMap.module.css";

type HebrewLxxEvidenceMapProps = {
  variant?: "strip" | "cards";
  showHeading?: boolean;
  className?: string;
};

export default function HebrewLxxEvidenceMap({
  variant = "cards",
  showHeading = true,
  className,
}: HebrewLxxEvidenceMapProps) {
  const { hebrew_lxx: hl } = coverage;
  const dssCount = hl.hebrew_dss_count;
  const lxxCount = hl.greek_lxx_count;

  if (variant === "strip") {
    return (
      <p
        className={`${styles.strip} ${className ?? ""}`}
        aria-label="Hebrew Bible and Septuagint evidence traditions"
      >
        <span className={styles.stripStep}>
          <span className={styles.stripNum} aria-hidden="true">
            1
          </span>
          <Link href="/hebrew-lxx/evidence/#dss">DSS Hebrew</Link>
        </span>
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
        <span className={styles.stripStep}>
          <span className={styles.stripNum} aria-hidden="true">
            2
          </span>
          <Link href="/hebrew-lxx/evidence/#mt">Masoretic Text</Link>
        </span>
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
        <span className={styles.stripStep}>
          <span className={styles.stripNum} aria-hidden="true">
            3
          </span>
          <Link href="/hebrew-lxx/evidence/#lxx">Septuagint</Link>
        </span>
      </p>
    );
  }

  return (
    <div className={`${styles.wrap} ${className ?? ""}`}>
      {showHeading ? (
        <p className={styles.heading}>Hebrew / LXX evidence map</p>
      ) : null}
      <div className={styles.cards}>
        <article className={styles.card} data-layer="1">
          <h3 className={styles.cardTitle}>
            <Link href="/?corpus=hebrew-lxx">1 · Dead Sea Scrolls Hebrew</Link>
          </h3>
          <p className={styles.cardMeta}>
            {dssCount} DSS witnesses · {hl.window_label} window
          </p>
          <p className={styles.cardBody}>
            Pre-medieval Hebrew on our timeline (e.g. 1QIsaᵃ) — earlier diversity
            with remarkable agreement in books like Isaiah; not a full DSS↔MT
            apparatus.
          </p>
        </article>
        <article className={styles.card} data-layer="2">
          <h3 className={styles.cardTitle}>
            <Link href="/hebrew-lxx/evidence/#mt">2 · Masoretic Text (MT)</Link>
          </h3>
          <p className={styles.cardMeta}>
            Standard late-medieval Hebrew · outside our leaf window
          </p>
          <p className={styles.cardBody}>
            Leningrad Codex–type MT is what most printed Hebrew Bibles follow today
            — centuries after Qumran and the first-century world, not a bound book
            Jesus held.
          </p>
        </article>
        <article className={styles.card} data-layer="3">
          <h3 className={styles.cardTitle}>
            <Link href="/?corpus=hebrew-lxx&q=P.Ryl">3 · Septuagint (LXX)</Link>
          </h3>
          <p className={styles.cardMeta}>
            {lxxCount} Greek witnesses in seed · Jewish papyri before Christian recensions
          </p>
          <p className={styles.cardBody}>
            Early Jewish Greek Torah and prophets (P.Ryl. 458, P.Fouad 266, etc.) —
            a separate stream from Hebrew DSS and from our frozen Greek NT slice.
          </p>
        </article>
      </div>
      <p className={styles.note}>
        Three traditions, one teaching map: Qumran Hebrew → standardized MT → Greek
        LXX.{" "}
        <Link href="/hebrew-lxx/evidence/">Full evidence page</Link> ·{" "}
        <Link href="/methodology/#hebrew-lxx-evidence-traditions">Methods</Link> ·{" "}
        <Link href="/teach/hebrew-lxx-three-traditions/">Teaching brief</Link>
      </p>
    </div>
  );
}
