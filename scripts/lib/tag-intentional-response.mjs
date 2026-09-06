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

export function extractJsonObject(text) {
  const trimmed = String(text ?? "").trim();
  if (!trimmed) {
    throw new Error("Empty model response");
  }
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error(`Model did not return JSON: ${trimmed.slice(0, 200)}`);
  }
}

export function validateTag(parsed, expectedUnitId, { warn = console.warn } = {}) {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Response is not an object");
  }

  let unitId = parsed.unit_id;
  if (unitId !== expectedUnitId) {
    if (unitId == null || unitId === "") {
      warn(`WARN ${expectedUnitId}: model omitted unit_id — correcting`);
      unitId = expectedUnitId;
    } else {
      warn(
        `WARN ${expectedUnitId}: unit_id mismatch (got ${unitId}) — correcting to expected id`
      );
      unitId = expectedUnitId;
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

/** Optional LM Studio / Qwen thinking disable — ignored by servers that don't support it. */
export function thinkingDisableFields() {
  if (!process.env.LM_DISABLE_THINKING) return {};
  return {
    enable_thinking: false,
    chat_template_kwargs: { enable_thinking: false },
  };
}
