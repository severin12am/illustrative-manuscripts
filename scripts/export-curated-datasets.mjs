#!/usr/bin/env node
/**
 * Copy hand-curated JSON datasets to public/ for static download.
 * Output: public/famous-passages.json, public/uthmani-regional-variants.json
 *
 * Regenerate: npm run export-curated
 */
import { copyFileSync, existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PUBLIC = join(ROOT, "public");

const PAIRS = [
  ["src/data/famous-passages.json", "famous-passages.json"],
  ["src/data/uthmani-regional-variants.json", "uthmani-regional-variants.json"],
  ["src/data/quran-shared-orthography.json", "quran-shared-orthography.json"],
];

for (const [srcRel, destName] of PAIRS) {
  const src = join(ROOT, srcRel);
  if (!existsSync(src)) {
    console.error(`Missing ${srcRel} — run npm run famous-passages / uthmani-regional first.`);
    process.exit(1);
  }
  const dest = join(PUBLIC, destName);
  copyFileSync(src, dest);
  const parsed = JSON.parse(readFileSync(src, "utf8"));
  const count =
    parsed.entries?.length ??
    parsed.variants?.length ??
    parsed.rows?.length ??
    "?";
  console.log(`Wrote public/${destName} (${count} top-level records)`);
}
