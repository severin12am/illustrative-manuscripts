#!/usr/bin/env node
/**
 * Compact SR GNT word lists for ESNs present in our witness corpus.
 * Output: public/sr-witness-esns.json (used by /compare)
 *
 * Regenerate: npm run export-sr-esns
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function loadSrByVerse() {
  const tsv = readFileSync(join(__dirname, "cache/sr-gnt.tsv"), "utf8");
  /** @type {Map<number, string[]>} */
  const byVerse = new Map();
  for (const line of tsv.split("\n")) {
    if (!line || line.startsWith("Verse")) continue;
    const [esn, , koine] = line.split("\t");
    if (!esn || !koine) continue;
    const key = Number(esn.trim());
    if (!byVerse.has(key)) byVerse.set(key, []);
    byVerse.get(key).push(koine.trim());
  }
  return byVerse;
}

function collectCorpusEsns() {
  const bundle = loadJson(join(ROOT, "src/data/witness-texts.json"));
  /** @type {Set<number>} */
  const esns = new Set();
  /** @type {Record<string, number[]>} */
  const byWitness = {};

  for (const [ga, entry] of Object.entries(bundle.texts || {})) {
    if (!entry?.available) continue;
    const witnessEsns = new Set();
    for (const v of entry.initial_verses || []) {
      esns.add(v.esn);
      witnessEsns.add(v.esn);
    }
    const overflow = join(ROOT, "public/cntr-texts", `${ga}.json`);
    if (existsSync(overflow)) {
      const data = loadJson(overflow);
      for (const v of data.verses || []) {
        esns.add(v.esn);
        witnessEsns.add(v.esn);
      }
    }
    byWitness[ga] = [...witnessEsns].sort((a, b) => a - b);
  }

  return { esns, byWitness };
}

function main() {
  const srByVerse = loadSrByVerse();
  const { esns, byWitness } = collectCorpusEsns();

  /** @type {Record<string, string[]>} */
  const verses = {};
  let missing = 0;
  for (const esn of [...esns].sort((a, b) => a - b)) {
    const words = srByVerse.get(esn);
    if (!words?.length) {
      missing++;
      continue;
    }
    verses[String(esn)] = words;
  }

  const out = {
    generated_at: new Date().toISOString(),
    definition:
      "SR GNT Koine word tokens for verses in our CNTR witness corpus (1–300 CE slice). Used for witness-to-witness alignment on /compare.",
    base_text: "SR GNT",
    verse_count: Object.keys(verses).length,
    missing_sr_count: missing,
    verses,
    witness_esns: byWitness,
  };

  const outPath = join(ROOT, "public/sr-witness-esns.json");
  writeFileSync(outPath, JSON.stringify(out));
  console.log(
    `Wrote ${outPath} (${Object.keys(verses).length} verses, ${Object.keys(byWitness).length} witnesses)`
  );
}

main();
