import type { Metadata } from "next";
import Link from "next/link";
import IntentionalTagsProvisionalNotice from "@/components/IntentionalTagsProvisionalNotice";
import { coverage } from "@/data/coverage";
import { claimsEvidence } from "@/data/claims-evidence";
import { TIMELINE_START, TIMELINE_END } from "@/data/witnesses";
import styles from "./status.module.css";

export const metadata: Metadata = {
  title: "Site status — Illustrative Manuscripts",
  description:
    "Finish-readiness hub: what Illustrative Manuscripts can answer per corpus, honest limits, and computed counts before you cite or debate from this site.",
};

export default function SiteStatusPage() {
  const {
    greek_nt,
    quran,
    hebrew_lxx,
    nag_hammadi,
    curated_layers,
    generated_at,
  } = coverage;
  const claimCount = claimsEvidence.claims.length;
  const disagreementTotal = greek_nt.disagreements.total;
  const famousCount = curated_layers?.famous_passages.count ?? 0;
  const uthmaniCount = curated_layers?.uthmani_regional_rasm.count ?? 0;
  const archetypeCount = curated_layers?.quran_shared_orthography?.count ?? 0;
  const teachCount = curated_layers?.teach_briefs.count ?? 0;

  return (
    <main className={styles.main} data-doc-page="true">
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Before you cite or email</p>
        <h1 className={styles.title}>Site status</h1>
        <p className={styles.lead}>
          A single honesty checkpoint for researchers, students, and debaters: what
          this GitHub Pages site <strong>can</strong> support from committed data,
          what it <strong>does not</strong> claim, and where to start. Pair with{" "}
          <Link href="/use/">Use &amp; claims</Link>,{" "}
          <Link href="/methodology/">Methods</Link>, and{" "}
          <Link href="/coverage/">Coverage</Link> — numbers below are from{" "}
          <code>src/data/coverage.json</code>, not invented for outreach.
        </p>
        <p className={styles.meta}>
          Coverage last computed:{" "}
          {new Date(generated_at).toLocaleString("en-GB", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </header>

      <section
        className={styles.publishedTools}
        aria-labelledby="published-tools-title"
        id="published-tools"
      >
        <h2 id="published-tools-title" className={styles.sectionTitle}>
          What published tools still give you
        </h2>
        <p className={styles.sectionIntro}>
          Think of this GitHub Pages build as a teaching layer on top of wheels
          scholars already published — not a replacement for the Liste, full CNTR,
          or critical editions. Wire out for real work; use our site for bounded
          slices and curated cards. Full bibliography:{" "}
          <Link href="/sources/">Open sources hub</Link>.
        </p>
        <div className={styles.twoCol}>
          <div className={styles.col}>
            <h4>This site (Illustrative Manuscripts)</h4>
            <ul>
              <li>
                Greek NT mechanical census — {disagreementTotal.toLocaleString()}{" "}
                word-aligned units vs open SR GNT in a{" "}
                {TIMELINE_START}–{TIMELINE_END} CE CNTR witness slice (
                {greek_nt.witness_count} catalogued witnesses).
              </li>
              <li>
                {famousCount} block-level <Link href="/famous/">Famous passages</Link>{" "}
                with CNTR witness status in our window.
              </li>
              <li>
                Qurʾān: {uthmaniCount} illustrative{" "}
                <Link href="/quran/uthmani/">Uthmanic rasm</Link> rows (Cook / Sidky
                framing) and {archetypeCount}{" "}
                <Link href="/quran/archetype/">niʿmat</Link> matrix rows (van Putten
                2019 Table 2).
              </li>
              <li>
                Timeline catalog cards, claim discipline, teaching briefs — honest
                aggregates from <code>coverage.json</code>.
              </li>
            </ul>
          </div>
          <div className={styles.col}>
            <h4>Still use for real work</h4>
            <ul>
              <li>
                <a
                  href="https://ntvmr.uni-muenster.de/liste"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  INTF Liste
                </a>{" "}
                /{" "}
                <a
                  href="https://ntvmr.uni-muenster.de/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  NTVMR
                </a>{" "}
                — full manuscript register and workspace.
              </li>
              <li>
                <a href="https://greekcntr.org/" target="_blank" rel="noopener noreferrer">
                  Full CNTR
                </a>{" "}
                (CC BY-SA transcriptions, SR GNT) — beyond our lazy-load slice.
              </li>
              <li>
                <a href="https://igntp.org/" target="_blank" rel="noopener noreferrer">
                  IGNTP
                </a>{" "}
                and other open edition projects where published.
              </li>
              <li>
                NA28 / ECM / UBS — cite and library-access; we do not host apparatus (
                <Link href="/sources/#na28-ecm-ubs">license note</Link>).
              </li>
              <li>
                <a
                  href="https://doi.org/10.1017/S0028688516000216"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Gurry 2016
                </a>{" "}
                (~500k-order tradition estimate;{" "}
                <a
                  href="https://www.repository.cam.ac.uk/bitstreams/fbac7937-110b-48a0-81f5-656677f85d8e/download"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  open accepted MS
                </a>
                ) — not our census number.
              </li>
              <li>
                <a
                  href="https://archive.org/details/novumtestamentum01tisc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tischendorf Editio octava critica maior
                </a>{" "}
                (Internet Archive, PD) — 19th-c. apparatus for famous passages, not ECM (
                <Link href="/sources/#tischendorf-eocm">all volumes</Link>).
              </li>
              <li>
                <a
                  href="https://corpuscoranicum.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Corpus Coranicum
                </a>
                ,{" "}
                <a
                  href="https://ccdl.claremont.edu/digital/collection/nha/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Claremont NHA
                </a>
                , Leon Levy DSS, DigiVatLib — see{" "}
                <Link href="/sources/">Open sources</Link>.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section
        className={styles.ehrmanGrade}
        aria-labelledby="ehrman-grade-title"
        id="ehrman-grade"
      >
        <h2 id="ehrman-grade-title" className={styles.sectionTitle}>
          For Ehrman-grade work, still use…
        </h2>
        <p className={styles.sectionIntro}>
          Textbook-level manuscript criticism and apparatus work still lives in
          published registers and licensed editions — not in our bounded GitHub
          Pages slice. Wire out before you argue tradition scale or cite plate
          numbers.
        </p>
        <ul className={styles.ehrmanList}>
          <li>
            <a
              href="https://ntvmr.uni-muenster.de/liste"
              target="_blank"
              rel="noopener noreferrer"
            >
              INTF Kurzgefasste Liste
            </a>{" "}
            and{" "}
            <a
              href="https://ntvmr.uni-muenster.de/"
              target="_blank"
              rel="noopener noreferrer"
            >
              NTVMR
            </a>{" "}
            for the full Greek NT manuscript census and workspace.
          </li>
          <li>
            <a href="https://greekcntr.org/" target="_blank" rel="noopener noreferrer">
              CNTR
            </a>{" "}
            for complete CC BY-SA transcriptions and SR GNT — beyond our lazy-load
            class-1 subset (gaps listed in{" "}
            <a
              href="https://github.com/severin12am/illustrative-manuscripts/blob/main/DATA.md#cntr-gaps-among-witnesses"
              target="_blank"
              rel="noopener noreferrer"
            >
              DATA.md
            </a>
            ).
          </li>
          <li>
            <a href="https://igntp.org/" target="_blank" rel="noopener noreferrer">
              IGNTP
            </a>{" "}
            and other open edition projects where a book has a published
            apparatus.
          </li>
          <li>
            NA28, ECM, and UBS — library or licensed access for editorial
            judgments; we do not host apparatus (
            <Link href="/sources/#na28-ecm-ubs">license note</Link>).
          </li>
          <li>
            Holding-institution IIIF and catalog viewers for plates we only
            outbound-link — see{" "}
            <Link href="/sources/">Open sources</Link> and witness cards.
          </li>
        </ul>
        <p className={styles.note}>
          What this site adds: curated timeline cards, mechanical disagreements vs
          SR GNT in our window, and teaching layers — summarized in{" "}
          <Link href="/status/#published-tools">Published tools</Link> above.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="counts-title">
        <h2 id="counts-title" className={styles.sectionTitle}>
          Honest counts (from build data)
        </h2>
        <p className={styles.sectionIntro}>
          Regenerate with <code>npm run coverage</code> after witness changes. These
          are the same figures shown on Coverage, not rounded for marketing.
        </p>
        <div className={styles.statGrid}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{greek_nt.witness_count}</span>
            <span className={styles.statLabel}>
              Greek NT witnesses ({TIMELINE_START}–{TIMELINE_END} CE)
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>
              {disagreementTotal.toLocaleString()}
            </span>
            <span className={styles.statLabel}>
              <Link href="/variants/">Variation units</Link> vs SR GNT
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{quran.witness_count}</span>
            <span className={styles.statLabel}>
              <Link href="/?corpus=quran">Qurʾān</Link> catalog leaves
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{hebrew_lxx.witness_count}</span>
            <span className={styles.statLabel}>
              Hebrew / LXX witnesses ({hebrew_lxx.window_label})
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>
              {nag_hammadi.tractate_witness_count}
            </span>
            <span className={styles.statLabel}>Nag Hammadi tractates</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{famousCount}</span>
            <span className={styles.statLabel}>
              <Link href="/famous/">Famous passages</Link>
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{uthmaniCount}</span>
            <span className={styles.statLabel}>
              <Link href="/quran/uthmani/">Uthmanic rasm</Link> examples
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{archetypeCount}</span>
            <span className={styles.statLabel}>
              <Link href="/quran/archetype/">Shared orthography</Link> rows
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{claimCount}</span>
            <span className={styles.statLabel}>
              <Link href="/use/#claims">Claim cards</Link>
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{teachCount}</span>
            <span className={styles.statLabel}>
              <Link href="/teach/">Teaching briefs</Link>
            </span>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="corpora-title">
        <h2 id="corpora-title" className={styles.sectionTitle}>
          Per corpus: can answer vs cannot claim
        </h2>

        <article className={styles.corpusBlock}>
          <h3 className={styles.corpusTitle}>
            Greek New Testament ({TIMELINE_START}–{TIMELINE_END} CE)
          </h3>
          <div className={styles.twoCol}>
            <div className={styles.col}>
              <h4>Can help answer</h4>
              <ul>
                <li>
                  How many word-aligned disagreements vs open SR GNT appear in extant
                  CNTR letters for our Liste window ({greek_nt.cntr_transcription_count}{" "}
                  transcriptions; {greek_nt.leaf_image_count} with leaf image).
                </li>
                <li>
                  Kind breakdown (substitution, orthography, omission, etc.) and
                  per-book filters in the{" "}
                  <Link href="/variants/">variant explorer</Link>.
                </li>
                <li>
                  Block-level famous passages ({famousCount}) separate from the word
                  census — witness status checked against CNTR in our slice.
                </li>
                <li>
                  Bounded claim cards ({claimCount}) on tradition-scale debates when
                  scoped to this dataset.
                </li>
              </ul>
            </div>
            <div className={styles.col}>
              <h4>Does not claim</h4>
              <ul>
                <li>
                  A full INTF Liste census or ~5,700+ manuscript tradition count.
                </li>
                <li>
                  Gurry&apos;s ~500,000 extrapolation as our number — see{" "}
                  <Link href="/coverage/">Coverage</Link>.
                </li>
                <li>NA28 / ECM apparatus judgments.</li>
                <li>
                  Settled intentional-vs-error labels — see notice below (
                  {greek_nt.intentional_tagging?.tagged_count?.toLocaleString() ?? 0}{" "}
                  tagged of{" "}
                  {greek_nt.intentional_tagging?.taggable_total?.toLocaleString() ??
                    0}{" "}
                  taggable units, provisional only).
                </li>
              </ul>
            </div>
          </div>
          <p className={styles.note}>
            Evidence map:{" "}
            <Link href="/coverage/">Coverage § Greek NT</Link> ·{" "}
            <Link href="/methodology/#greek-evidence-layers">Methods § layers</Link>
          </p>
        </article>

        <article className={styles.corpusBlock}>
          <h3 className={styles.corpusTitle}>
            Qurʾān — early leaves, Uthmani rasm, shared orthography
          </h3>
          <div className={styles.twoCol}>
            <div className={styles.col}>
              <h4>Can help answer</h4>
              <ul>
                <li>
                  Catalog cards for {quran.witness_count} seeded Hijazi-range leaves (
                  {quran.leaf_image_count} with hosted leaf image).
                </li>
                <li>
                  Illustrative regional <em>rasm</em> rows ({uthmaniCount}) and
                  van Putten Table 2 niʿmat matrix ({archetypeCount} rows) for
                  teaching — citable to published scholarship.
                </li>
                <li>
                  Claim discipline on rasm vs qirāʾāt vs Ṣanʿāʾ lower text (
                  <Link href="/quran/readings/">readings essay</Link>).
                </li>
              </ul>
            </div>
            <div className={styles.col}>
              <h4>Does not claim</h4>
              <ul>
                <li>{quran.variant_census_note}</li>
                <li>
                  “40 Qurans” or a full mushaf collation — layers 2–3 transcribe
                  published tables, not every leaf in the seed.
                </li>
                <li>
                  The niʿmat matrix as independent re-collation of all sigla — it
                  mirrors {curated_layers?.quran_shared_orthography?.note ?? "published Table 2"}.
                </li>
                <li>
                  Four seeded leaves still lack license-clear hosted images (
                  marcel-17, mingana-1572b, doha-ms-2007, dar-al-kutub-247-masahif)
                  — re-checked 2026-09-24; see <Link href="/coverage/">Coverage</Link>{" "}
                  counts and DATA.md in the repo.
                </li>
              </ul>
            </div>
          </div>
          <p className={styles.note}>
            Evidence stack:{" "}
            <Link href="/methodology/#quran-evidence-layers">Methods § three layers</Link>{" "}
            · <Link href="/coverage/">Coverage § Qurʾān</Link>
          </p>
        </article>

        <article className={styles.corpusBlock}>
          <h3 className={styles.corpusTitle}>
            Hebrew Bible &amp; Septuagint ({hebrew_lxx.window_label})
          </h3>
          <div className={styles.twoCol}>
            <div className={styles.col}>
              <h4>Can help answer</h4>
              <ul>
                <li>
                  Timeline context for {hebrew_lxx.hebrew_dss_count} DSS Hebrew +{" "}
                  {hebrew_lxx.greek_lxx_count} LXX papyri witnesses (
                  {hebrew_lxx.leaf_image_count} with leaf image).
                </li>
                <li>
                  Three-tradition teaching map (DSS, MT context, LXX) on the{" "}
                  <Link href="/hebrew-lxx/evidence/">evidence page</Link>.
                </li>
                <li>{hebrew_lxx.student_note}</li>
              </ul>
            </div>
            <div className={styles.col}>
              <h4>Does not claim</h4>
              <ul>
                <li>{hebrew_lxx.corpus_note}</li>
                <li>
                  A mechanical word census parallel to Greek NT — no variant explorer
                  rows for Hebrew/LXX here.
                </li>
                <li>
                  That Qumran Hebrew equals medieval MT or that LXX replaces DSS
                  evidence.
                </li>
                <li>
                  Five witnesses still link-only for leaf photos (4QSamᵃ, 2Q18, Mur
                  88, Mas1a, P.Vindob. G 39777) — re-checked Commons 2026-09-24;
                  see repo DATA.md.
                </li>
              </ul>
            </div>
          </div>
        </article>

        <article className={styles.corpusBlock}>
          <h3 className={styles.corpusTitle}>Nag Hammadi library</h3>
          <div className={styles.twoCol}>
            <div className={styles.col}>
              <h4>Can help answer</h4>
              <ul>
                <li>
                  Fourth-century Coptic codex cards for{" "}
                  {nag_hammadi.tractate_witness_count} tractates (
                  {nag_hammadi.leaf_image_count} with leaf image).
                </li>
                <li>
                  Genre and canon discipline — overlap with Greek sayings traditions
                  without Thomas↔NT collation.
                </li>
                <li>
                  <Link href="/nag-hammadi/evidence/">Evidence map</Link> and{" "}
                  <Link href="/teach/nag-hammadi-vs-canon/">teaching brief</Link>.
                </li>
              </ul>
            </div>
            <div className={styles.col}>
              <h4>Does not claim</h4>
              <ul>
                <li>{nag_hammadi.collation_note}</li>
                <li>
                  Lost books of the New Testament canon — NH ≠ uncatalogued Greek NT
                  copies (see claim cards on{" "}
                  <Link href="/use/#nag-hammadi-lost-nt-books">Use</Link>).
                </li>
              </ul>
            </div>
          </div>
        </article>
      </section>

      <IntentionalTagsProvisionalNotice />

      <section className={styles.section} aria-labelledby="start-title">
        <h2 id="start-title" className={styles.sectionTitle}>Start with</h2>
        <div className={styles.linkGrid}>
          <Link href="/coverage/">Coverage &amp; scope</Link>
          <Link href="/methodology/">Methods</Link>
          <Link href="/use/">Use &amp; claims</Link>
          <Link href="/methodology/#greek-evidence-layers">Greek NT evidence map</Link>
          <Link href="/methodology/#quran-evidence-layers">Qurʾān evidence layers</Link>
          <Link href="/hebrew-lxx/evidence/">Hebrew / LXX evidence map</Link>
          <Link href="/nag-hammadi/evidence/">Nag Hammadi evidence map</Link>
          <Link href="/teach/">Teaching briefs</Link>
          <Link href="/cite/">Cite &amp; learn</Link>
          <Link href="/sources/">Open sources</Link>
          <Link href="/famous/">Famous passages</Link>
          <Link href="/variants/">Variant explorer</Link>
          <Link href="/quran/uthmani/">Uthmanic regional rasm</Link>
          <Link href="/quran/archetype/">Shared orthography</Link>
          <Link href="/quran/readings/">Rasm vs qirāʾāt vs Ṣanʿāʾ</Link>
        </div>
      </section>

      <aside className={styles.disclaimer}>
        <h2>Outreach discipline</h2>
        <p>
          This page exists so finish-readiness is visible on the site itself — not
          buried in email drafts. Reuse CNTR, INTF, Corpus Coranicum, and critical
          editions for primary work; cite Illustrative Manuscripts only for the
          bounded slices and curated layers described here.
        </p>
      </aside>

      <footer className={styles.footer}>
        <Link href="/">← Timeline</Link>
        {" · "}
        <Link href="/about/">About</Link>
        {" · "}
        <Link href="/coverage/">Coverage</Link>
        {" · "}
        <Link href="/sources/">Open sources</Link>
        {" · "}
        <Link href="/use/">Use</Link>
      </footer>
    </main>
  );
}
