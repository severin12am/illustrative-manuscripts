import data from "@/data/quran-shared-orthography.json";
import type { QuranSharedOrthographyBundle } from "@/types/quranSharedOrthography";

export const quranSharedOrthography =
  data as unknown as QuranSharedOrthographyBundle;

export function nimatRowCount(): number {
  return quranSharedOrthography.rows.length;
}
