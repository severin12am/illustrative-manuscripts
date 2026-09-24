import type { Metadata } from "next";
import Link from "next/link";
import {
  openSources,
} from "@/data/open-sources";
import {
  OPEN_SOURCE_LICENSE_LABEL,
  type OpenSourceLicenseKind,
} from "@/types/openSources";
import styles from "./sources.module.css";

export const metadata: Metadata = {
  title: "Open sources hub — Illustrative Manuscripts",
  description:
    "Curated bibliography of published catalogs and open tools we reuse — INTF Liste, CNTR, Gurry, Tischendorf EOCM scans, Corpus Coranicum, Claremont NHA, and more — with honest license notes.",
};

function badgeClass(license: OpenSourceLicenseKind) {
  if (license === "open_reuse") return `${styles.badge} ${styles.badgeOpen}`;
  if (license === "copyrighted_cite_only") return `${styles.badge} ${styles.badgeCopyright}`;
  return `${styles.badge} ${styles.badgeLink}`;
}

export default function OpenSourcesPage() {
  const { intro, license_legend, sections } = openSources;

  return (
    <main className={styles.main} data-doc-page="true">
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Reuse, don&apos;t reinvent</p>
        <h1 className={styles.title}>Open sources hub</h1>
        <p className={styles.lead}>{intro}</p>
        <p className={styles.lead} style={{ marginTop: "0.75rem" }}>
          Pair with <Link href="/status/#published-tools">Site status § published tools</Link>,{" "}
          <Link href="/methodology/">Methods</Link>, and{" "}
          <Link href="/cite/#sources">Cite &amp; learn</Link>. This site holds bounded slices;
          primary work stays with the catalogs below.
        </p>
      </header>

      <div className={styles.legend} aria-label="License legend">
        {(Object.keys(license_legend) as OpenSourceLicenseKind[]).map((key) => (
          <span key={key} className={styles.legendItem}>
            <strong>{OPEN_SOURCE_LICENSE_LABEL[key]}:</strong> {license_legend[key]}
          </span>
        ))}
      </div>

      {sections.map((section) => (
        <section
          key={section.id}
          className={styles.corpusSection}
          aria-labelledby={`${section.id}-title`}
        >
          <h2 id={`${section.id}-title`} className={styles.sectionTitle}>
            {section.title}
          </h2>
          {section.intro && <p className={styles.sectionIntro}>{section.intro}</p>}
          <div className={styles.cardGrid}>
            {section.cards.map((card) => (
              <article
                key={card.id}
                id={card.id}
                className={styles.card}
                aria-labelledby={`${card.id}-title`}
              >
                <span className={badgeClass(card.license)}>
                  {OPEN_SOURCE_LICENSE_LABEL[card.license]}
                </span>
                <h3 id={`${card.id}-title`} className={styles.cardTitle}>
                  {card.title}
                </h3>
                <p className={styles.cardSummary}>{card.summary}</p>
                <ul className={styles.linkList}>
                  {card.links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} target="_blank" rel="noopener noreferrer">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className={styles.licenseNote}>{card.license_note}</p>
              </article>
            ))}
          </div>
        </section>
      ))}

      <footer className={styles.footer}>
        <Link href="/status/">Site status →</Link>
        {" · "}
        <Link href="/teach/reuse-open-tools/">Teaching brief →</Link>
        {" · "}
        <Link href="/cite/">Cite &amp; learn →</Link>
        {" · "}
        <Link href="/">← Timeline</Link>
      </footer>
    </main>
  );
}
