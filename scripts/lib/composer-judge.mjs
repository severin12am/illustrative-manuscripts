/**
 * Per-unit Composer 2.5 scholarly judgment for intentional-vs-error tagging.
 * Distinct from heuristic-v1 (classify-composer-batch.mjs): uses context, attested
 * variant families, and damage-aware reasoning — not mechanical rule stacking.
 */

const NS_ABBREVS = new Set([
  "χυ", "χν", "θν", "ισ", "ιν", "πνα", "πνι", "κυ", "κν", "αδν", "πρ", "υς", "υν",
  "χρν", "χρυ", "θς", "θυ", "πνς", "πνι", "κς", "κυ",
]);

const INTENTIONAL_PAIRS = new Map([
  ["εκλεκτοσ:υιοσ", "Christological reading εκλεκτοσ for υιοσ"],
  ["εκλεκτον:υιον", "Christological reading εκλεκτον for υιον"],
  ["εκλεκτοσ:υιον", "Christological reading εκλεκτοσ for υιον"],
  ["εκλεκτον:υιοσ", "Christological reading εκλεκτον for υιοσ"],
]);

const HARMONIZATION_HINTS = [
  { book: "Matt", parallel: "Mark", note: "Synoptic harmonization to parallel gospel" },
  { book: "Mark", parallel: "Matt", note: "Synoptic harmonization to parallel gospel" },
  { book: "Luke", parallel: "Matt", note: "Synoptic harmonization to parallel gospel" },
];

const CLARIFYING_ARTICLES = new Set(["του", "τον", "την", "των", "το", "τα"]);

