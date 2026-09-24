export type WitnessPassageStatus =
  | "present"
  | "absent"
  | "partial"
  | "lacunose"
  | "not_in_corpus";

export interface FamousPassageWitness {
  ga: string;
  status: WitnessPassageStatus;
  note?: string;
}

export interface FamousPassageScholarship {
  label: string;
  url: string;
}

export interface FamousPassageHistoricalApparatus {
  label: string;
  url: string;
  note: string;
}

export interface FamousPassageEntry {
  slug: string;
  title: string;
  passage_ref: string;
  book: string;
  verse_esns: number[];
  story: string;
  later_tradition: string;
  scholarship: FamousPassageScholarship[];
  historical_apparatus?: FamousPassageHistoricalApparatus;
  witnesses: FamousPassageWitness[];
  variants_link?: { book: string; q?: string; kind?: string };
  compare_link?: { a: string; b: string; book: string };
}

export interface FamousPassagesBundle {
  definition: string;
  entries: FamousPassageEntry[];
}
