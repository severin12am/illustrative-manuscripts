export type VariantKind =
  | "orthography"
  | "omission"
  | "addition"
  | "substitution"
  | "transposition"
  | "nonsense"
  | "harmonization"
  | "uncertain";

export type VariantIntention = "error" | "likely_intentional" | "uncertain";

export type VariantSource = "cntr" | "igntp" | "manual";

export interface VariantLocus {
  book: string;
  book_id: number;
  chapter: number;
  verse: number;
  reference: string;
  word_start?: number;
  word_end?: number;
}

/** Taxonomy-ready variant unit (CNTR / IGNTP / manual). */
export interface VariantUnit {
  locus: VariantLocus;
  witness_reading: string;
  base_reading: string;
  base_text: string;
  kind: VariantKind;
  intention: VariantIntention;
  source: VariantSource;
  note?: string;
}

export interface GreekSegment {
  kind:
    | "text"
    | "missing"
    | "damaged"
    | "lacuna"
    | "supplied"
    | "linebreak"
    | "pagebreak";
  value?: string;
  nomina?: boolean;
  vid?: boolean;
}

export interface TextVerse {
  reference: string;
  book_id: number;
  chapter: number;
  verse: number;
  esn: number;
  greek: GreekSegment[];
  greek_lines: GreekSegment[][];
  greek_plain: string;
  english_web: string;
  english_adapted: string;
  has_variant: boolean;
  variants: VariantUnit[];
}

export interface WitnessText {
  available: boolean;
  message: string | null;
  source?: string;
  translation_base?: string;
  translation_label?: string;
  cntr_url?: string;
  cntr_file?: string;
  total_verses?: number;
  more_count?: number;
  /** Variant units in initial_verses (photo-matched / first paint). */
  difference_count?: number;
  base_text?: string;
  initial_verses: TextVerse[];
  more_verses?: TextVerse[];
  attribution?: string | null;
}

export interface WitnessTextBundle {
  generated_at: string;
  sources: Record<string, string>;
  texts: Record<string, WitnessText>;
}

export function countVariants(verses: TextVerse[]): number {
  return verses.reduce((n, v) => n + (v.variants?.length ?? 0), 0);
}

export function formatLocus(locus: VariantLocus): string {
  if (locus.word_start !== undefined) {
    const range =
      locus.word_end !== undefined && locus.word_end !== locus.word_start
        ? `${locus.word_start}–${locus.word_end}`
        : `${locus.word_start}`;
    return `${locus.reference} (word ${range})`;
  }
  return locus.reference;
}
