#!/usr/bin/env node
/**
 * Flat variant index for /variants explorer.
 * Output: src/data/variant-index.json
 *
 * Regenerate: npm run variant-index
 */

import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { collectTaggableUnits } from "./lib/taggable-units.mjs";
import { CNTR_BOOKS, parseESN } from "./lib/books.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const FEATURED_KINDS = ["omission", "addition", "substitution", "orthography"];
const PREFERRED_WITNESSES = new Set([
  "P52",
  "P66",
  "P75",
  "P46",
  "P45",
  "P90",
  "P104",
  "P4",
  "P5",
]);

function loadWitnessIdByGa() {
  const mod = readFileSync(join(ROOT, "src/data/witnesses.ts"), "utf8");
  const match = mod.match(/export const witnesses: Witness\[\] = (\[[\s\S]*\]);/);
  if (!match) throw new Error("Could not parse witnesses.ts");
  const witnesses = JSON.parse(match[1]);
  /** @type {Record<string, string>} */
  const byGa = {};
  for (const w of witnesses) {
    byGa[w.ga_number] = w.id;
  }
  return byGa;
}

function loadCntrUrls() {
  const bundle = JSON.parse(
    readFileSync(join(ROOT, "src/data/witness-texts.json"), "utf8")
  );
  /** @type {Record<string, string>} */
  const urls = {};
  for (const [ga, entry] of Object.entries(bundle.texts || {})) {
    if (entry?.cntr_url) urls[ga] = entry.cntr_url;
  }
  return urls;
}

function enrichUnit(unit, witnessIdByGa, cntrUrls) {
  const parsed = parseESN(unit.esn);
  const bookMeta = CNTR_BOOKS[parsed.book];
  return {
    unit_id: unit.unit_id,
    witness_id: unit.witness_id,
    witness_slug: witnessIdByGa[unit.witness_id] ?? null,
    verse_ref: unit.verse_ref,
    esn: unit.esn,
    book: bookMeta?.name ?? String(parsed.book),
    book_id: parsed.book,
    chapter: parsed.chapter,
    verse: parsed.verse,
    kind: unit.kind,
    witness_reading: unit.witness_reading,
    sr_reading: unit.sr_reading,
    context_left: unit.context_left,
    context_right: unit.context_right,
    word_start: unit.word_start,
    word_end: unit.word_end,
    cntr_url: cntrUrls[unit.witness_id] ?? null,
  };
}

function scoreFeatured(unit) {
  let score = 0;
  if (PREFERRED_WITNESSES.has(unit.witness_id)) score += 10;
  if (unit.witness_reading && unit.sr_reading) score += 5;
  if (unit.context_left || unit.context_right) score += 2;
  if (unit.witness_reading.length < 30 && unit.sr_reading.length < 30) score += 1;
  return score;
}

function pickFeatured(units) {
  /** @type {Record<string, object>} */
  const picked = {};
  for (const kind of FEATURED_KINDS) {
    const candidates = units
      .filter((u) => u.kind === kind)
      .sort((a, b) => scoreFeatured(b) - scoreFeatured(a));
    if (candidates.length) picked[kind] = candidates[0];
  }
  return Object.values(picked);
}

function main() {
  const rawUnits = collectTaggableUnits({ includeOrthography: true });
  const witnessIdByGa = loadWitnessIdByGa();
  const cntrUrls = loadCntrUrls();
  const units = rawUnits.map((u) => enrichUnit(u, witnessIdByGa, cntrUrls));

  const byKind = {};
  const witnesses = new Set();
  const books = new Set();
  for (const u of units) {
    byKind[u.kind] = (byKind[u.kind] || 0) + 1;
    witnesses.add(u.witness_id);
    books.add(u.book);
  }

  const out = {
    generated_at: new Date().toISOString(),
    definition:
      "Word-aligned variation units in extant CNTR runs vs SR GNT (scripts/lib/variant-classify.mjs). Lacunae and supplied reconstruction excluded.",
    base_text: "SR GNT",
    total: units.length,
    by_kind: byKind,
    witness_count: witnesses.size,
    book_count: books.size,
    books: [...books].sort(),
    witnesses: [...witnesses].sort(),
    featured_examples: pickFeatured(units),
    units,
  };

  const outPath = join(ROOT, "src/data/variant-index.json");
  writeFileSync(outPath, JSON.stringify(out));
  console.log(`Wrote ${outPath} (${units.length} units)`);
}

main();
