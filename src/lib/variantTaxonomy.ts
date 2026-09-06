export const VARIANT_KIND_ORDER = [
  "orthography",
  "omission",
  "addition",
  "substitution",
  "transposition",
  "uncertain",
] as const;

export type TaxonomyKind = (typeof VARIANT_KIND_ORDER)[number];

export const VARIANT_KIND_LABELS: Record<string, string> = {
  orthography: "Orthography",
  omission: "Omission",
  addition: "Addition",
  substitution: "Substitution",
  transposition: "Transposition",
  uncertain: "Uncertain",
};

export const VARIANT_KIND_DEFINITIONS: Record<string, string> = {
  orthography:
    "Spelling or pronunciation spelling only (itacism, movable nu, nomina sacra, diacritic/breathing-insensitive).",
  omission:
    "SR GNT has word(s) the witness lacks in the aligned extant span.",
  addition:
    "Witness has word(s) SR GNT lacks in the aligned extant span.",
  substitution:
    "Different lexical content at the same aligned position (not explainable as orthography alone).",
  transposition:
    "Same letters or word multiset in different order (cheap mechanical check only; may miss complex cases).",
  uncertain:
    "Alignment too messy for a confident mechanical kind.",
};

export function kindLabel(kind: string): string {
  return VARIANT_KIND_LABELS[kind] ?? kind.replace(/_/g, " ");
}

export function sortKindEntries(
  byKind: Record<string, number>
): [string, number][] {
  return Object.entries(byKind).sort((a, b) => {
    const ai = VARIANT_KIND_ORDER.indexOf(a[0] as TaxonomyKind);
    const bi = VARIANT_KIND_ORDER.indexOf(b[0] as TaxonomyKind);
    const rankA = ai === -1 ? 99 : ai;
    const rankB = bi === -1 ? 99 : bi;
    if (rankA !== rankB) return rankA - rankB;
    return b[1] - a[1];
  });
}
