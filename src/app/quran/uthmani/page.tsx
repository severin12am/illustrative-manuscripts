import type { Metadata } from "next";
import Link from "next/link";
import { uthmaniRegionalVariants } from "@/data/uthmani-regional-variants";
import type { RegionalPattern } from "@/types/uthmaniRegionalVariants";
import styles from "./uthmani.module.css";

export const metadata: Metadata = {
  title: "Uthmanic regional rasm — Illustrative Manuscripts",
  description:
    "Evidence-backed regional orthographic variants between the four ʿUthmānic exemplars (Syria, Medina, Basra, Kufa) — stemma, curated examples, and links to our early Hijazi witnesses.",
};

const PATTERN_LABEL: Record<RegionalPattern, string> = {
  syria_unique: "Syria-unique (Cook ~16)",
  syria_medina: "Syria + Medina vs Basra + Kufa (Cook ~13)",
  kufa_unique: "Kufa-unique (Cook ~6)",
};

function witnessHref(id: string) {
  return `/?q=${encodeURIComponent(id)}`;
}

function StemmaDiagram() {
  return (
    <div className={styles.stemmaWrap} role="img" aria-label="Stemma of four Uthmanic regional codices">
      <svg
        className={styles.stemmaSvg}
        viewBox="0 0 520 280"
        width="520"
        height="280"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id="arrow"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L8,3 z" fill="#888" />
          </marker>
        </defs>
        {/* Archetype */}
        <rect x="185" y="12" width="150" height="36" rx="4" fill="#f5f0e8" stroke="#8a7344" />
        <text x="260" y="35" textAnchor="middle" fontSize="12" fill="#333">
          Uthmanic archetype (UT)
        </text>
        {/* Branches */}
        <line x1="220" y1="48" x2="120" y2="88" stroke="#888" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <line x1="300" y1="48" x2="400" y2="88" stroke="#888" strokeWidth="1.5" markerEnd="url(#arrow)" />
        {/* Syria */}
        <rect x="50" y="88" width="140" height="44" rx="4" fill="#eef2f4" stroke="#5a7a8a" />
        <text x="120" y="108" textAnchor="middle" fontSize="11" fontWeight="600" fill="#3d5a6b">
          Syria (Ḥimṣ)
        </text>
        <text x="120" y="124" textAnchor="middle" fontSize="9" fill="#666">
          ~16 unique rasm reports
        </text>
        {/* Medina */}
        <line x1="120" y1="132" x2="120" y2="168" stroke="#888" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <rect x="50" y="168" width="140" height="40" rx="4" fill="#eef4ef" stroke="#2d5a3d" />
        <text x="120" y="188" textAnchor="middle" fontSize="11" fontWeight="600" fill="#2d5a3d">
          Medina
        </text>
        <text x="120" y="202" textAnchor="middle" fontSize="9" fill="#666">
          shares ~13 with Syria
        </text>
        {/* Basra-Kufa node */}
        <rect x="330" y="88" width="140" height="36" rx="4" fill="#f5f0e8" stroke="#6b4a2d" />
        <text x="400" y="110" textAnchor="middle" fontSize="11" fill="#333">
          Iraqi branch
        </text>
        <line x1="370" y1="124" x2="340" y2="168" stroke="#888" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <line x1="430" y1="124" x2="460" y2="168" stroke="#888" strokeWidth="1.5" markerEnd="url(#arrow)" />
        {/* Basra */}
        <rect x="270" y="168" width="100" height="40" rx="4" fill="#faf6f0" stroke="#6b4a2d" />
        <text x="320" y="188" textAnchor="middle" fontSize="11" fontWeight="600" fill="#6b4a2d">
          Basra
        </text>
        <text x="320" y="202" textAnchor="middle" fontSize="8" fill="#666">
          neo-Basran later
        </text>
        {/* Kufa */}
        <rect x="390" y="168" width="100" height="40" rx="4" fill="#f0ecf4" stroke="#5a3a6b" />
        <text x="440" y="188" textAnchor="middle" fontSize="11" fontWeight="600" fill="#5a3a6b">
          Kufa
        </text>
        <text x="440" y="202" textAnchor="middle" fontSize="9" fill="#666">
          ~6 unique reports
        </text>
        {/* Dotted: Sidky neo-Basran */}
        <rect x="255" y="228" width="130" height="32" rx="4" fill="none" stroke="#6b4a2d" strokeDasharray="4 3" />
        <text x="320" y="248" textAnchor="middle" fontSize="9" fill="#6b4a2d">
          neo-Basran reform (Sidky)
        </text>
        <line x1="320" y1="208" x2="320" y2="228" stroke="#6b4a2d" strokeWidth="1" strokeDasharray="3 2" />
      </svg>
      <p className={styles.stemmaCaption}>
        {uthmaniRegionalVariants.stemma.caption}{" "}
        {uthmaniRegionalVariants.stemma.neo_basran_note}
      </p>
      <div className={styles.stemmaLegend}>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendSyria}`} />
          Syria
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendMedina}`} />
          Medina
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendBasra}`} />
          Basra
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendKufa}`} />
          Kufa
        </span>
      </div>
    </div>
  );
}

function ReadingCell({
  rasm,
  gloss,
}: {
  rasm: string;
  gloss: string;
}) {
  return (
    <div>
      <div className={styles.rasmCell} lang="ar" dir="rtl">
        {rasm}
      </div>
      <div className={styles.glossCell}>{gloss}</div>
    </div>
  );
}

