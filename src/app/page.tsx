"use client";

import { useMemo, useState } from "react";
import styles from "./page.module.css";
import Timeline from "@/components/Timeline";
import WitnessCard from "@/components/WitnessCard";
import { witnesses, getWitnessesForYear } from "@/data/witnesses";
import { formatYear } from "@/types/witness";

export default function Home() {
  const [selectedYear, setSelectedYear] = useState(150);

  const activeWitnesses = useMemo(
    () => getWitnessesForYear(selectedYear),
    [selectedYear]
  );

  const allWitnessesSorted = useMemo(
    () => [...witnesses].sort((a, b) => a.date_start - b.date_start),
    []
  );

  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>A year-by-year history of the written Bible</p>
          <h1 className={styles.title}>Illustrative Manuscripts</h1>
          <p className={styles.subtitle}>
            Explore manuscripts, scraps, and written witnesses across two millennia.
            Select a year on the timeline to see what survives from that era.
          </p>
        </div>
      </header>

      <section className={styles.timelineSection}>
        <div className={styles.yearPicker}>
          <label htmlFor="year-input" className={styles.yearLabel}>
            Selected year
          </label>
          <div className={styles.yearControls}>
            <button
              className={styles.yearBtn}
              onClick={() => setSelectedYear((y) => y - 25)}
              aria-label="Go back 25 years"
            >
              −25
            </button>
            <input
              id="year-input"
              type="number"
              className={styles.yearInput}
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              min={-800}
              max={500}
            />
            <span className={styles.yearDisplay}>{formatYear(selectedYear)}</span>
            <button
              className={styles.yearBtn}
              onClick={() => setSelectedYear((y) => y + 25)}
              aria-label="Go forward 25 years"
            >
              +25
            </button>
          </div>
        </div>

        <Timeline
          selectedYear={selectedYear}
          onYearSelect={setSelectedYear}
        />
      </section>

      <section className={styles.witnessesSection}>
        <h2 className={styles.sectionTitle}>
          Witnesses active in {formatYear(selectedYear)}
          <span className={styles.count}>
            {activeWitnesses.length} of {witnesses.length}
          </span>
        </h2>

        {activeWitnesses.length > 0 ? (
          <div className={styles.cardGrid}>
            {activeWitnesses.map((w) => (
              <WitnessCard key={w.id} witness={w} />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>
            No seed witnesses overlap {formatYear(selectedYear)} in this v1
            dataset. Try another year on the timeline, or browse all witnesses
            below.
          </p>
        )}
      </section>

      <section className={styles.allSection}>
        <h2 className={styles.sectionTitle}>All seed witnesses</h2>
        <div className={styles.cardGrid}>
          {allWitnessesSorted.map((w) => (
            <WitnessCard key={w.id} witness={w} />
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <p>
          v1 scaffold — {witnesses.length} sample witnesses. Not a replacement for{" "}
          <a
            href="https://ntvmr.uni-muenster.de/"
            target="_blank"
            rel="noopener noreferrer"
          >
            NTVMR
          </a>
          ,{" "}
          <a
            href="https://www.uni-muenster.de/INTF/"
            target="_blank"
            rel="noopener noreferrer"
          >
            INTF
          </a>
          , or{" "}
          <a
            href="http://ntgreek.net/"
            target="_blank"
            rel="noopener noreferrer"
          >
            ECM
          </a>
          . Images link to holding institutions; none are hosted here.
        </p>
      </footer>
    </main>
  );
}
