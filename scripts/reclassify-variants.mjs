#!/usr/bin/env node
/**
 * Re-run variant classification on committed witness text JSON (no CNTR fetch).
 * Updates src/data/witness-texts.json variants and public/cntr-texts/*.json.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { segmentsToExtantRuns } from "./lib/mes-parser.mjs";
import {
  classifyVerseVariants,
  countVariantsInVerses,
} from "./lib/variant-classify.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function diplomaticToMesSegments(greek) {
  return (greek || []).map((seg) => {
    switch (seg.kind) {
      case "text":
        return seg.nomina
          ? { type: "nomina", text: seg.value }
          : { type: "text", text: seg.value || "" };
      case "missing":
        return { type: "missing" };
      case "damaged":
        return { type: "damaged" };
      case "lacuna":
        return { type: "lacuna" };
      case "supplied":
        return { type: "supplied", vid: seg.vid };
      case "linebreak":
        return { type: "linebreak" };
      case "pagebreak":
        return { type: "pagebreak" };
      default:
        return { type: "text", text: "" };
    }
  });
}

async function loadSR() {
  const tsv = readFileSync(join(__dirname, "cache/sr-gnt.tsv"), "utf8");
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

function reclassifyVerse(verse, srByVerse) {
  const extantRuns = segmentsToExtantRuns(
    diplomaticToMesSegments(verse.greek)
  );
  const srWords = srByVerse.get(String(verse.esn)) || [];
  const variants = classifyVerseVariants(
    extantRuns,
    srWords,
    verse.book_id,
    verse.chapter,
    verse.verse
  );
  verse.variants = variants;
  verse.has_variant = variants.length > 0;
  return verse;
}

async function main() {
  const srByVerse = await loadSR();
  const bundlePath = join(ROOT, "src/data/witness-texts.json");
  const bundle = loadJson(bundlePath);

  for (const [ga, entry] of Object.entries(bundle.texts)) {
    if (!entry?.available) continue;
    for (const verse of entry.initial_verses || []) {
      reclassifyVerse(verse, srByVerse);
    }
    entry.difference_count = countVariantsInVerses(entry.initial_verses || []);
  }

  writeFileSync(bundlePath, JSON.stringify(bundle, null, 2));

  const overflowDir = join(ROOT, "public/cntr-texts");
  if (existsSync(overflowDir)) {
    for (const file of readdirSync(overflowDir).filter((f) => f.endsWith(".json"))) {
      const path = join(overflowDir, file);
      const data = loadJson(path);
      for (const verse of data.verses || []) {
        reclassifyVerse(verse, srByVerse);
      }
      writeFileSync(path, JSON.stringify(data));
    }
  }

  console.log("Reclassified variants in witness-texts.json and public/cntr-texts/");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
