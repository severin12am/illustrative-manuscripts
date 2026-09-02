"use client";

import { useMemo } from "react";
import styles from "./Timeline.module.css";
import { TIMELINE_START, TIMELINE_END } from "@/data/witnesses";
import type { Witness } from "@/types/witness";
import { formatYear } from "@/types/witness";

interface TimelineProps {
  onYearSelect: (year: number) => void;
  selectedYear: number;
  filteredWitnesses: Witness[];
}

export default function Timeline({
  onYearSelect,
  selectedYear,
  filteredWitnesses,
}: TimelineProps) {
  const min = TIMELINE_START;
  const max = TIMELINE_END;

  const ticks = useMemo(() => {
    const result: number[] = [];
    for (let y = 25; y <= max; y += 25) result.push(y);
    if (!result.includes(1)) result.unshift(1);
    if (!result.includes(200)) result.push(200);
    return result.sort((a, b) => a - b);
  }, [max]);

  const yearToPercent = (year: number) =>
    ((year - min) / (max - min)) * 100;

  const witnessBars = useMemo(() => {
    return filteredWitnesses.map((w, i) => ({
      witness: w,
      left: yearToPercent(Math.max(w.date_start, min)),
      width: Math.max(
        yearToPercent(Math.min(w.date_end, max)) -
          yearToPercent(Math.max(w.date_start, min)),
        0.8
      ),
      row: i % 4,
    }));
  }, [filteredWitnesses, min, max]);

  return (
    <div className={styles.timeline}>
      <div className={styles.header}>
        <span className={styles.rangeLabel}>
          {formatYear(TIMELINE_START)} – {formatYear(TIMELINE_END)}
        </span>
        <span className={styles.hint}>
          Dates are paleographic ranges — scrub a year to slice through them
        </span>
      </div>

      <div className={styles.axis}>
        {ticks.map((year) => (
          <button
            key={year}
            type="button"
            className={`${styles.tick} ${selectedYear === year ? styles.tickActive : ""}`}
            style={{ left: `${yearToPercent(year)}%` }}
            onClick={() => onYearSelect(year)}
            aria-label={`Select year ${formatYear(year)}`}
          >
            <span className={styles.tickMark} />
            <span className={styles.tickLabel}>{year}</span>
          </button>
        ))}
      </div>

      <div className={styles.track}>
        <div
          className={styles.cursor}
          style={{ left: `${yearToPercent(selectedYear)}%` }}
          aria-hidden
        />
        {witnessBars.map(({ witness, left, width, row }) => {
          const active =
            selectedYear >= witness.date_start &&
            selectedYear <= witness.date_end;
          return (
            <button
              key={witness.id}
              type="button"
              className={`${styles.bar} ${active ? styles.barActive : ""}`}
              style={{
                left: `${left}%`,
                width: `${width}%`,
                top: `${8 + row * 28}px`,
              }}
              onClick={() =>
                onYearSelect(
                  Math.round((witness.date_start + witness.date_end) / 2)
                )
              }
              title={`${witness.ga_number}: ${formatYear(witness.date_start)}–${formatYear(witness.date_end)}`}
            >
              <span className={styles.barLabel}>{witness.ga_number}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
