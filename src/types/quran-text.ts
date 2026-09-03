export interface QuranVariantUnit {
  kind: string;
  witness_reading: string;
  base_reading: string;
  base_text: string;
  note?: string;
  source: string;
}

export interface QuranAyah {
  reference: string;
  surah: number;
  ayah: number;
  layer: string | null;
  arabic_witness: string | null;
  arabic_witness_label: string;
  arabic_witness_source: string;
  arabic_standard: string;
  arabic_standard_label: string;
  english_pickthall: string;
  english_label: string;
  has_variant: boolean;
  variants: QuranVariantUnit[];
  note?: string;
}

export interface QuranWitnessText {
  available: boolean;
  message: string | null;
  source?: string;
  translation_base?: string;
  translation_label?: string;
  arabic_base?: string;
  corpus_coranicum_url?: string;
  library_url?: string;
  total_ayahs?: number;
  difference_count?: number;
  initial_ayahs: QuranAyah[];
  attribution?: string | null;
}

export interface QuranTextBundle {
  generated_at: string;
  sources: Record<string, string>;
  texts: Record<string, QuranWitnessText>;
}

export function countQuranVariants(ayahs: QuranAyah[]): number {
  return ayahs.reduce((n, a) => n + (a.variants?.length ?? 0), 0);
}
