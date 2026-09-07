import type { IntentionalTaggingStats } from "@/types/intentionalTags";

export interface CoveragePerWitness {
  ga: string;
  id: string;
  cntr_transcription: boolean;
  leaf_image: boolean;
  nonzero_extant_comparison: boolean;
  extant_word_tokens: number;
  disagreements: number;
  disagreements_by_kind: Record<string, number>;
}

export interface BookDisagreementSummary {
  book_id: number;
  book: string;
  abbr: string;
  total: number;
  by_kind: Record<string, number>;
}

export interface CoverageData {
  generated_at: string;
  sources: Record<string, string>;
  greek_nt: {
    witness_count: number;
    cntr_transcription_count: number;
    cntr_missing: string[];
    leaf_image_count: number;
    nonzero_extant_comparison_count: number;
    lazy_load_overflow_files: number;
    extant_word_tokens: {
      definition: string;
      total: number;
    };
    disagreements: {
      definition: string;
      base_text: string;
      total: number;
      unit?: string;
      by_kind: Record<string, number>;
      per_witness_median: number;
      per_witness_max: number;
      witnesses_with_any: number;
      by_book?: BookDisagreementSummary[];
    };
    intl_liste_papyri: {
      window: number[];
      liste_in_window: number;
      included: number;
      missing: string[];
      included_percent: number;
      missing_percent: number;
    };
    per_witness: CoveragePerWitness[];
    intentional_tagging: IntentionalTaggingStats;
  };
  quran: {
    witness_count: number;
    leaf_image_count: number;
    leaf_image_fraction: number;
    variant_census_note: string;
  };
  nag_hammadi: {
    tractate_witness_count: number;
    leaf_image_count: number;
    leaf_image_fraction: number;
    collation_note: string;
  };
  primer_example: {
    witness: string;
    reference: string;
    witness_reading: string;
    base_reading: string;
    base_text: string;
    kind: string;
  } | null;
  home_stats: {
    greek_nt_witnesses: number;
    disagreements_total: number;
    disagreements_label: string;
  };
}
