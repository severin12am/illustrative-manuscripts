"use client";

import styles from "./HebrewLxxTextPanel.module.css";
import type { HebrewLxxTextUnit, HebrewLxxWitnessText } from "@/types/hebrew-lxx-text";

interface Props {
  text: HebrewLxxWitnessText;
  witnessId: string;
}

function UnitRow({ unit }: { unit: HebrewLxxTextUnit }) {
  const isHebrew = unit.tradition === "hebrew";
  const lang = isHebrew ? "he" : "grc";

  return (
    <div className={styles.unitRow}>
      <div className={styles.ref}>{unit.reference}</div>
      <div className={styles.columns}>
        <div className={styles.originalCol}>
          <span className={styles.colLabel}>
            {isHebrew ? "Hebrew" : "Greek"}
          </span>
          {unit.original ? (
            <p
              className={isHebrew ? styles.hebrew : styles.greek}
              lang={lang}
              dir={isHebrew ? "rtl" : "ltr"}
            >
              {unit.original}
            </p>
          ) : (
            <p className={styles.missingOriginal}>
              Diplomatic text not bundled for this witness in v1.
            </p>
          )}
          <p className={styles.witnessNote}>{unit.original_label}</p>
          {unit.original && (
            <p className={styles.sourceNote}>Source: {unit.original_source}</p>
          )}
        </div>
        <div className={styles.englishCol}>
          <span className={styles.colLabel}>Translation</span>
          <p className={styles.english}>{unit.english}</p>
          <p className={styles.transNote}>
            {unit.english_label} — {unit.english_source}
          </p>
        </div>
      </div>
      {unit.note && <p className={styles.unitNote}>{unit.note}</p>}
    </div>
  );
}

export default function HebrewLxxTextPanel({ text, witnessId }: Props) {
  if (!text.available) {
    return (
      <section className={styles.unavailable}>
        <h4 className={styles.heading}>Running text</h4>
        <p>{text.message || `No text bundle for ${witnessId}.`}</p>
        {text.leon_levy_url && (
          <p className={styles.hint}>
            See{" "}
            <a href={text.leon_levy_url} target="_blank" rel="noopener noreferrer">
              Leon Levy DSS Digital Library
            </a>
            .
          </p>
        )}
      </section>
    );
  }

  return (
    <section className={styles.panel}>
      <header className={styles.panelHeader}>
        <h4 className={styles.heading}>Running text</h4>
        <p className={styles.subhead}>
          {text.translation_label} — {text.translation_base}
        </p>
        <p className={styles.note}>
          {text.rahlfs
            ? `Rahlfs ${text.rahlfs} — display excerpts only, not a critical apparatus.`
            : "Hebrew Bible / LXX witness — not a BHQ or Göttingen apparatus reuse."}
        </p>
      </header>

      <div className={styles.unitList}>
        {text.initial_units.map((u) => (
          <UnitRow key={u.reference} unit={u} />
        ))}
      </div>

      <footer className={styles.attr}>
        {text.attribution}
        {text.leon_levy_url && (
          <>
            {" "}
            <a href={text.leon_levy_url} target="_blank" rel="noopener noreferrer">
              Leon Levy DSS ↗
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
