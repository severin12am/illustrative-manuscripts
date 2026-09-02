"use client";

import { useState } from "react";
import styles from "./WitnessTextPanel.module.css";
import GreekDiplomatic from "./GreekDiplomatic";
import type { WitnessText, TextVerse } from "@/types/text";
import { assetUrl } from "@/lib/assetUrl";

interface Props {
  text: WitnessText;
  ga: string;
}

function VerseRow({ verse }: { verse: TextVerse }) {
  return (
    <div
      className={styles.verseRow}
      id={`verse-${verse.reference.replace(/\s/g, "-")}`}
    >
      <div className={styles.ref}>{verse.reference}</div>
      <div className={styles.columns}>
        <div className={styles.greekCol}>
          <span className={styles.colLabel}>Original</span>
          <GreekDiplomatic verse={verse} />
        </div>
        <div className={styles.englishCol}>
          <span className={styles.colLabel}>Translation</span>
          <p
            className={
              verse.has_variant ? styles.englishVariant : styles.english
            }
          >
            {verse.english_adapted || (
              <span className={styles.noEnglish}>[no WEB verse]</span>
            )}
          </p>
        </div>
      </div>
      {verse.variant && (
        <div className={styles.variantStrip}>
          <span className={styles.vsLabel}>vs SR GNT</span>
          <span className={styles.vsWitness}>{verse.variant.witness_reading}</span>
          <span className={styles.vsSep}>|</span>
          <span className={styles.vsSr}>{verse.variant.sr_reading}</span>
          <span className={styles.vsNote}>{verse.variant.note}</span>
        </div>
      )}
    </div>
  );
}

export default function WitnessTextPanel({ text, ga }: Props) {
  const [moreVerses, setMoreVerses] = useState<TextVerse[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (!text.available) {
    return (
      <section className={styles.unavailable}>
        <h4 className={styles.heading}>Running text</h4>
        <p>{text.message || `No CNTR transcription available for ${ga}.`}</p>
        <p className={styles.hint}>
          See{" "}
          <a
            href={`https://greekcntr.org/manuscripts/${ga}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            CNTR
          </a>{" "}
          or NTVMR for this witness.
        </p>
      </section>
    );
  }

  const hiddenCount = text.more_count ?? 0;

  async function loadMore() {
    if (expanded || hiddenCount === 0) return;
    setLoading(true);
    try {
      const res = await fetch(assetUrl(`/cntr-texts/${ga}.json`));
      if (res.ok) {
        const data = await res.json();
        setMoreVerses(data.verses || []);
      }
    } catch {
      /* user can open CNTR */
    }
    setLoading(false);
    setExpanded(true);
  }

  const visible = expanded
    ? [...text.initial_verses, ...moreVerses]
    : text.initial_verses;

  return (
    <section className={styles.panel}>
      <header className={styles.panelHeader}>
        <h4 className={styles.heading}>Running text</h4>
        <p className={styles.subhead}>
          {text.translation_label} — {text.translation_base}
        </p>
      </header>

      <div className={styles.verseList}>
        {visible.map((v) => (
          <VerseRow key={v.esn} verse={v} />
        ))}
      </div>

      {!expanded && hiddenCount > 0 && (
        <button
          type="button"
          className={styles.expandBtn}
          onClick={loadMore}
          disabled={loading}
        >
          {loading
            ? "Loading CNTR transcription…"
            : `Show ${hiddenCount} more verse${hiddenCount !== 1 ? "s" : ""} (${text.total_verses} total)`}
        </button>
      )}

      {expanded && hiddenCount > 0 && (
        <button
          type="button"
          className={styles.expandBtn}
          onClick={() => {
            setExpanded(false);
            setMoreVerses([]);
          }}
        >
          Collapse to photo-matched passage
        </button>
      )}

      <footer className={styles.attr}>
        {text.attribution}
        {text.cntr_url && (
          <>
            {" "}
            <a href={text.cntr_url} target="_blank" rel="noopener noreferrer">
              CNTR ↗
            </a>
          </>
        )}
      </footer>
    </section>
  );
}
