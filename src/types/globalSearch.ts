export type GlobalSearchKind =
  | "witness"
  | "famous"
  | "variant"
  | "claim"
  | "uthmani"
  | "quran_archetype";

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
  variant: "Variants",
  claim: "Use / claims",
  uthmani: "Uthmanic rasm",
  quran_archetype: "Qurʾān archetype matrix",
};

export const GLOBAL_SEARCH_GROUP_ORDER: GlobalSearchKind[] = [
  "witness",
  "famous",
  "variant",
  "claim",
  "uthmani",
  "quran_archetype",
];
