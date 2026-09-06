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
        {home_stats.disagreements_label} (our CNTR slice, not a global census) ·{" "}
        <Link href="/coverage/" className={styles.link}>
          definition &amp; limits →
        </Link>
      </p>
      <p className={styles.sub}>
        {greek_nt.extant_word_tokens.total.toLocaleString()} extant Greek word
        tokens compared · {greek_nt.leaf_image_count}/{greek_nt.witness_count}{" "}
        with leaf images
      </p>
    </aside>
  );
}
