"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { assetUrl } from "@/lib/assetUrl";
import { globalSearchFilter, groupSearchResults } from "@/lib/globalSearch";
import type { GlobalSearchIndex, GlobalSearchItem, GlobalSearchKind } from "@/types/globalSearch";
import {
  GLOBAL_SEARCH_GROUP_LABEL,
  GLOBAL_SEARCH_GROUP_ORDER,
} from "@/types/globalSearch";
import styles from "./SiteNav.module.css";

type FlatRow =
  | { type: "heading"; kind: GlobalSearchKind }
  | { type: "item"; item: GlobalSearchItem; index: number };

function buildFlatRows(items: GlobalSearchItem[]): FlatRow[] {
  const grouped = groupSearchResults(items);
  const rows: FlatRow[] = [];
  let index = 0;
  for (const kind of GLOBAL_SEARCH_GROUP_ORDER) {
    const list = grouped.get(kind);
    if (!list?.length) continue;
    rows.push({ type: "heading", kind });
    for (const item of list) {
      rows.push({ type: "item", item, index });
      index += 1;
    }
  }
  return rows;
}

export default function SiteNavSearch() {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<GlobalSearchIndex | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(assetUrl("/search-index.json"))
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<GlobalSearchIndex>;
      })
      .then((data) => {
        if (!cancelled) setIndex(data);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const results = useMemo(() => {
    if (!index || !query.trim()) return [];
    return globalSearchFilter(index.items, query);
  }, [index, query]);

  const flatRows = useMemo(() => buildFlatRows(results), [results]);
  const selectableRows = useMemo(
    () => flatRows.filter((r): r is FlatRow & { type: "item" } => r.type === "item"),
    [flatRows]
  );

  const navigateTo = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      setActiveIndex(-1);
      router.push(href);
    },
    [router]
  );

  const submitWitnessFallback = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = query.trim();
      if (!q) return;
      if (activeIndex >= 0 && selectableRows[activeIndex]) {
        navigateTo(selectableRows[activeIndex].item.href);
        return;
      }
      if (results.length === 1) {
        navigateTo(results[0].href);
        return;
      }
      navigateTo(`/?q=${encodeURIComponent(q)}`);
    },
    [query, activeIndex, selectableRows, results, navigateTo]
  );

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
      return;
    }
    if (!selectableRows.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => (i + 1) % selectableRows.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => (i <= 0 ? selectableRows.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      navigateTo(selectableRows[activeIndex].item.href);
    }
  };

  const showPanel = open && query.trim().length > 0;

  return (
    <div className={styles.searchRoot} ref={rootRef}>
      <form className={styles.searchForm} onSubmit={submitWitnessFallback} role="search">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query.trim() && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search site…"
          className={styles.searchInput}
          aria-label="Search witnesses, famous passages, claims, and Uthmanic rasm"
          aria-expanded={showPanel}
          aria-controls={showPanel ? listId : undefined}
          aria-autocomplete="list"
          autoComplete="off"
        />
      </form>
      {showPanel && (
        <div className={styles.searchPanel} id={listId} role="listbox" aria-label="Search results">
          {loadError && (
            <p className={styles.searchEmpty}>Search index unavailable — try timeline search.</p>
          )}
          {!loadError && !index && (
            <p className={styles.searchEmpty}>Loading search index…</p>
          )}
          {!loadError && index && results.length === 0 && (
            <p className={styles.searchEmpty}>
              No curated matches. Press Enter to search witnesses on the timeline.
            </p>
          )}
          {!loadError && index && results.length > 0 && (
            <ul className={styles.searchResults}>
              {flatRows.map((row) => {
                if (row.type === "heading") {
                  return (
                    <li key={`h-${row.kind}`} className={styles.searchGroupLabel} role="presentation">
                      {GLOBAL_SEARCH_GROUP_LABEL[row.kind]}
                    </li>
                  );
                }
                const isActive = selectableRows[activeIndex]?.index === row.index;
                return (
                  <li key={`${row.item.kind}-${row.item.id}`} role="option" aria-selected={isActive}>
                    <Link
                      href={row.item.href}
                      className={isActive ? styles.searchHitActive : styles.searchHit}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setOpen(false);
                        setQuery("");
                      }}
                    >
                      <span className={styles.searchHitLabel}>{row.item.label}</span>
                      {row.item.subtitle && (
                        <span className={styles.searchHitSub}>{row.item.subtitle}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
