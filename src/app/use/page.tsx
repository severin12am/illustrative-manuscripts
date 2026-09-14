import type { Metadata } from "next";
import Link from "next/link";
import { claimsEvidence } from "@/data/claims-evidence";
import type { ClaimVerdict } from "@/types/claimsEvidence";
import styles from "./use.module.css";

export const metadata: Metadata = {
  title: "Use this site — claims & evidence — Illustrative Manuscripts",
  description:
    "Audience pathways and claim discipline: what Illustrative Manuscripts supports vs common overclaims — for students, researchers, debaters, and apologists.",
};

const VERDICT_LABEL: Record<ClaimVerdict, string> = {
  supported: "Supported (within our scope)",
  partial: "Partially true",
  unsupported: "Unsupported / overclaim",
  out_of_scope: "Out of scope here",
};

function isExternal(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export default function UsePage() {
  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Claims &amp; evidence</p>
        <h1 className={styles.title}>Use this site</h1>
        <p className={styles.lead}>{claimsEvidence.intro}</p>
      </header>

      <section className={styles.section} aria-labelledby="pathways-title">
        <h2 id="pathways-title" className={styles.sectionTitle}>
          Audience pathways
        </h2>
        <p className={styles.sectionIntro}>
          Pick a lane — each card links into pages we already publish. Nothing
          here replaces CNTR, INTF, or critical editions; it routes you to honest
          slices of evidence on this site.
        </p>
        <div className={styles.pathwayGrid}>
          {claimsEvidence.pathways.map((pathway) => (
            <article key={pathway.id} className={styles.pathwayCard}>
              <h3>{pathway.title}</h3>
              <p>{pathway.description}</p>
              <ul className={styles.pathwayLinks}>
                {pathway.links.map((link) => (
                  <li key={link.href + link.label}>
                    {link.external || isExternal(link.href) ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label} ↗
                      </a>
                    ) : (
                      <Link href={link.href}>{link.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} id="claims" aria-labelledby="claims-title">
        <h2 id="claims-title" className={styles.sectionTitle}>
          Claim cards
        </h2>
        <p className={styles.sectionIntro}>
          Verdicts describe what <strong>this site&apos;s data and scope</strong>{" "}
          can support — not every theological or historical dispute in the field.
          For citations and BibTeX, see{" "}
          <Link href="/cite/">Cite &amp; learn</Link>.
        </p>
        <div className={styles.claimList}>
          {claimsEvidence.claims.map((card) => (
            <article key={card.id} className={styles.claimCard}>
              <div className={styles.claimHeader}>
                <p className={styles.claimText}>&ldquo;{card.claim}&rdquo;</p>
                <span
                  className={styles.verdict}
                  data-verdict={card.verdict}
                >
                  {VERDICT_LABEL[card.verdict]}
                </span>
              </div>
              <p className={styles.claimWhy}>{card.why}</p>
              <div className={styles.claimMeta}>
                <strong>On this site</strong>
                <ul>
                  {card.links.map((link) => (
                    <li key={link.href + link.label}>
                      {isExternal(link.href) ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.href}>{link.label}</Link>
                      )}
                    </li>
                  ))}
                </ul>
                {card.scholarship && card.scholarship.length > 0 && (
                  <>
                    <strong style={{ display: "block", marginTop: "0.65rem" }}>
                      Scholarly reference
                    </strong>
                    <ul>
                      {card.scholarship.map((s) => (
                        <li key={s.url}>
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {s.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <Link href="/methodology/">Methods →</Link>
        {" · "}
        <Link href="/cite/">Cite &amp; learn →</Link>
        {" · "}
        <Link href="/coverage/">Coverage &amp; scope →</Link>
        {" · "}
        <Link href="/famous/">Famous passages →</Link>
        {" · "}
        <Link href="/">← Back to timeline</Link>
      </footer>
    </main>
  );
}
