#!/usr/bin/env node
/**
 * Cross-check hand-curated famous-passage witness statuses against CNTR data.
 * CNTR marks absent verses with greek_plain "-" (or a single "-" token).
 * Run: node scripts/verify-famous-passages.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE = path.join(ROOT, "scripts/famous-passages.json");
const OUTPUT = path.join(ROOT, "src/data/famous-passages.json");
const TEXTS = path.join(ROOT, "src/data/witness-texts.json");

function loadVerseIndex() {
  const data = JSON.parse(fs.readFileSync(TEXTS, "utf8"));
  const index = new Map();
  for (const [ga, bundle] of Object.entries(data.texts ?? {})) {
    if (!bundle?.available) continue;
    const verses = new Map();
    for (const v of bundle.initial_verses ?? []) {
      verses.set(v.esn, v);
    }
    const overflow = path.join(ROOT, "public/cntr-texts", `${ga}.json`);
    if (fs.existsSync(overflow)) {
      const ov = JSON.parse(fs.readFileSync(overflow, "utf8"));
      for (const v of ov.verses ?? []) {
        verses.set(v.esn, v);
      }
    }
    index.set(ga, verses);
  }
  return index;
}

function isAbsentMarker(v) {
  return v.greek_plain === "-" || v.greek?.[0]?.value === "-";
}

/** Block-level: CNTR often marks only boundary verses with "-" when a passage is missing. */
function cntrStatus(verses, esns) {
  if (!verses) return "not_in_corpus";
  const hits = esns.map((esn) => verses.get(esn)).filter(Boolean);
  if (hits.length === 0) return "not_in_corpus";
  const withText = hits.filter((v) => !isAbsentMarker(v));
  const absentMarkers = hits.filter((v) => isAbsentMarker(v));
  if (withText.length > 0) return "present";
  if (absentMarkers.length > 0) return "absent";
  return "unknown";
}

const source = JSON.parse(fs.readFileSync(SOURCE, "utf8"));
const index = loadVerseIndex();
let mismatches = 0;

console.log("Famous passages — CNTR verification\n");

for (const entry of source.entries) {
  console.log(`## ${entry.title} (${entry.passage_ref})`);
  for (const w of entry.witnesses) {
    const verses = index.get(w.ga);
    const computed = cntrStatus(verses, entry.verse_esns);
    const curated = w.status;
    const ok =
      curated === computed ||
      (curated === "present" && computed === "present") ||
      (curated === "not_in_corpus" && computed === "not_in_corpus") ||
      (curated === "absent" && (computed === "absent" || computed === "mixed"));
    const mark = ok ? "✓" : "✗ MISMATCH";
    if (!ok) mismatches++;
    console.log(
      `  ${mark} ${w.ga}: curated=${curated}, CNTR=${computed}${w.note ? ` — ${w.note}` : ""}`
    );
  }
  console.log();
}

if (mismatches > 0) {
  console.error(`${mismatches} mismatch(es) — update scripts/famous-passages.json or investigate CNTR data.`);
  process.exit(1);
}
console.log("All witness statuses align with CNTR data (within expected rules).");
