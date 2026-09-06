"use client";

import { useState } from "react";
import styles from "./WitnessTextPanel.module.css";
import GreekDiplomatic from "./GreekDiplomatic";
import type { WitnessText, TextVerse, VariantUnit } from "@/types/text";
import { countVariants, formatLocus } from "@/types/text";
import { assetUrl } from "@/lib/assetUrl";
import { kindLabel, sortKindEntries } from "@/lib/variantTaxonomy";
import { unitIdForVariant } from "@/lib/unitId";
import {
  getIntentionalTag,
  hasAnyIntentionalTags,
  intentionalBadgeTitle,
  INTENTIONAL_LABEL_DISPLAY,
} from "@/lib/intentionalTags";

interface Props {
  text: WitnessText;
  ga: string;
}

function VerseRow({ verse, ga }: { verse: TextVerse; ga: string }) {
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
      {verse.variants.length > 0 && (
        <ul className={styles.variantList}>
          {verse.variants.map((v, i) => (
            <VariantStrip key={`${verse.esn}-${i}`} verse={verse} variant={v} ga={ga} />
          ))}
        </ul>
      )}
    </div>
  );
}

function VariantStrip({
  verse,
  variant,
  ga,
}: {
  verse: TextVerse;
  variant: VariantUnit;
  ga: string;
}) {
  const unitId = unitIdForVariant(ga, verse.esn, variant);
  const tag = getIntentionalTag(unitId);

  return (
    <li className={styles.variantStrip}>
      <span className={styles.kindBadge} data-kind={variant.kind}>
        {kindLabel(variant.kind)}
      </span>
      {tag && (
        <span
          className={styles.intentionBadge}
          data-intention={tag.label}
          title={intentionalBadgeTitle(tag.label, tag.rationale)}
        >
          {INTENTIONAL_LABEL_DISPLAY[tag.label].short}
        </span>
      )}
      <span className={styles.vsLabel}>vs {variant.base_text}</span>
      <span className={styles.vsLocus}>{formatLocus(variant.locus)}</span>
      <span className={styles.vsWitness}>{variant.witness_reading}</span>
      <span className={styles.vsSep}>|</span>
      <span className={styles.vsBase}>{variant.base_reading}</span>
      {variant.note && <span className={styles.vsNote}>{variant.note}</span>}
    </li>
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

  const differenceCount = countVariants(visible);
  const baseText = text.base_text ?? "SR GNT";
  const kindTotals = visible.reduce<Record<string, number>>((acc, verse) => {
    for (const v of verse.variants || []) {
      acc[v.kind] = (acc[v.kind] || 0) + 1;
    }
    return acc;
  }, {});
  const kindEntries = sortKindEntries(kindTotals);

  return (
    <section className={styles.panel}>
      <header className={styles.panelHeader}>
        <h4 className={styles.heading}>Running text</h4>
        <p className={styles.subhead}>
          {text.translation_label} — {text.translation_base}
        </p>
        <p className={styles.diffCount}>
          <strong>{differenceCount}</strong> variation unit
          {differenceCount !== 1 ? "s" : ""} in extant (non-supplied) runs vs{" "}
          {baseText} in the surviving verses shown. Lacunae and reconstructed
          text are not counted.
        </p>
        {kindEntries.length > 0 && (
          <ul className={styles.kindBreakdown}>
            {kindEntries.map(([kind, count]) => (
              <li key={kind}>
                <span className={styles.kindBadge} data-kind={kind}>
                  {kindLabel(kind)}
                </span>
                {count}
              </li>
            ))}
          </ul>
        )}
        {!hasAnyIntentionalTags() && (
          <p className={styles.kindPending}>
            Intentional-vs-error tagging not run yet. On your machine:{" "}
            <code>npm run export-taggable</code> then{" "}
            <code>npm run tag-intentional</code> (LM Studio / Qwen). See DATA.md.
          </p>
        )}
        {text.cntr_url && (
          <a
            href={text.cntr_url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cntrOpen}
          >
            Open on CNTR ↗
          </a>
        )}
      </header>

      <div className={styles.verseList}>
        {visible.map((v) => (
          <VerseRow key={v.esn} verse={v} ga={ga} />
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
