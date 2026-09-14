export type GlobalSearchKind = "witness" | "famous" | "claim" | "uthmani";

export interface GlobalSearchItem {
  kind: GlobalSearchKind;
  id: string;
  label: string;
  subtitle: string;
  href: string;
  haystack: string;
}

export interface GlobalSearchIndex {
  generated_at: string;
  version: number;
  counts: Record<string, number>;
  items: GlobalSearchItem[];
}

export const GLOBAL_SEARCH_GROUP_LABEL: Record<GlobalSearchKind, string> = {
  witness: "Witnesses",
  famous: "Famous passages",
  claim: "Use / claims",
  uthmani: "Uthmanic rasm",
};

export const GLOBAL_SEARCH_GROUP_ORDER: GlobalSearchKind[] = [
  "witness",
  "famous",
  "claim",
  "uthmani",
];
