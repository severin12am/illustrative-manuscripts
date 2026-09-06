#!/usr/bin/env node
/**
 * Tag variation units as error / intentional / uncertain via a local OpenAI-compatible LLM
 * (LM Studio, default http://127.0.0.1:1234).
 *
 * Usage:
 *   npm run tag-intentional
 *   npm run tag-intentional -- --limit 50 --resume
 *   npm run tag-intentional -- --dry-run --limit 0
 *
 * Env:
 *   LM_BASE_URL  default http://127.0.0.1:1234/v1/chat/completions
 *   LM_MODEL     default first non-embedding model from /v1/models, else "uncategorized"
 *   RATE_LIMIT_MS default 500
 *   LM_DISABLE_THINKING  if set, sends enable_thinking:false (LM Studio / Qwen; ignored elsewhere)
 */

import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
} from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import {
  parseTagFromMessage,
  thinkingDisableFields,
} from "./lib/tag-intentional-response.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const DEFAULT_INPUT = join(ROOT, "scripts/cache/taggable-units.jsonl");
const DEFAULT_OUTPUT = join(ROOT, "src/data/intentional-tags.json");
const MAX_TOKENS = 1024;

const SYSTEM_PROMPT = `You classify New Testament papyrus variation units as likely scribal error, likely intentional, or uncertain.

Reply with JSON only — no markdown, no prose outside the object:
{"unit_id":"<same id>","label":"error"|"intentional"|"uncertain","rationale":"≤20 words","confidence":0.0-1.0}

Labels:
- error: haplography, dittography, leap, nonsense, clear slip
- intentional: harmonization to parallel, doctrinal/stylistic preference, clarifying expansion (hypothesis, not verdict)
- uncertain: cannot tell from the evidence given

These are provisional hypotheses for teaching, not ECM judgments.`;

function parseArgs(argv) {
  const opts = {
    input: DEFAULT_INPUT,
    output: DEFAULT_OUTPUT,
    limit: Infinity,
    resume: false,
    dryRun: false,
    delayMs: Number(process.env.RATE_LIMIT_MS) || 500,
    baseUrl:
      process.env.LM_BASE_URL ||
      "http://127.0.0.1:1234/v1/chat/completions",
    model: process.env.LM_MODEL || null,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--input") opts.input = argv[++i];
    else if (arg === "--output") opts.output = argv[++i];
    else if (arg === "--limit") opts.limit = Number(argv[++i]);
    else if (arg === "--resume") opts.resume = true;
    else if (arg === "--dry-run") opts.dryRun = true;
    else if (arg === "--delay-ms") opts.delayMs = Number(argv[++i]) || 0;
    else if (arg === "--help" || arg === "-h") {
      console.log(`Usage: node scripts/tag-intentional.mjs [options]

Options:
  --input PATH     JSONL input (default scripts/cache/taggable-units.jsonl)
  --output PATH    Tag map output (default src/data/intentional-tags.json)
  --limit N        Tag at most N units (0 = validate CLI only)
  --resume         Skip unit_ids already present in output
  --dry-run        Do not call the model or write output
  --delay-ms MS    Pause between API calls (default 500 or RATE_LIMIT_MS)

Environment:
  LM_BASE_URL           OpenAI-compatible chat completions endpoint
  LM_MODEL              Model id (auto-detected from /v1/models when unset)
  RATE_LIMIT_MS         Default delay between requests
  LM_DISABLE_THINKING   If set, request enable_thinking:false (LM Studio/Qwen; harmless elsewhere)
`);
      process.exit(0);
    }
  }
  return opts;
}

function loadJsonl(path) {
  if (!existsSync(path)) {
    throw new Error(`Input not found: ${path}\nRun: npm run export-taggable`);
  }
  return readFileSync(path, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, i) => {
      try {
        return JSON.parse(line);
      } catch {
        throw new Error(`Invalid JSON on line ${i + 1} of ${path}`);
      }
    });
}

