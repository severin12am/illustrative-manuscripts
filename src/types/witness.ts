export type Corpus = "nt" | "ot" | "lxx" | "version" | "other";
export type Material =
  | "papyrus"
  | "parchment"
  | "ostracon"
  | "inscription"
  | "other";
export type ImagePolicy = "hosted" | "link_only" | "missing";
export type BookCategory = "gospels" | "paul" | "other" | "all";

export interface KnownVariant {
  locus: string;
  witness_reading: string;
  modern_reading: string;
  significance: string;
  base_text?: string;
}

export interface BibliographyEntry {
  title: string;
  url: string;
  note?: string;
}

export interface ImageAttribution {
  ga: string;
  file: string;
  commons_title: string;
  commons_url: string;
  download_url?: string;
  license: string;
  license_url?: string;
  artist?: string;
  credit?: string;
  attribution_required: boolean;
  note?: string;
}

export interface Witness {
  id: string;
  ga_number: string;
  traditional_name: string;
  aliases: string[];
  corpus: Corpus;
  book_category: BookCategory;
  language: string;
  material: Material;
  contents: string;
  date_start: number;
  date_end: number;
  date_label: string;
  date_note: string;
  dating_method: string;
  dating_source: string;
  find_place: string;
  find_year_or_note: string;
  current_institution: string;
  current_shelfmark: string;
  image_policy: ImagePolicy;
  hosted_image: string | null;
  image_attribution: ImageAttribution | null;
  commons_url?: string;
  source_page_url?: string;
  ntvmr_url: string;
  csntm_url?: string;
  cntr_url?: string;
  docID: number;
  translation: string;
  modern_base_text: string;
  known_variants: KnownVariant[];
  bibliography: BibliographyEntry[];
  license_note: string;
}

export function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
}

export function formatDateRange(start: number, end: number): string {
  if (start === end) return formatYear(start);
  return `${formatYear(start)} – ${formatYear(end)}`;
}

export function witnessOverlapsYear(witness: Witness, year: number): boolean {
  return year >= witness.date_start && year <= witness.date_end;
}
