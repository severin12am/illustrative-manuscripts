export interface CompareRow {
  esn: number;
  verse_ref: string;
  book: string;
  word_index: number;
  sr_reading: string;
  reading_a: string;
  reading_b: string;
  disagrees: boolean;
  kind_a: string | null;
  kind_b: string | null;
}

export interface CompareResult {
  witness_a: string;
  witness_b: string;
  book_filter: string | null;
  overlap_verses: number;
  comparable_rows: number;
  disagreement_rows: number;
  rows: CompareRow[];
}
