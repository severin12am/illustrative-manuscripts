import Link from "next/link";
import QuranEvidenceMap from "@/components/QuranEvidenceMap";
import HebrewLxxEvidenceMap from "@/components/HebrewLxxEvidenceMap";
import GreekNtEvidenceMap from "@/components/GreekNtEvidenceMap";
import NagHammadiEvidenceMap from "@/components/NagHammadiEvidenceMap";
import type { SiteCorpus } from "@/components/HomeTimeline";
import styles from "./HomeStartHere.module.css";

type Props = {
  showGreekNtMap?: boolean;
  activeCorpus: SiteCorpus;
};

const CORPUS_MAP_LABEL: Record<SiteCorpus, string> = {
  nt: "Greek NT evidence",
  quran: "Qurʾān evidence",
  "hebrew-lxx": "Hebrew / LXX evidence",
  "nag-hammadi": "Nag Hammadi evidence",
};

export default function HomeStartHere({ showGreekNtMap, activeCorpus }: Props) {
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
          <Link href="/status/">Site status</Link>
          <span className={styles.sep} aria-hidden="true">
            ·
          </span>
          <Link href="/about/">About</Link>
          <span className={styles.sep} aria-hidden="true">
            ·
          </span>
          <Link href="/teach/">Teach</Link>
        </p>
        <div
          className={`${styles.quranMap} ${styles.mapQuran} ${
            activeCorpus === "quran" ? styles.mapActiveMobile : ""
          }`}
        >
          <span className={styles.quranMapLabel}>{CORPUS_MAP_LABEL.quran}</span>
          <QuranEvidenceMap variant="strip" />
        </div>
        <div
          className={`${styles.quranMap} ${styles.mapHebrewLxx} ${
            activeCorpus === "hebrew-lxx" ? styles.mapActiveMobile : ""
          }`}
        >
          <span className={styles.quranMapLabel}>{CORPUS_MAP_LABEL["hebrew-lxx"]}</span>
          <HebrewLxxEvidenceMap variant="strip" />
        </div>
        <div
          className={`${styles.quranMap} ${styles.mapNagHammadi} ${
            activeCorpus === "nag-hammadi" ? styles.mapActiveMobile : ""
          }`}
        >
          <span className={styles.quranMapLabel}>{CORPUS_MAP_LABEL["nag-hammadi"]}</span>
          <NagHammadiEvidenceMap variant="strip" />
        </div>
        <div
          className={`${styles.quranMap} ${styles.mapGreekNt} ${
            activeCorpus === "nt" ? styles.mapActiveMobile : ""
          }`}
        >
          <span className={styles.quranMapLabel}>{CORPUS_MAP_LABEL.nt}</span>
          <GreekNtEvidenceMap variant="compact" />
        </div>
      </aside>
      {showGreekNtMap ? (
        <div className={styles.greekMapDesktop}>
          <GreekNtEvidenceMap variant="compact" />
        </div>
      ) : null}
    </>
  );
}
