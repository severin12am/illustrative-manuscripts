import type { VariantKind } from "@/types/text";

export interface VariantIndexEntry {
  unit_id: string;
  witness_id: string;
  witness_slug: string | null;
  verse_ref: string;
  esn: number;
  book: string;
  book_id: number;
  chapter: number;
  verse: number;
  kind: VariantKind;
  witness_reading: string;
  sr_reading: string;
  context_left: string | null;
  context_right: string | null;
  word_start?: number;
  word_end?: number;
  cntr_url: string | null;
}

export interface VariantIndex {
  generated_at: string;
  definition: string;
  base_text: string;
  total: number;
  by_kind: Record<string, number>;
  witness_count: number;
  book_count: number;
  books: string[];
  witnesses: string[];
  featured_examples: VariantIndexEntry[];
  units: VariantIndexEntry[];
}
