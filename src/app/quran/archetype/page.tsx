import type { Metadata } from "next";
import Link from "next/link";
import { quranSharedOrthography } from "@/data/quran-shared-orthography";
import type {
  NimatManuscriptColumn,
  NimatMatrixRow,
  NimatSpelling,
} from "@/types/quranSharedOrthography";
import styles from "./archetype.module.css";

export const metadata: Metadata = {
  title: "Shared orthography & written archetype — Illustrative Manuscripts",
  description:
    "Illustrative niʿmat allāh ta vs ta marbūṭa matrix (van Putten 2019 Table 2) — shared idiosyncrasies across early Uthmanic manuscripts, distinct from regional rasm splits.",
};

function witnessHref(id: string) {
  return `/?corpus=quran&q=${encodeURIComponent(id)}`;
}

function SpellingCell({
  value,
  highlight,
}: {
  value: NimatSpelling | undefined;
  highlight?: boolean;
}) {
  if (!value) {
    return <span className={styles.emptyCell}>—</span>;
  }
  const { reading_legend } = quranSharedOrthography;
  const glyph = reading_legend[value].glyph;
  return (
    <span
      className={`${styles.spellCell} ${
        value === "ta_marbuta" ? styles.spellMarbuta : styles.spellTa
      } ${highlight ? styles.spellDisagree : ""}`}
      title={reading_legend[value].label}
      lang="ar"
      dir="rtl"
    >
      {glyph}
    </span>
  );
}

function isDisagreementCell(
  row: NimatMatrixRow,
  siglum: string,
  value: NimatSpelling | undefined
): boolean {
  if (!row.disagreement_locus || !value) return false;
  const majority = row.cairo;
  if (siglum === "C") return false;
  return value !== majority;
}

function SigHeader({ m }: { m: NimatManuscriptColumn }) {
  const ids =
    m.our_witness_ids ??
    (m.our_witness_id ? [m.our_witness_id] : []);
  if (ids.length === 1) {
    return (
      <Link href={witnessHref(ids[0])} className={styles.sigLink}>
        {m.siglum}
      </Link>
    );
  }
  if (ids.length > 1) {
    return (
      <span className={styles.sigMuted} title={ids.join(", ")}>
        {m.siglum}
      </span>
    );
  }
  return <span>{m.siglum}</span>;
}

