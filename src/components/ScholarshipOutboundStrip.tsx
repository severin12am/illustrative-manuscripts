import Link from "next/link";
import { greekNtScholarshipLinks } from "@/lib/witnessOutbound";
import styles from "./WitnessOutboundBar.module.css";

interface ScholarshipOutboundStripProps {
  /** Show link to /sources/#greek-nt and /status/#ehrman-grade. */
  showSiteAnchors?: boolean;
}

export default function ScholarshipOutboundStrip({
  showSiteAnchors = true,
}: ScholarshipOutboundStripProps) {
  return (
    <nav
      className={styles.bar}
      aria-label="Published Greek NT scholarship (outbound)"
    >
      <span className={styles.kicker}>Still use for primary work</span>
      <div className={styles.actions}>
        {greekNtScholarshipLinks.map((l) => (
          <a
            key={l.href + l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.chip}
          >
            {l.label}
          </a>
        ))}
        {showSiteAnchors && (
          <>
            <Link href="/sources/#greek-nt" className={styles.chip}>
              Open sources hub
            </Link>
            <Link href="/status/#ehrman-grade" className={styles.chip}>
              What this site is not
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
