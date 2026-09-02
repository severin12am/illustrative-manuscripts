import styles from "./WitnessCard.module.css";
import type { Witness } from "@/types/witness";
import { formatDateRange } from "@/types/witness";
import { assetUrl } from "@/lib/assetUrl";
import { getWitnessText } from "@/data/witness-texts";
import WitnessTextPanel from "./WitnessTextPanel";

interface WitnessCardProps {
  witness: Witness;
}

const categoryLabels: Record<string, string> = {
  gospels: "Gospels",
  paul: "Pauline",
  other: "Other NT",
};

export default function WitnessCard({ witness }: WitnessCardProps) {
  const hasHosted = witness.image_policy === "hosted" && witness.hosted_image;
  const text = getWitnessText(witness.ga_number);

  return (
    <article className={styles.card} id={witness.id}>
      <header className={styles.cardHeader}>
        <div className={styles.titleRow}>
          <h3 className={styles.ga}>{witness.ga_number}</h3>
          <span className={styles.badge}>
            {categoryLabels[witness.book_category] || witness.book_category}
          </span>
        </div>
        <p className={styles.date}>
          {formatDateRange(witness.date_start, witness.date_end)}
          <span className={styles.dateLabel}> ({witness.date_label})</span>
        </p>
        <p className={styles.survives}>
          <strong>What survives:</strong> {witness.contents}
          {witness.current_shelfmark && (
            <> · {witness.current_institution}, {witness.current_shelfmark}</>
          )}
          {witness.find_place && <> · Found: {witness.find_place}</>}
        </p>
        <p className={styles.dateNote}>{witness.date_note}</p>
      </header>

      <div className={styles.mainGrid}>
        <div className={styles.imageColumn}>
          {hasHosted ? (
            <a
              href={witness.commons_url || witness.source_page_url}
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
              <a
                href={witness.ntvmr_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.viewerLink}
              >
                NTVMR ↗
              </a>
              {witness.csntm_url && (
                <a
                  href={witness.csntm_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.viewerLink}
                >
                  CSNTM ↗
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
          <WitnessTextPanel text={text} ga={witness.ga_number} />
        </div>
      </div>

      <footer className={styles.links}>
        <a href={witness.ntvmr_url} target="_blank" rel="noopener noreferrer">
          NTVMR ↗
        </a>
        {witness.cntr_url && (
          <a href={witness.cntr_url} target="_blank" rel="noopener noreferrer">
            CNTR ↗
          </a>
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
