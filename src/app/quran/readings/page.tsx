import type { Metadata } from "next";
import Link from "next/link";
import styles from "./readings.module.css";

export const metadata: Metadata = {
  title: "Rasm, qirāʾāt & Ṣanʿāʾ — don’t conflate — Illustrative Manuscripts",
  description:
    "Plain-English guide: Uthmanic rasm (consonantal orthography), canonical qirāʾāt reading traditions, and the non-Uthmanic Ṣanʿāʾ palimpsest lower text — what each layer supports in debate.",
};

function LayerDiagram() {
  return (
    <div className={styles.diagramWrap} role="img" aria-label="Three separate Qurʾān layers: rasm, qirāʾāt, Ṣanʿāʾ lower text">
      <svg
        className={styles.diagramSvg}
        viewBox="0 0 640 220"
        width="640"
        height="220"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text x="320" y="22" textAnchor="middle" fontSize="11" fill="#666">
          Three categories debaters often merge — keep them separate
        </text>
        {/* Rasm box */}
        <rect x="24" y="40" width="180" height="72" rx="4" fill="#eef2f4" stroke="#5a7a8a" />
        <text x="114" y="62" textAnchor="middle" fontSize="12" fontWeight="600" fill="#3d5a6b">
          Rasm (UT)
        </text>
        <text x="114" y="80" textAnchor="middle" fontSize="9" fill="#555">
          Written consonantal skeleton
        </text>
        <text x="114" y="96" textAnchor="middle" fontSize="9" fill="#555">
          Site: layers 2–3
        </text>
        {/* Qirāʾāt box */}
        <rect x="230" y="40" width="180" height="72" rx="4" fill="#faf6f0" stroke="#6b4a2d" />
        <text x="320" y="62" textAnchor="middle" fontSize="12" fontWeight="600" fill="#6b4a2d">
          Qirāʾāt
        </text>
        <text x="320" y="80" textAnchor="middle" fontSize="9" fill="#555">
          Reading traditions (oral + later dotting)
        </text>
        <text x="320" y="96" textAnchor="middle" fontSize="9" fill="#555">
          Not our rasm table
        </text>
        {/* Sanaa box */}
        <rect x="436" y="40" width="180" height="72" rx="4" fill="#f0ecf4" stroke="#5a3a6b" />
        <text x="526" y="62" textAnchor="middle" fontSize="12" fontWeight="600" fill="#5a3a6b">
          Ṣanʿāʾ lower
        </text>
        <text x="526" y="80" textAnchor="middle" fontSize="9" fill="#555">
          Non-UT companion line
        </text>
        <text x="526" y="96" textAnchor="middle" fontSize="9" fill="#555">
          One palimpsest card
        </text>
        {/* Arrows from shared early period */}
        <rect x="200" y="130" width="240" height="36" rx="4" fill="#f5f0e8" stroke="#8a7344" />
        <text x="320" y="153" textAnchor="middle" fontSize="10" fill="#333">
          Early 7th-c. witnesses (Hijazi leaves)
        </text>
        <line x1="114" y1="112" x2="114" y2="130" stroke="#888" strokeWidth="1.2" />
        <line x1="320" y1="112" x2="320" y2="130" stroke="#888" strokeWidth="1.2" strokeDasharray="4 3" />
        <line x1="526" y1="112" x2="526" y2="130" stroke="#888" strokeWidth="1.2" />
        <text x="320" y="190" textAnchor="middle" fontSize="9" fill="#888">
          Dotted line: qirāʾāt presuppose a rasm tradition — they do not replace stemmatics
        </text>
      </svg>
      <p className={styles.diagramCaption}>
        Illustrative Manuscripts publishes UT rasm teaching tables and one Ṣanʿāʾ witness card.
        We do not host a qirāʾāt apparatus — cite standard introductions (Nasser, Shah, van Putten)
        for that layer.
      </p>
    </div>
  );
}

