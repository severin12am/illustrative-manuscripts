import bundle from "./hebrew-lxx-texts.json";
import type { HebrewLxxTextBundle, HebrewLxxWitnessText } from "@/types/hebrew-lxx-text";

const data = bundle as HebrewLxxTextBundle;

export function getHebrewLxxWitnessText(id: string): HebrewLxxWitnessText | null {
  return data.texts[id] ?? null;
}
