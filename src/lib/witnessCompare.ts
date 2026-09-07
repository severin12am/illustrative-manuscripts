import { assetUrl } from "@/lib/assetUrl";
import type { CompareResult, CompareRow } from "@/types/compare";
import type { SrWitnessEsnsBundle } from "@/types/srWitnessEsns";
import type { TextVerse, VariantUnit } from "@/types/text";
import { versesByEsn } from "@/lib/witnessVerseLoader";

let srBundlePromise: Promise<SrWitnessEsnsBundle> | null = null;

export function loadSrWitnessEsns(): Promise<SrWitnessEsnsBundle> {
  if (!srBundlePromise) {
    srBundlePromise = fetch(assetUrl("/sr-witness-esns.json")).then((res) => {
      if (!res.ok) throw new Error("Failed to load SR witness index");
      return res.json() as Promise<SrWitnessEsnsBundle>;
    });
  }
  return srBundlePromise;
}

export function getWitnessEsns(
  bundle: SrWitnessEsnsBundle,
  ga: string
): number[] {
  return bundle.witness_esns[ga] ?? [];
}

export function overlapEsns(
  bundle: SrWitnessEsnsBundle,
  gaA: string,
  gaB: string
): number[] {
  const a = new Set(getWitnessEsns(bundle, gaA));
  return getWitnessEsns(bundle, gaB).filter((esn) => a.has(esn));
}

const BOOK_NAMES: Record<number, string> = {
  40: "Matthew",
  41: "Mark",
  42: "Luke",
  43: "John",
  44: "Acts",
  45: "Romans",
  46: "1 Corinthians",
  47: "2 Corinthians",
  48: "Galatians",
  49: "Ephesians",
  50: "Philippians",
  51: "Colossians",
  52: "1 Thessalonians",
  53: "2 Thessalonians",
  54: "1 Timothy",
  55: "2 Timothy",
  56: "Titus",
  57: "Philemon",
  58: "Hebrews",
  59: "James",
  60: "1 Peter",
  61: "2 Peter",
  62: "1 John",
  63: "2 John",
  64: "3 John",
  65: "Jude",
  66: "Revelation",
};

export function esnBookName(esn: number): string {
  const bookId = Math.floor(esn / 1_000_000);
  return BOOK_NAMES[bookId] ?? `Book ${bookId}`;
}

export function booksInOverlap(
  srBundle: SrWitnessEsnsBundle,
  gaA: string,
  gaB: string
): string[] {
  const esns = overlapEsns(srBundle, gaA, gaB);
  const books = new Set(esns.map(esnBookName));
  return [...books].sort();
}

function positionsForVariant(v: VariantUnit): number[] {
  const start = v.locus.word_start;
  if (start == null) return [];
  const end = v.locus.word_end ?? start;
  const out: number[] = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}

function readingAtPosition(
  srWords: string[],
  variants: VariantUnit[],
  wordIndex: number
): { reading: string; kind: string | null; extant: boolean } {
  const srDefault = srWords[wordIndex - 1] ?? "";

  for (const v of variants) {
    const positions = positionsForVariant(v);
    if (!positions.includes(wordIndex)) continue;

    if (v.kind === "omission") {
      return { reading: "", kind: v.kind, extant: true };
    }
    if (v.kind === "addition") {
      return { reading: v.witness_reading, kind: v.kind, extant: true };
    }
    return { reading: v.witness_reading, kind: v.kind, extant: true };
  }

  if (variants.length === 0) {
    return { reading: srDefault, kind: null, extant: true };
  }

  return { reading: srDefault, kind: null, extant: true };
}

function comparablePositions(
  srWords: string[],
  variantsA: VariantUnit[],
  variantsB: VariantUnit[]
): Set<number> {
  const positions = new Set<number>();

  for (const v of [...variantsA, ...variantsB]) {
    for (const p of positionsForVariant(v)) positions.add(p);
  }

  if (positions.size === 0 && srWords.length > 0) {
    for (let i = 1; i <= srWords.length; i++) positions.add(i);
  }

  return positions;
}

export function compareWitnessVerses(
  witnessA: string,
  witnessB: string,
  versesA: TextVerse[],
  versesB: TextVerse[],
  srBundle: SrWitnessEsnsBundle,
  opts?: { book?: string | null; disagreementsOnly?: boolean }
): CompareResult {
  const mapA = versesByEsn(versesA);
  const mapB = versesByEsn(versesB);
  const commonEsns = overlapEsns(srBundle, witnessA, witnessB).filter((esn) => {
    if (!mapA.has(esn) || !mapB.has(esn)) return false;
    if (opts?.book && opts.book !== "all") {
      return esnBookName(esn) === opts.book;
    }
    return true;
  });

  const rows: CompareRow[] = [];

  for (const esn of commonEsns) {
    const srWords = srBundle.verses[String(esn)];
    if (!srWords?.length) continue;

    const verseA = mapA.get(esn)!;
    const verseB = mapB.get(esn)!;
    const variantsA = verseA.variants ?? [];
    const variantsB = verseB.variants ?? [];
    const positions = comparablePositions(srWords, variantsA, variantsB);

    for (const wordIndex of [...positions].sort((a, b) => a - b)) {
      const a = readingAtPosition(srWords, variantsA, wordIndex);
      const b = readingAtPosition(srWords, variantsB, wordIndex);
      if (!a.extant || !b.extant) continue;

      const srReading = srWords[wordIndex - 1] ?? "";
      const disagrees = a.reading !== b.reading;

      if (opts?.disagreementsOnly && !disagrees) continue;

      rows.push({
        esn,
        verse_ref: verseA.reference,
        book: esnBookName(esn),
        word_index: wordIndex,
        sr_reading: srReading,
        reading_a: a.reading,
        reading_b: b.reading,
        disagrees,
        kind_a: a.kind,
        kind_b: b.kind,
      });
    }
  }

  return {
    witness_a: witnessA,
    witness_b: witnessB,
    book_filter: opts?.book ?? null,
    overlap_verses: commonEsns.length,
    comparable_rows: rows.length,
    disagreement_rows: rows.filter((r) => r.disagrees).length,
    rows,
  };
}
