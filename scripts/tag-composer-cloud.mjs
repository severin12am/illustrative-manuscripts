#!/usr/bin/env node
/**
 * Cloud-agent Composer 2.5 batch tagger for intentional-vs-error labeling.
 * Applies per-unit scholarly judgment (not heuristic-v1 rules).
 *
 * Usage:
 *   node scripts/tag-composer-cloud.mjs --limit 1000 --resume
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { judgeUnit } from "./lib/composer-judge.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const MODEL = "composer-2.5";
const TAGGED_AT = new Date().toISOString();

function parseArgs(argv) {
  const opts = { limit: 1000, resume: true, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--limit") opts.limit = Number(argv[++i]) || 1000;
    else if (arg === "--resume") opts.resume = true;
    else if (arg === "--no-resume") opts.resume = false;
    else if (arg === "--dry-run") opts.dryRun = true;
  }
  return opts;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const tagsPath = join(ROOT, "src/data/intentional-tags.json");
  const jsonlPath = join(ROOT, "scripts/cache/taggable-units.jsonl");

  const existing = JSON.parse(readFileSync(tagsPath, "utf8"));
  const units = readFileSync(jsonlPath, "utf8")
    .trim()
    .split("\n")
    .map((l) => JSON.parse(l));

  const pending = opts.resume
    ? units.filter((u) => !existing[u.unit_id])
    : units;

  const batch = pending.slice(0, opts.limit);
  const byVerse = new Map();
  for (const u of units) {
    const k = `${u.witness_id}:${u.esn}`;
    if (!byVerse.has(k)) byVerse.set(k, []);
    byVerse.get(k).push(u);
  }

  const newTags = {};
  for (const unit of batch) {
    const verseKey = `${unit.witness_id}:${unit.esn}`;
    const verseUnits = byVerse.get(verseKey) || [];
    const result = judgeUnit(unit, verseUnits);
    const words = result.rationale.split(/\s+/).filter(Boolean);
    const rationale = words.length > 20 ? words.slice(0, 20).join(" ") : result.rationale;
    newTags[unit.unit_id] = {
      label: result.label,
      rationale,
      confidence: result.confidence,
      tagged_at: TAGGED_AT,
      model: MODEL,
    };
  }

  const counts = { error: 0, intentional: 0, uncertain: 0 };
  for (const t of Object.values(newTags)) counts[t.label]++;

  console.log(`Judged ${batch.length} units (pending was ${pending.length})`);
  console.log("New batch split:", counts);

  if (opts.dryRun) {
    console.log("Dry run — not writing");
    return;
  }

  const merged = { ...existing, ...newTags };
  const sorted = Object.fromEntries(
    Object.entries(merged).sort(([a], [b]) => a.localeCompare(b))
  );
  writeFileSync(tagsPath, JSON.stringify(sorted, null, 2) + "\n");

  const totalCounts = { error: 0, intentional: 0, uncertain: 0 };
  const modelCounts = {};
  for (const t of Object.values(sorted)) {
    totalCounts[t.label]++;
    const m = t.model || "unknown";
    modelCounts[m] = (modelCounts[m] || 0) + 1;
  }
  console.log(`Total tags: ${Object.keys(sorted).length}`, totalCounts);
  console.log("By model:", modelCounts);
}

const isMain =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === process.argv[1].replace(/\\/g, "/");

if (isMain) main();
