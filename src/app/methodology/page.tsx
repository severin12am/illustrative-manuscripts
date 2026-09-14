import type { Metadata } from "next";
import Link from "next/link";
import { TIMELINE_START, TIMELINE_END } from "@/data/witnesses";
import styles from "./methodology.module.css";

const GITHUB =
  "https://github.com/severin12am/illustrative-manuscripts";

export const metadata: Metadata = {
  title: "Methods — Illustrative Manuscripts",
  description:
    "Scope windows, Greek variation-unit definitions, curated vs computed layers, image licensing, reproducibility scripts, and known limitations for researchers citing this site.",
};

export default function MethodologyPage() {
  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>For researchers &amp; instructors</p>
        <h1 className={styles.title}>Methods</h1>
        <p className={styles.lead}>
          A short methods statement for papers and syllabi: what corpora we
          include, how Greek counts are produced, which layers are hand-curated
          vs build-time aggregates, and how to reproduce the numbers. Pair this
          page with{" "}
          <Link href="/coverage/">Coverage &amp; scope</Link>,{" "}
          <Link href="/cite/">Cite &amp; learn</Link>, and{" "}
          <Link href="/use/">Use this site</Link> for claim discipline.
        </p>
      </header>

      <section className={styles.section} id="scope">
        <h2 className={styles.sectionTitle}>Corpus scope (time windows)</h2>
        <p className={styles.sectionIntro}>
          Each tradition on the timeline uses a published overlap window — not
          “every manuscript ever.” Details and witness counts live in{" "}
          <Link href="/coverage/">Coverage</Link> and{" "}
          <a href={`${GITHUB}/blob/main/DATA.md`}>DATA.md</a>.
        </p>
        <dl className={styles.defList}>
          <div className={styles.defItem}>
            <dt>Greek New Testament</dt>
            <dd>
              Witnesses whose paleographic or catalog range overlaps{" "}
              <strong>
                {TIMELINE_START}–{TIMELINE_END} CE
              </strong>{" "}
              (frozen window). Papyri from INTF Liste cache; majuscules from{" "}
              <code>scripts/uncial-seed.json</code>. Not the full ~5,700+ witness
              tradition.
            </dd>
          </div>
          <div className={styles.defItem}>
            <dt>Qurʾān (Hijazi catalog)</dt>
            <dd>
              <strong>1–100 AH</strong> (~622–719 CE overlap) for dated or
              overlapping leaves in <code>scripts/quran-seed.json</code> (Corpus
              Coranicum–aligned metadata). Later display mushafs are generally
              excluded unless their published range genuinely overlaps.
            </dd>
          </div>
          <div className={styles.defItem}>
            <dt>Hebrew Bible &amp; Septuagint</dt>
            <dd>
              <strong>250 BCE – 400 CE</strong> for this corpus only (BCE allowed
              on the Hebrew/LXX timeline). Hand-curated DSS and LXX papyri in{" "}
              <code>scripts/hebrew-lxx-seed.json</code> — not BHQ or Rahlfs
              apparatus dumps.
            </dd>
          </div>
          <div className={styles.defItem}>
            <dt>Nag Hammadi</dt>
            <dd>
              Codex-level witnesses positioned by <strong>paleography</strong>{" "}
              (~300–400 CE overlap) from the Claremont NHA catalog seed — catalog
              cards, not a Coptic variant census.
            </dd>
          </div>
        </dl>
      </section>

      <section className={styles.section} id="greek-units">
        <h2 className={styles.sectionTitle}>
          Greek NT variation units (CNTR vs SR GNT)
        </h2>
        <p className={styles.sectionIntro}>
          Our Greek NT explorer and downloadable census compare{" "}
          <strong>committed diplomatic transcriptions</strong> from{" "}
          <a href="https://greekcntr.org/">CNTR</a> to the open{" "}
          <strong>Society of Biblical Literature Greek New Testament (SR GNT)</strong>,
          also sourced from CNTR. This is a mechanical, word-aligned disagreement
          count — not the Nestle-Aland 28th edition apparatus.
        </p>
        <dl className={styles.defList}>
          <div className={styles.defItem}>
            <dt>Unit definition</dt>
            <dd>
              One <strong>word-aligned variation unit</strong> is a single aligned
              word position where a witness&apos;s surviving letters disagree with
              SR GNT (spelling, omission, addition, substitution, etc.). Units
              are classified by kind via <code>scripts/lib/variant-classify.mjs</code>.
            </dd>
          </div>
          <div className={styles.defItem}>
            <dt>Fragment-safe counting</dt>
            <dd>
              We count only extant text on each witness — lacunae and broken edges
              do not generate false disagreements. Compare logic respects per-verse
              availability in <code>src/data/witness-texts.json</code>.
            </dd>
          </div>
          <div className={styles.defItem}>
            <dt>Exports</dt>
            <dd>
              Flat browse index: <code>src/data/variant-index.json</code>.
              Researcher-facing rows:{" "}
              <code>public/variant-census.json</code> /{" "}
              <code>public/variant-census.csv</code> (see{" "}
              <Link href="/cite/#for-researchers">Cite → For researchers</Link>
              ).
            </dd>
          </div>
        </dl>
      </section>

      <section className={styles.section} id="layers">
        <h2 className={styles.sectionTitle}>Curated vs computed layers</h2>
        <dl className={styles.defList}>
          <div className={styles.defItem}>
            <dt>Computed at build time</dt>
            <dd>
              Greek disagreement totals, per-book summaries, variant index, SR
              witness ESN export, and coverage aggregates in{" "}
              <code>src/data/coverage.json</code>.
            </dd>
          </div>
          <div className={styles.defItem}>
            <dt>Famous passages (hand-curated)</dt>
            <dd>
              Block-level cards for debaters and classrooms in{" "}
              <code>scripts/famous-passages.json</code> →{" "}
              <code>src/data/famous-passages.json</code>. Verified by{" "}
              <code>npm run famous-passages</code>; not an exhaustive apparatus.
            </dd>
          </div>
          <div className={styles.defItem}>
            <dt>Use / claims hub (hand-curated)</dt>
            <dd>
              Claim discipline and audience routes in{" "}
              <code>scripts/claims-evidence.json</code> (synced to{" "}
              <code>src/data/</code> by the famous-passages script). Verdicts
              describe <em>this site&apos;s scope</em>, not every field debate.
            </dd>
          </div>
          <div className={styles.defItem}>
            <dt>Uthmanic regional rasm (hand-curated)</dt>
            <dd>
              Illustrative table of published regional muṣḥaf reports (~35–40 in
              Cook / van Putten summaries) in{" "}
              <code>scripts/uthmani-regional-variants.json</code> — currently{" "}
              <strong>40</strong> curated examples with per-region rasm glosses
              and source citations, aligned to that published total band without
              inventing extra reports. We cite published totals and secondary
              collations — we have <strong>not</strong> re-census every rasm
              report against every leaf in our Qurʾān seed. See{" "}
              <Link href="/quran/uthmani/">Uthmanic regional rasm</Link>.
            </dd>
          </div>
          <div className={styles.defItem}>
            <dt>Intentional-response tags (provisional)</dt>
            <dd>
              Optional LLM/heuristic labels on a bounded Greek NT sample. Treat
              as hypotheses unless tagged with a model-judged pipeline; see
              Coverage for tagging limits.
            </dd>
          </div>
        </dl>
      </section>

      <section className={styles.section} id="images">
        <h2 className={styles.sectionTitle}>Image licensing policy</h2>
        <p className={styles.sectionIntro}>
          Leaf photos are shown only when we can host or link responsibly.
        </p>
        <ul className={styles.limitList}>
          <li>
            <strong>Hosted plates:</strong> Wikimedia Commons and other openly
            licensed facsimile scans in <code>public/witnesses/</code>, each with
            a <code>.attribution.json</code> sidecar (author, license, source
            URL).
          </li>
          <li>
            <strong>Link-only:</strong> Holding-institution viewers (Vatican,
            BL, Leon Levy DSS, etc.) when reuse is restricted — metadata still
            cites INTF, Corpus Coranicum, or the holding library as documented
            on witness cards.
          </li>
          <li>
            <strong>Not rehosted:</strong> Copyrighted reading-room photography,
            NA28/NIV/ESV text, or proprietary critical editions.
          </li>
        </ul>
      </section>

      <section className={styles.section} id="reproduce">
        <h2 className={styles.sectionTitle}>Reproducibility (npm scripts)</h2>
        <p className={styles.sectionIntro}>
          After changing seeds or CNTR-derived JSON, regenerate and commit
          outputs before publishing.
        </p>
        <ul className={styles.scriptList}>
          <li>
            <code>npm run data</code> — refresh Liste cache + witness generation
            spine (when NTVMR reachable).
          </li>
          <li>
            <code>npm run texts</code> — rebuild{" "}
            <code>src/data/witness-texts.json</code> from CNTR exports.
          </li>
          <li>
            <code>npm run reclassify</code> — re-run variant classifier on
            committed transcriptions.
          </li>
          <li>
            <code>npm run coverage</code> — write{" "}
            <code>src/data/coverage.json</code> aggregates.
          </li>
          <li>
            <code>npm run variant-index</code> — write{" "}
            <code>src/data/variant-index.json</code>.
          </li>
          <li>
            <code>npm run export-census</code> — write{" "}
            <code>public/variant-census.json</code> /{" "}
            <code>.csv</code> (also runs in <code>prebuild</code>).
          </li>
          <li>
            <code>npm run export-curated</code> — copy famous-passages and
            Uthmanic rasm JSON to <code>public/</code> (also runs in{" "}
            <code>prebuild</code>).
          </li>
          <li>
            <code>npm run famous-passages</code> — verify famous cards + sync
            claims JSON.
          </li>
          <li>
            <code>npm run uthmani-regional</code> — validate + copy Uthmanic
            rasm table to <code>src/data/</code>.
          </li>
          <li>
            <code>npm run quran</code> / <code>npm run hebrew-lxx</code> /{" "}
            <code>npm run nag-hammadi</code> — tradition-specific JSON builds.
          </li>
        </ul>
      </section>

      <section className={styles.section} id="limitations">
        <h2 className={styles.sectionTitle}>Known limitations</h2>
        <ul className={styles.limitList}>
          <li>
            Not a full INTF Liste mirror, NA28/ECM apparatus, or tradition-scale
            Greek NT variant total (cf. Gurry/Ehrman scope notes on Coverage).
          </li>
          <li>
            Qurʾān, Hebrew/LXX, and Nag Hammadi timelines are{" "}
            <strong>catalog + excerpt</strong> layers — no mechanical word census
            comparable to Greek NT yet.
          </li>
          <li>
            Uthmanic rasm rows follow published regional reports (Cook 2004;
            al-Dānī summaries; Alrahawan &amp; Said 2021 collation, etc.) — not
            a complete digital re-count of all ~40 loci.
          </li>
          <li>
            Intentional tags remain <strong>provisional</strong>; do not cite
            them as established text-critical judgments.
          </li>
          <li>
            English glosses on cards (WEB, Pickthall, etc.) are labeled PD
            reference translations — not diplomatic text.
          </li>
        </ul>
      </section>

      <footer className={styles.footer}>
        <Link href="/cite/">Cite &amp; learn →</Link>
        {" · "}
        <Link href="/coverage/">Coverage &amp; scope →</Link>
        {" · "}
        <Link href="/use/">Use this site →</Link>
        {" · "}
        <Link href="/">← Back to timeline</Link>
      </footer>
    </main>
  );
}
