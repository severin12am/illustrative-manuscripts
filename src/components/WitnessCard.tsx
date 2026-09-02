import styles from "./WitnessCard.module.css";
import type { Witness } from "@/types/witness";
import { formatDateRange } from "@/types/witness";
import { assetUrl } from "@/lib/assetUrl";

interface WitnessCardProps {
  witness: Witness;
  compact?: boolean;
}

const categoryLabels: Record<string, string> = {
  gospels: "Gospels",
  paul: "Pauline",
  other: "Other NT",
};

export default function WitnessCard({ witness, compact }: WitnessCardProps) {
  const hasHosted = witness.image_policy === "hosted" && witness.hosted_image;

  return (
    <article className={`${styles.card} ${compact ? styles.compact : ""}`} id={witness.id}>
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
              We do not have a PD/CC photograph for this witness. View the scan
              at the holding institution:
            </p>
            <a
              href={witness.ntvmr_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.viewerLink}
            >
              Open in NTVMR ↗
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
            {witness.image_attribution.artist && (
              <> · {witness.image_attribution.artist.slice(0, 80)}</>
            )}
          </p>
        )}
      </div>

      <div className={styles.body}>
        <header className={styles.header}>
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
          <p className={styles.dateNote}>{witness.date_note}</p>
        </header>

        <dl className={styles.meta}>
          <div className={styles.metaRow}>
            <dt>Contents</dt>
            <dd>{witness.contents}</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>Found</dt>
            <dd>{witness.find_place}</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>Now at</dt>
            <dd>
              {witness.current_institution}
              {witness.current_shelfmark && (
                <span className={styles.shelf}> · {witness.current_shelfmark}</span>
              )}
            </dd>
          </div>
          <div className={styles.metaRow}>
            <dt>Dating</dt>
            <dd>
              {witness.dating_method} — {witness.dating_source}
            </dd>
          </div>
        </dl>

        <blockquote className={styles.translation}>
          <p>{witness.translation}</p>
          <footer>vs {witness.modern_base_text}</footer>
        </blockquote>

        {witness.known_variants.length > 0 && (
          <section className={styles.variants}>
            <h4>Variant vs open base text</h4>
            {witness.known_variants.map((v, i) => (
              <div key={i} className={styles.variant}>
                <strong>{v.locus}</strong>
                <p>
                  <span className={styles.witnessReading}>{v.witness_reading}</span>
                  <span className={styles.vs}> vs </span>
                  <span>{v.modern_reading}</span>
                </p>
                <p className={styles.sig}>{v.significance}</p>
              </div>
            ))}
          </section>
        )}

        <footer className={styles.links}>
          <a href={witness.ntvmr_url} target="_blank" rel="noopener noreferrer">
            NTVMR ↗
          </a>
          {witness.cntr_url && (
            <a href={witness.cntr_url} target="_blank" rel="noopener noreferrer">
              CNTR ↗
            </a>
          )}
          {witness.source_page_url && (
            <a href={witness.source_page_url} target="_blank" rel="noopener noreferrer">
              Image viewer ↗
            </a>
          )}
        </footer>
      </div>
    </article>
  );
}
