export interface NagHammadiTextUnit {
  reference: string;
  tractate: string;
  logion: number | null;
  codex_page: number | null;
  coptic: string | null;
  coptic_label: string;
  coptic_source: string;
  english: string;
  english_label: string;
  english_source: string;
  note?: string;
}

export interface NagHammadiWitnessText {
  available: boolean;
  message: string | null;
  source?: string;
  translation_base?: string;
  translation_label?: string;
  coptic_base?: string;
  library_url?: string;
  claremont_url?: string;
  total_units?: number;
  initial_units: NagHammadiTextUnit[];
  attribution?: string | null;
}

export interface NagHammadiTextBundle {
  generated_at: string;
  sources: Record<string, string>;
  texts: Record<string, NagHammadiWitnessText>;
}
