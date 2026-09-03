"use client";

import { useMemo, useState } from "react";
import styles from "./page.module.css";
import Timeline from "@/components/Timeline";
import WitnessCard from "@/components/WitnessCard";
import {
  witnesses,
  TIMELINE_START,
  TIMELINE_END,
  getWitnessesForYear,
} from "@/data/witnesses";
import type { BookCategory } from "@/types/witness";
import { formatYear } from "@/types/witness";

export default function Home() {
  const [selectedYear, setSelectedYear] = useState(150);
  const [bookFilter, setBookFilter] = useState<BookCategory | "all">("all");
  const [search, setSearch] = useState("");

  const filteredAll = useMemo(() => {
    return witnesses.filter((w) => {
      if (bookFilter !== "all" && w.book_category !== bookFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !w.ga_number.toLowerCase().includes(q) &&
          !w.contents.toLowerCase().includes(q) &&
          !w.current_shelfmark.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [bookFilter, search]);

  const activeWitnesses = useMemo(() => {
    return getWitnessesForYear(selectedYear).filter((w) =>
      filteredAll.some((f) => f.id === w.id)
    );
  }, [selectedYear, filteredAll]);

  const withImages = witnesses.filter((w) => w.hosted_image).length;

  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>
            Greek New Testament papyri · {TIMELINE_START}–{TIMELINE_END} CE
          </p>
          <h1 className={styles.title}>Illustrative Manuscripts</h1>
          <p className={styles.lead}>
            A year-by-year slice through early biblical manuscripts. Every
            witness is dated as a <strong>paleographic range</strong>, not a
            single year — scrub the timeline to see what could have existed in
            a given moment.
          </p>
          <ul className={styles.principles}>
            <li>
              <strong>{witnesses.length}</strong> Greek NT papyri whose Liste
              date overlaps {TIMELINE_START}–{TIMELINE_END} CE
            </li>
            <li>
              <strong>Original Greek</strong> (CNTR diplomatic) +{" "}
              <strong>English of this fragment</strong> (WEB, public domain)
              on every card with a CNTR file
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
              ; the rest link to NTVMR/CSNTM viewers
            </li>
            <li>
              Metadata from{" "}
              <a
                href="https://ntvmr.uni-muenster.de/liste/"
                target="_blank"
                rel="noopener noreferrer"
              >
                INTF Liste
              </a>
              ; variants vs{" "}
              <a
                href="https://github.com/LogosBible/SBLGNT"
                target="_blank"
                rel="noopener noreferrer"
              >
                SBLGNT
              </a>
              /{" "}
              <a
                href="https://greekcntr.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                SR GNT (CNTR)
              </a>
            </li>
          </ul>
        </div>
      </header>

      <section className={styles.controls}>
        <div className={styles.yearPicker}>
          <label htmlFor="year-input" className={styles.label}>
            Year
          </label>
          <button
            type="button"
            className={styles.stepBtn}
            onClick={() =>
              setSelectedYear((y) => Math.max(TIMELINE_START, y - 10))
            }
          >
            −10
          </button>
          <input
            id="year-input"
            type="range"
            min={TIMELINE_START}
            max={TIMELINE_END}
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className={styles.slider}
          />
          <button
            type="button"
            className={styles.stepBtn}
            onClick={() =>
              setSelectedYear((y) => Math.min(TIMELINE_END, y + 10))
            }
          >
            +10
          </button>
          <span className={styles.yearDisplay}>{formatYear(selectedYear)}</span>
        </div>

        <div className={styles.filters}>
          <input
            type="search"
            placeholder="Search GA (e.g. P52)…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.search}
            aria-label="Search by Gregory-Aland number"
          />
          {(["all", "gospels", "paul", "other"] as const).map((cat) => (
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
        />
      </section>

      <section className={styles.witnessesSection}>
        <h2 className={styles.sectionTitle}>
          {activeWitnesses.length} witness
          {activeWitnesses.length !== 1 ? "es" : ""} overlapping{" "}
          {formatYear(selectedYear)}
          <span className={styles.subtitle}>
            (of {witnesses.length} in the {TIMELINE_START}–{TIMELINE_END} CE
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
              Try another year, or clear the book/search filters. Remember:
              dates are ranges — e.g. a papyrus dated IV CE (300–399) overlaps
              year 300 at the boundary; one dated 325–399 does not appear in
              the 1–300 window.
            </p>
          </div>
        )}
      </section>

      <footer className={styles.footer}>
        <p>
          Not a replacement for{" "}
          <a href="https://ntvmr.uni-muenster.de/" target="_blank" rel="noreferrer">
            NTVMR
          </a>
          ,{" "}
          <a href="https://www.uni-muenster.de/INTF/" target="_blank" rel="noreferrer">
            INTF
          </a>
          , or ECM. v1 covers {TIMELINE_START}–{TIMELINE_END} CE only.
        </p>
      </footer>
    </main>
  );
}
