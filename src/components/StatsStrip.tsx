import Link from "next/link";
import { coverage } from "@/data/coverage";
import styles from "./StatsStrip.module.css";

export default function StatsStrip() {
  const { home_stats, greek_nt } = coverage;

  return (
    <aside className={styles.strip} aria-label="Dataset summary">
      <p className={styles.text}>
        <strong>{home_stats.greek_nt_witnesses}</strong> Greek NT witnesses ·{" "}
        <strong>{home_stats.disagreements_total.toLocaleString()}</strong>{" "}
        counted disagreements vs SR GNT in this slice —{" "}
        <Link href="/variants/" className={styles.link}>
          browse variants →
        </Link>
      </p>
      <p className={styles.sub}>
        Not a full-tradition census (Ehrman/Gurry scale).{" "}
        <Link href="/coverage/" className={styles.link}>
          What we count &amp; what we don&apos;t →
        </Link>
        {" · "}
        {greek_nt.extant_word_tokens.total.toLocaleString()} extant word tokens
        compared
      </p>
    </aside>
  );
}
