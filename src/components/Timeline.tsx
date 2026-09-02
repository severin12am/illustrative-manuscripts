"use client";

import { useMemo, useState } from "react";
import styles from "./Timeline.module.css";
import { witnesses, getTimelineBounds } from "@/data/witnesses";
import type { Witness } from "@/types/witness";
import { formatYear } from "@/types/witness";

interface TimelineProps {
  onYearSelect: (year: number) => void;
  selectedYear: number;
}

export default function Timeline({ onYearSelect, selectedYear }: TimelineProps) {
  const bounds = getTimelineBounds();
  const padding = 50;
  const min = bounds.min - padding;
  const max = bounds.max + padding;

  const ticks = useMemo(() => {
    const result: number[] = [];
    const step = 100;
    const start = Math.ceil(min / step) * step;
    for (let y = start; y <= max; y += step) {
      result.push(y);
    }
    return result;
  }, [min, max]);

  const yearToPercent = (year: number) => ((year - min) / (max - min)) * 100;

  const witnessBars = useMemo(() => {
    return witnesses.map((w) => ({
      witness: w,
      left: yearToPercent(w.date_start),
      width: Math.max(yearToPercent(w.date_end) - yearToPercent(w.date_start), 1.5),
    }));
  }, [min, max]);

  return (
    <div className={styles.timeline}>
      <div className={styles.axis}>
        {ticks.map((year) => (
          <button
            key={year}
            className={`${styles.tick} ${selectedYear === year ? styles.tickActive : ""}`}
            style={{ left: `${yearToPercent(year)}%` }}
            onClick={() => onYearSelect(year)}
            aria-label={`Select year ${formatYear(year)}`}
          >
            <span className={styles.tickMark} />
            <span className={styles.tickLabel}>{formatYear(year)}</span>
          </button>
        ))}
      </div>

      <div className={styles.track}>
        <div
          className={styles.cursor}
          style={{ left: `${yearToPercent(selectedYear)}%` }}
          aria-hidden
        />
        {witnessBars.map(({ witness, left, width }) => (
          <WitnessBar
            key={witness.id}
            witness={witness}
            left={left}
            width={width}
            selectedYear={selectedYear}
            onSelect={() =>
              onYearSelect(
                Math.round((witness.date_start + witness.date_end) / 2)
              )
            }
          />
        ))}
      </div>
    </div>
  );
}

function WitnessBar({
  witness,
  left,
  width,
  selectedYear,
  onSelect,
}: {
  witness: Witness;
  left: number;
  width: number;
  selectedYear: number;
  onSelect: () => void;
}) {
  const active =
    selectedYear >= witness.date_start && selectedYear <= witness.date_end;

  return (
    <button
      className={`${styles.bar} ${active ? styles.barActive : ""}`}
      style={{ left: `${left}%`, width: `${width}%` }}
      onClick={onSelect}
      title={`${witness.traditional_name} (${formatYear(witness.date_start)} – ${formatYear(witness.date_end)})`}
      aria-label={`${witness.traditional_name}, ${formatYear(witness.date_start)} to ${formatYear(witness.date_end)}`}
    >
      <span className={styles.barLabel}>{witness.traditional_name}</span>
    </button>
  );
}
