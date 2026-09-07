#!/usr/bin/env node
/**
 * Computes honest coverage statistics from committed data files.
 * Output: src/data/coverage.json (imported by the /coverage page and home stats strip).
 *
 * Regenerate: npm run coverage
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { normalizeGreek, segmentsToExtantRuns } from "./lib/mes-parser.mjs";
import { tokenizeGreek } from "./lib/variant-classify.mjs";
import { countTaggableUnits } from "./lib/taggable-units.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const NT_WINDOW = [1, 400];

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function loadWitnessesFromTs() {
  const mod = readFileSync(join(ROOT, "src/data/witnesses.ts"), "utf8");
  const match = mod.match(/export const witnesses: Witness\[\] = (\[[\s\S]*\]);/);
  if (!match) throw new Error("Could not parse witnesses.ts");
  return JSON.parse(match[1]);
}

function loadQuranWitnessesFromTs() {
  const mod = readFileSync(join(ROOT, "src/data/quran-witnesses.ts"), "utf8");
  const match = mod.match(/export const quranWitnesses: Witness\[\] = (\[[\s\S]*\]);/);
  if (!match) throw new Error("Could not parse quran-witnesses.ts");
  return JSON.parse(match[1]);
}

function loadNagHammadiWitnessesFromTs() {
  const mod = readFileSync(join(ROOT, "src/data/nag-hammadi-witnesses.ts"), "utf8");
  const match = mod.match(
    /export const nagHammadiWitnesses: Witness\[\] = (\[[\s\S]*\]);/
  );
  if (!match) throw new Error("Could not parse nag-hammadi-witnesses.ts");
  return JSON.parse(match[1]);
}

function overlapsWindow(start, end, winStart, winEnd) {
  return start <= winEnd && end >= winStart;
}

function hasLeafImage(witness) {
  return Boolean(
    witness.hosted_image ||
      (witness.image_policy === "iiif" && witness.iiif_image_url)
  );
}

/** Convert stored diplomatic segments back to MES-like segments for extant-run logic. */
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

function extantTokenCountForVerse(verse) {
  const runs = segmentsToExtantRuns(diplomaticToMesSegments(verse.greek));
  return runs.reduce((n, run) => n + tokenizeGreek(run).length, 0);
}

function collectVerses(ga, witnessTexts) {
  const entry = witnessTexts.texts[ga];
  if (!entry) return [];
  const verses = [...(entry.initial_verses || [])];
  const overflowPath = join(ROOT, "public/cntr-texts", `${ga}.json`);
  if (existsSync(overflowPath)) {
    const overflow = loadJson(overflowPath);
    verses.push(...(overflow.verses || []));
  }
  return verses;
}

function countVariantsInVerses(verses) {
  const byKind = {};
  let total = 0;
  for (const verse of verses) {
    for (const v of verse.variants || []) {
      total++;
      byKind[v.kind] = (byKind[v.kind] || 0) + 1;
    }
  }
  return { total, byKind };
}

function median(sorted) {
  if (!sorted.length) return 0;
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  }
  return sorted[mid];
}

