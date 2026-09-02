import styles from "./WitnessCard.module.css";
import type { Witness } from "@/types/witness";
import { formatDateRange } from "@/types/witness";

interface WitnessCardProps {
  witness: Witness;
}

const corpusLabels: Record<Witness["corpus"], string> = {
  nt: "New Testament",
  ot: "Old Testament",
  lxx: "Septuagint",
  version: "Version",
  other: "Other",
};

export default function WitnessCard({ witness }: WitnessCardProps) {
  const imageLink = witness.source_page_url ?? witness.image_url;
  const hasImage = witness.image_policy !== "missing" && imageLink;

  return (
    <article className={styles.card}>
      <div className={styles.thumbnail}>
        {hasImage ? (
          <a
            href={imageLink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.thumbnailLink}
            aria-label={`View image at ${witness.current_institution}`}
          >
            <div className={styles.placeholder}>
              <span className={styles.placeholderIcon}>📜</span>
              <span className={styles.placeholderText}>
                {witness.image_policy === "link_only"
                  ? "View at institution →"
                  : "View image →"}
              </span>
            </div>
          </a>
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.placeholderIcon}>📜</span>
            <span className={styles.placeholderText}>No image available</span>
          </div>
        )}
        <span className={styles.corpusBadge}>{corpusLabels[witness.corpus]}</span>
      </div>

      <div className={styles.body}>
        <header className={styles.header}>
          <h3 className={styles.name}>{witness.traditional_name}</h3>
          {witness.aliases.length > 0 && (
            <p className={styles.aliases}>
              also known as {witness.aliases.join(", ")}
            </p>
          )}
        </header>

        <dl className={styles.meta}>
          <div className={styles.metaRow}>
            <dt>Date</dt>
            <dd>
              {formatDateRange(witness.date_start, witness.date_end)}
              {witness.date_note && (
                <span className={styles.dateNote}> ({witness.date_note})</span>
              )}
            </dd>
          </div>
          <div className={styles.metaRow}>
            <dt>Contents</dt>
            <dd>{witness.contents}</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>Found</dt>
            <dd>
              {witness.find_place}
              {witness.find_year_or_note && (
                <span className={styles.subNote}>
                  {" "}
                  — {witness.find_year_or_note}
                </span>
              )}
            </dd>
          </div>
          <div className={styles.metaRow}>
            <dt>Now at</dt>
            <dd>
              {witness.current_institution}
              {witness.current_shelfmark && (
                <span className={styles.subNote}>
                  {" "}
                  ({witness.current_shelfmark})
                </span>
              )}
            </dd>
          </div>
        </dl>

        <blockquote className={styles.translation}>
          <p>{witness.translation}</p>
          <footer>Base text: {witness.modern_base_text}</footer>
        </blockquote>

        {witness.known_variants.length > 0 && (
          <section className={styles.variants}>
            <h4>Notable variants</h4>
            <ul>
              {witness.known_variants.map((v, i) => (
                <li key={i}>
                  <strong>{v.locus}:</strong> {v.witness_reading}
                  <span className={styles.vs}> vs </span>
                  {v.modern_reading}
                  <p className={styles.significance}>{v.significance}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <footer className={styles.links}>
          {witness.bibliography.map((ref, i) => (
            <a
              key={i}
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.refLink}
            >
              {ref.title} ↗
            </a>
          ))}
          {witness.transcription_url && (
            <a
              href={witness.transcription_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.refLink}
            >
              Transcription ↗
            </a>
          )}
        </footer>

        <p className={styles.license}>{witness.license_note}</p>
      </div>
    </article>
  );
}
