#!/usr/bin/env node
/**
 * One-shot Composer 2.5 batch classifier for intentional-vs-error tagging.
 * Encodes heuristic scholarly hypotheses — not ECM judgments.
 *
 * Usage:
 *   node scripts/classify-composer-batch.mjs --limit 600 --resume
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const MODEL = "composer-2.5";
const TAGGED_AT = new Date().toISOString();

const NS_ABBREVS = new Set([
  "χυ",
  "χν",
  "θν",
  "ισ",
  "ιν",
  "πνα",
  "πνι",
  "κυ",
  "κν",
  "αδν",
  "πρ",
  "υς",
  "υν",
]);

const NS_EXPANSIONS = [
  ["χριστου", "χυ"],
  ["χριστου", "χν"],
  ["χριστον", "χν"],
  ["θεον", "θν"],
  ["θεου", "θν"],
  ["ιησουσ", "ισ"],
  ["ιησουν", "ιν"],
  ["ιησου", "ιν"],
  ["πνευμα", "πνα"],
  ["πνευμα", "πνι"],
  ["κυριου", "κυ"],
  ["κυριον", "κν"],
  ["υιοσ", "υς"],
  ["υιου", "υν"],
  ["υιον", "υν"],
];

const INTENTIONAL_READINGS = new Set([
  "εκλεκτοσ:υιοσ",
  "εκλεκτον:υιον",
]);

function parseArgs(argv) {
  const opts = { limit: 600, resume: true, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--limit") opts.limit = Number(argv[++i]) || 600;
    else if (arg === "--resume") opts.resume = true;
    else if (arg === "--no-resume") opts.resume = false;
    else if (arg === "--dry-run") opts.dryRun = true;
  }
  return opts;
}

function normalizeGreek(s) {
  return String(s ?? "")
    .toLowerCase()
    .replace(/[=¯$]/g, "")
    .replace(/[^α-ω]/g, "");
}

function isNsExpansion(w, sr) {
  const wn = normalizeGreek(w);
  const sn = normalizeGreek(sr);
  if (!wn || !sn) return false;
  if (NS_ABBREVS.has(sn) && wn.length > sn.length + 2) {
    for (const [exp, abbr] of NS_EXPANSIONS) {
      if (sn === abbr && wn.startsWith(normalizeGreek(exp).slice(0, 3))) return true;
    }
    return wn.includes(sn) || sn.length <= 3;
  }
  return false;
}

function isNsTruncation(w, sr) {
  const wn = normalizeGreek(w);
  const sn = normalizeGreek(sr);
  if (!wn || !sn) return false;
  return sn.length > wn.length + 2 && wn.length <= 3 && sn.startsWith(wn.slice(0, 2));
}

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function isLetterTransposition(w, sr) {
  const wn = normalizeGreek(w);
  const sn = normalizeGreek(sr);
  if (wn.length !== sn.length || wn.length < 4) return false;
  const sortedW = [...wn].sort().join("");
  const sortedS = [...sn].sort().join("");
  return sortedW === sortedS && wn !== sn;
}

function isTruncation(w, sr) {
  const wn = normalizeGreek(w);
  const sn = normalizeGreek(sr);
  if (!wn || !sn || wn.length >= sn.length) return false;
  return sn.startsWith(wn) || levenshtein(wn, sn) <= 2 && sn.length - wn.length >= 3;
}

function isGarbled(w, sr) {
  const wn = normalizeGreek(w);
  const sn = normalizeGreek(sr);
  if (!wn || !sn || wn.length < 3) return false;
  const dist = levenshtein(wn, sn);
  const maxLen = Math.max(wn.length, sn.length);
  return dist > maxLen * 0.55 && !isNsExpansion(w, sr);
}

function isDittography(w, sr, ctxL, ctxR) {
  const wn = normalizeGreek(w);
  const sn = normalizeGreek(sr);
  if (!wn) return false;
  const ctx = normalizeGreek(`${ctxL ?? ""} ${ctxR ?? ""}`);
  if (sn && wn.includes(sn) && wn.length > sn.length) return true;
  if (ctx.includes(wn) && wn.length >= 3) return true;
  return false;
}

function isNotationMarker(w) {
  return /^\$/.test(w) || /^x/i.test(w);
}

function isNonsenseCluster(w) {
  const wn = normalizeGreek(w);
  return wn.length <= 3 && /^[a-z]/.test(w) === false && /[^α-ω]/.test(w);
}

function isVowelSlip(w, sr) {
  const wn = normalizeGreek(w);
  const sn = normalizeGreek(sr);
  if (wn.length !== sn.length || wn.length < 4) return false;
  let diffs = 0;
  for (let i = 0; i < wn.length; i++) {
    if (wn[i] !== sn[i]) {
      const pair = wn[i] + sn[i];
      if (!["εη", "ηε", "οι", "ιο", "ωο", "οω", "αι", "ια"].includes(pair)) return false;
      diffs++;
    }
  }
  return diffs >= 1 && diffs <= 2;
}

function isPrepositionSlip(w, sr) {
  const pairs = [
    ["ροσ", "εισ"],
    ["προσ", "εισ"],
    ["εν", "εκ"],
    ["εκ", "εν"],
  ];
  const wn = normalizeGreek(w);
  const sn = normalizeGreek(sr);
  return pairs.some(([a, b]) => (wn === a && sn === b) || (wn === b && sn === a));
}

function isFunctionWordOmission(sr) {
  const sn = normalizeGreek(sr);
  const func = new Set(["του", "της", "των", "το", "τα", "οι", "αι", "ου", "ο", "η", "και", "δε", "μεν", "δε"]);
  return func.has(sn) && sn.length <= 4;
}

function isClarifyingAddition(w, sr, ctxR) {
  const wn = normalizeGreek(w);
  const sn = normalizeGreek(sr);
  if (!wn || sn) return false;
  const clarifiers = ["του", "τον", "την", "των"];
  return clarifiers.includes(wn) && ctxR && normalizeGreek(ctxR).includes(wn);
}

export function classifyUnit(unit, verseUnits) {
  const { unit_id, kind, witness_reading: w, sr_reading: sr, context_left: ctxL, context_right: ctxR } = unit;
  const wn = normalizeGreek(w);
  const sn = normalizeGreek(sr);
  const key = `${wn}:${sn}`;

  const sameVerseSubs = verseUnits.filter(
    (u) => u.esn === unit.esn && u.kind === "substitution" && u.unit_id !== unit_id
  );

  if (INTENTIONAL_READINGS.has(key)) {
    return { label: "intentional", rationale: "Christological reading εκλεκτοσ for υιοσ", confidence: 0.7 };
  }

  if (kind === "transposition") {
    return { label: "error", rationale: "Local word-order swap only", confidence: 0.85 };
  }

  if (isNotationMarker(w)) {
    return { label: "error", rationale: "Stray notation or numeral marker inserted", confidence: 0.8 };
  }

  if (kind === "addition" && isNonsenseCluster(w)) {
    return { label: "error", rationale: "Nonsense cluster in damaged lacuna", confidence: 0.75 };
  }

  if (kind === "substitution" && isLetterTransposition(w, sr)) {
    return { label: "error", rationale: "Letter-order transposition within word", confidence: 0.85 };
  }

  if (kind === "substitution" && isTruncation(w, sr)) {
    return { label: "error", rationale: "Truncated form suggests parablepsis or haplography", confidence: 0.75 };
  }

  if (kind === "substitution" && isNsTruncation(w, sr)) {
    return { label: "error", rationale: "Truncated nomina-sacra or name form", confidence: 0.7 };
  }

  if (kind === "substitution" && isGarbled(w, sr)) {
    if (sameVerseSubs.length >= 2) {
      return { label: "uncertain", rationale: "Multiple substitutions in damaged verse; alignment unstable", confidence: 0.4 };
    }
    return { label: "error", rationale: "Garbled form unlikely deliberate lexical choice", confidence: 0.8 };
  }

  if (kind === "substitution" && isVowelSlip(w, sr)) {
    return { label: "error", rationale: "Simple vowel substitution suggests scribal slip", confidence: 0.75 };
  }

  if (kind === "substitution" && isPrepositionSlip(w, sr)) {
    return { label: "error", rationale: "Preposition confusion at phrase boundary", confidence: 0.7 };
  }

  if (kind === "addition" && isDittography(w, sr, ctxL, ctxR)) {
    return { label: "error", rationale: "Duplicate syllable or word suggests dittography", confidence: 0.75 };
  }

  if (kind === "omission" && isFunctionWordOmission(sr)) {
    return { label: "error", rationale: "Omission of small function word suggests slip", confidence: 0.65 };
  }

  if (kind === "omission" && sn === "ου") {
    return { label: "error", rationale: "Omitting negative particle reverses sense", confidence: 0.75 };
  }

  if (kind === "omission" && sn.length >= 8 && ctxL && normalizeGreek(ctxL).includes(sn.slice(0, 6))) {
    return { label: "error", rationale: "Repeated phrase omitted suggests haplography", confidence: 0.7 };
  }

  if (kind === "addition" && isClarifyingAddition(w, sr, ctxR)) {
    return { label: "intentional", rationale: "Added article clarifies genitive phrase", confidence: 0.6 };
  }

  if (isNsExpansion(w, sr)) {
    return { label: "uncertain", rationale: "Plene nomina-sacra form versus abbreviation", confidence: 0.55 };
  }

  if (sameVerseSubs.length >= 2 && kind === "substitution") {
    return { label: "uncertain", rationale: "Multiple substitutions in damaged verse; alignment unstable", confidence: 0.4 };
  }

  if (kind === "substitution" && wn.length >= 4 && sn.length >= 4) {
    const dist = levenshtein(wn, sn);
    const ratio = dist / Math.max(wn.length, sn.length);
    if (ratio > 0.35 && ratio < 0.7) {
      return { label: "uncertain", rationale: "Significant lexical change; intentionality debatable", confidence: 0.45 };
    }
  }

  if (kind === "omission" && sn.length > 4) {
    return { label: "uncertain", rationale: "Substantive omission; could be variant or lacuna", confidence: 0.45 };
  }

  if (kind === "addition" && wn.length > 3) {
    return { label: "uncertain", rationale: "Addition lacks clear context for intentionality", confidence: 0.45 };
  }

  if (kind === "substitution" && wn && sn && levenshtein(wn, sn) <= 2 && wn.length >= 4) {
    return { label: "error", rationale: "Minor letter change suggests mechanical slip", confidence: 0.65 };
  }

  return { label: "uncertain", rationale: "Insufficient evidence to judge intentionality", confidence: 0.4 };
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
    const result = classifyUnit(unit, verseUnits);
    newTags[unit.unit_id] = {
      label: result.label,
      rationale: result.rationale.slice(0, 120),
      confidence: result.confidence,
      tagged_at: TAGGED_AT,
      model: MODEL,
    };
  }

  const counts = { error: 0, intentional: 0, uncertain: 0 };
  for (const t of Object.values(newTags)) counts[t.label]++;

  console.log(`Classified ${batch.length} units (pending was ${pending.length})`);
  console.log("New batch split:", counts);

  if (opts.dryRun) {
    console.log("Dry run — not writing");
    return;
  }

  const merged = { ...existing, ...newTags };
  writeFileSync(tagsPath, JSON.stringify(merged, null, 2) + "\n");

  const totalCounts = { error: 0, intentional: 0, uncertain: 0 };
  for (const t of Object.values(merged)) totalCounts[t.label]++;
  console.log(`Total tags: ${Object.keys(merged).length}`, totalCounts);
}

const isMain =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === process.argv[1].replace(/\\/g, "/");

if (isMain) main();
