"use client";

import { useEffect, useState } from "react";
import StudentPrimer from "./StudentPrimer";
import styles from "./HomePrimerBanner.module.css";

const STORAGE_KEY = "im-primer-dismissed";

export default function HomePrimerBanner() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (!dismissed) setOpen(true);
    } catch {
      setOpen(false);
    }
  }, []);

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  if (!mounted) return null;

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? "Hide" : "Show"} student primer
      </button>
      {open && (
        <div className={styles.panel}>
          <button
            type="button"
            className={styles.dismiss}
            onClick={dismiss}
            aria-label="Dismiss primer on future visits"
          >
            Don&apos;t show again
          </button>
          <StudentPrimer compact />
        </div>
      )}
    </div>
  );
}
