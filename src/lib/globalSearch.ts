import type { GlobalSearchItem, GlobalSearchKind } from "@/types/globalSearch";
import { GLOBAL_SEARCH_GROUP_ORDER } from "@/types/globalSearch";

const MAX_PER_GROUP = 6;
const MAX_TOTAL = 20;

function normalizeQuery(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}

/** AND-match tokens against haystack; also match verse refs with flexible spacing. */
export function globalSearchFilter(
  items: GlobalSearchItem[],
  query: string
): GlobalSearchItem[] {
  const q = normalizeQuery(query);
  if (!q) return [];

  const tokens = q.split(" ").filter(Boolean);
  const compact = q.replace(/\s/g, "");

  const matched = items.filter((item) => {
    const h = item.haystack;
    const hCompact = h.replace(/\s/g, "");
    if (tokens.every((t) => h.includes(t) || hCompact.includes(t.replace(/\s/g, "")))) {
      return true;
    }
    if (compact.length >= 3 && hCompact.includes(compact)) return true;
    return false;
  });

  const byKind = new Map<GlobalSearchKind, GlobalSearchItem[]>();
  for (const item of matched) {
    const list = byKind.get(item.kind) ?? [];
    if (list.length < MAX_PER_GROUP) {
      list.push(item);
      byKind.set(item.kind, list);
    }
  }

  const out: GlobalSearchItem[] = [];
  for (const kind of GLOBAL_SEARCH_GROUP_ORDER) {
    const list = byKind.get(kind);
    if (!list) continue;
    for (const item of list) {
      if (out.length >= MAX_TOTAL) break;
      out.push(item);
    }
  }
  return out;
}

export function groupSearchResults(items: GlobalSearchItem[]): Map<GlobalSearchKind, GlobalSearchItem[]> {
  const map = new Map<GlobalSearchKind, GlobalSearchItem[]>();
  for (const item of items) {
    const list = map.get(item.kind) ?? [];
    list.push(item);
    map.set(item.kind, list);
  }
  return map;
}