function computeNtCoverage(witnesses, witnessTexts, liste) {
  const listePapyri = liste.data.manuscripts.manuscript;
  const listeInWindow = listePapyri.filter((d) =>
    overlapsWindow(d.origEarly, d.origLate, NT_WINDOW[0], NT_WINDOW[1])
  );
  const ourGas = new Set(witnesses.map((w) => w.ga_number));
  const listeIncluded = listeInWindow.filter((d) => ourGas.has(d.gaNum));
  const listeMissing = listeInWindow.filter((d) => !ourGas.has(d.gaNum));

  const perWitness = [];
  let totalDisagreements = 0;
  const globalByKind = {};
  let totalExtantTokens = 0;
  let withCntr = 0;
  let withImage = 0;
  let withNonzeroComparison = 0;

  for (const w of witnesses) {
    const ga = w.ga_number;
    const entry = witnessTexts.texts[ga];
    const verses = collectVerses(ga, witnessTexts);
    const { total: disagreements, byKind } = countVariantsInVerses(verses);
    const extantTokens = verses.reduce(
      (n, v) => n + extantTokenCountForVerse(v),
      0
    );

    const cntrAvailable = Boolean(entry?.available);
    const image = hasLeafImage(w);
    const nonzero = cntrAvailable && extantTokens > 0;

    if (cntrAvailable) withCntr++;
    if (image) withImage++;
    if (nonzero) withNonzeroComparison++;

    totalDisagreements += disagreements;
    totalExtantTokens += extantTokens;
    for (const [kind, n] of Object.entries(byKind)) {
      globalByKind[kind] = (globalByKind[kind] || 0) + n;
    }

    perWitness.push({
      ga,
      id: w.id,
      cntr_transcription: cntrAvailable,
      leaf_image: image,
      nonzero_extant_comparison: nonzero,
      extant_word_tokens: extantTokens,
      disagreements,
      disagreements_by_kind: byKind,
    });
  }

  const disagreementCounts = perWitness
    .filter((w) => w.cntr_transcription)
    .map((w) => w.disagreements)
    .sort((a, b) => a - b);

  const overflowFiles = existsSync(join(ROOT, "public/cntr-texts"))
    ? readdirSync(join(ROOT, "public/cntr-texts")).filter((f) => f.endsWith(".json"))
    : [];

  return {
    witness_count: witnesses.length,
    cntr_transcription_count: withCntr,
    cntr_missing: witnesses
      .filter((w) => !witnessTexts.texts[w.ga_number]?.available)
      .map((w) => w.ga_number),
    leaf_image_count: withImage,
    nonzero_extant_comparison_count: withNonzeroComparison,
    lazy_load_overflow_files: overflowFiles.length,
    extant_word_tokens: {
      definition:
        "Greek word tokens in extant (non-supplied) runs across all CNTR verses we store, including lazy-load overflow files. Lacunae and editorially supplied letters are excluded.",
      total: totalExtantTokens,
    },
    disagreements: {
      definition:
        "Word-aligned variation units in extant runs vs SR GNT (CNTR), using scripts/lib/variant-classify.mjs. Lacunae and reconstructed supplied text are not counted. Intentional-vs-error labels are not assigned in this mechanical pass.",
      base_text: "SR GNT",
      total: totalDisagreements,
      unit:
        "variation units (word-aligned disagreements; spelling-only differences count as orthography units)",
      by_kind: globalByKind,
      per_witness_median: median(disagreementCounts),
      per_witness_max: disagreementCounts.length
        ? disagreementCounts[disagreementCounts.length - 1]
        : 0,
      witnesses_with_any: perWitness.filter((w) => w.disagreements > 0).length,
    },
    intl_liste_papyri: {
      window: NT_WINDOW,
      liste_in_window: listeInWindow.length,
      included: listeIncluded.length,
      missing: listeMissing.map((d) => d.gaNum),
      included_percent:
        listeInWindow.length > 0
          ? Math.round((listeIncluded.length / listeInWindow.length) * 1000) / 10
          : 0,
      missing_percent:
        listeInWindow.length > 0
          ? Math.round((listeMissing.length / listeInWindow.length) * 1000) / 10
          : 0,
    },
    hand_curated_uncials: {
      count: witnesses.filter((w) => /^0\d$/.test(w.ga_number)).length,
      witnesses: witnesses.filter((w) => /^0\d$/.test(w.ga_number)).map((w) => w.ga_number),
      note: "Gregory-Aland uncials from scripts/uncial-seed.json — not in Liste papyri export",
    },
    per_witness: perWitness,
  };
}

function computeQuranCoverage(witnesses) {
  const withImage = witnesses.filter((w) => hasLeafImage(w)).length;
  return {
    witness_count: witnesses.length,
    leaf_image_count: withImage,
    leaf_image_fraction: witnesses.length
      ? Math.round((withImage / witnesses.length) * 1000) / 1000
      : 0,
    variant_census_note:
      "No NA-style variant census for Qurʾān in v1. Cards show reference rasm and library links, not a full manuscript collation.",
  };
}

