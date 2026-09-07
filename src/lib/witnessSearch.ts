import type { Witness } from "@/types/witness";

/** Client-side witness filter for timeline / global search. */
export function witnessMatchesSearch(witness: Witness, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const haystack = [
    witness.ga_number,
    witness.traditional_name,
    witness.contents,
    witness.current_shelfmark,
    witness.current_institution,
    witness.find_place,
    witness.tractate,
    witness.nhc_siglum,
    ...(witness.aliases ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}

export function witnessSearchPlaceholder(corpus: "nt" | "quran" | "nag-hammadi"): string {
  switch (corpus) {
    case "quran":
      return "Search shelfmark, institution, passage…";
    case "nag-hammadi":
      return "Search tractate, codex siglum, institution…";
    default:
      return "Search GA (P52), book, shelfmark, institution…";
  }
}
