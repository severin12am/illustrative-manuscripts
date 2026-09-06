export const VALID_INTENTIONAL_LABELS = new Set([
  "error",
  "intentional",
  "uncertain",
]);

/** Prefer final content; Qwen/LM Studio often puts JSON in reasoning_content. */
export function messageTextFromChoice(message) {
  if (!message || typeof message !== "object") return "";
  const content = typeof message.content === "string" ? message.content.trim() : "";
  if (content) return content;
  const reasoning =
    typeof message.reasoning_content === "string"
      ? message.reasoning_content.trim()
      : "";
  return reasoning;
}

export function stripMarkdownFences(text) {
  let s = String(text ?? "").trim();
  s = s.replace(/^```(?:json)?\s*\r?\n?/i, "");
  s = s.replace(/\r?\n?```\s*$/i, "");
  return s.trim();
}

export function looksLikeTagObject(obj) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return false;
  if (!VALID_INTENTIONAL_LABELS.has(obj.label)) return false;
  if (obj.rationale == null || String(obj.rationale).trim() === "") return false;
  const confidence = Number(obj.confidence);
  return Number.isFinite(confidence) && confidence >= 0 && confidence <= 1;
}

/** Find the first parseable {...} that looks like a tag object. */
export function findTagJsonObject(text) {
  const cleaned = stripMarkdownFences(text);
  if (!cleaned) {
    throw new Error("Empty model response");
  }

  try {
    const direct = JSON.parse(cleaned);
    if (looksLikeTagObject(direct)) return direct;
  } catch {
    /* scan below */
  }

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start >= 0 && end > start) {
    try {
      const slice = JSON.parse(cleaned.slice(start, end + 1));
      if (looksLikeTagObject(slice)) return slice;
    } catch {
      /* scan below */
    }
  }

  for (let i = 0; i < cleaned.length; i++) {
    if (cleaned[i] !== "{") continue;
    let depth = 0;
    for (let j = i; j < cleaned.length; j++) {
      if (cleaned[j] === "{") depth++;
      else if (cleaned[j] === "}") {
        depth--;
        if (depth === 0) {
          try {
            const candidate = JSON.parse(cleaned.slice(i, j + 1));
            if (looksLikeTagObject(candidate)) return candidate;
          } catch {
            /* try next brace */
          }
          break;
        }
      }
    }
  }

  throw new Error(`Model did not return JSON: ${cleaned.slice(0, 200)}`);
}

export function extractJsonObject(text) {
  return findTagJsonObject(text);
}

export function validateTag(parsed, expectedUnitId, { warn = console.warn } = {}) {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Response is not an object");
  }

  if (parsed.unit_id !== expectedUnitId) {
    if (parsed.unit_id == null || parsed.unit_id === "") {
      warn(`WARN ${expectedUnitId}: model omitted unit_id — correcting`);
    } else {
      warn(
        `WARN ${expectedUnitId}: unit_id mismatch (got ${parsed.unit_id}) — correcting to expected id`
      );
    }
  }

  if (!VALID_INTENTIONAL_LABELS.has(parsed.label)) {
    throw new Error(`Invalid label: ${parsed.label}`);
  }
  const rationale = String(parsed.rationale ?? "").trim();
  if (!rationale) throw new Error("Missing rationale");
  const words = rationale.split(/\s+/).filter(Boolean);
  if (words.length > 20) {
    throw new Error(`Rationale too long (${words.length} words)`);
  }
  const confidence = Number(parsed.confidence);
  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) {
    throw new Error(`Invalid confidence: ${parsed.confidence}`);
  }

  return {
    label: parsed.label,
    rationale,
    confidence,
    tagged_at: new Date().toISOString(),
  };
}

export function parseTagFromMessage(message, expectedUnitId, warn = console.warn) {
  const text = messageTextFromChoice(message);
  const parsed = extractJsonObject(text);
  return validateTag(parsed, expectedUnitId, { warn });
}

export function isParseFailure(err) {
  const msg = String(err?.message ?? err);
  return (
    msg.includes("Empty model response") ||
    msg.includes("Model did not return JSON") ||
    msg.includes("Response is not an object") ||
    msg.includes("Invalid label") ||
    msg.includes("Missing rationale") ||
    msg.includes("Rationale too long") ||
    msg.includes("Invalid confidence")
  );
}

/** Optional LM Studio / Qwen thinking disable — ignored by servers that don't support it. */
export function thinkingDisableFields() {
  if (!process.env.LM_DISABLE_THINKING) return {};
  return {
    enable_thinking: false,
    chat_template_kwargs: { enable_thinking: false },
  };
}

/** Optional JSON mode — LM Studio may honor response_format. */
export function jsonModeFields() {
  if (!process.env.LM_JSON_MODE) return {};
  return { response_format: { type: "json_object" } };
}

export const SYSTEM_PROMPT = `You classify New Testament papyrus variation units as likely scribal error, likely intentional, or uncertain.

Your entire reply MUST be exactly one JSON object — nothing else.
- First character MUST be {
- Last character MUST be }
- No markdown fences, no prose, no chain-of-thought, no explanation outside JSON
- If unsure, use label "uncertain"
- Never write anything before or after the JSON object

Schema:
{"unit_id":"<same id>","label":"error"|"intentional"|"uncertain","rationale":"≤20 words","confidence":0.0-1.0}

Labels:
- error: haplography, dittography, leap, nonsense, clear slip
- intentional: harmonization to parallel, doctrinal/stylistic preference, clarifying expansion (hypothesis, not verdict)
- uncertain: cannot tell from the evidence given

Valid examples (your output must look like these — JSON only):
{"unit_id":"P106:43001031:w4-5:transposition","label":"error","rationale":"Local word-order swap only","confidence":0.9}
{"unit_id":"P106:43001034:w4:substitution","label":"intentional","rationale":"Christological reading εκλεκτοσ for υιοσ","confidence":0.7}
{"unit_id":"P100:59004011:w3:substitution","label":"uncertain","rationale":"Damaged text; intentionality unclear","confidence":0.3}

These are provisional teaching hypotheses, not ECM judgments.`;

export function buildRetryUserPrompt(unitId) {
  return `Reply with JSON only for unit_id ${unitId}. label error|intentional|uncertain. First character must be {. Last character must be }. No other text.`;
}
