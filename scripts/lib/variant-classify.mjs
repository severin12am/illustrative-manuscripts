/**
 * Conservative CNTR-vs-SR variant classification for taxonomy-ready storage.
 * Does not guess intention at scale; classifies kind only when obvious.
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

function isContiguousSubsequence(needle, haystack) {
  if (needle.length === 0) return true;
  let j = 0;
  for (let i = 0; i < haystack.length && j < needle.length; i++) {
    if (haystack[i] === needle[j]) j++;
  }
  return j === needle.length;
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

/**
 * Compare witness plain text to SR GNT for a verse.
 * Returns [] when the witness is a mere fragment (contiguous subsequence of SR).
 */
export function classifyVerseVariants(
  witnessPlain,
  srPlain,
  bookId,
  chapter,
  verse
) {
  const w = tokenizeGreek(witnessPlain);
  const s = tokenizeGreek(srPlain);
  if (w.length === 0 || s.length === 0) return [];

  if (w.join(" ") === s.join(" ")) return [];

  // Partial papyrus leaf: extant words follow SR order → not a collation variant
  if (isContiguousSubsequence(w, s)) return [];

  const variants = [];
  const wSet = new Set(w);
  const sSet = new Set(s);
  const onlyW = w.filter((t) => !sSet.has(t));
  const onlyS = s.filter((t) => !wSet.has(t));

  const locusBase = { book_id: bookId, chapter, verse };

  // Single-word substitution with one-character difference → orthography
  if (
    onlyW.length === 1 &&
    onlyS.length === 1 &&
    w.length === s.length &&
    levenshtein(onlyW[0], onlyS[0]) === 1
  ) {
    const wi = w.indexOf(onlyW[0]);
    variants.push(
      unit(
        locusBase,
        onlyW[0],
        onlyS[0],
        "orthography",
        "Single-character difference; may be itacism or orthographic variation.",
        wi + 1,
        wi + 1
      )
    );
    return variants;
  }

  // Clear extra words in witness
  if (onlyW.length > 0 && onlyS.length === 0 && w.length > s.length) {
    const start = w.findIndex((t) => onlyW.includes(t));
    variants.push(
      unit(
        locusBase,
        onlyW.join(" "),
        "(absent)",
        "addition",
        "Witness contains word(s) not in SR GNT.",
        start + 1,
        start + onlyW.length
      )
    );
    return variants;
  }

  // Clear missing words in witness (extant portion complete vs SR)
  if (onlyS.length > 0 && onlyW.length === 0 && w.length < s.length) {
    const start = s.findIndex((t) => onlyS.includes(t));
    variants.push(
      unit(
        locusBase,
        "(absent)",
        onlyS.join(" "),
        "omission",
        "Witness lacks word(s) present in SR GNT.",
        start + 1,
        start + onlyS.length
      )
    );
    return variants;
  }

  // Paired different words → substitution(s)
  if (onlyW.length > 0 && onlyS.length > 0) {
    const n = Math.min(onlyW.length, onlyS.length);
    for (let i = 0; i < n; i++) {
      const wi = w.indexOf(onlyW[i]);
      const kind =
        levenshtein(onlyW[i], onlyS[i]) === 1 ? "orthography" : "substitution";
      variants.push(
        unit(
          locusBase,
          onlyW[i],
          onlyS[i],
          kind,
          kind === "orthography"
            ? "Single-character substitution."
            : "Substituted wording vs SR GNT.",
          wi >= 0 ? wi + 1 : undefined,
          wi >= 0 ? wi + 1 : undefined
        )
      );
    }
    if (onlyW.length > onlyS.length) {
      variants.push(
        unit(
          locusBase,
          onlyW.slice(n).join(" "),
          "(absent)",
          "addition",
          "Additional words in witness.",
          undefined,
          undefined
        )
      );
    }
    if (onlyS.length > onlyW.length) {
      variants.push(
        unit(
          locusBase,
          "(absent)",
          onlyS.slice(n).join(" "),
          "omission",
          "Additional words in SR GNT.",
          undefined,
          undefined
        )
      );
    }
    return variants;
  }

  // Fallback: verse-level difference without clear word alignment
  variants.push(
    unit(
      locusBase,
      witnessPlain.slice(0, 160),
      srPlain.slice(0, 160),
      "uncertain",
      "Verse differs from SR GNT; word alignment unclear (fragment or complex variation).",
      undefined,
      undefined
    )
  );
  return variants;
}

export function countVariantsInVerses(verses) {
  return verses.reduce((n, v) => n + (v.variants?.length ?? 0), 0);
}