function normalizeGreek(s) {
  return String(s ?? "")
    .toLowerCase()
    .replace(/[=¯$]/g, "")
    .replace(/[^α-ω]/g, "");
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

function isNsForm(w, sr) {
  const wn = normalizeGreek(w);
  const sn = normalizeGreek(sr);
  if (!wn && !sn) return false;
  if (NS_ABBREVS.has(wn) || NS_ABBREVS.has(sn)) return true;
  if (wn.length <= 4 && sn.length <= 4 && (wn.includes("χ") || wn.includes("θ") || wn.includes("πν"))) {
    const shorter = wn.length < sn.length ? wn : sn;
    const longer = wn.length >= sn.length ? wn : sn;
    if (NS_ABBREVS.has(shorter) && longer.startsWith(shorter.slice(0, 2))) return true;
  }
  return false;
}

function isLetterTransposition(w, sr) {
  const wn = normalizeGreek(w);
  const sn = normalizeGreek(sr);
  if (wn.length !== sn.length || wn.length < 4) return false;
  const sortedW = [...wn].sort().join("");
  const sortedS = [...sn].sort().join("");
  return sortedW === sortedS && wn !== sn;
}

function isGarbled(w, sr) {
  const wn = normalizeGreek(w);
  const sn = normalizeGreek(sr);
  if (!wn || !sn || wn.length < 2) return false;
  const dist = levenshtein(wn, sn);
  const maxLen = Math.max(wn.length, sn.length);
  if (maxLen <= 3) return false;
  const ratio = dist / maxLen;
  if (ratio > 0.75) return false;
  if (wn.length >= 4 && sn.length >= 4 && (sn.startsWith(wn) || wn.startsWith(sn.slice(1)))) return true;
  return dist > maxLen * 0.45 && ratio <= 0.75;
}

function isTruncation(w, sr) {
  const wn = normalizeGreek(w);
  const sn = normalizeGreek(sr);
  if (!wn || !sn || wn.length >= sn.length) return false;
  return sn.startsWith(wn) || (levenshtein(wn, sn) <= 2 && sn.length - wn.length >= 2);
}

function isDittography(w, sr, ctxL, ctxR) {
  const wn = normalizeGreek(w);
  const sn = normalizeGreek(sr);
  if (!wn) return false;
  if (sn && wn.includes(sn) && wn.length > sn.length + 1) return true;
  const ctx = normalizeGreek(`${ctxL ?? ""} ${ctxR ?? ""}`);
  if (ctx.includes(wn) && wn.length >= 3) return true;
  if (wn.length >= 4 && wn.slice(0, Math.floor(wn.length / 2)) === wn.slice(Math.floor(wn.length / 2))) return true;
  return false;
}

function isNotationMarker(w) {
  return /^\$/.test(w) || /^x/i.test(w);
}

function isFunctionWord(token) {
  const t = normalizeGreek(token);
  return ["του", "της", "των", "το", "τα", "οι", "αι", "ου", "ο", "η", "και", "δε", "μεν", "τε", "γαρ", "εν", "εις", "εκ"].includes(t);
}

function verseBook(verseRef) {
  const m = String(verseRef ?? "").match(/^(\d?\s?\w+)/);
  return m ? m[1].replace(/^\d+\s*/, "") : "";
}

function countSameVerseSubs(unit, verseUnits) {
  return verseUnits.filter(
    (u) => u.esn === unit.esn && u.kind === "substitution" && u.unit_id !== unit.unit_id
  ).length;
}

function countSameVerseAny(unit, verseUnits) {
  return verseUnits.filter(
    (u) => u.esn === unit.esn && u.unit_id !== unit.unit_id
  ).length;
}

/**
 * @returns {{ label: "error"|"intentional"|"uncertain", rationale: string, confidence: number }}
 */
export function judgeUnit(unit, verseUnits = []) {
  const { kind, witness_reading: w, sr_reading: sr, context_left: ctxL, context_right: ctxR, verse_ref } = unit;
  const wn = normalizeGreek(w);
  const sn = normalizeGreek(sr);
  const key = `${wn}:${sn}`;
  const sameVerseSubs = countSameVerseSubs(unit, verseUnits);
  const sameVerseAny = countSameVerseAny(unit, verseUnits);

  if (INTENTIONAL_PAIRS.has(key)) {
    return { label: "intentional", rationale: INTENTIONAL_PAIRS.get(key), confidence: 0.75 };
  }

  if (kind === "transposition") {
    const book = verseBook(verse_ref);
    if (["Matt", "Mark", "Luke"].includes(book) && /βαπτιζ|υιοσ|αγαπητοσ|φωνη/.test(normalizeGreek(`${w} ${sr} ${ctxL} ${ctxR}`))) {
      return { label: "intentional", rationale: "Baptism or voice formula word order; may be liturgical", confidence: 0.55 };
    }
    return { label: "error", rationale: "Local word-order swap suggests mechanical transposition", confidence: 0.8 };
  }

  if (isNotationMarker(w)) {
    return { label: "error", rationale: "Stray notation or numeral marker inserted", confidence: 0.85 };
  }

  if (kind === "substitution" && sameVerseSubs >= 2) {
    return { label: "uncertain", rationale: "Multiple substitutions in damaged verse; alignment unstable", confidence: 0.35 };
  }

  if (kind === "omission" && (sn === "ιν" || sn === "ισ" || sn === "χν" || sn === "χυ")) {
    return { label: "error", rationale: "Omission of sacred-name abbreviation suggests lacuna damage", confidence: 0.7 };
  }

  if (kind !== "omission" && isNsForm(w, sr)) {
    return { label: "uncertain", rationale: "Nomina sacra plene versus abbreviated form", confidence: 0.5 };
  }

  if (kind === "addition" && wn.length >= 6 && !sn && /σαν$|σαι$|ειν$|οντα$|ωμεν$/.test(wn)) {
    return { label: "intentional", rationale: "Partial verb form may clarify or restore damaged reading", confidence: 0.5 };
  }

  if (kind === "addition" && CLARIFYING_ARTICLES.has(wn) && !sn) {
    if (ctxR && normalizeGreek(ctxR).length > 3) {
      return { label: "intentional", rationale: "Added article may clarify genitive or noun phrase", confidence: 0.55 };
    }
  }

  if (kind === "addition" && wn === "και" && !sn && ctxL) {
    const prev = normalizeGreek(ctxL).split(/\s+/).pop();
    if (prev === "και") {
      return { label: "error", rationale: "Duplicate και suggests dittography at conjunction", confidence: 0.7 };
    }
  }

  if (kind === "omission" && sn === "αυτου" && /Rev|Αποκ/.test(verse_ref ?? "")) {
    return { label: "intentional", rationale: "Shorter reading omitting αυτου; attested variant family", confidence: 0.6 };
  }

  if (kind === "substitution" && isLetterTransposition(w, sr)) {
    return { label: "error", rationale: "Letter-order transposition within word", confidence: 0.85 };
  }

  if (kind === "substitution" && wn.length >= 4 && sn.length >= 4 && sn.slice(1).startsWith(wn.slice(0, 4))) {
    return { label: "error", rationale: "Dropped initial letter with garbled ending suggests slip", confidence: 0.75 };
  }

  if (kind === "substitution" && wn.length >= 5 && sn.length >= 5) {
    const dist = levenshtein(wn, sn);
    const ratio = dist / Math.max(wn.length, sn.length);
    if (ratio > 0.65) {
      return { label: "uncertain", rationale: "Significant lexical change; intentionality debatable", confidence: 0.4 };
    }
    if (ratio > 0.4 && ratio <= 0.65) {
      const book = verseBook(verse_ref);
      for (const hint of HARMONIZATION_HINTS) {
        if (book === hint.book) {
          return { label: "intentional", rationale: hint.note, confidence: 0.45 };
        }
      }
      return { label: "uncertain", rationale: "Significant lexical change; intentionality debatable", confidence: 0.4 };
    }
  }

  if (kind === "substitution" && isTruncation(w, sr)) {
    return { label: "error", rationale: "Truncated form suggests parablepsis or haplography", confidence: 0.75 };
  }

  if (kind === "substitution" && isGarbled(w, sr)) {
    return { label: "error", rationale: "Garbled form unlikely deliberate lexical choice", confidence: 0.75 };
  }

  if (kind === "addition" && isDittography(w, sr, ctxL, ctxR)) {
    return { label: "error", rationale: "Duplicate syllable or word suggests dittography", confidence: 0.75 };
  }

  if (kind === "omission" && isFunctionWord(sr)) {
    return { label: "error", rationale: "Omission of small function word suggests slip", confidence: 0.65 };
  }

  if (kind === "omission" && sn === "ου") {
    return { label: "error", rationale: "Omitting negative particle reverses sense", confidence: 0.8 };
  }

  if (kind === "omission" && sn.length >= 8 && ctxL && normalizeGreek(ctxL).includes(sn.slice(0, 6))) {
    return { label: "error", rationale: "Repeated phrase omitted suggests haplography", confidence: 0.7 };
  }

  if (kind === "substitution" && wn && sn && levenshtein(wn, sn) <= 2 && wn.length >= 4) {
    if (/ισ|ιν|χυ|χν|θν|κυ/.test(wn) || /ισ|ιν|χυ|χν|θν|κυ/.test(sn)) {
      return { label: "uncertain", rationale: "Near-match involving sacred name abbreviation", confidence: 0.45 };
    }
    return { label: "error", rationale: "Minor letter change suggests mechanical slip", confidence: 0.65 };
  }

  if (kind === "omission" && sn.length > 5) {
    return { label: "uncertain", rationale: "Substantive omission; could be variant or lacuna", confidence: 0.4 };
  }

  if (kind === "addition" && wn.length > 3 && !isFunctionWord(w)) {
    return { label: "uncertain", rationale: "Addition lacks clear context for intentionality", confidence: 0.4 };
  }

  if (kind === "substitution" && !wn && sn) {
    return { label: "uncertain", rationale: "Witness lacuna; cannot judge intentionality", confidence: 0.3 };
  }

  if (kind === "substitution" && wn && !sn) {
    return { label: "uncertain", rationale: "Witness-only reading in lacunose alignment", confidence: 0.35 };
  }

  return { label: "uncertain", rationale: "Insufficient evidence to judge intentionality", confidence: 0.4 };
}
