import type { Metadata } from "next";
import Link from "next/link";
import NagHammadiEvidenceMap from "@/components/NagHammadiEvidenceMap";
import { coverage } from "@/data/coverage";
import { nagHammadiWitnesses } from "@/data/nag-hammadi-witnesses";
import {
  NAG_HAMMADI_TIMELINE_START,
  NAG_HAMMADI_TIMELINE_END,
} from "@/data/nag-hammadi-witnesses";
import { TIMELINE_START, TIMELINE_END } from "@/data/witnesses";
import styles from "./evidence.module.css";

export const metadata: Metadata = {
  title: "Nag Hammadi evidence map — Illustrative Manuscripts",
  description:
    "What the Nag Hammadi library is, how fourth-century Coptic codices relate to the Greek New Testament timeline on this site, and links to 18 tractate witness cards.",
};

const WINDOW_LABEL = `${NAG_HAMMADI_TIMELINE_START}–${NAG_HAMMADI_TIMELINE_END} CE`;

export default function NagHammadiEvidencePage() {
  const { nag_hammadi: nh } = coverage;

  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Nag Hammadi library · {WINDOW_LABEL}</p>
        <h1 className={styles.title}>Evidence map &amp; scope</h1>
        <p className={styles.lead}>
          The Nag Hammadi corpus on this site is a hand-curated timeline of{" "}
          <strong>{nh.tractate_witness_count}</strong> tractate witnesses from
          multiple codices (I, II–VI, XIII in our seed) — Coptic diplomatic text,
          English excerpts, and Claremont IIIF embeds when permitted. It does{" "}
          <strong>not</strong> reproduce the full 52-tractate library apparatus or
          collate Thomas against the Gospel of John. Use the map below, then open
          cards on the{" "}
          <Link href="/?corpus=nag-hammadi">Nag Hammadi timeline</Link>.
        </p>
      </header>

      <NagHammadiEvidenceMap showHeading={false} />

      <section className={styles.essay} id="library">
        <h2 className={styles.essayTitle}>1 · What the library is</h2>
        <div className={styles.essayBody}>
          <p>
            In December 1945, peasants at Jabal al-Tarif near Nag Hammadi, Upper
            Egypt, found a sealed jar containing leather-bound Coptic codices —
            the famous Nag Hammadi library. Standard handbooks (e.g. Robinson,{" "}
            <em>The Nag Hammadi Library in English</em>; Layton&apos;s NHS volumes)
            describe <strong>thirteen codices</strong> with fifty-two tractates
            total, copied in Sahidic Coptic on papyrus, with paleographic dates
            clustering around the <strong>mid fourth century CE</strong> for the
            physical books.
          </p>
          <p>
            Individual tractates may have been composed earlier (often 2nd–4th c.
            in scholarly dating). Our witness cards date the <strong>codex
            copies</strong> in the {WINDOW_LABEL} window — the same discipline we
            use for paleographic NT papyri — not a single composition year for
            every text.
          </p>
          <p>
            Images on this site come from the{" "}
            <a
              href="https://ccdl.claremont.edu/digital/collection/nha/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Claremont Nag Hammadi Archive
            </a>{" "}
            (IIIF embed only; holding institutions retain rights). Diplomatic
            Coptic follows open editions where noted on each card (e.g. Coptic
            Scriptorium).
          </p>
          <div className={styles.witnessLinks}>
            <Link href="/?corpus=nag-hammadi">Full timeline ({nh.tractate_witness_count} tractates)</Link>
            <Link href="/coverage/">Coverage counts</Link>
            <Link href="/methodology/#nag-hammadi-evidence">Methods: corpus boundaries</Link>
          </div>
        </div>
      </section>

      <section className={styles.essay} id="not-lost-nt">
        <h2 className={styles.essayTitle}>2 · Not “lost books of the New Testament”</h2>
        <div className={styles.essayBody}>
          <p>
            Debates about canon and diversity often treat Nag Hammadi as a stash of
            &ldquo;lost Gospels.&rdquo; That framing blurs genres. Most tractates are
            Gnostic or apocryphal Christian treatises in Coptic — not uncatalogued
            Greek copies of Matthew–Revelation in the stream this site collates
            against CNTR ({TIMELINE_START}–{TIMELINE_END} CE).
          </p>
          <p>
            Some titles overlap material also known from Greek fragments (Gospel of
            Thomas is the classroom example). That overlap supports careful
            historical claims about early Christian literature — it does{" "}
            <strong>not</strong> mean our site runs a Thomas↔John variant census.
            Church lists debated individual works; they were not treated as
            interchangeable with the Greek NT manuscript tradition on INTF timelines.
          </p>
          <div className={styles.witnessLinks}>
            <Link href="/use/#nag-hammadi-lost-nt-books">Claim card: NH = lost NT books</Link>
            <Link href="/teach/nag-hammadi-vs-canon/">Teaching brief</Link>
            <Link href="/?corpus=nt#p52">P52 (Greek John fragment) for contrast</Link>
          </div>
        </div>
      </section>

      <section className={styles.essay} id="vs-greek-nt">
        <h2 className={styles.essayTitle}>3 · How to use vs the Greek NT timeline</h2>
        <div className={styles.essayBody}>
          <p>
            <strong>Genre &amp; content notes, not verse collation.</strong> Switch
            corpora on the home timeline: Greek NT for CNTR-aligned disagreement
            counts and the <Link href="/variants/">variant explorer</Link>; Nag
            Hammadi for Coptic tractate cards. Compare mentally — e.g. Thomas
            logia beside an early Greek gospel fragment — but do not cite our NH
            excerpts as if they were rows in the Greek NT census.
          </p>
          <p>
            The <Link href="/compare/">Compare</Link> tool remains Greek NT only.
            Famous block passages ({TIMELINE_START}–{TIMELINE_END} CE canonical
            issues) live on <Link href="/famous/">Famous passages</Link>, separate
            from both NH and the word-level census.
          </p>
          <p>{nh.collation_note}</p>
        </div>
      </section>

      <section className={styles.essay} id="tractates">
        <h2 className={styles.essayTitle}>
          4 · Tractates in our seed ({nagHammadiWitnesses.length})
        </h2>
        <div className={styles.essayBody}>
          <p>
            Each link opens the tractate witness card on the Nag Hammadi timeline
            (metadata, IIIF, diplomatic excerpt). This is not an exhaustive list of
            all fifty-two Nag Hammadi tractates — only what we have seeded with
            licensed images and text.
          </p>
          <ul className={styles.tractateList}>
            {nagHammadiWitnesses.map((w) => (
              <li key={w.id}>
                <Link href={`/?corpus=nag-hammadi#${w.id}`}>
                  {w.traditional_name}
                </Link>
                <span className={styles.tractateSiglum}> · {w.ga_number}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <aside className={styles.callout}>
        <strong>Scope reminder:</strong> {nh.collation_note} Pair with{" "}
        <Link href="/methodology/#nag-hammadi-evidence">Methods</Link>,{" "}
        <Link href="/teach/nag-hammadi-vs-canon/">teaching brief</Link>, and{" "}
        <Link href="/use/#nag-hammadi-lost-nt-books">claim discipline</Link>.
      </aside>

      <footer className={styles.footer}>
        <Link href="/?corpus=nag-hammadi">← Nag Hammadi timeline</Link>
        {" · "}
        <Link href="/coverage/">Coverage</Link>
        {" · "}
        <Link href="/use/">Use &amp; claims</Link>
      </footer>
    </main>
  );
}
