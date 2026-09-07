import { getWitnessText } from "@/data/witness-texts";
import { assetUrl } from "@/lib/assetUrl";
import type { TextVerse } from "@/types/text";

const overflowCache = new Map<string, TextVerse[]>();

/** Load all verses for a GA witness (initial bundle + lazy CNTR overflow). */
export async function loadAllVerses(ga: string): Promise<TextVerse[]> {
  const bundled = getWitnessText(ga);
  if (!bundled.available) return [];

  const verses = [...(bundled.initial_verses ?? [])];
  const moreCount = bundled.more_count ?? 0;

  if (moreCount <= 0) {
    return verses;
  }

  if (overflowCache.has(ga)) {
    return mergeVerses(verses, overflowCache.get(ga)!);
  }

  try {
    const res = await fetch(assetUrl(`/cntr-texts/${ga}.json`));
    if (!res.ok) return verses;
    const data = (await res.json()) as { verses?: TextVerse[] };
    const overflow = data.verses ?? [];
    overflowCache.set(ga, overflow);
    return mergeVerses(verses, overflow);
  } catch {
    return verses;
  }
}

function mergeVerses(initial: TextVerse[], overflow: TextVerse[]): TextVerse[] {
  const byEsn = new Map<number, TextVerse>();
  for (const v of initial) byEsn.set(v.esn, v);
  for (const v of overflow) byEsn.set(v.esn, v);
  return [...byEsn.values()].sort((a, b) => a.esn - b.esn);
}

export function versesByEsn(verses: TextVerse[]): Map<number, TextVerse> {
  return new Map(verses.map((v) => [v.esn, v]));
}
