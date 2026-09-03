import bundle from "./quran-texts.json";
import type { QuranTextBundle, QuranWitnessText } from "@/types/quran-text";

const data = bundle as QuranTextBundle;

export function getQuranWitnessText(id: string): QuranWitnessText {
  const text = data.texts[id];
  if (!text) {
    return {
      available: false,
      message: `No text bundle for ${id}.`,
      initial_ayahs: [],
      attribution: null,
    };
  }
  return text;
}

export { data as quranTextBundle };
