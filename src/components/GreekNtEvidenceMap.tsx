import Link from "next/link";
import { coverage } from "@/data/coverage";
import { TIMELINE_START, TIMELINE_END } from "@/data/witnesses";
import styles from "./GreekNtEvidenceMap.module.css";

type Props = {
  /** Compact grid under “Start here”; full block on Coverage. */
  variant?: "compact" | "section";
  className?: string;
};

export default function GreekNtEvidenceMap({
  variant = "section",
  className,
}: Props) {
  const { greek_nt, curated_layers } = coverage;
  const disagreementTotal = greek_nt.disagreements.total;
  const famousCount = curated_layers?.famous_passages.count ?? 0;
  const windowLabel = `${TIMELINE_START}–${TIMELINE_END} CE`;

  const cards = [
    {
      href: "/",
      layer: "Layer 1",
      title: "Timeline witnesses",
      desc: `Paleographic catalog cards for Greek NT papyri and select uncials overlapping ${windowLabel} — photographs when we can host them.`,
      stat: `${greek_nt.witness_count} witnesses · ${greek_nt.leaf_image_count} with leaf image`,
    },
    {
      href: "/variants/",
      layer: "Layer 2",
      title: "Word-level variant census",
      desc: "Mechanical word-aligned disagreements vs open SR GNT (CNTR transcriptions) — browsable explorer and downloadable rows.",
      stat: `${disagreementTotal.toLocaleString()} variation units vs SR GNT`,
    },
    {
      href: "/famous/",
      layer: "Layer 3",
      title: "Famous block passages",
      desc: "Pericope Adulterae, longer endings, Comma Johanneum, and similar block-level teaching cards — not rows in the word census.",
      stat: `${famousCount} curated passages`,
    },
    {
      href: "/use/",
      layer: "Layer 4",
      title: "Use & claims",
      desc: "Claim discipline for debaters and syllabi — what our bounded slice supports and what it does not.",
      stat: "Pathways + verdict cards",
    },
  ];

  const wrapClass =
    variant === "compact"
      ? `${styles.wrap} ${styles.wrapCompact}${className ? ` ${className}` : ""}`
      : `${styles.wrap} ${styles.sectionBlock}${className ? ` ${className}` : ""}`;

  const HeadingTag = variant === "compact" ? "h2" : "h3";

  return (
    <section className={wrapClass} aria-labelledby="greek-nt-evidence-map-title">
      <HeadingTag id="greek-nt-evidence-map-title" className={styles.heading}>
        Greek NT evidence map ({windowLabel})
      </HeadingTag>
      {variant === "section" && (
        <p className={styles.intro}>
          Four discoverable layers on this site — mirror how Qurʾān routes catalog, rasm,
          and archetype separately. Pair with{" "}
          <Link href="/methodology/#greek-evidence-layers">Methods</Link> and{" "}
          <Link href="/coverage/">Coverage</Link> before citing counts.
        </p>
      )}
      <div
        className={`${styles.grid}${variant === "compact" ? ` ${styles.gridCompact}` : ""}`}
      >
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className={styles.card}>
            <span className={styles.cardLayer}>{card.layer}</span>
            <span className={styles.cardTitle}>{card.title}</span>
            <span className={styles.cardDesc}>{card.desc}</span>
            <span className={styles.cardStat}>{card.stat}</span>
          </Link>
        ))}
      </div>
      {variant === "section" && (
        <p className={styles.footerNote}>
          Experimental intentional tags on a bounded sample are{" "}
          <strong>provisional</strong> — see{" "}
          <Link href="/coverage/">Coverage</Link> and{" "}
          <Link href="/methodology/#greek-evidence-layers">Methods</Link>. Not
          ECM/NA judgments. For Liste, full CNTR, and apparatus work, wire out via{" "}
          <Link href="/sources/#greek-nt">Open sources</Link> and{" "}
          <Link href="/status/#ehrman-grade">Site status § Ehrman-grade</Link> (
          <Link href="/teach/when-to-leave-for-intf-ecm/">teaching brief</Link>
          ).
        </p>
      )}
    </section>
  );
}
