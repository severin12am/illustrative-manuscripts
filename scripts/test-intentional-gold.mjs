#!/usr/bin/env node
/**
 * Validate intentional tagging gold fixtures against export and label schema.
 * Run: npm run test:intentional
 */

import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { collectTaggableUnits } from "./lib/taggable-units.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const VALID = new Set(["error", "intentional", "uncertain"]);

const gold = JSON.parse(
  readFileSync(join(__dirname, "fixtures/intentional-gold.json"), "utf8")
);
const units = collectTaggableUnits({ includeOrthography: false });
const byId = new Map(units.map((u) => [u.unit_id, u]));

let failed = 0;

if (!Array.isArray(gold.units) || gold.units.length < 15) {
  console.error("Gold set should contain at least 15 units");
  failed++;
}

for (const entry of gold.units || []) {
  if (!VALID.has(entry.expected_label)) {
    failed++;
    console.error(`FAIL ${entry.unit_id}: invalid expected_label ${entry.expected_label}`);
    continue;
  }
  if (!byId.has(entry.unit_id)) {
    failed++;
    console.error(`FAIL ${entry.unit_id}: not found in taggable export`);
    continue;
  }
  console.log(`ok ${entry.unit_id} → ${entry.expected_label}`);
}

if (failed) {
  console.error(`\n${failed} gold fixture issue(s)`);
  process.exit(1);
}

console.log(`\nAll ${gold.units.length} gold fixtures valid.`);
