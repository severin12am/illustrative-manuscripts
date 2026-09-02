export type Corpus = "nt" | "ot" | "lxx" | "version" | "other";
export type Material =
  | "papyrus"
  | "parchment"
  | "ostracon"
  | "inscription"
  | "other";
export type ImagePolicy = "hosted" | "link_only" | "missing";

export interface KnownVariant {
  locus: string;
  witness_reading: string;
  modern_reading: string;
  significance: string;
}

export interface BibliographyEntry {
  title: string;
  url: string;
  note?: string;
}

export interface Witness {
  id: string;
  traditional_name: string;
  aliases: string[];
  corpus: Corpus;
  language: string;
  material: Material;
  contents: string;
  date_start: number;
  date_end: number;
  date_note: string;
  find_place: string;
  find_year_or_note: string;
  current_institution: string;
  current_shelfmark: string;
  image_policy: ImagePolicy;
  image_url?: string;
  source_page_url?: string;
  transcription_url?: string;
  translation: string;
  modern_base_text: string;
  known_variants: KnownVariant[];
  bibliography: BibliographyEntry[];
  license_note: string;
}

export function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  if (year === 0) return "1 BCE/CE";
  return `${year} CE`;
}

export function formatDateRange(start: number, end: number): string {
  if (start === end) return formatYear(start);
  return `${formatYear(start)} – ${formatYear(end)}`;
}

export function witnessOverlapsYear(witness: Witness, year: number): boolean {
  return year >= witness.date_start && year <= witness.date_end;
}
