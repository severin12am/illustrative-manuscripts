#!/usr/bin/env node
/**
 * Validate and copy niʿmat shared-orthography matrix (van Putten 2019 Table 2).
 * Run: node scripts/build-quran-shared-orthography.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE = path.join(ROOT, "scripts/quran-shared-orthography-nimat.json");
const OUTPUT = path.join(ROOT, "src/data/quran-shared-orthography.json");

const data = JSON.parse(fs.readFileSync(SOURCE, "utf8"));
const validSpellings = new Set(["ta_marbuta", "ta"]);
let errors = 0;

if (!data.rows?.length || !data.manuscripts?.length) {
  console.error("Missing rows or manuscripts.");
  process.exit(1);
}

for (const row of data.rows) {
  if (!row.id || !row.ref || !row.cairo) {
    console.error(`Row missing id/ref/cairo: ${JSON.stringify(row.id)}`);
    errors++;
  }
  if (!validSpellings.has(row.cairo)) {
    console.error(`${row.id}: invalid cairo ${row.cairo}`);
    errors++;
  }
  for (const [sig, val] of Object.entries(row.readings ?? {})) {
    if (!validSpellings.has(val)) {
      console.error(`${row.id} ${sig}: invalid ${val}`);
      errors++;
    }
  }
}

if (errors) {
  console.error(`${errors} validation error(s).`);
  process.exit(1);
}

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 2) + "\n");
console.log(
  `Wrote ${data.rows.length} niʿmat rows, ${data.manuscripts.length} sigla → ${path.relative(ROOT, OUTPUT)}`
);
