export interface HebrewLxxTextUnit {
  reference: string;
  tradition: "hebrew" | "lxx";
  original: string | null;
  original_label: string;
  original_source: string;
  english: string;
  english_label: string;
  english_source: string;
  note?: string;
}

export interface HebrewLxxWitnessText {
  available: boolean;
  message: string | null;
  source?: string;
  translation_base?: string;
  translation_label?: string;
  original_base?: string;
  library_url?: string;
  leon_levy_url?: string;
  rahlfs?: string;
  total_units?: number;
  initial_units: HebrewLxxTextUnit[];
  attribution?: string | null;
}

export interface HebrewLxxTextBundle {
  generated_at: string;
  sources: Record<string, string>;
  texts: Record<string, HebrewLxxWitnessText>;
}