function loadExistingTags(path) {
  if (!existsSync(path)) return {};
  const raw = readFileSync(path, "utf8").trim();
  if (!raw || raw === "{}") return {};
  const data = JSON.parse(raw);
  return typeof data === "object" && data !== null ? data : {};
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function modelsUrl(baseUrl) {
  return baseUrl.replace(/\/chat\/completions\/?$/, "/models");
}

async function resolveModel(baseUrl, explicit) {
  if (explicit) return explicit;
  const url = modelsUrl(baseUrl);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const data = await res.json();
    const models = (data.data || [])
      .map((m) => m.id)
      .filter((id) => id && !/embed/i.test(id));
    if (models.length) return models[0];
  } catch (err) {
    console.warn(`Could not list models at ${url}: ${err.message}`);
  }
  return "uncategorized";
}

function buildUserPrompt(unit) {
  const parts = [
    `unit_id: ${unit.unit_id}`,
    `witness: ${unit.witness_id}`,
    `reference: ${unit.verse_ref}`,
    `kind: ${unit.kind}`,
    `witness_reading: ${unit.witness_reading || "(empty)"}`,
    `sr_reading: ${unit.sr_reading || "(empty)"}`,
  ];
  if (unit.context_left) parts.push(`context_left: ${unit.context_left}`);
  if (unit.context_right) parts.push(`context_right: ${unit.context_right}`);
  return parts.join("\n");
}

async function tagUnit(unit, opts, model) {
  const body = {
    model,
    temperature: 0.2,
    max_tokens: MAX_TOKENS,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(unit) },
    ],
    ...thinkingDisableFields(),
  };

  const res = await fetch(opts.baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`LM API ${res.status}: ${detail.slice(0, 300)}`);
  }

  const data = await res.json();
  const message = data.choices?.[0]?.message;
  const tag = parseTagFromMessage(message, unit.unit_id, console.warn);
  tag.model = model;
  return tag;
}

function saveTags(path, tags) {
  mkdirSync(dirname(path), { recursive: true });
  const sorted = Object.fromEntries(
    Object.entries(tags).sort(([a], [b]) => a.localeCompare(b))
  );
  writeFileSync(path, JSON.stringify(sorted, null, 2) + "\n");
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const units = loadJsonl(opts.input);
  const existing = opts.resume ? loadExistingTags(opts.output) : {};
  const pending = units.filter((u) => !existing[u.unit_id]);
  const toProcess =
    opts.limit === 0 ? [] : pending.slice(0, Math.max(0, opts.limit));

  console.log(`Loaded ${units.length} units from ${opts.input}`);
  console.log(`Already tagged: ${Object.keys(existing).length}`);
  console.log(`Pending: ${pending.length}`);
  console.log(`Will process: ${toProcess.length}${opts.dryRun ? " (dry-run)" : ""}`);

  if (opts.limit === 0) {
    console.log("Limit 0 — CLI validation only, exiting.");
    return;
  }

  if (opts.dryRun) {
    if (toProcess.length > 0) {
      console.log("Sample unit:", toProcess[0].unit_id);
      console.log(buildUserPrompt(toProcess[0]));
    }
    console.log("Dry-run complete — no API calls, no output written.");
    return;
  }

  const model = await resolveModel(opts.baseUrl, opts.model);
  console.log(`Using model: ${model}`);
  console.log(`Endpoint: ${opts.baseUrl}`);
  if (process.env.LM_DISABLE_THINKING) {
    console.log("LM_DISABLE_THINKING set — requesting enable_thinking:false");
  }

  const tags = { ...existing };
  let tagged = 0;
  let failed = 0;

  for (const unit of toProcess) {
    try {
      const tag = await tagUnit(unit, opts, model);
      tags[unit.unit_id] = tag;
      tagged++;
      saveTags(opts.output, tags);
      console.log(`[${tagged}/${toProcess.length}] ${unit.unit_id} → ${tag.label}`);
      if (opts.delayMs > 0 && tagged < toProcess.length) {
        await sleep(opts.delayMs);
      }
    } catch (err) {
      failed++;
      console.error(`FAIL ${unit.unit_id}: ${err.message}`);
    }
  }

  console.log(`Done. Tagged ${tagged}, failed ${failed}, total in map ${Object.keys(tags).length}`);
  if (failed > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
