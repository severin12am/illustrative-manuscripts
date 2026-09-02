import witnessTextsData from "@/data/witness-texts.json";
import type { WitnessTextBundle } from "@/types/text";

const bundle = witnessTextsData as WitnessTextBundle;

export function getWitnessText(ga: string) {
  return bundle.texts[ga] ?? {
    available: false,
    message: "Text data not loaded.",
    initial_verses: [],
    more_count: 0,
  };
}

export const TEXT_ATTRIBUTION = bundle.sources;