function computeNagHammadiCoverage(witnesses) {
  const withImage = witnesses.filter((w) => hasLeafImage(w)).length;
  return {
    tractate_witness_count: witnesses.length,
    leaf_image_count: withImage,
    leaf_image_fraction: witnesses.length
      ? Math.round((withImage / witnesses.length) * 1000) / 1000
      : 0,
    collation_note:
      "No Thomas↔NT collation in v1. These are Coptic Gnostic tractates, not Greek New Testament witnesses.",
  };
}

function computeIntentionalTagging() {
  const tagsPath = join(ROOT, "src/data/intentional-tags.json");
  const taggableTotal = countTaggableUnits(false);
  const byLabel = { error: 0, intentional: 0, uncertain: 0 };
  let taggedCount = 0;

  if (existsSync(tagsPath)) {
    const raw = readFileSync(tagsPath, "utf8").trim();
    if (raw && raw !== "{}") {
      const tags = JSON.parse(raw);
      for (const tag of Object.values(tags)) {
        if (!tag?.label || !(tag.label in byLabel)) continue;
        byLabel[tag.label]++;
        taggedCount++;
      }
    }
  }

  return {
    definition:
      "Model-assisted error / intentional / uncertain labels on a subset of non-orthography variation units. Provisional hypotheses only — not ECM or NA judgments.",
    taggable_total: taggableTotal,
    tagged_count: taggedCount,
    coverage_percent: taggableTotal
      ? Math.round((taggedCount / taggableTotal) * 1000) / 10
      : 0,
    by_label: byLabel,
    not_run: taggedCount === 0,
    run_command: "npm run export-taggable && npm run tag-intentional",
  };
}

function findPrimerExample(witnessTexts) {
  for (const [ga, entry] of Object.entries(witnessTexts.texts)) {
    if (!entry?.available) continue;
    for (const verse of entry.initial_verses || []) {
      if (verse.variants?.length) {
        const v = verse.variants[0];
        return {
          witness: ga,
          reference: verse.reference,
          witness_reading: v.witness_reading,
          base_reading: v.base_reading,
          base_text: v.base_text,
          kind: v.kind,
        };
      }
    }
  }
  return null;
}

function main() {
  const witnesses = loadWitnessesFromTs();
  const quranWitnesses = loadQuranWitnessesFromTs();
  const nagHammadiWitnesses = loadNagHammadiWitnessesFromTs();
  const witnessTexts = loadJson(join(ROOT, "src/data/witness-texts.json"));
  const liste = loadJson(join(ROOT, "scripts/cache/liste.json"));

  const nt = computeNtCoverage(witnesses, witnessTexts, liste);
  nt.intentional_tagging = computeIntentionalTagging();
  const quran = computeQuranCoverage(quranWitnesses);
  const nagHammadi = computeNagHammadiCoverage(nagHammadiWitnesses);

  const out = {
    generated_at: new Date().toISOString(),
    sources: {
      witness_texts: "src/data/witness-texts.json",
      cntr_overflow: "public/cntr-texts/*.json",
      liste: "scripts/cache/liste.json",
      classifier: "scripts/lib/variant-classify.mjs",
      intentional_tags: "src/data/intentional-tags.json",
    },
    greek_nt: nt,
    quran,
    nag_hammadi: nagHammadi,
    primer_example: findPrimerExample(witnessTexts),
    home_stats: {
      greek_nt_witnesses: nt.witness_count,
      disagreements_total: nt.disagreements.total,
      disagreements_label: "variation units vs SR GNT",
    },
  };

  const outPath = join(ROOT, "src/data/coverage.json");
  writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`Wrote ${outPath}`);
  console.log(
    `Greek NT: ${nt.witness_count} witnesses, ${nt.disagreements.total} disagreements, ${nt.extant_word_tokens.total} extant word tokens`
  );
}

main();
