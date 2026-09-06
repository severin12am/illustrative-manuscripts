/**
 * CNTR-vs-SR variant classification (v1 mechanical taxonomy).
 * Compares extant witness words against the corresponding SR span only;
 * lacunae, supplied text, and missing context are not scored as variants.
 */

import { normalizeGreek } from "./mes-parser.mjs";
import { CNTR_BOOKS } from "./books.mjs";

export const BASE_TEXT_NAME = "SR GNT";

export const VARIANT_KINDS = [
  "orthography",
  "omission",
  "addition",
  "substitution",
  "transposition",
  "uncertain",
];

const KIND_NOTES = {
  orthography:
    "Spelling or pronunciation spelling only (itacism, movable nu, nomina sacra, breathing/diacritic-insensitive).",
  omission: "SR has word(s) the witness lacks in this aligned extant span.",
  addition: "Witness has word(s) SR lacks in this aligned extant span.",
  substitution:
    "Different lexical content at the same aligned position (not explainable as orthography alone).",
  transposition:
    "Same word letters in different order within one word, or same word multiset in different order (cheap check only).",
  uncertain: "Alignment could not classify this unit reliably.",
};

export function tokenizeGreek(plain) {
  return normalizeGreek(plain).split(/\s+/).filter(Boolean);
}

function normalizeToken(word) {
  if (!word) return "";
  const stripped = word.startsWith("=") ? word.slice(1) : word;
  return normalizeGreek(stripped);
}

/** Fold common Koine spelling equivalences after normalizeGreek. */
export function orthographicSkeleton(word) {
  let w = normalizeToken(word);
  if (!w) return "";

  w = w
    .replace(/αι/g, "ε")
    .replace(/ει/g, "ι")
    .replace(/οι/g, "υ")
    .replace(/ου/g, "υ")
    .replace(/η/g, "ι")
    .replace(/ω/g, "ο")
    .replace(/ευ/g, "ε")
    .replace(/αυ/g, "α")
    .replace(/γγ/g, "γ")
    .replace(/γκ/g, "κ")
    .replace(/μπ/g, "π")
    .replace(/ντ/g, "τ")
    .replace(/τζ/g, "ζ");

  return w;
}

function sortedLetters(s) {
  return [...s].sort().join("");
}

export function wordsOrthographicallyEqual(a, b) {
  const na = normalizeToken(a);
  const nb = normalizeToken(b);
  if (!na || !nb) return na === nb;
  if (na === nb) return true;

  const sa = orthographicSkeleton(a);
  const sb = orthographicSkeleton(b);
  if (sa === sb) return true;

  if (sa.endsWith("ν") && sa.slice(0, -1) === sb) return true;
  if (sb.endsWith("ν") && sb.slice(0, -1) === sa) return true;

  if (sa.endsWith("σ") && sa.slice(0, -1) + "ν" === sb) return true;
  if (sb.endsWith("σ") && sb.slice(0, -1) + "ν" === sa) return true;

  return false;
}

function isLetterTransposition(a, b) {
  const sa = orthographicSkeleton(a);
  const sb = orthographicSkeleton(b);
  if (!sa || !sb || sa.length !== sb.length || sa.length < 3) return false;
  return sortedLetters(sa) === sortedLetters(sb) && sa !== sb;
}

function isWordOrderTransposition(wWords, sWords) {
  if (wWords.length !== sWords.length || wWords.length < 2) return false;
  const wSk = wWords.map((w) => orthographicSkeleton(w));
  const sSk = sWords.map((w) => orthographicSkeleton(w));
  if (wSk.join(" ") === sSk.join(" ")) return false;
  const a = [...wSk].sort();
  const b = [...sSk].sort();
  return a.join("\0") === b.join("\0");
}

