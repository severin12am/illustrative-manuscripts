export type RegionalPattern =
  | "syria_unique"
  | "syria_medina"
  | "kufa_unique";

export interface RegionalReading {
  rasm: string;
  gloss: string;
}

export interface UthmaniVariantSource {
  label?: string;
  /** Plain citation string when label omitted */
  citation?: string;
}

export interface ManuscriptHit {
  witness_id: string;
  reading: "syria" | "medina" | "basra" | "kufa" | "unknown";
  note: string;
  source: string;
}

export interface UthmaniRegionalVariant {
  id: string;
  surah: number;
  ayah: number;
  ref: string;
  context: string;
  readings: {
    syria: RegionalReading;
    medina: RegionalReading;
    basra: RegionalReading;
    kufa: RegionalReading;
  };
  nature: string;
  pattern: RegionalPattern;
  /** Citation strings — not URLs unless paired in scholarship block */
  sources: string[];
  manuscript_hits: ManuscriptHit[];
}

export interface UthmaniScholarshipLink {
  label: string;
  url: string;
}

export interface UthmaniRegionalVariantsBundle {
  _meta: {
    title: string;
    definition: string;
    totals_note: string;
    honest_disclaimer: string;
    window_note: string;
  };
  scholarship: UthmaniScholarshipLink[];
  stemma: {
    caption: string;
    groups: {
      syria_medina: string;
      syria_unique: string;
      kufa_unique: string;
    };
    neo_basran_note: string;
  };
  variants: UthmaniRegionalVariant[];
  sanaa_callout: {
    title: string;
    summary: string;
    witness_id: string;
    scholarship: UthmaniScholarshipLink[];
  };
}
