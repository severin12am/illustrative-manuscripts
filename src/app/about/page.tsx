import type { Metadata } from "next";
import Link from "next/link";
import { TIMELINE_START, TIMELINE_END } from "@/data/witnesses";
import styles from "./about.module.css";

const GITHUB =
  "https://github.com/severin12am/illustrative-manuscripts";

export const metadata: Metadata = {
  title: "About — Illustrative Manuscripts",
  description:
    "What Illustrative Manuscripts is: an open, illustrative early-window census of biblical and related witnesses — not a full INTF Liste or critical edition.",
};

export default function AboutPage() {
  return (
    <main className={styles.main} data-doc-page="true">
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Open teaching tool</p>
        <h1 className={styles.title}>About this project</h1>
        <p className={styles.lead}>
          <strong>Illustrative Manuscripts</strong> is a static, GitHub Pages site
          that lines up dated witness cards, a bounded Greek New Testament
          word-level census (CNTR vs SR GNT), and hand-curated Qurʾān, Hebrew/LXX,
          and Nag Hammadi catalog slices. It is meant for classrooms and honest
          debate prep — not to replace INTF, NA28/ECM, Corpus Coranicum, or
          holding-library viewers.
        </p>
      </header>

      <section className={styles.section} aria-labelledby="windows-title">
        <h2 id="windows-title" className={styles.sectionTitle}>
          Time windows (what is in vs out)
        </h2>
        <p className={styles.sectionIntro}>
          Each corpus uses a published overlap rule on the timeline. We do not
          silently widen windows to inflate counts.
        </p>
        <ul className={styles.bulletList}>
          <li>
            <strong>Greek New Testament:</strong> {TIMELINE_START}–{TIMELINE_END}{" "}
            CE — Liste papyri plus select majuscules (e.g. 01, 03), not the full
            manuscript tradition.
          </li>
          <li>
            <strong>Qurʾān:</strong> ~1–100 AH (622–719 CE overlap) — Hijazi-era
            catalog seed aligned with Corpus Coranicum metadata; not every later
            Kufic display mushaf.
          </li>
          <li>
            <strong>Hebrew Bible &amp; Septuagint:</strong> 250 BCE – 400 CE for
            this corpus only — DSS and LXX papyri/codices in the seed, not BHQ or
            Rahlfs apparatus dumps.
          </li>
          <li>
            <strong>Nag Hammadi:</strong> ~300–400 CE codex paleography — selected
            tractate cards with IIIF embeds, not a Coptic variant census.
          </li>
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="sources-title">
        <h2 id="sources-title" className={styles.sectionTitle}>
          Data sources (high level)
        </h2>
        <p className={styles.sectionIntro}>
          Committed JSON and open scripts on{" "}
          <a href={GITHUB} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          . Image policy: Wikimedia Commons PD/CC plates we can host; institutional
          IIIF or NTVMR links when terms require it. Details per witness live in{" "}
          <a href={`${GITHUB}/blob/main/DATA.md`}>DATA.md</a>.
        </p>
        <ul className={styles.bulletList}>
          <li>
            Greek NT dates &amp; papyrus spine — INTF{" "}
            <em>Kurzgefasste Liste</em> (cached export)
          </li>
          <li>
            Greek transcriptions &amp; mechanical variation units — CNTR vs SR GNT
            (CC-licensed)
          </li>
          <li>
            Qurʾān catalog metadata — Corpus Coranicum–aligned seed; Arabic/English
            reference lines via open Tanzil API (rasm comparison, not traced
            facsimiles on every card)
          </li>
          <li>
            Hebrew/LXX &amp; Nag Hammadi — hand-curated seeds with open diplomatic
            excerpts where licensed (Coptic Scriptorium, PD facsimile plates, etc.)
          </li>
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="next-title">
        <h2 id="next-title" className={styles.sectionTitle}>
          Read next
        </h2>
        <div className={styles.linkGrid}>
          <Link href="/methodology/">Methods (scope &amp; reproducibility)</Link>
          <Link href="/status/">Site status (honest counts &amp; limits)</Link>
          <Link href="/cite/">Cite &amp; learn</Link>
          <Link href="/use/">Use &amp; claims</Link>
          <Link href="/coverage/">Coverage &amp; downloads</Link>
          <Link href="/teach/">Teaching briefs</Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <Link href="/">← Timeline</Link>
        {" · "}
        <Link href="/status/">Status</Link>
        {" · "}
        <Link href="/methodology/">Methods</Link>
      </footer>
    </main>
  );
}
