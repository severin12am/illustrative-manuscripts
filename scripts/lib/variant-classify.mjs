/**
 * Conservative CNTR-vs-SR variant classification for taxonomy-ready storage.
 * Compares extant witness letters against the corresponding SR span only;
 * lacunae, supplied text, and missing context are not scored as variants.
 */

import { normalizeGreek } from "./mes-parser.mjs";
import { CNTR_BOOKS } from "./books.mjs";

export const BASE_TEXT_NAME = "SR GNT";

export function tokenizeGreek(plain) {
  return normalizeGreek(plain).split(/\s+/).filter(Boolean);
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
    note: note || undefined,
  };
}

function srCharMap(srWords) {
  const words = srWords.map((w) => normalizeGreek(w)).filter(Boolean);
  let chars = "";
  const charToWord = [];
  for (let wi = 0; wi < words.length; wi++) {
    for (const ch of words[wi]) {
      chars += ch;
      charToWord.push(wi + 1);
    }
  }
  return { chars, charToWord, words };
}

function runChars(runPlain) {
  return tokenizeGreek(runPlain).join("");
}

function findAnchor(wChars, sChars, minS) {
  const minLen = wChars.length >= 6 ? 4 : Math.min(3, wChars.length);
  let best = null;
  for (let len = Math.min(wChars.length, 16); len >= minLen; len--) {
    for (let wi = 0; wi <= wChars.length - len; wi++) {
      const sub = wChars.slice(wi, wi + len);
      let from = minS;
      while (from < sChars.length) {
        const si = sChars.indexOf(sub, from);
        if (si < 0) break;
        const score = len * 10 - si * 0.001;
        if (!best || score > best.score) {
          best = { wi, si, len, score };
        }
        from = si + 1;
      }
    }
  }
  return best;
}

function extendSide(wChars, sChars, wFrom, wTo, sFrom, sTo, maxGap) {
  const mismatches = [];
  let wi = wFrom;
  let si = sFrom;

  while (wi < wTo && si < sTo) {
    if (wChars[wi] === sChars[si]) {
      wi++;
      si++;
      continue;
    }

    let fixed = false;
    for (let k = 1; k <= maxGap && si + k < sTo; k++) {
      if (wChars[wi] === sChars[si + k]) {
        si += k;
        fixed = true;
        break;
      }
    }
    if (fixed) continue;

    for (let k = 1; k <= 3 && wi + k < wTo; k++) {
      if (wChars[wi + k] === sChars[si]) {
        wi += k;
        fixed = true;
        break;
      }
    }
    if (fixed) continue;

    if (levenshtein(wChars[wi], sChars[si]) === 1) {
      mismatches.push({ wi, si, kind: "orthography" });
      wi++;
      si++;
      continue;
    }

    return null;
  }

  return { wi, si, mismatches };
}

/** Align extant run to SR using a unique long anchor, then extend. */
function alignRunToSr(wChars, sChars, minS = 0) {
  if (!wChars.length || !sChars.length) return null;
  if (/^\d+$/.test(wChars)) return { mismatches: [], endSi: minS };

  const anchor = findAnchor(wChars, sChars, minS);
  if (!anchor) return null;

  const maxGap = Math.min(14, Math.ceil(wChars.length * 0.5));

  const left = extendSide(
    wChars,
    sChars,
    0,
    anchor.wi,
    Math.max(minS, anchor.si - maxGap),
    anchor.si,
    maxGap
  );
  if (!left) return null;

  const right = extendSide(
    wChars,
    sChars,
    anchor.wi + anchor.len,
    wChars.length,
    anchor.si + anchor.len,
    Math.min(sChars.length, anchor.si + anchor.len + maxGap + 4),
    maxGap
  );
  if (!right) return null;

  const mismatches = [...left.mismatches, ...right.mismatches];
  return { mismatches, endSi: right.si };
}

function mismatchToVariant(m, wChars, sChars, charToWord, locusBase) {
  const wSlice = expandAround(wChars, m.wi, 2);
  const sSlice = expandAround(sChars, m.si, 2);
  const wordPos = charToWord[m.si] ?? undefined;
  const kind = m.kind === "orthography" ? "orthography" : "substitution";
  const note =
    kind === "orthography"
      ? "Single-character difference in extant letters vs SR GNT."
      : "Extant letters differ from SR GNT at this position.";

  return unit(
    locusBase,
    wSlice,
    sSlice,
    kind,
    note,
    wordPos,
    wordPos
  );
}

function expandAround(chars, idx, radius) {
  const start = Math.max(0, idx - radius);
  const end = Math.min(chars.length, idx + radius + 1);
  return chars.slice(start, end);
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
  const { chars: sChars, charToWord } = srCharMap(srWords);
  if (!sChars.length) return [];

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
    const wChars = runChars(runPlain);
    if (!wChars.length || /^\d+$/.test(wChars)) continue;

    const align = alignRunToSr(wChars, sChars, minS);
    if (!align) continue;

    for (const m of align.mismatches) {
      variants.push(
        mismatchToVariant(m, wChars, sChars, charToWord, locusBase)
      );
    }
    minS = Math.max(minS, align.endSi);
  }

  return variants;
}

export function countVariantsInVerses(verses) {
  return verses.reduce((n, v) => n + (v.variants?.length ?? 0), 0);
}
