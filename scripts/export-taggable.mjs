#!/usr/bin/env node
/**
 * Export word-level variation units for local intentional-vs-error tagging.
 *
 * Usage:
 *   npm run export-taggable
 *   npm run export-taggable -- --include-orthography
 *   npm run export-taggable -- --sample 100
 */

import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { collectTaggableUnits } from "./lib/taggable-units.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function parseArgs(argv) {
  const opts = {
    includeOrthography: false,
    sample: 0,
    out: join(ROOT, "scripts/cache/taggable-units.jsonl"),
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--include-orthography") opts.includeOrthography = true;
    else if (arg === "--sample") opts.sample = Number(argv[++i]) || 0;
    else if (arg === "--out") opts.out = argv[++i];
    else if (arg === "--help" || arg === "-h") {
      console.log(`Usage: node scripts/export-taggable.mjs [options]

Options:
  --include-orthography   Include orthography units (skipped by default)
  --sample N              Also write first N lines to scripts/cache/taggable-units.sample.jsonl
  --out PATH              Output JSONL path (default: scripts/cache/taggable-units.jsonl)
`);
      process.exit(0);
    }
  }
  return opts;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const units = collectTaggableUnits({
    includeOrthography: opts.includeOrthography,
  });

  mkdirSync(dirname(opts.out), { recursive: true });
  const lines = units.map((u) => JSON.stringify(u));
  writeFileSync(opts.out, lines.join("\n") + (lines.length ? "\n" : ""));

  console.log(
    `Wrote ${units.length.toLocaleString()} taggable units to ${opts.out}` +
      (opts.includeOrthography ? " (including orthography)" : " (orthography skipped)")
  );

  if (opts.sample > 0) {
    const samplePath = join(ROOT, "scripts/cache/taggable-units.sample.jsonl");
    const sampleLines = lines.slice(0, opts.sample);
    writeFileSync(samplePath, sampleLines.join("\n") + (sampleLines.length ? "\n" : ""));
    console.log(`Wrote sample (${sampleLines.length} lines) to ${samplePath}`);
  }
}

main();
