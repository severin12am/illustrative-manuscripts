"use client";

import styles from "./QuranTextPanel.module.css";
import type { QuranAyah, QuranWitnessText } from "@/types/quran-text";
import { countQuranVariants } from "@/types/quran-text";

interface Props {
  text: QuranWitnessText;
  witnessId: string;
}

function AyahRow({ ayah }: { ayah: QuranAyah }) {
  return (
    <div className={styles.ayahRow} id={`ayah-${ayah.surah}-${ayah.ayah}`}>
      <div className={styles.ref}>{ayah.reference}</div>
      <div className={styles.columns}>
        <div className={styles.arabicCol}>
          <span className={styles.colLabel}>Original</span>
          <p className={styles.arabicStandard} dir="rtl" lang="ar">
            {ayah.arabic_standard}
          </p>
          <p className={styles.witnessNote}>{ayah.arabic_witness_label}</p>
          <p className={styles.sourceNote}>Source: {ayah.arabic_witness_source}</p>
        </div>
        <div className={styles.englishCol}>
          <span className={styles.colLabel}>Translation</span>
          <p className={styles.english}>{ayah.english_pickthall}</p>
          <p className={styles.transNote}>{ayah.english_label}</p>
        </div>
      </div>
      {ayah.variants.length > 0 && (
        <ul className={styles.variantList}>
          {ayah.variants.map((v, i) => (
            <li key={i} className={styles.variantStrip}>
              <span className={styles.kindBadge}>{v.kind}</span>
              <span className={styles.vsLabel}>vs {v.base_text}</span>
              <span className={styles.vsWitness}>{v.witness_reading}</span>
              <span className={styles.vsSep}>|</span>
              <span className={styles.vsBase}>{v.base_reading}</span>
              {v.note && <span className={styles.vsNote}>{v.note}</span>}
            </li>
          ))}
        </ul>
      )}
      {ayah.note && <p className={styles.ayahNote}>{ayah.note}</p>}
    </div>
  );
}

export default function QuranTextPanel({ text, witnessId }: Props) {
  if (!text.available) {
    return (
      <section className={styles.unavailable}>
        <h4 className={styles.heading}>Running text</h4>
        <p>{text.message || `No transliteration bundle for ${witnessId}.`}</p>
        {text.corpus_coranicum_url && (
          <p className={styles.hint}>
            See{" "}
            <a href={text.corpus_coranicum_url} target="_blank" rel="noopener noreferrer">
              Corpus Coranicum
            </a>
            .
          </p>
        )}
      </section>
    );
  }

  const differenceCount = countQuranVariants(text.initial_ayahs);

  return (
    <section className={styles.panel}>
      <header className={styles.panelHeader}>
        <h4 className={styles.heading}>Running text</h4>
        <p className={styles.subhead}>
          {text.translation_label} — {text.translation_base}
        </p>
        <p className={styles.diffCount}>
          {differenceCount} layer/rasm difference
          {differenceCount !== 1 ? "s" : ""} noted in the surviving verses shown
        </p>
      </header>

      <div className={styles.ayahList}>
        {text.initial_ayahs.map((a) => (
          <AyahRow key={`${a.surah}-${a.ayah}-${a.layer || "x"}`} ayah={a} />
        ))}
      </div>

      <footer className={styles.attr}>
        {text.attribution}
        {text.corpus_coranicum_url && (
          <>
            {" "}
            <a href={text.corpus_coranicum_url} target="_blank" rel="noopener noreferrer">
              Corpus Coranicum ↗
            </a>
          </>
        )}
        {text.library_url && (
          <>
            {" "}
            <a href={text.library_url} target="_blank" rel="noopener noreferrer">
              Library ↗
            </a>
          </>
        )}
      </footer>
    </section>
  );
}
