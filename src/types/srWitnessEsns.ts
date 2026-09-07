export interface SrWitnessEsnsBundle {
  generated_at: string;
  definition: string;
  base_text: string;
  verse_count: number;
  missing_sr_count: number;
  verses: Record<string, string[]>;
  witness_esns: Record<string, number[]>;
}
