#!/usr/bin/env node
/**
 * Regression tests for scripts/lib/variant-classify.mjs
 * Run: node scripts/test-variant-classify.mjs
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { classifyVerseVariants } from "./lib/variant-classify.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixtures = JSON.parse(
  readFileSync(join(__dirname, "fixtures/variant-classify-fixtures.json"), "utf8")
);

function pickFields(v) {
  return {
    kind: v.kind,
    witness_reading: v.witness_reading,
    base_reading: v.base_reading,
  };
}

let failed = 0;

for (const fx of fixtures) {
  const got = classifyVerseVariants(
    fx.extant_runs,
    fx.sr_words,
    fx.book_id,
    fx.chapter,
    fx.verse
  ).map(pickFields);

  const expectations = fx.expect_any ?? [fx.expect];
  const ok = expectations.some(
    (expected) =>
      got.length === expected.length &&
      got.every(
        (g, i) =>
          g.kind === expected[i].kind &&
          g.witness_reading === expected[i].witness_reading &&
          g.base_reading === expected[i].base_reading
      )
  );

  if (!ok) {
    failed++;
    console.error(`FAIL ${fx.id}`);
    console.error("  expected one of:", JSON.stringify(expectations));
    console.error("  got:     ", JSON.stringify(got));
  } else {
    console.log(`ok ${fx.id}`);
  }
}

if (failed) {
  console.error(`\n${failed} fixture(s) failed`);
  process.exit(1);
}

console.log(`\nAll ${fixtures.length} fixtures passed.`);