export default function QuranArchetypePage() {
  const { _meta, scholarship, manuscripts, rows, reading_legend } =
    quranSharedOrthography;
  const mssColumns = manuscripts.filter((m) => !m.is_reference);

  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Qurʾān · Uthmanic Text Type</p>
        <h1 className={styles.title}>Shared orthographic idiosyncrasies</h1>
        <p className={styles.lead}>
          Early Uthmanic manuscripts are highly uniform, but not identical at
          every graphic detail. <strong>Regional rasm</strong> (
          <Link href="/quran/uthmani/">layer 2</Link>) records places where
          medieval stemmatics say the four ʿUthmānic exemplar traditions{" "}
          <em>differ</em>. This page is the complementary{" "}
          <strong>third layer</strong>: places where many early witnesses{" "}
          <em>agree on the same quirky spelling</em> in the same verse — hard to
          explain if each scribe invented spellings independently, but expected if
          they copied a shared written archetype (van Putten 2019; Cook/Sidky
          stemma context on{" "}
          <Link href="/quran/uthmani/">Uthmanic regional rasm</Link>).
        </p>
        <ol className={styles.layerList}>
          <li>
            <Link href="/?corpus=quran">Hijazi witness timeline</Link> — dated
            catalog cards (1–100 AH window).
          </li>
          <li>
            <Link href="/quran/uthmani/">Regional Uthmanic rasm</Link> — ~40
            Cook/Sidky split examples.
          </li>
          <li>
            <strong>This page</strong> — shared idiosyncrasies (niʿmat case
            study).
          </li>
        </ol>
      </header>

      <aside className={styles.callout}>
        <p>
          <strong>Claim discipline.</strong> Scholarship here supports an early{" "}
          <strong>written Uthmanic archetype</strong> and copying from written
          exemplars — not a proof that ʿUthmān personally penned every letter,
          and not a verse-alignment compare tool like Greek NT{" "}
          <Link href="/compare/">/compare/</Link>.           Non-UT material (e.g.{" "}
          <Link href="/?corpus=quran&q=sanaa">Ṣanʿāʾ lower text</Link>) and{" "}
          <Link href="/quran/readings/">qirāʾāt reading traditions</Link> are separate
          categories — see{" "}
          <Link href="/quran/uthmani/#variants">Uthmani Sanaa callout</Link>.
        </p>
      </aside>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Seed case study (van Putten 2019)</h2>
        <p className={styles.sectionIntro}>
          In the phrase <em>niʿmat allāh</em> / <em>niʿmat rabbi-ka</em>, the
          consonantal skeleton can spell <em>niʿmat</em> with tāʾ (
          {reading_legend.ta.glyph}) or tāʾ marbūṭa ({reading_legend.ta_marbuta.glyph}
          ). Standard Arabic expects one or the other by grammar; the Cairo
          1924 rasm mixes both across verses. Van Putten collated{" "}
          {mssColumns.length} early manuscripts plus the Cairo reference: at
          almost every attested verse, witnesses match the Cairo column&apos;s{" "}
          choice — including non-standard pairings — which he argues points to
          one written archetype and written copying, not random per-scribe
          invention.
        </p>
        <ul className={styles.scholarshipList}>
          {scholarship.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} id="matrix">
        <h2 className={styles.sectionTitle}>
          Table 2 reproduction ({rows.length} verse locations)
        </h2>
        <p className={styles.sectionIntro}>{_meta.source}</p>
        <div className={styles.legend}>
          <span>
            <span className={styles.legendGlyph} lang="ar" dir="rtl">
              {reading_legend.ta_marbuta.glyph}
            </span>
            {reading_legend.ta_marbuta.label}
          </span>
          <span>
            <span className={styles.legendGlyph} lang="ar" dir="rtl">
              {reading_legend.ta.glyph}
            </span>
            {reading_legend.ta.label}
          </span>
          <span>— = not attested in van Putten&apos;s table for that siglum</span>
        </div>
        <div className={styles.matrixWrap}>
          <table className={styles.matrix}>
            <thead>
              <tr>
                <th scope="col" className={styles.refCol}>
                  Verse
                </th>
                <th scope="col">C</th>
                {mssColumns.map((m) => (
                  <th scope="col" key={m.siglum}>
                    <SigHeader m={m} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  id={row.id}
                  className={row.disagreement_locus ? styles.rowLocus : undefined}
                >
                  <td className={styles.refCol}>
                    <a href={`#${row.id}`}>{row.ref}</a>
                    {row.disagreement_note ? (
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--ink-muted)",
                          fontWeight: 400,
                          maxWidth: "12rem",
                        }}
                      >
                        {row.disagreement_note}
                      </div>
                    ) : null}
                  </td>
                  <td>
                    <SpellingCell value={row.cairo} />
                  </td>
                  {mssColumns.map((m) => {
                    const val = row.readings[m.siglum];
                    return (
                      <td key={m.siglum}>
                        <SpellingCell
                          value={val}
                          highlight={isDisagreementCell(row, m.siglum, val)}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.metaNote}>{_meta.honest_disclaimer}</p>
        <p className={styles.metaNote}>{_meta.layer_note}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Manuscript sigla</h2>
        <ul className={styles.mssKey}>
          {manuscripts.map((m) => (
            <li key={m.siglum}>
              <code>{m.siglum}</code> — {m.label}
              {m.our_witness_id ? (
                <>
                  {" · "}
                  <Link href={witnessHref(m.our_witness_id)}>Our card</Link>
                </>
              ) : null}
              {m.our_witness_ids?.length ? (
                <>
                  {" · Our cards: "}
                  {m.our_witness_ids.map((id, i) => (
                    <span key={id}>
                      {i > 0 ? ", " : ""}
                      <Link href={witnessHref(id)}>{id}</Link>
                    </span>
                  ))}
                </>
              ) : null}
              {m.source ? (
                <span style={{ color: "var(--ink-muted)" }}> ({m.source})</span>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <aside className={`${styles.callout} ${styles.calloutWarn}`}>
        <p>
          Use claim cards on <Link href="/use/">/use/</Link> before debating:{" "}
          <Link href="/use/#quran-nimat-random-spelling">
            random independent spelling
          </Link>{" "}
          vs{" "}
          <Link href="/use/#quran-shared-idiosyncrasies-archetype">
            shared idiosyncrasies → written archetype
          </Link>
          . Teaching outline:{" "}
          <Link href="/teach/quran-three-evidence-layers/">
            three Qurʾān evidence layers
          </Link>
          .
        </p>
      </aside>

      <footer className={styles.footer}>
        <Link href="/quran/readings/">Rasm vs qirāʾāt →</Link>
        {" · "}
        <Link href="/quran/uthmani/">Regional Uthmanic rasm →</Link>
        {" · "}
        <Link href="/methodology/">Methods →</Link>
        {" · "}
        <Link href="/coverage/">Coverage →</Link>
        {" · "}
        <Link href="/cite/">Cite &amp; learn →</Link>
        {" · "}
        <Link href="/?corpus=quran">← Qurʾān timeline</Link>
      </footer>
    </main>
  );
}
