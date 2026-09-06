/**
 * Collect word-level variation units suitable for intentional-vs-error tagging.
 */

import { readFileSync, existsSync, readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { makeUnitId } from "./unit-id.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");

const TAGGABLE_KINDS = new Set([
  "substitution",
  "omission",
  "addition",
  "transposition",
]);

/**
 * @typedef {object} TaggableUnitInput
 * @property {string} witness_id
 * @property {number} esn
 * @property {string} kind
 * @property {number} [word_start]
 * @property {number} [word_end]
 */

/**
 * @typedef {TaggableUnitInput & {
 *   unit_id: string;
 *   verse_ref: string;
 *   witness_reading: string;
 *   sr_reading: string;
 *   context_left: string | null;
 *   context_right: string | null;
 * }} TaggableUnit
 */

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function loadSrByVerse() {
  const tsv = readFileSync(join(__dirname, "../cache/sr-gnt.tsv"), "utf8");
  /** @type {Map<string, string[]>} */
  const byVerse = new Map();
  for (const line of tsv.split("\n")) {
    if (!line || line.startsWith("Verse")) continue;
    const [esn, , koine] = line.split("\t");
    if (!esn || !koine) continue;
    const key = esn.trim();
    if (!byVerse.has(key)) byVerse.set(key, []);
    byVerse.get(key).push(koine.trim());
  }
  return byVerse;
}

function srContext(srWords, wordStart, wordEnd, radius = 2) {
  if (!srWords.length || wordStart == null) {
    return { left: null, right: null };
  }
  const startIdx = Math.max(0, wordStart - 1 - radius);
  const endIdx = Math.min(srWords.length, (wordEnd ?? wordStart) + radius);
  const focusStart = Math.max(0, wordStart - 1);
  const focusEnd = wordEnd ?? wordStart;
  const left = focusStart > startIdx ? srWords.slice(startIdx, focusStart).join(" ") : null;
  const right =
    focusEnd < endIdx ? srWords.slice(focusEnd, endIdx).join(" ") : null;
  return {
    left: left || null,
    right: right || null,
  };
}

function variantToUnit(witnessId, verse, variant, srByVerse, includeOrthography) {
  const kind = variant.kind;
  if (!includeOrthography && kind === "orthography") return null;
  if (!includeOrthography && !TAGGABLE_KINDS.has(kind)) return null;

  const esn = verse.esn;
  const wordStart = variant.locus?.word_start;
  const wordEnd = variant.locus?.word_end;
  const input = {
    witness_id: witnessId,
    esn,
    kind,
    word_start: wordStart,
    word_end: wordEnd,
  };
  const srWords = srByVerse.get(String(esn)) || [];
  const { left, right } = srContext(srWords, wordStart, wordEnd);

  return {
    unit_id: makeUnitId(input),
    witness_id: witnessId,
    verse_ref: variant.locus?.reference ?? verse.reference,
    esn,
    kind,
    witness_reading: variant.witness_reading ?? "",
    sr_reading: variant.base_reading ?? "",
    context_left: left,
    context_right: right,
    word_start: wordStart,
    word_end: wordEnd,
  };
}

function collectFromVerses(witnessId, verses, srByVerse, includeOrthography) {
  /** @type {TaggableUnit[]} */
  const units = [];
  for (const verse of verses || []) {
    for (const variant of verse.variants || []) {
      const unit = variantToUnit(witnessId, verse, variant, srByVerse, includeOrthography);
      if (unit) units.push(unit);
    }
  }
  return units;
}

/**
 * @param {{ includeOrthography?: boolean }} [opts]
 * @returns {TaggableUnit[]}
 */
export function collectTaggableUnits({ includeOrthography = false } = {}) {
  const srByVerse = loadSrByVerse();
  const bundle = loadJson(join(ROOT, "src/data/witness-texts.json"));
  /** @type {TaggableUnit[]} */
  const units = [];
  const seen = new Set();

  for (const [ga, entry] of Object.entries(bundle.texts || {})) {
    if (!entry?.available) continue;
    for (const u of collectFromVerses(
      ga,
      entry.initial_verses,
      srByVerse,
      includeOrthography
    )) {
      if (seen.has(u.unit_id)) continue;
      seen.add(u.unit_id);
      units.push(u);
    }
  }

  const overflowDir = join(ROOT, "public/cntr-texts");
  if (existsSync(overflowDir)) {
    for (const file of readdirSync(overflowDir).filter((f) => f.endsWith(".json"))) {
      const ga = file.replace(/\.json$/, "");
      const data = loadJson(join(overflowDir, file));
      for (const u of collectFromVerses(
        ga,
        data.verses,
        srByVerse,
        includeOrthography
      )) {
        if (seen.has(u.unit_id)) continue;
        seen.add(u.unit_id);
        units.push(u);
      }
    }
  }

  units.sort((a, b) => {
    const ga = a.witness_id.localeCompare(b.witness_id);
    if (ga !== 0) return ga;
    if (a.esn !== b.esn) return a.esn - b.esn;
    return a.unit_id.localeCompare(b.unit_id);
  });

  return units;
}

export function countTaggableUnits(includeOrthography = false) {
  return collectTaggableUnits({ includeOrthography }).length;
}
