export type Corpus = "nt" | "quran" | "nag-hammadi" | "ot" | "lxx" | "version" | "other";
export type QuranScript = "hijazi" | "kufic" | "other";

export interface PalimpsestLayer {
  id: string;
  label: string;
  description: string;
}
export type Material =
  | "papyrus"
  | "parchment"
  | "ostracon"
  | "inscription"
  | "other";
export type ImagePolicy = "hosted" | "iiif" | "link_only" | "missing";
export type ImageSource = "commons" | "iiif";
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
  ga?: string;
  file?: string;
  commons_title?: string;
  commons_url?: string;
  download_url?: string;
  license: string;
  license_url?: string;
  artist?: string;
  credit?: string;
  institution?: string;
  license_note?: string;
  viewer_url?: string;
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
  /** Hijri range when known (Quran corpus). */
  ah_start?: number | null;
  ah_end?: number | null;
  date_label: string;
  date_note: string;
  dating_method: string;
  dating_source: string;
  find_place: string;
  find_year_or_note: string;
  current_institution: string;
  current_shelfmark: string;
  script?: QuranScript;
  palimpsest?: boolean;
  layers?: PalimpsestLayer[] | null;
  corpus_coranicum_url?: string;
  /** Nag Hammadi tractate title (e.g. Gospel of Thomas). */
  tractate?: string;
  /** Nag Hammadi catalog siglum (e.g. CG II,2). */
  nhc_siglum?: string;
  claremont_url?: string;
  library_url?: string;
  image_policy: ImagePolicy;
  hosted_image: string | null;
  /** Remote IIIF Image API URL (library-hosted; not scraped). */
  iiif_manifest?: string;
  iiif_image_url?: string;
  image_source?: ImageSource;
  image_attribution: ImageAttribution | null;
  commons_url?: string;
  source_page_url?: string;
  ntvmr_url?: string;
  csntm_url?: string;
  cntr_url?: string;
  docID?: number;
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

export function formatAhYear(ah: number): string {
  if (ah <= 0) return "pre-1 AH";
  return `${ah} AH`;
}

export function formatAhRange(start: number | null | undefined, end: number | null | undefined): string | null {
  if (start == null && end == null) return null;
  if (start != null && end != null) {
    if (start <= 0 && end > 0) return `pre-1 – ${end} AH`;
    if (start === end) return formatAhYear(start);
    return `${formatAhYear(start)} – ${formatAhYear(end)}`;
  }
  if (start != null) return `${formatAhYear(start)}+`;
  return `≤ ${formatAhYear(end!)}`;
}

/** Rough CE→AH label for timeline ticks (linear map 622 CE = 1 AH, 719 CE ≈ 100 AH). */
export function ceToAhTick(ce: number): number {
  return Math.round(((ce - 622) / (719 - 622)) * 99 + 1);
}

export function formatDualDateRange(
  ceStart: number,
  ceEnd: number,
  ahStart?: number | null,
  ahEnd?: number | null
): string {
  const ce = formatDateRange(ceStart, ceEnd);
  const ah = formatAhRange(ahStart, ahEnd);
  return ah ? `${ce} · ${ah}` : ce;
}

export function formatDateRange(start: number, end: number): string {
  if (start === end) return formatYear(start);
  return `${formatYear(start)} – ${formatYear(end)}`;
}

export function witnessOverlapsYear(witness: Witness, year: number): boolean {
  return year >= witness.date_start && year <= witness.date_end;
}

export function witnessHasDisplayImage(witness: Witness): boolean {
  return Boolean(
    witness.hosted_image ||
      (witness.image_policy === "iiif" && witness.iiif_image_url)
  );
}
