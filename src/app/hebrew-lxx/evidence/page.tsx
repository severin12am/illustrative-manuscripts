import type { Metadata } from "next";
import Link from "next/link";
import HebrewLxxEvidenceMap from "@/components/HebrewLxxEvidenceMap";
import { coverage } from "@/data/coverage";
import styles from "./evidence.module.css";

export const metadata: Metadata = {
  title: "Hebrew Bible & Septuagint evidence map — Illustrative Manuscripts",
  description:
    "Three evidence traditions for the Old Testament on this site: Dead Sea Scrolls Hebrew, medieval Masoretic Text, and early Jewish Septuagint — with links to witness cards and claim discipline.",
};

export default function HebrewLxxEvidencePage() {
  const { hebrew_lxx: hl } = coverage;

  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Hebrew Bible &amp; LXX · {hl.window_label}</p>
        <h1 className={styles.title}>Three evidence traditions</h1>
        <p className={styles.lead}>
          The Hebrew/LXX corpus on this site is a hand-curated timeline of{" "}
          {hl.witness_count} witnesses ({hl.hebrew_dss_count} Hebrew DSS +{" "}
          {hl.greek_lxx_count} Greek LXX) overlapping {hl.window_label}. It does{" "}
          <strong>not</strong> reproduce BHQ, Göttingen, or Leon Levy full plates —
          only illustrative cards, licensed images, and diplomatic excerpts paired
          with WEB English. Use the map below to see what each tradition answers,
          then open witness cards on the{" "}
          <Link href="/?corpus=hebrew-lxx">Hebrew / LXX timeline</Link>.
        </p>
      </header>

      <HebrewLxxEvidenceMap showHeading={false} />

      <section className={styles.essay} id="dss">
        <h2 className={styles.essayTitle}>1 · Dead Sea Scrolls and early Hebrew</h2>
        <div className={styles.essayBody}>
          <p>
            Qumran and related Judean Desert finds give Hebrew (and some Aramaic)
            copies of biblical books from roughly the second century BCE through
            the first century CE — more than a millennium before typical medieval
            Masoretic codices. Handbook summaries (e.g. Tov,{" "}
            <em>Textual Criticism of the Hebrew Bible</em>) describe both{" "}
            <strong>textual diversity</strong> across the scrolls and{" "}
            <strong>substantial agreement</strong> with the later MT in many books.
          </p>
          <p>
            The Great Isaiah Scroll (1QIsaᵃ) is the classic classroom example: it
            agrees with the Masoretic book of Isaiah far more often than it
            disagrees, while still preserving thousands of spelling variants and
            documented differences elsewhere in the DSS corpus. That pattern supports
            careful claims about continuity — not &ldquo;the Bible never changed.&rdquo;
          </p>
          <p>
            On this site, open DSS cards for metadata, Leon Levy links, and excerpt
            notes — not an automated verse-by-verse collation against Leningrad.
          </p>
          <div className={styles.witnessLinks}>
            <Link href="/?corpus=hebrew-lxx#1qisaa">1QIsaᵃ</Link>
            <Link href="/?corpus=hebrew-lxx#nash-papyrus">Nash Papyrus</Link>
            <Link href="/?corpus=hebrew-lxx#mur-88">Mur 88 (Isaiah)</Link>
            <Link href="/use/#1qisa-proves-never-changed">Claim: 1QIsaᵃ (partial)</Link>
            <Link href="/use/#ot-unattested-before-medieval">Claim: not only medieval</Link>
          </div>
        </div>
      </section>

      <section className={styles.essay} id="mt">
        <h2 className={styles.essayTitle}>2 · Masoretic Text (medieval standard)</h2>
        <div className={styles.essayBody}>
          <p>
            The Masoretic Text is the consonantal-plus-vocalized Hebrew standard
            behind most modern Jewish and Protestant Old Testaments — stabilized
            through medieval scribal schools and best represented in scholarly
            editions by codices such as Leningrad (BHS/BHQ). Those codices are{" "}
            <strong>late</strong> relative to Qumran, the Second Temple period, and
            the first-century Mediterranean world.
          </p>
          <p>
            Jesus and his contemporaries did not hold a printed Leningrad Codex.
            Debates that equate &ldquo;the Hebrew Bible Jesus used&rdquo; with every
            consonant of a tenth-century manuscript overclaim what paleography and
            scroll evidence can prove — while debates that ignore MT entirely
            understate how much pre-Christian Hebrew already aligns with the later
            standard in many passages.
          </p>
          <p>
            Our timeline window ({hl.window_label}) intentionally hosts{" "}
            <strong>earlier</strong> witnesses. MT appears here as context and claim
            discipline, not as facsimile cards in the seed.
          </p>
          <div className={styles.witnessLinks}>
            <Link href="/use/#mt-identical-jesus-read">Claim: MT identical to Jesus (partial)</Link>
            <Link href="/teach/dss-vs-mt/">Teaching brief: DSS vs MT</Link>
            <Link href="/coverage/">Coverage: Hebrew/LXX limits</Link>
          </div>
        </div>
      </section>

      <section className={styles.essay} id="lxx">
        <h2 className={styles.essayTitle}>3 · Septuagint (early Jewish Greek)</h2>
        <div className={styles.essayBody}>
          <p>
            The Septuagint tradition is the ancient Greek translation stream of
            Jewish scripture — attested on papyri and rolls long before the major
            Christian recensions. Standard catalogues (Rahlfs; Göttingen
            Septuaginta) cite pre-Christian witnesses such as{" "}
            <strong>P.Ryl. 458</strong> (Genesis), <strong>P.Fouad 266</strong>{" "}
            (Deuteronomy), and <strong>P.Oxy. 1007</strong> (Exodus) in our seed
            metadata. Later Christian copies and revisions exist; that is not the
            same as inventing the whole Greek Old Testament in the patristic era.
          </p>
          <p>
            New Testament authors often quote Greek wording that aligns with LXX
            renderings rather than literal MT — so dismissing LXX as irrelevant to
            NT Greek Bible use is also overstated (see claim card). LXX remains a{" "}
            <strong>separate stream</strong> from Hebrew DSS and from the site&apos;s{" "}
            frozen Greek NT compare tool (1–400 CE CNTR only).
          </p>
          <div className={styles.witnessLinks}>
            <Link href="/?corpus=hebrew-lxx&q=P.Ryl">P.Ryl. 458</Link>
            <Link href="/?corpus=hebrew-lxx&q=Fouad">P.Fouad 266</Link>
            <Link href="/?corpus=hebrew-lxx&q=1007">P.Oxy. 1007</Link>
            <Link href="/use/#lxx-late-christian-invention">Claim: not a late invention</Link>
            <Link href="/use/#lxx-irrelevant-nt-authors">Claim: LXX &amp; NT authors</Link>
          </div>
        </div>
      </section>

      <aside className={styles.callout}>
        <strong>Scope reminder:</strong> {hl.corpus_note} Pair this page with{" "}
        <Link href="/methodology/#hebrew-lxx-evidence-traditions">Methods</Link>,{" "}
        <Link href="/teach/hebrew-lxx-three-traditions/">teaching brief</Link>, and{" "}
        <Link href="/compare/">Compare</Link> (Greek NT only — not LXX↔NT collation).
      </aside>

      <footer className={styles.footer}>
        <Link href="/?corpus=hebrew-lxx">← Hebrew / LXX timeline</Link>
        {" · "}
        <Link href="/coverage/">Coverage</Link>
        {" · "}
        <Link href="/use/">Use &amp; claims</Link>
      </footer>
    </main>
  );
}
