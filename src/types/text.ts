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

export interface VariantUnit {
  locus: string;
  sr_reading: string;
  witness_reading: string;
  note: string;
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
  variant: VariantUnit | null;
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
  initial_verses: TextVerse[];
  more_verses?: TextVerse[];
  attribution?: string | null;
}

export interface WitnessTextBundle {
  generated_at: string;
  sources: Record<string, string>;
  texts: Record<string, WitnessText>;
}
