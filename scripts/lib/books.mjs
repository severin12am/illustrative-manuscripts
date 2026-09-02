/** CNTR book IDs (ESN prefix) → metadata */
export const CNTR_BOOKS = {
  40: { name: "Matthew", abbr: "Matt", web: "matthew" },
  41: { name: "Mark", abbr: "Mark", web: "mark" },
  42: { name: "Luke", abbr: "Luke", web: "luke" },
  43: { name: "John", abbr: "John", web: "john" },
  44: { name: "Acts", abbr: "Acts", web: "acts" },
  45: { name: "Romans", abbr: "Rom", web: "romans" },
  46: { name: "1 Corinthians", abbr: "1 Cor", web: "1corinthians" },
  47: { name: "2 Corinthians", abbr: "2 Cor", web: "2corinthians" },
  48: { name: "Galatians", abbr: "Gal", web: "galatians" },
  49: { name: "Ephesians", abbr: "Eph", web: "ephesians" },
  50: { name: "Philippians", abbr: "Phil", web: "philippians" },
  51: { name: "Colossians", abbr: "Col", web: "colossians" },
  52: { name: "1 Thessalonians", abbr: "1 Thess", web: "1thessalonians" },
  53: { name: "2 Thessalonians", abbr: "2 Thess", web: "2thessalonians" },
  54: { name: "1 Timothy", abbr: "1 Tim", web: "1timothy" },
  55: { name: "2 Timothy", abbr: "2 Tim", web: "2timothy" },
  56: { name: "Titus", abbr: "Titus", web: "titus" },
  57: { name: "Philemon", abbr: "Phlm", web: "philemon" },
  58: { name: "Hebrews", abbr: "Heb", web: "hebrews" },
  59: { name: "James", abbr: "Jas", web: "james" },
  60: { name: "1 Peter", abbr: "1 Pet", web: "1peter" },
  61: { name: "2 Peter", abbr: "2 Pet", web: "2peter" },
  62: { name: "1 John", abbr: "1 John", web: "1john" },
  63: { name: "2 John", abbr: "2 John", web: "2john" },
  64: { name: "3 John", abbr: "3 John", web: "3john" },
  65: { name: "Jude", abbr: "Jude", web: "jude" },
  66: { name: "Revelation", abbr: "Rev", web: "revelation" },
};

export function parseESN(esn) {
  const s = String(esn).padStart(8, "0");
  return {
    book: parseInt(s.slice(0, 2), 10),
    chapter: parseInt(s.slice(2, 5), 10),
    verse: parseInt(s.slice(5, 8), 10),
  };
}

export function formatRef(bookId, chapter, verse) {
  const b = CNTR_BOOKS[bookId];
  if (!b) return `${bookId} ${chapter}:${verse}`;
  return `${b.abbr} ${chapter}:${verse}`;
}

/** Focus verses matching Commons photo where known */
export const PHOTO_FOCUS = {
  P52: [{ book: 43, chapter: 18, verseStart: 31, verseEnd: 38 }],
  P66: [{ book: 43, chapter: 1, verseStart: 1, verseEnd: 14 }],
  P75: [{ book: 42, chapter: 11, verseStart: 2, verseEnd: 4 }],
  P46: [{ book: 45, chapter: 8, verseStart: 38, verseEnd: 39 }],
  P45: [{ book: 41, chapter: 8, verseStart: 35, verseEnd: 38 }],
  P90: [{ book: 43, chapter: 18, verseStart: 36, verseEnd: 40 }],
  P104: [{ book: 40, chapter: 21, verseStart: 34, verseEnd: 37 }],
  P4: [{ book: 40, chapter: 3, verseStart: 1, verseEnd: 5 }],
  P5: [{ book: 43, chapter: 1, verseStart: 23, verseEnd: 23 }],
  P103: [{ book: 40, chapter: 13, verseStart: 55, verseEnd: 56 }],
  P106: [{ book: 43, chapter: 1, verseStart: 29, verseEnd: 35 }],
  P107: [{ book: 43, chapter: 17, verseStart: 1, verseEnd: 2 }],
  P108: [{ book: 43, chapter: 18, verseStart: 1, verseEnd: 5 }],
  P109: [{ book: 43, chapter: 21, verseStart: 18, verseEnd: 20 }],
  P111: [{ book: 42, chapter: 17, verseStart: 22, verseEnd: 23 }],
  P113: [{ book: 45, chapter: 2, verseStart: 29, verseEnd: 29 }],
  P114: [{ book: 58, chapter: 1, verseStart: 7, verseEnd: 12 }],
  P118: [{ book: 45, chapter: 15, verseStart: 26, verseEnd: 33 }],
};

export const MAX_INITIAL_VERSES = 12;
export const MAX_LARGE_MSS = 14;
