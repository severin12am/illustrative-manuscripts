export type IntentionalLabel = "error" | "intentional" | "uncertain";

export interface IntentionalTag {
  label: IntentionalLabel;
  rationale: string;
  confidence: number;
  tagged_at?: string;
  model?: string;
}

export type IntentionalTagMap = Record<string, IntentionalTag>;

export interface IntentionalTaggingStats {
  definition: string;
  taggable_total: number;
  tagged_count: number;
  coverage_percent: number;
  by_label: Record<IntentionalLabel, number>;
  not_run: boolean;
  run_command: string;
}
