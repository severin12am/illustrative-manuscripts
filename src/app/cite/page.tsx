import type { Metadata } from "next";
import Link from "next/link";
import { coverage } from "@/data/coverage";
import { variantIndex } from "@/data/variant-index";
import { TIMELINE_START, TIMELINE_END } from "@/data/witnesses";
import {
  kindLabel,
  sortKindEntries,
  VARIANT_KIND_DEFINITIONS,
} from "@/lib/variantTaxonomy";
import { assetUrl } from "@/lib/assetUrl";
import styles from "./cite.module.css";

export const metadata: Metadata = {
  title: "Cite & learn — Illustrative Manuscripts",
  description:
    "How to cite this site and its open variant census, what the numbers mean, how to read witness cards, and where to learn more about textual criticism.",
};

const GITHUB =
  "https://github.com/severin12am/illustrative-manuscripts";
const PAGES =
  "https://severin12am.github.io/illustrative-manuscripts/";
const GURRY_DOI = "https://doi.org/10.1017/S0028688516000216";

const ACCESS = "[access day month year]";

export default function CitePage() {
  const kinds = sortKindEntries(coverage.greek_nt.disagreements.by_kind);
  const censusCsv = assetUrl("/variant-census.csv");
  const censusJson = assetUrl("/variant-census.json");

  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>For students &amp; lay readers</p>
        <h1 className={styles.title}>Cite &amp; learn</h1>
        <p className={styles.lead}>
          Plain-language help for using this site in papers, classrooms, and
          curious browsing — how to cite our work, what the counts mean, and
          where to go next for full scholarly tools.
        </p>
      </header>

      <section className={styles.section} id="how-to-cite">
        <h2 className={styles.sectionTitle}>How to cite this site</h2>
        <p className={styles.sectionIntro}>
          Replace bracketed placeholders with your access date. Adjust the author
          line to match how you attribute the repository maintainer.
        </p>

        <div className={styles.citationBlock}>
          <h3>The website</h3>
          <p className={styles.citation}>
            Illustrative Manuscripts. (n.d.).{" "}
            <em>
              Illustrative Manuscripts: An illustrated timeline of early biblical
              witnesses
            </em>{" "}
            [Website]. GitHub Pages. {PAGES} (Source code: {GITHUB}). Accessed{" "}
            <span className={styles.placeholder}>{ACCESS}</span>.
          </p>
        </div>

        <div className={styles.citationBlock}>
          <h3>The downloadable variant census (CSV / JSON)</h3>
          <p className={styles.citation}>
            Illustrative Manuscripts. (n.d.).{" "}
            <em>
              Greek New Testament variant census ({TIMELINE_START}–{TIMELINE_END}{" "}
              CE vs SR GNT)
            </em>{" "}
            [Data set]. GitHub. {GITHUB}/blob/main/public/variant-census.csv
            (JSON: {GITHUB}/blob/main/public/variant-census.json).{" "}
            {variantIndex.total.toLocaleString()} word-aligned variation units,{" "}
            {variantIndex.witness_count} witnesses. Accessed{" "}
            <span className={styles.placeholder}>{ACCESS}</span>.
          </p>
          <p className={styles.sectionIntro} style={{ marginTop: "0.75rem", marginBottom: 0 }}>
            Direct downloads:{" "}
            <a href={censusCsv}>variant-census.csv</a>
            {" · "}
            <a href={censusJson}>variant-census.json</a>
          </p>
        </div>
      </section>

      <section className={styles.section} id="what-numbers-mean">
        <h2 className={styles.sectionTitle}>What the numbers mean</h2>
        <p className={styles.sectionIntro}>
          Greek NT counts on this site compare surviving letters in our CNTR
          witness slice to open <strong>SR GNT</strong> (Society of Biblical
          Literature Greek New Testament, from CNTR). Qurʾān and Nag Hammadi cards
          show catalogued witnesses but do not yet publish the same mechanical
          census.
        </p>
        <dl className={styles.defList}>
          <div className={styles.defItem}>
            <dt>Witness</dt>
            <dd>
              One physical manuscript — e.g. P52, Codex Vaticanus (03), a Hijazi
              Qurʾān leaf. Each card is a single witness, not the whole
              tradition.
            </dd>
          </div>
          <div className={styles.defItem}>
            <dt>Paleographic range</dt>
            <dd>
              Scholars estimate when a hand was written from handwriting style
              (and sometimes radiocarbon). Cards show a <strong>range</strong>{" "}
              (e.g. 125–175 CE), not a single exact year.
            </dd>
          </div>
          <div className={styles.defItem}>
            <dt>Variation unit</dt>
            <dd>
              One spot where a witness&apos;s extant letters disagree with SR
              GNT at the same aligned word position — for example, a different
              spelling at John 1:1. Our site counts{" "}
              <strong>word-aligned variation units</strong> in surviving text
              only.
            </dd>
          </div>
          <div className={styles.defItem}>
            <dt>Kinds (omission, addition, substitution, orthography, …)</dt>
            <dd>
              Each unit is classified mechanically:
              <ul className={styles.notClaimList} style={{ marginTop: "0.5rem" }}>
                {kinds.map(([kind]) => (
                  <li key={kind}>
                    <strong>{kindLabel(kind)}</strong> —{" "}
                    {VARIANT_KIND_DEFINITIONS[kind] ??
                      "See DATA.md for taxonomy notes."}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div className={styles.defItem}>
            <dt>SR GNT comparison</dt>
            <dd>
              <strong>SR GNT</strong> is an open critical Greek text from the
              Center for New Testament Restoration (CNTR). Comparing one witness
              to SR GNT shows where <em>that copy</em> differs from this
              reconstruction — not “the right reading” by itself, and not every
              manuscript ever copied.
            </dd>
          </div>
          <div className={styles.defItem}>
            <dt>Lacunae are not counted as variants</dt>
            <dd>
              Fragments have holes. If software treated every gap as a deliberate
              omission, counts would explode. We{" "}
              <strong>only compare extant letters</strong> — lacunae (
              <code>[...]</code>) and editorially supplied reconstruction (
              <code>~</code>) are excluded. That keeps numbers smaller and more
              honest than naive string diffs.
            </dd>
          </div>
        </dl>
      </section>

      <section className={styles.section} id="read-a-card">
        <h2 className={styles.sectionTitle}>How to read a card</h2>
        <p className={styles.sectionIntro}>
          On the <Link href="/">timeline</Link>, each witness card stacks three
          layers of evidence for the passage we show:
        </p>
        <ol className={styles.steps}>
          <li>
            <strong>Photograph</strong> — when we have a legal Commons plate or
            an institutional IIIF embed; otherwise an outbound link to the
            holding library. We do not rehost restricted scans.
          </li>
          <li>
            <strong>Diplomatic text</strong> — what survives on the leaf in the
            original script (Greek uncial, Arabic rasm, Coptic, or Hebrew
            consonants), with lacunae marked honestly.
          </li>
          <li>
            <strong>English of these lines</strong> — a public-domain translation
            for the same verses (WEB for Greek NT, Pickthall 1930 for Qurʾān,
            etc.), plus variant strips under Greek NT verses where the witness
            disagrees with SR GNT.
          </li>
        </ol>
        <p className={styles.sectionIntro}>
          The header line gives the Gregory–Aland or catalog siglum, paleographic
          date range, and a short variant summary for Greek NT witnesses with
          CNTR data.
        </p>
      </section>

      <section className={styles.section} id="compare-and-variants">
        <h2 className={styles.sectionTitle}>How to use Compare and Variants</h2>
        <ol className={styles.steps}>
          <li>
            Open the <Link href="/variants/">variant explorer</Link> to browse{" "}
            {coverage.greek_nt.disagreements.total.toLocaleString()} counted
            disagreements vs SR GNT. Filter by kind (omission, orthography, …),
            witness, or book.
          </li>
          <li>
            Click a row to expand witness vs SR readings for that unit; use the
            search box for verse references or Greek snippets.
          </li>
          <li>
            Open <Link href="/compare/">witness compare</Link>, pick two Greek NT
            witnesses (e.g. P75 vs 03), choose a book overlap, and run the
            comparison. Toggle the SR GNT column and “disagreements only” as
            needed.
          </li>
          <li>
            Follow preset pairs (P66 vs P75 in John, etc.) or URL parameters{" "}
            <code>?a=P75&amp;b=03&amp;book=Luke</code> to share a view.
          </li>
          <li>
            Download the open census from{" "}
            <Link href="/coverage/">Coverage</Link> or the citation block above
            for spreadsheet or research workflows — always note our scope limits
            when you publish.
          </li>
        </ol>
      </section>

      <section className={styles.section} id="not-claiming">
        <h2 className={styles.sectionTitle}>What we are not claiming</h2>
        <ul className={styles.notClaimList}>
          <li>
            <strong>Not a full New Testament census.</strong> We count
            disagreements in our CNTR witness slice ({TIMELINE_START}–
            {TIMELINE_END} CE plus select uncials) — not ~5,700+ Greek
            manuscripts and not Peter Gurry&apos;s ~500,000-reading extrapolation.
          </li>
          <li>
            <strong>Not NA28, ECM, or IGNTP apparatus judgments.</strong> Our
            mechanical classifier and optional intentional tags are illustrative
            tools, not editions of record.
          </li>
          <li>
            <strong>Intentional-vs-error tags are provisional.</strong> When
            present, they are model-assisted hypotheses — do not cite tag
            counts as settled scholarship.
          </li>
          <li>
            For Bart Ehrman&apos;s framing of tradition-scale volume vs what this
            dataset actually counts, see{" "}
            <Link href="/coverage/">Coverage &amp; scope</Link>.
          </li>
        </ul>
      </section>

      <section className={styles.section} id="sources">
        <h2 className={styles.sectionTitle}>Scholarly sources we reuse</h2>
        <p className={styles.sectionIntro}>
          We compile metadata and transcriptions from open catalogs; institutional
          image rights stay with holding libraries unless a Commons or IIIF license
          explicitly allows reuse.
        </p>
        <table className={styles.sourceTable}>
          <thead>
            <tr>
              <th>Source</th>
              <th>What we use it for</th>
              <th>License / terms</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <a
                  href="https://greekcntr.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CNTR
                </a>
              </td>
              <td>Greek diplomatic transcriptions, SR GNT, variant collation</td>
              <td className={styles.license}>CC BY-SA 4.0</td>
            </tr>
            <tr>
              <td>
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
                </a>
              </td>
              <td>Gregory–Aland sigla, date ranges, outbound manuscript links</td>
              <td className={styles.license}>Cite INTF; images link-only</td>
            </tr>
            <tr>
              <td>
                <a
                  href="https://igntp.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  IGNTP
                </a>
              </td>
              <td>Critical editions and tools for full NT textual work</td>
              <td className={styles.license}>Per edition / site terms</td>
            </tr>
            <tr>
              <td>
                <a href={GURRY_DOI} target="_blank" rel="noopener noreferrer">
                  Gurry 2016
                </a>
              </td>
              <td>Context for Ehrman-scale estimates (~500k readings)</td>
              <td className={styles.license}>
                <em>NTS</em> article; open accepted MS at Cambridge
              </td>
            </tr>
            <tr>
              <td>
                <a
                  href="https://corpuscoranicum.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Corpus Coranicum
                </a>
              </td>
              <td>Qurʾān witness catalog spine and bibliography</td>
              <td className={styles.license}>CC BY 4.0 metadata</td>
            </tr>
            <tr>
              <td>
                <a
                  href="https://ccdl.claremont.edu/digital/collection/nha/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Claremont NHA
                </a>
              </td>
              <td>Nag Hammadi codex IIIF embeds</td>
              <td className={styles.license}>
                IIIF embed only; physical rights retained
              </td>
            </tr>
            <tr>
              <td>
                <a
                  href="https://commons.wikimedia.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wikimedia Commons
                </a>{" "}
                / IIIF
              </td>
              <td>Hosted leaf photos where PD/CC licenses allow</td>
              <td className={styles.license}>
                Per-file license (see <code>.attribution.json</code> sidecars)
              </td>
            </tr>
          </tbody>
        </table>
        <p className={styles.sectionIntro} style={{ marginTop: "1rem" }}>
          Site metadata compilation: CC BY 4.0. Code: MIT. Details in{" "}
          <a href={`${GITHUB}/blob/main/DATA.md`}>DATA.md</a>.
        </p>
      </section>

      <section className={styles.section} id="further-reading">
        <h2 className={styles.sectionTitle}>Further reading</h2>
        <p className={styles.sectionIntro}>
          Accessible starting points — popular introductions alongside standard
          reference works and open tools.
        </p>
        <ol className={styles.readingList}>
          <li>
            Bart D. Ehrman, <em>Misquoting Jesus: The Story Behind Who Changed
            the Bible and Why</em> (San Francisco: HarperSanFrancisco, 2005) —
            popular framing of NT textual variation (read alongside critical
            reviews and our{" "}
            <Link href="/coverage/">Coverage</Link> limits).
          </li>
          <li>
            Bruce M. Metzger &amp; Bart D. Ehrman,{" "}
            <em>
              The Text of the New Testament: Its Transmission, Corruption, and
              Restoration
            </em>{" "}
            (4th ed.; Oxford: Oxford University Press, 2005) — standard handbook
            introduction to textual criticism.
          </li>
          <li>
            Peter J. Gurry, &ldquo;How Many Variants Are in the Greek New
            Testament?&rdquo; <em>Journal of Theological Studies</em> 67, no. 2
            (2016): 657–664 —{" "}
            <a href={GURRY_DOI} target="_blank" rel="noopener noreferrer">
              doi:10.1017/S0028688516000216
            </a>
            .
          </li>
          <li>
            Institute for New Testament Textual Research —{" "}
            <a
              href="https://www.uni-muenster.de/INTF/"
              target="_blank"
              rel="noopener noreferrer"
            >
              INTF overview
            </a>{" "}
            and{" "}
            <a
              href="https://ntvmr.uni-muenster.de/"
              target="_blank"
              rel="noopener noreferrer"
            >
              NTVMR
            </a>{" "}
            for manuscript registers and images.
          </li>
          <li>
            Center for New Testament Restoration —{" "}
            <a
              href="https://greekcntr.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              greekcntr.org
            </a>{" "}
            for open transcriptions and SR GNT.
          </li>
          <li>
            Tommy Wasserman &amp; Peter J. Gurry, eds.,{" "}
            <em>
              Myths and Mistakes in New Testament Textual Criticism
            </em>{" "}
            (Downers Grove, IL: IVP Academic, 2019) — clears common public
            misunderstandings about counts and methods.
          </li>
          <li>
            Peter J. Williams, <em>Can We Trust the Gospels?</em> (Wheaton, IL:
            Crossway, 2018) — short, lay-friendly introduction to Gospel
            manuscript evidence and common misconceptions.
          </li>
          <li>
            Corpus Coranicum —{" "}
            <a
              href="https://corpuscoranicum.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              corpuscoranicum.org
            </a>{" "}
            for early Qurʾān manuscript cataloguing and bibliography.
          </li>
        </ol>
      </section>

      <footer className={styles.footer}>
        <Link href="/coverage/">Coverage &amp; scope →</Link>
        {" · "}
        <Link href="/variants/">Variant explorer →</Link>
        {" · "}
        <Link href="/">← Back to timeline</Link>
      </footer>
    </main>
  );
}
