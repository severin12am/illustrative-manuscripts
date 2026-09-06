#!/usr/bin/env node
/**
 * Unit tests for LM response parsing (no LM Studio required).
 * Run: npm run test:tag-intentional
 */

import {
  messageTextFromChoice,
  extractJsonObject,
  validateTag,
  parseTagFromMessage,
  thinkingDisableFields,
} from "./lib/tag-intentional-response.mjs";

const UNIT = "P106:43001031:w4-5:transposition";
const JSON_TAG = `{"unit_id":"${UNIT}","label":"error","rationale":"Word-order swap only","confidence":0.85}`;

let failed = 0;

function ok(name, cond) {
  if (cond) console.log(`ok ${name}`);
  else {
    failed++;
    console.error(`FAIL ${name}`);
  }
}

ok("content preferred", messageTextFromChoice({ content: JSON_TAG }) === JSON_TAG);
ok(
  "reasoning_content fallback",
  messageTextFromChoice({ content: "", reasoning_content: JSON_TAG }) === JSON_TAG
);
ok(
  "reasoning when content whitespace",
  messageTextFromChoice({ content: "  ", reasoning_content: JSON_TAG }) === JSON_TAG
);

const parsed = extractJsonObject(
  `Let me think...\n${JSON_TAG}\nDone.`
);
ok("extractJsonObject embedded", parsed.label === "error");

const tag = parseTagFromMessage(
  { content: "", reasoning_content: JSON_TAG },
  UNIT,
  () => {}
);
ok("parseTagFromMessage from reasoning", tag.label === "error");

const warnings = [];
const corrected = validateTag(
  { label: "uncertain", rationale: "Cannot tell", confidence: 0.4 },
  UNIT,
  { warn: (m) => warnings.push(m) }
);
ok("missing unit_id corrected", corrected.label === "uncertain");
ok("missing unit_id warned", warnings.some((w) => w.includes("omitted unit_id")));

const warnings2 = [];
validateTag(
  {
    unit_id: "wrong-id",
    label: "error",
    rationale: "Clear slip",
    confidence: 0.9,
  },
  UNIT,
  { warn: (m) => warnings2.push(m) }
);
ok("wrong unit_id warned", warnings2.some((w) => w.includes("mismatch")));

ok(
  "thinkingDisableFields empty by default",
  Object.keys(thinkingDisableFields()).length === 0
);

process.env.LM_DISABLE_THINKING = "1";
ok(
  "thinkingDisableFields when set",
  thinkingDisableFields().enable_thinking === false
);
delete process.env.LM_DISABLE_THINKING;

try {
  parseTagFromMessage({ content: "", reasoning_content: "" }, UNIT, () => {});
  failed++;
  console.error("FAIL empty message should throw");
} catch (err) {
  ok("empty message throws", err.message.includes("Empty model response"));
}

if (failed) {
  console.error(`\n${failed} test(s) failed`);
  process.exit(1);
}

console.log("\nAll tag-intentional response tests passed.");
