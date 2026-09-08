#!/usr/bin/env node
/**
 * Validate and copy hand-curated Uthmanic regional rasm variants to src/data/.
 * Run: node scripts/build-uthmani-regional-variants.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE = path.join(ROOT, "scripts/uthmani-regional-variants.json");
const OUTPUT = path.join(ROOT, "src/data/uthmani-regional-variants.json");

const data = JSON.parse(fs.readFileSync(SOURCE, "utf8"));

if (!data.variants?.length) {
  console.error("No variants in seed file.");
  process.exit(1);
}

const regions = ["syria", "medina", "basra", "kufa"];
let errors = 0;

for (const v of data.variants) {
  if (!v.id || !v.ref || !v.readings) {
    console.error(`Missing id/ref/readings on variant: ${JSON.stringify(v.id)}`);
    errors++;
    continue;
  }
  for (const r of regions) {
    const reading = v.readings[r];
    if (!reading?.rasm || !reading?.gloss) {
      console.error(`${v.id}: missing ${r} rasm or gloss`);
      errors++;
    }
  }
  if (!v.sources?.length) {
    console.error(`${v.id}: no sources`);
    errors++;
  }
}

if (errors) {
  console.error(`${errors} validation error(s).`);
  process.exit(1);
}

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 2) + "\n");
console.log(
  `Wrote ${data.variants.length} regional variants → ${path.relative(ROOT, OUTPUT)}`
);
