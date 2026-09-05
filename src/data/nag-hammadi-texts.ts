import bundle from "./nag-hammadi-texts.json";
import type { NagHammadiTextBundle, NagHammadiWitnessText } from "@/types/nag-hammadi-text";

const data = bundle as NagHammadiTextBundle;

export function getNagHammadiWitnessText(id: string): NagHammadiWitnessText {
  const text = data.texts[id];
  if (!text) {
    return {
      available: false,
      message: `No text bundle for ${id}.`,
      initial_units: [],
      attribution: null,
    };
  }
  return text;
}

export { data as nagHammadiTextBundle };
