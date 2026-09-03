import styles from "./WitnessCard.module.css";
import type { Witness } from "@/types/witness";
import { formatDualDateRange } from "@/types/witness";
import { assetUrl } from "@/lib/assetUrl";
import { getWitnessText } from "@/data/witness-texts";
import { getQuranWitnessText } from "@/data/quran-texts";
import WitnessTextPanel from "./WitnessTextPanel";
import QuranTextPanel from "./QuranTextPanel";

interface WitnessCardProps {
  witness: Witness;
}

const categoryLabels: Record<string, string> = {
  gospels: "Gospels",
  paul: "Pauline",
  other: "Other NT",
  hijazi: "Hijazi",
};

export default function WitnessCard({ witness }: WitnessCardProps) {
  const isQuran = witness.corpus === "quran";
  const hasHosted = witness.image_policy === "hosted" && witness.hosted_image;
  const ntText = !isQuran ? getWitnessText(witness.ga_number) : null;
  const quranText = isQuran ? getQuranWitnessText(witness.id) : null;

  const badge = isQuran
    ? witness.script === "hijazi"
      ? "Hijazi"
      : witness.script || "Qur'an"
    : categoryLabels[witness.book_category] || witness.book_category;

  const primaryLink = isQuran
    ? witness.library_url || witness.corpus_coranicum_url
    : witness.ntvmr_url;

  return (
    <article className={styles.card} id={witness.id}>
      <header className={styles.cardHeader}>
        <div className={styles.titleRow}>
          <h3 className={styles.ga}>{witness.ga_number}</h3>
          <span className={styles.badge}>{badge}</span>
          {witness.palimpsest && (
            <span className={styles.badge}>Palimpsest</span>
          )}
        </div>
        <p className={styles.traditionalName}>{witness.traditional_name}</p>
        <p className={styles.date}>
          {formatDualDateRange(
            witness.date_start,
            witness.date_end,
            witness.ah_start,
            witness.ah_end
          )}
          <span className={styles.dateLabel}> ({witness.date_label})</span>
        </p>
        <p className={styles.survives}>
          <strong>What survives:</strong> {witness.contents}
          {witness.current_shelfmark && (
            <> · {witness.current_institution}, {witness.current_shelfmark}</>
          )}
          {witness.find_place && <> · Found: {witness.find_place}</>}
        </p>
        {witness.layers && witness.layers.length > 0 && (
          <p className={styles.layers}>
            <strong>Layers:</strong>{" "}
            {witness.layers.map((l) => l.label).join("; ")}
          </p>
        )}
        <p className={styles.dateNote}>{witness.date_note}</p>
      </header>

      <div className={styles.mainGrid}>
        <div className={styles.imageColumn}>
          {hasHosted ? (
            <a
              href={witness.commons_url || witness.source_page_url || primaryLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.imageLink}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={assetUrl(witness.hosted_image!)}
                alt={`${witness.ga_number} manuscript photograph`}
                className={styles.image}
                loading="lazy"
              />
              <span className={styles.imageBadge}>Commons</span>
            </a>
          ) : (
            <div className={styles.noImage}>
              <p className={styles.noImageTitle}>No open image yet</p>
              <p className={styles.noImageText}>
                View the scan at the holding institution:
              </p>
              {primaryLink && (
                <a
                  href={primaryLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.viewerLink}
                >
                  {isQuran ? "Library viewer ↗" : "NTVMR ↗"}
                </a>
              )}
              {!isQuran && witness.csntm_url && (
                <a
                  href={witness.csntm_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.viewerLink}
                >
                  CSNTM ↗
                </a>
              )}
              {isQuran && witness.corpus_coranicum_url && (
                <a
                  href={witness.corpus_coranicum_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.viewerLink}
                >
                  Corpus Coranicum ↗
                </a>
              )}
            </div>
          )}
          {witness.image_attribution && (
            <p className={styles.imageCredit}>
              <a
                href={witness.image_attribution.commons_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {witness.image_attribution.license}
              </a>
            </p>
          )}
        </div>

        <div className={styles.textColumn}>
          {isQuran && quranText ? (
            <QuranTextPanel text={quranText} witnessId={witness.id} />
          ) : ntText ? (
            <WitnessTextPanel text={ntText} ga={witness.ga_number} />
          ) : null}
        </div>
      </div>

      <footer className={styles.links}>
        {isQuran ? (
          <>
            {witness.corpus_coranicum_url && (
              <a
                href={witness.corpus_coranicum_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Corpus Coranicum ↗
              </a>
            )}
            {witness.library_url && (
              <a href={witness.library_url} target="_blank" rel="noopener noreferrer">
                Library ↗
              </a>
            )}
          </>
        ) : (
          <>
            {witness.ntvmr_url && (
              <a href={witness.ntvmr_url} target="_blank" rel="noopener noreferrer">
                NTVMR ↗
              </a>
            )}
            {witness.cntr_url && (
              <a href={witness.cntr_url} target="_blank" rel="noopener noreferrer">
                CNTR ↗
              </a>
            )}
          </>
        )}
        {witness.commons_url && (
          <a href={witness.commons_url} target="_blank" rel="noopener noreferrer">
            Commons ↗
          </a>
        )}
        {witness.source_page_url && (
          <a href={witness.source_page_url} target="_blank" rel="noopener noreferrer">
            Image viewer ↗
          </a>
        )}
      </footer>
    </article>
  );
}