export default function QuranReadingsPage() {
  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Qurʾān · claim discipline</p>
        <h1 className={styles.title}>Rasm, qirāʾāt &amp; Ṣanʿāʾ lower text</h1>
        <p className={styles.lead}>
          Public debate often treats <strong>regional Uthmanic rasm</strong>,{" "}
          <strong>canonical qirāʾāt</strong>, and the <strong>Ṣanʿāʾ palimpsest lower text</strong>{" "}
          as interchangeable “variants.” They are related historically but answer different
          questions. This page is plain English for students and debaters; our data pages show{" "}
          <em>rasm</em> ({" "}
          <Link href="/quran/uthmani/">regional splits</Link>,{" "}
          <Link href="/quran/archetype/">shared orthography</Link>) — not a census of the Ten
          Readings.
        </p>
      </header>

      <aside className={styles.callout}>
        <p>
          <strong>On this site:</strong> layers 2–3 document the Uthmanic Text Type written
          tradition. <Link href="/use/">Claim cards</Link> flag common conflations. Teaching
          outline: <Link href="/teach/quran-rasm-qiraat-sanaa/">rasm ≠ qirāʾāt ≠ Ṣanʿāʾ</Link>.
        </p>
      </aside>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Three definitions</h2>
        <dl className={styles.defList}>
          <div className={styles.defItem}>
            <dt>Rasm (Uthmanic orthography)</dt>
            <dd>
              The <strong>consonantal skeleton</strong> early Muslims copied in master codices —
              what our <Link href="/quran/uthmani/">~35–40 regional examples</Link> and{" "}
              <Link href="/quran/archetype/">niʿmat matrix</Link> illustrate. Medieval{" "}
              <em>rasm</em> literature and modern stemmatics (Cook; Sidky; van Putten) discuss
              graphic differences among the four ʿUthmānic exemplar traditions and shared written
              quirks — not vowel colors or every oral reading variant.
            </dd>
          </div>
          <div className={styles.defItem}>
            <dt>Qirāʾāt (reading traditions)</dt>
            <dd>
              Later <strong>canonical reading traditions</strong> (often counted as seven or ten
              fully described lines) that specify how to pronounce — and sometimes how to read
              consonants within — an undotted rasm. Specialists treat qirāʾāt as a layer built on
              transmission and teaching, not as a one-to-one map to Cook&apos;s regional rasm list.
              Introductory surveys include Shady H. Nasser,{" "}
              <em>The Transmission of the Variant Readings of the Qurʾān</em> (Brill, 2013);
              handbook chapters by Mustafa Shah and others on the canonization of readings; and
              Marijn van Putten, <em>Quranic Arabic</em> (Brill, 2022) on how rasm and
              reading traditions interact. We publish <strong>no</strong> qirāʾāt variant table
              here.
            </dd>
          </div>
          <div className={styles.defItem}>
            <dt>Ṣanʿāʾ DAM 01-27.1 lower text</dt>
            <dd>
              The washed <strong>scriptio inferior</strong> of the Ṣanʿāʾ palimpsest — a{" "}
              <strong>non-Uthmanic companion-era</strong> line studied by Sadeghi &amp; Goudarzi
              (2012), with early radiocarbon context for the lower layer in subsequent discussion.
              It shows that not every early copy matches standard UT rasm; it is{" "}
              <strong>not</strong> one of the ~40 regional UT exemplar splits. See our{" "}
              <Link href="/?corpus=quran&q=sanaa-dam-01-27-1">witness card</Link> and the{" "}
              <Link href="/quran/uthmani/">Uthmani Sanaa callout</Link>.
            </dd>
          </div>
        </dl>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Visual separation</h2>
        <LayerDiagram />
      </section>

      <section className={styles.section} id="compare">
        <h2 className={styles.sectionTitle}>What each layer supports (and does not)</h2>
        <p className={styles.sectionIntro}>
          Use this matrix before citing our charts in debate. Verdict tags match{" "}
          <Link href="/use/#claims">claim cards</Link> on <code>/use/</code>.
        </p>
        <div className={styles.compareWrap}>
          <table className={styles.compareTable}>
            <thead>
              <tr>
                <th scope="col">Question</th>
                <th scope="col" className={styles.colRasm}>
                  Rasm (UT regional + shared orthography)
                </th>
                <th scope="col" className={styles.colQiraat}>Qirāʾāt</th>
                <th scope="col" className={styles.colSanaa}>
                  Ṣanʿāʾ lower text
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">What it is</th>
                <td>
                  Written consonantal/orthographic tradition of the Uthmanic Text Type; ~40
                  published regional splits + shared idiosyncrasies (site layers 2–3).
                </td>
                <td>
                  Named reading lines (Seven / Ten in standard references) with their own
                  transmission histories atop rasm.
                </td>
                <td>
                  Early palimpsest lower layer — different text type from UT, one manuscript.
                </td>
              </tr>
              <tr>
                <th scope="row">Supports</th>
                <td className={styles.supports}>
                  <strong>Early written standardization</strong> with small graphic diversity among
                  exemplar traditions; copying from written archetypes (van Putten niʿmat case).
                </td>
                <td className={styles.supports}>
                  <strong>Legitimate diversity</strong> in recitation/teaching within Islam&apos;s
                  canonical frameworks — studied in reading-tradition scholarship, not in our JSON.
                </td>
                <td className={styles.supports}>
                  <strong>Non-UT Qurʾanic material</strong> existed in the 7th century alongside
                  the dominant UT line (companion-era framing per Sadeghi &amp; Goudarzi).
                </td>
              </tr>
              <tr>
                <th scope="row">Does not support</th>
                <td className={styles.notSupports}>
                  Equating each rasm row with a qirāʾa; claiming “40 different Qurans.”
                </td>
                <td className={styles.notSupports}>
                  Replacing manuscript stemmatics; proving every undotted letter admits infinite
                  original readings without tradition context.
                </td>
                <td className={styles.notSupports}>
                  Proving UT is a late fiction with no early witnesses; replacing a full variant
                  census of UT rasm.
                </td>
              </tr>
              <tr>
                <th scope="row">Our page</th>
                <td>
                  <Link href="/quran/uthmani/">Regional rasm</Link>
                  {" · "}
                  <Link href="/quran/archetype/">Shared orthography</Link>
                </td>
                <td>
                  This guide only — see scholarship links below.
                </td>
                <td>
                  <Link href="/?corpus=quran&q=sanaa-dam-01-27-1">DAM 01-27.1 card</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className={styles.metaNote}>
          Claim discipline:{" "}
          <Link href="/use/#quran-rasm-equals-qiraat">
            ~40 Uthmani differences = the Seven/Ten qirāʾāt
          </Link>
          {" · "}
          <Link href="/use/#sanaa-proves-uthmanic-fiction">
            Ṣanʿāʾ lower text proves UT is late fiction
          </Link>
          {" · "}
          <Link href="/use/#undotted-mss-any-reading-original">
            undotted MSS mean any reading is equally original
          </Link>
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Further reading (qirāʾāt &amp; rasm)</h2>
        <ul className={styles.scholarshipList}>
          <li>
            <a
              href="https://doi.org/10.1163/9789004241794"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shady H. Nasser — The Transmission of the Variant Readings of the Qurʾān (Brill,
              2013)
            </a>
          </li>
          <li>
            <a
              href="https://doi.org/10.1163/9789004506251"
              target="_blank"
              rel="noopener noreferrer"
            >
              Marijn van Putten — Quranic Arabic (Brill, 2022)
            </a>
          </li>
          <li>
            <a
              href="https://doi.org/10.1515/islam-2011-0025"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sadeghi &amp; Goudarzi — Ṣanʿāʾ 1 and the Origins of the Qurʾān (Der Islam 2012)
            </a>
          </li>
          <li>
            <a
              href="https://doi.org/10.1163/9789004693623_009"
              target="_blank"
              rel="noopener noreferrer"
            >
              Michael Cook — stemma of regional codices (Graeco-Arabica 2004)
            </a>
          </li>
          <li>
            <a
              href="https://doi.org/10.5913/jiqsa.5.2020.a005"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hythem Sidky — regionality of Qurʾānic codices (JIQSA 2020)
            </a>
          </li>
        </ul>
        <p className={styles.metaNote}>
          Mustafa Shah and other scholars publish survey chapters on readings in academic
          handbooks — we link Nasser and van Putten here as standard entry points and do not
          reproduce qirāʾāt lists.
        </p>
      </section>

      <footer className={styles.footer}>
        <Link href="/teach/quran-rasm-qiraat-sanaa/">Teaching brief →</Link>
        {" · "}
        <Link href="/quran/uthmani/">Regional rasm →</Link>
        {" · "}
        <Link href="/quran/archetype/">Shared orthography →</Link>
        {" · "}
        <Link href="/use/#claims">Claim cards →</Link>
        {" · "}
        <Link href="/methodology/#quran-evidence-layers">Methods →</Link>
        {" · "}
        <Link href="/?corpus=quran">← Qurʾān timeline</Link>
      </footer>
    </main>
  );
}