export default function UthmaniRegionalPage() {
  const { _meta, scholarship, variants, sanaa_callout } = uthmaniRegionalVariants;

  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Qurʾān · Uthmanic Text Type</p>
        <h1 className={styles.title}>Regional rasm variants</h1>
        <p className={styles.lead}>
          In the mid-7th century, tradition holds that ʿUthmān sent master copies to
          regional centers — traditionally Medina, Syria (likely{" "}
          <strong>Ḥimṣ</strong>, not Damascus), Basra, and Kufa. Early manuscripts
          overwhelmingly descend from one <strong>Uthmanic Text Type (UT)</strong> and
          are highly uniform. Medieval <em>rasm</em> literature and modern stemmatics
          record on the order of <strong>~35–40</strong> small consonantal or
          orthographic differences between those regional exemplars — not ~40
          alternate Qurans. See our{" "}
          <Link href="/">Hijazi witness timeline</Link> for dated leaves;{" "}
          <Link href="/coverage/">Coverage</Link> explains what we do and do not
          collate.
        </p>
      </header>

      <aside className={styles.callout}>
        <p>
          <strong>Not word-level Greek variants.</strong> Our{" "}
          <Link href="/variants/">variant explorer</Link> counts CNTR word disagreements
          in the Greek NT. <strong>Not qirāʾāt.</strong> The seven canonical reading
          traditions are a later layer. <strong>These entries</strong> are regional{" "}
          <em>rasm</em> within one early standard — the class Cook and Sidky describe.
        </p>
      </aside>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>What the scholarship says</h2>
        <p className={styles.sectionIntro}>{_meta.totals_note}</p>
        <p className={styles.sectionIntro}>{_meta.window_note}</p>
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

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Stemma (Cook / Sidky)</h2>
        <StemmaDiagram />
      </section>

      <section className={styles.section} id="variants">
        <h2 className={styles.sectionTitle}>
          Curated examples ({variants.length} of ~35–40)
        </h2>
        <p className={styles.sectionIntro}>{_meta.definition}</p>
        <div className={styles.variantTableWrap}>
          <table className={styles.variantTable}>
            <thead>
              <tr>
                <th scope="col">Ref</th>
                <th scope="col">Context</th>
                <th scope="col">Syria</th>
                <th scope="col">Medina</th>
                <th scope="col">Basra</th>
                <th scope="col">Kufa</th>
                <th scope="col">Nature</th>
                <th scope="col">Pattern</th>
                <th scope="col">Sources</th>
                <th scope="col">Our witnesses</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((v) => (
                <tr key={v.id}>
                  <td className={styles.refCell}>
                    <a href={`#${v.id}`}>{v.ref}</a>
                  </td>
                  <td className={styles.contextCell}>{v.context}</td>
                  <td>
                    <ReadingCell rasm={v.readings.syria.rasm} gloss={v.readings.syria.gloss} />
                  </td>
                  <td>
                    <ReadingCell rasm={v.readings.medina.rasm} gloss={v.readings.medina.gloss} />
                  </td>
                  <td>
                    <ReadingCell rasm={v.readings.basra.rasm} gloss={v.readings.basra.gloss} />
                  </td>
                  <td>
                    <ReadingCell rasm={v.readings.kufa.rasm} gloss={v.readings.kufa.gloss} />
                  </td>
                  <td>{v.nature}</td>
                  <td>
                    <span className={styles.patternBadge} data-pattern={v.pattern}>
                      {PATTERN_LABEL[v.pattern]}
                    </span>
                  </td>
                  <td>
                    <ul className={styles.sourcesList}>
                      {v.sources.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    {v.manuscript_hits.length === 0 ? (
                      <span className={styles.hitUnknown}>
                        Not checked / no cited hit in our seed
                      </span>
                    ) : (
                      <ul className={styles.hitsList}>
                        {v.manuscript_hits.map((h) => (
                          <li key={`${h.witness_id}-${h.reading}`}>
                            <Link href={witnessHref(h.witness_id)} className={styles.hitWitness}>
                              {h.witness_id}
                            </Link>
                            {" — "}
                            {h.note}
                            <span className={styles.glossCell}> ({h.source})</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.metaNote}>{_meta.honest_disclaimer}</p>
      </section>

      <aside className={`${styles.callout} ${styles.sanaaCallout}`}>
        <h2>{sanaa_callout.title}</h2>
        <p>{sanaa_callout.summary}</p>
        <p>
          <Link href={witnessHref(sanaa_callout.witness_id)}>
            Open our Ṣanʿāʾ palimpsest card →
          </Link>
        </p>
        <ul className={styles.scholarshipList}>
          {sanaa_callout.scholarship.map((s) =>
            s.url.startsWith("/") ? (
              <li key={s.url}>
                <Link href={s.url}>{s.label}</Link>
              </li>
            ) : (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            )
          )}
        </ul>
      </aside>

      <footer className={styles.footer}>
        <Link href="/coverage/">Coverage &amp; scope →</Link>
        {" · "}
        <Link href="/cite/">Cite &amp; learn →</Link>
        {" · "}
        <Link href="/">← Back to timeline</Link>
      </footer>
    </main>
  );
}