function levenshtein(a, b) {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(cur[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    prev = cur;
  }
  return prev[n];
}

export function classifyWordPair(witnessWord, baseWord) {
  if (wordsOrthographicallyEqual(witnessWord, baseWord)) return null;
  const sa = orthographicSkeleton(witnessWord);
  const sb = orthographicSkeleton(baseWord);
  if (sa === sb) return "orthography";
  if (
    Math.abs(sa.length - sb.length) <= 1 &&
    levenshtein(sa, sb) <= 1
  ) {
    return "orthography";
  }
  if (isLetterTransposition(witnessWord, baseWord)) return "transposition";
  return "substitution";
}

function wordVariantKind(witnessWord, baseWord) {
  if (!witnessWord && !baseWord) return null;
  if (!witnessWord) return "omission";
  if (!baseWord) return "addition";
  if (normalizeToken(witnessWord) === normalizeToken(baseWord)) return null;
  if (wordsOrthographicallyEqual(witnessWord, baseWord)) return "orthography";
  return classifyWordPair(witnessWord, baseWord) ?? "uncertain";
}

function makeLocus(bookId, chapter, verse, wordStart, wordEnd) {
  const book = CNTR_BOOKS[bookId];
  const reference = book
    ? `${book.abbr} ${chapter}:${verse}`
    : `${bookId} ${chapter}:${verse}`;
  const locus = {
    book: book?.name ?? String(bookId),
    book_id: bookId,
    chapter,
    verse,
    reference,
  };
  if (wordStart !== undefined) {
    locus.word_start = wordStart;
    locus.word_end = wordEnd ?? wordStart;
  }
  return locus;
}

function unit(locus, witness, base, kind, note, wordStart, wordEnd) {
  return {
    locus: makeLocus(
      locus.book_id,
      locus.chapter,
      locus.verse,
      wordStart,
      wordEnd
    ),
    witness_reading: witness,
    base_reading: base,
    base_text: BASE_TEXT_NAME,
    kind,
    intention: "uncertain",
    source: "cntr",
    note: note || KIND_NOTES[kind] || undefined,
  };
}

function srWordsNormalized(srWords) {
  return srWords.map((w) => normalizeToken(w)).filter(Boolean);
}

/** Join line-break fragments (πα + ριστανετε) when the merge matches an SR word. */
function coalesceWitnessWords(wWords, sWords) {
  const srSet = new Set(sWords.map((w) => orthographicSkeleton(w)));
  const out = [];
  let i = 0;
  while (i < wWords.length) {
    let merged = null;
    for (let len = Math.min(4, wWords.length - i); len >= 2; len--) {
      const chunk = wWords.slice(i, i + len).join("");
      const sk = orthographicSkeleton(chunk);
      if (srSet.has(sk) || sWords.some((sw) => wordsOrthographicallyEqual(chunk, sw))) {
        merged = chunk;
        i += len;
        break;
      }
    }
    if (merged) out.push(merged);
    else {
      out.push(wWords[i]);
      i++;
    }
  }
  return out;
}

function anchorWordsMatch(a, b) {
  return normalizeToken(a) === normalizeToken(b);
}

function findWordAnchor(wWords, sWords, minS) {
  const minLen = wWords.length >= 4 ? 2 : 1;
  let best = null;

  for (let len = Math.min(wWords.length, 6); len >= minLen; len--) {
    for (let wi = 0; wi <= wWords.length - len; wi++) {
      for (let si = minS; si <= sWords.length - len; si++) {
        let ok = true;
        for (let k = 0; k < len; k++) {
          if (!anchorWordsMatch(wWords[wi + k], sWords[si + k])) {
            ok = false;
            break;
          }
        }
        if (!ok) continue;
        const score = len * 10 - si * 0.001;
        if (!best || score > best.score) {
          best = { wi, si, len, score };
        }
      }
    }
  }
  return best;
}

function mergeUnits(units) {
  if (!units.length) return [];
  const merged = [];
  let cur = { ...units[0] };

  for (let i = 1; i < units.length; i++) {
    const next = units[i];
    if (next.kind === cur.kind && (next.kind === "omission" || next.kind === "addition")) {
      cur = {
        ...cur,
        witness_reading: [cur.witness_reading, next.witness_reading]
          .filter(Boolean)
          .join(" "),
        base_reading: [cur.base_reading, next.base_reading]
          .filter(Boolean)
          .join(" "),
        word_end: next.word_end,
      };
      continue;
    }
    merged.push(cur);
    cur = { ...next };
  }
  merged.push(cur);
  return merged;
}

function shouldCompareLeftFringe(wWords, sWords, anchor) {
  const srStart = anchor.si - anchor.wi;
  if (anchor.wi === 0) return true;

  const w0 = wWords[0];
  const s0 = sWords[srStart];
  if (wordsOrthographicallyEqual(w0, s0)) return true;

  const nw = normalizeToken(w0);
  const ns = normalizeToken(s0);
  if (!nw || !ns) return false;

  if (nw.length < ns.length && (ns.startsWith(nw) || ns.endsWith(nw))) {
    return false;
  }

  const joinedWitness = wWords.slice(0, anchor.wi).join("");
  const joinedSr = sWords.slice(srStart, anchor.si).join("");
  const jw = normalizeToken(joinedWitness);
  const js = normalizeToken(joinedSr);
  if (jw && js && jw.length < js.length && js.includes(jw)) {
    return false;
  }

  return nw.length >= 2 && ns.length >= 2;
}

function alignStrictPositional(wWords, sWords, wFrom, wTo, sFrom, sTo) {
  const span = wTo - wFrom;
  if (span !== sTo - sFrom || span <= 0) return [];
  const units = [];
  for (let k = 0; k < span; k++) {
    const ww = wWords[wFrom + k];
    const sw = sWords[sFrom + k];
    if (wordVariantKind(ww, sw) === null) continue;
    const kind = wordVariantKind(ww, sw);
    if (!kind) continue;
    units.push({
      kind,
      witness: ww,
      base: sw,
      wordStart: wFrom + k + 1,
      wordEnd: wFrom + k + 1,
    });
  }
  return units;
}

function alignWordRange(wWords, sWords, wFrom, wTo, sFrom, sTo, maxGap) {
  const rawUnits = [];
  let wi = wFrom;
  let si = sFrom;

  while (wi < wTo || si < sTo) {
    if (wi < wTo && si < sTo) {
      const ww = wWords[wi];
      const sw = sWords[si];

      if (wordVariantKind(ww, sw) === null) {
        wi++;
        si++;
        continue;
      }

    let handled = false;

    for (let span = 2; span <= 3 && wi + span <= wTo && si + span <= sTo; span++) {
      const wSpan = wWords.slice(wi, wi + span);
      const sSpan = sWords.slice(si, si + span);
      if (isWordOrderTransposition(wSpan, sSpan)) {
        rawUnits.push({
          kind: "transposition",
          witness: wSpan.join(" "),
          base: sSpan.join(" "),
          wordStart: wi + 1,
          wordEnd: wi + span,
        });
        wi += span;
        si += span;
        handled = true;
        break;
      }
    }
    if (handled) continue;

    for (let skip = 1; skip <= maxGap && si + skip < sTo; skip++) {
        if (wordsOrthographicallyEqual(ww, sWords[si + skip])) {
          for (let k = 0; k < skip; k++) {
            rawUnits.push({
              kind: "omission",
              witness: "",
              base: sWords[si + k],
              wordStart: wi + 1,
              wordEnd: wi + 1,
            });
          }
          si += skip;
          handled = true;
          break;
        }
      }
      if (handled) continue;

      for (let skip = 1; skip <= maxGap && wi + skip < wTo; skip++) {
        if (wordsOrthographicallyEqual(wWords[wi + skip], sw)) {
          for (let k = 0; k < skip; k++) {
            rawUnits.push({
              kind: "addition",
              witness: wWords[wi + k],
              base: "",
              wordStart: wi + k + 1,
              wordEnd: wi + k + 1,
            });
          }
          wi += skip;
          handled = true;
          break;
        }
      }
    if (handled) continue;

    const kind = wordVariantKind(ww, sw);

    rawUnits.push({
      kind,
      witness: ww,
      base: sw,
      wordStart: wi + 1,
      wordEnd: wi + 1,
    });
      wi++;
      si++;
      continue;
    }

    if (wi < wTo) {
      rawUnits.push({
        kind: "addition",
        witness: wWords[wi],
        base: "",
        wordStart: wi + 1,
        wordEnd: wi + 1,
      });
      wi++;
      continue;
    }

    if (si < sTo) {
      break;
    }
  }

  return { wi, si, units: rawUnits };
}

function alignRunToSrWords(wWords, sWords, minS = 0) {
  if (!wWords.length || !sWords.length) return null;
  if (wWords.every((w) => /^\d+$/.test(w))) return { units: [], endSi: minS };

  const anchor = findWordAnchor(wWords, sWords, minS);
  if (!anchor) return null;

  const srStart = anchor.si - anchor.wi;
  if (srStart < minS) return null;

  const maxGap = Math.min(6, Math.ceil(wWords.length * 0.45));
  const units = [];

  units.push(
    ...(shouldCompareLeftFringe(wWords, sWords, anchor)
      ? alignStrictPositional(
          wWords,
          sWords,
          0,
          anchor.wi,
          srStart,
          anchor.si
        )
      : [])
  );

  const witnessTail = wWords.length - anchor.wi - anchor.len;
  const rightEnd = Math.min(
    sWords.length,
    anchor.si + anchor.len + witnessTail + maxGap
  );
  const right = alignWordRange(
    wWords,
    sWords,
    anchor.wi + anchor.len,
    wWords.length,
    anchor.si + anchor.len,
    rightEnd,
    maxGap
  );
  if (!right) return null;

  units.push(...right.units);

  return {
    units: mergeUnits(units),
    endSi: right.si,
  };
}

/**
 * Compare extant witness runs to SR GNT word tokens for a verse.
 * @param {string[]} extantRuns - contiguous extant plain-text runs (no supplied text)
 * @param {string[]} srWords - SR koine word tokens for the verse
 */
export function classifyVerseVariants(
  extantRuns,
  srWords,
  bookId,
  chapter,
  verse
) {
  const sWords = srWordsNormalized(srWords);
  if (!sWords.length) return [];

  const runs = Array.isArray(extantRuns)
    ? extantRuns
    : extantRuns
      ? [extantRuns]
      : [];
  if (!runs.length) return [];

  const locusBase = { book_id: bookId, chapter, verse };
  const variants = [];
  let minS = 0;

  for (const runPlain of runs) {
    const rawWords = tokenizeGreek(runPlain).filter((w) => !/^\d+$/.test(w));
    const wWords = coalesceWitnessWords(rawWords, sWords);
    if (!wWords.length) continue;

    const align = alignRunToSrWords(wWords, sWords, minS);
    if (!align) continue;

    for (const u of align.units) {
      variants.push(
        unit(
          locusBase,
          u.witness,
          u.base,
          u.kind,
          KIND_NOTES[u.kind],
          u.wordStart,
          u.wordEnd
        )
      );
    }
    minS = Math.max(minS, align.endSi);
  }

  return variants;
}

export function countVariantsInVerses(verses) {
  return verses.reduce((n, v) => n + (v.variants?.length ?? 0), 0);
}
