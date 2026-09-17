export type NimatSpelling = "ta_marbuta" | "ta";

export interface NimatManuscriptColumn {
  siglum: string;
  label: string;
  our_witness_id: string | null;
  our_witness_ids?: string[];
  is_reference?: boolean;
  source?: string;
}

export interface NimatMatrixRow {
  id: string;
  ref: string;
  surah: number;
  ayah: number;
  cairo: NimatSpelling;
  readings: Partial<Record<string, NimatSpelling>>;
  disagreement_locus?: boolean;
  disagreement_note?: string;
  cell_notes?: Record<string, string>;
}

export interface QuranSharedOrthographyBundle {
  _meta: {
    title: string;
    source: string;
    doi: string;
    open_access_pdf: string;
    honest_disclaimer: string;
    layer_note: string;
  };
  scholarship: { label: string; url: string }[];
  manuscripts: NimatManuscriptColumn[];
  rows: NimatMatrixRow[];
  reading_legend: Record<
    NimatSpelling,
    { glyph: string; label: string }
  >;
}
