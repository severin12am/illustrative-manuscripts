"use client";

import { useMemo, useState } from "react";
import styles from "./page.module.css";
import Timeline from "@/components/Timeline";
import WitnessCard from "@/components/WitnessCard";
import {
  witnesses as ntWitnesses,
  TIMELINE_START,
  TIMELINE_END,
  getWitnessesForYear,
} from "@/data/witnesses";
import {
  quranWitnesses,
  QURAN_TIMELINE_START,
  QURAN_TIMELINE_END,
  getQuranWitnessesForYear,
} from "@/data/quran-witnesses";
import type { BookCategory } from "@/types/witness";
import { formatYear, witnessHasDisplayImage } from "@/types/witness";

export type SiteCorpus = "nt" | "quran";

export default function Home() {
  const [siteCorpus, setSiteCorpus] = useState<SiteCorpus>("nt");
  const [selectedYear, setSelectedYear] = useState(150);
  const [bookFilter, setBookFilter] = useState<BookCategory | "all">("all");
  const [search, setSearch] = useState("");

  const isQuran = siteCorpus === "quran";
  const allWitnesses = isQuran ? quranWitnesses : ntWitnesses;
  const timelineStart = isQuran ? QURAN_TIMELINE_START : TIMELINE_START;
  const timelineEnd = isQuran ? QURAN_TIMELINE_END : TIMELINE_END;

  const filteredAll = useMemo(() => {
    return allWitnesses.filter((w) => {
      if (!isQuran && bookFilter !== "all" && w.book_category !== bookFilter)
        return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !w.ga_number.toLowerCase().includes(q) &&
          !w.traditional_name.toLowerCase().includes(q) &&
          !w.contents.toLowerCase().includes(q) &&
          !w.current_shelfmark.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [allWitnesses, bookFilter, search, isQuran]);

  const activeWitnesses = useMemo(() => {
    const forYear = isQuran
      ? getQuranWitnessesForYear(selectedYear)
      : getWitnessesForYear(selectedYear);
    return forYear.filter((w) => filteredAll.some((f) => f.id === w.id));
  }, [selectedYear, filteredAll, isQuran]);

  const withImages = allWitnesses.filter((w) => witnessHasDisplayImage(w)).length;

  function switchCorpus(next: SiteCorpus) {
    setSiteCorpus(next);
    setBookFilter("all");
    setSearch("");
    setSelectedYear(next === "quran" ? 650 : 150);
  }

  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>
            {isQuran
              ? `Qurʾān manuscripts · 1–100 AH (~${QURAN_TIMELINE_START}–${QURAN_TIMELINE_END} CE)`
              : `Greek New Testament papyri · ${TIMELINE_START}–${TIMELINE_END} CE`}
          </p>
          <h1 className={styles.title}>Illustrative Manuscripts</h1>
          <p className={styles.lead}>
            {isQuran
              ? "A year-by-year slice through early Qurʾanic witnesses in the first century AH. Every manuscript is dated as a paleographic or C14 range — not a single year."
              : "A year-by-year slice through early biblical manuscripts. Every witness is dated as a paleographic range — scrub the timeline to see what could have existed in a given moment."}
          </p>

          <div className={styles.corpusSwitch} role="tablist" aria-label="Corpus">
            <button
              type="button"
              role="tab"
              aria-selected={!isQuran}
              className={`${styles.corpusBtn} ${!isQuran ? styles.corpusActive : ""}`}
              onClick={() => switchCorpus("nt")}
            >
              Greek NT (1–300 CE)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isQuran}
              className={`${styles.corpusBtn} ${isQuran ? styles.corpusActive : ""}`}
              onClick={() => switchCorpus("quran")}
            >
              Qurʾān (1–100 AH)
            </button>
          </div>

          <ul className={styles.principles}>
            <li>
              <strong>{allWitnesses.length}</strong> verified{" "}
              {isQuran ? "Hijazi / 1st-century AH" : "Greek NT papyri"} in this
              dataset
            </li>
            <li>
              <strong>Original Arabic</strong> (diplomatic rasm) +{" "}
              <strong>Pickthall English</strong> (PD 1930) on Qurʾān cards;{" "}
              <strong>CNTR Greek</strong> + <strong>WEB</strong> on NT cards
            </li>
            <li>
              <strong>{withImages}</strong> with PD/CC photographs from{" "}
              <a
                href="https://commons.wikimedia.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Wikimedia Commons
              </a>
              ; others link to library viewers
            </li>
            <li>
              Catalog:{" "}
              {isQuran ? (
                <a
                  href="https://corpuscoranicum.org/en/manuscripts"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Corpus Coranicum
                </a>
              ) : (
                <a
                  href="https://ntvmr.uni-muenster.de/liste/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  INTF Liste
                </a>
              )}
            </li>
          </ul>
          {isQuran && (
            <p className={styles.completeness}>
              Hand-curated seed of well-sourced Hijazi witnesses overlapping 1–100
              AH. Later Kufic display mushafs (8th–9th c.) are out of scope
              unless their published range overlaps this window.
            </p>
          )}
        </div>
      </header>

      <section className={styles.controls}>
        <div className={styles.yearPicker}>
          <label htmlFor="year-input" className={styles.label}>
            Year (CE)
          </label>
          <button
            type="button"
            className={styles.stepBtn}
            onClick={() =>
              setSelectedYear((y) => Math.max(timelineStart, y - 10))
            }
          >
            −10
          </button>
          <input
            id="year-input"
            type="range"
            min={timelineStart}
            max={timelineEnd}
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className={styles.slider}
          />
          <button
            type="button"
            className={styles.stepBtn}
            onClick={() =>
              setSelectedYear((y) => Math.min(timelineEnd, y + 10))
            }
          >
            +10
          </button>
          <span className={styles.yearDisplay}>{formatYear(selectedYear)}</span>
        </div>

        <div className={styles.filters}>
          <input
            type="search"
            placeholder={
              isQuran ? "Search shelfmark (e.g. Mingana 1572a)…" : "Search GA (e.g. P52)…"
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.search}
            aria-label="Search manuscripts"
          />
          {!isQuran &&
            (["all", "gospels", "paul", "other"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                className={`${styles.filterBtn} ${bookFilter === cat ? styles.filterActive : ""}`}
                onClick={() => setBookFilter(cat)}
              >
                {cat === "all"
                  ? "All"
                  : cat === "gospels"
                    ? "Gospels"
                    : cat === "paul"
                      ? "Paul"
                      : "Other"}
              </button>
            ))}
        </div>
      </section>

      <section className={styles.timelineSection}>
        <Timeline
          selectedYear={selectedYear}
          onYearSelect={setSelectedYear}
          filteredWitnesses={filteredAll}
          timelineStart={timelineStart}
          timelineEnd={timelineEnd}
          showAhTicks={isQuran}
        />
      </section>

      <section className={styles.witnessesSection}>
        <h2 className={styles.sectionTitle}>
          {activeWitnesses.length} witness
          {activeWitnesses.length !== 1 ? "es" : ""} overlapping{" "}
          {formatYear(selectedYear)}
          <span className={styles.subtitle}>
            (of {allWitnesses.length} in the{" "}
            {isQuran
              ? `1–100 AH / ~${QURAN_TIMELINE_START}–${QURAN_TIMELINE_END} CE`
              : `${TIMELINE_START}–${TIMELINE_END} CE`}{" "}
            dataset)
          </span>
        </h2>

        {activeWitnesses.length > 0 ? (
          <div className={styles.cardGrid}>
            {activeWitnesses.map((w) => (
              <WitnessCard key={w.id} witness={w} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p>
              No witnesses in this dataset overlap {formatYear(selectedYear)}.
            </p>
            <p className={styles.emptyHint}>
              Try another year or clear search filters. Dates are ranges — a
              witness dated IV CE (300–399) overlaps year 300 at the boundary
              only.
            </p>
          </div>
        )}
      </section>

      <footer className={styles.footer}>
        <p>
          {isQuran ? (
            <>
              Catalog via{" "}
              <a href="https://corpuscoranicum.org/" target="_blank" rel="noreferrer">
                Corpus Coranicum
              </a>{" "}
              (CC BY 4.0 metadata). v1 covers 1–100 AH Hijazi witnesses only.
            </>
          ) : (
            <>
              Not a replacement for{" "}
              <a href="https://ntvmr.uni-muenster.de/" target="_blank" rel="noreferrer">
                NTVMR
              </a>
              , INTF, or ECM. v1 covers {TIMELINE_START}–{TIMELINE_END} CE Greek
              NT papyri.
            </>
          )}
        </p>
      </footer>
    </main>
  );
}
