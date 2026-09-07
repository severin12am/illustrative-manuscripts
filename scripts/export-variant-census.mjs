#!/usr/bin/env node
/**
 * Open variant census export for download (CSV + JSON).
 * Output: public/variant-census.csv, public/variant-census.json
 *
 * Regenerate: npm run export-census
 */

import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const CSV_COLUMNS = [
  "unit_id",
  "witness",
  "verse",
  "kind",
  "witness_reading",
  "sr_reading",
];

function csvEscape(value) {
  const s = String(value ?? "");
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function main() {
  const index = JSON.parse(
    readFileSync(join(ROOT, "src/data/variant-index.json"), "utf8")
  );

  const rows = index.units.map((u) => ({
    unit_id: u.unit_id,
    witness: u.witness_id,
    verse: u.verse_ref,
    kind: u.kind,
    witness_reading: u.witness_reading ?? "",
    sr_reading: u.sr_reading ?? "",
  }));

  const header = CSV_COLUMNS.join(",");
  const csvLines = [
    header,
    ...rows.map((r) => CSV_COLUMNS.map((c) => csvEscape(r[c])).join(",")),
  ];
  writeFileSync(join(ROOT, "public/variant-census.csv"), csvLines.join("\n"));

  const jsonOut = {
    generated_at: new Date().toISOString(),
    definition: index.definition,
    base_text: index.base_text,
    scope:
      "Greek NT papyri overlapping 1–300 CE with CNTR transcriptions in this repository — not a full-tradition census.",
    licenses_note:
      "CNTR transcriptions CC BY-SA 4.0; SR GNT CC BY-SA 4.0. See DATA.md for full attribution.",
    total: rows.length,
    columns: CSV_COLUMNS,
    units: rows,
  };
  writeFileSync(
    join(ROOT, "public/variant-census.json"),
    JSON.stringify(jsonOut)
  );

  console.log(
    `Wrote public/variant-census.csv and .json (${rows.length} units)`
  );
}

main();
