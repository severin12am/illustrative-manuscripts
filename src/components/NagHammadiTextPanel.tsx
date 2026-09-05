"use client";

import styles from "./NagHammadiTextPanel.module.css";
import type { NagHammadiTextUnit, NagHammadiWitnessText } from "@/types/nag-hammadi-text";

interface Props {
  text: NagHammadiWitnessText;
  witnessId: string;
}

function UnitRow({ unit }: { unit: NagHammadiTextUnit }) {
  return (
    <div className={styles.unitRow}>
      <div className={styles.ref}>{unit.reference}</div>
      <div className={styles.columns}>
        <div className={styles.copticCol}>
          <span className={styles.colLabel}>Original</span>
          {unit.coptic ? (
            <p className={styles.coptic} lang="cop">
              {unit.coptic}
            </p>
          ) : (
            <p className={styles.missingCoptic}>
              Coptic diplomatic text not bundled for this tractate in v1.
            </p>
          )}
          <p className={styles.witnessNote}>{unit.coptic_label}</p>
          {unit.coptic && (
            <p className={styles.sourceNote}>Source: {unit.coptic_source}</p>
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

export default function NagHammadiTextPanel({ text, witnessId }: Props) {
  if (!text.available) {
    return (
      <section className={styles.unavailable}>
        <h4 className={styles.heading}>Running text</h4>
        <p>{text.message || `No text bundle for ${witnessId}.`}</p>
        {text.claremont_url && (
          <p className={styles.hint}>
            See{" "}
            <a href={text.claremont_url} target="_blank" rel="noopener noreferrer">
              Claremont Nag Hammadi Archive
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
          Non-canonical Coptic tractate — not a New Testament manuscript.
        </p>
      </header>

      <div className={styles.unitList}>
        {text.initial_units.map((u) => (
          <UnitRow key={`${u.reference}-${u.logion ?? "x"}`} unit={u} />
        ))}
      </div>

      <footer className={styles.attr}>
        {text.attribution}
        {text.claremont_url && (
          <>
            {" "}
            <a href={text.claremont_url} target="_blank" rel="noopener noreferrer">
              Claremont NHA ↗
            </a>
          </>
        )}
        {text.library_url && (
          <>
            {" "}
            <a href={text.library_url} target="_blank" rel="noopener noreferrer">
              Leaf viewer ↗
            </a>
          </>
        )}
      </footer>
    </section>
  );
}
