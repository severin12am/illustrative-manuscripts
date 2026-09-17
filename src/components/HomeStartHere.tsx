import Link from "next/link";
import QuranEvidenceMap from "@/components/QuranEvidenceMap";
import HebrewLxxEvidenceMap from "@/components/HebrewLxxEvidenceMap";
import GreekNtEvidenceMap from "@/components/GreekNtEvidenceMap";
import styles from "./HomeStartHere.module.css";

type Props = {
  showGreekNtMap?: boolean;
};

export default function HomeStartHere({ showGreekNtMap }: Props) {
  return (
    <>
      <aside className={styles.strip} aria-label="Start here">
        <p className={styles.inner}>
          <span className={styles.label}>Start here</span>
          <Link href="/use/">Use &amp; claims</Link>
          <span className={styles.sep} aria-hidden="true">
            ·
          </span>
          <Link href="/methodology/">Methods</Link>
          <span className={styles.sep} aria-hidden="true">
            ·
          </span>
          <Link href="/coverage/">Coverage</Link>
          <span className={styles.sep} aria-hidden="true">
            ·
          </span>
          <Link href="/teach/">Teach</Link>
        </p>
        <div className={styles.quranMap}>
          <span className={styles.quranMapLabel}>Qurʾān evidence</span>
          <QuranEvidenceMap variant="strip" />
        </div>
        <div className={styles.quranMap}>
          <span className={styles.quranMapLabel}>Hebrew / LXX evidence</span>
          <HebrewLxxEvidenceMap variant="strip" />
        </div>
      </aside>
      {showGreekNtMap ? <GreekNtEvidenceMap variant="compact" /> : null}
    </>
  );
}
