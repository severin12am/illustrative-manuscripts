"use client";

import { useMemo } from "react";
import styles from "./Timeline.module.css";
import type { Witness } from "@/types/witness";
import { ceToAhTick, formatYear } from "@/types/witness";

interface TimelineProps {
  onYearSelect: (year: number) => void;
  selectedYear: number;
  filteredWitnesses: Witness[];
  timelineStart: number;
  timelineEnd: number;
  showAhTicks?: boolean;
}

export default function Timeline({
  onYearSelect,
  selectedYear,
  filteredWitnesses,
  timelineStart,
  timelineEnd,
  showAhTicks = false,
}: TimelineProps) {
  const min = timelineStart;
  const max = timelineEnd;

  const ticks = useMemo(() => {
    const span = max - min;
    const step = span <= 120 ? 10 : 25;
    const result: number[] = [min];
    for (let y = min + step; y < max; y += step) result.push(y);
    if (!result.includes(max)) result.push(max);
    return result.sort((a, b) => a - b);
  }, [min, max]);

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
      row: i % 6,
    }));
  }, [filteredWitnesses, min, max]);

  return (
    <div className={styles.timeline}>
      <div className={styles.header}>
        <span className={styles.rangeLabel}>
          {formatYear(min)} – {formatYear(max)}
          {showAhTicks && (
            <span className={styles.ahRange}>
              {" "}
              (~{ceToAhTick(min)}–{ceToAhTick(max)} AH)
            </span>
          )}
        </span>
        <span className={styles.hint}>
          Dates are ranges — scrub a year to slice through them
          {showAhTicks && " (CE; AH labels approximate on ticks)"}
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
            <span className={styles.tickLabel}>
              {year}
              {showAhTicks && year >= 622 && (
                <span className={styles.tickAh}> ~{ceToAhTick(year)} AH</span>
              )}
            </span>
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
