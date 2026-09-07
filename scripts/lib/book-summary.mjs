/**
 * Per-book disagreement totals for coverage / variant-index exports.
 */

import { CNTR_BOOKS, parseESN } from "./books.mjs";

/** Canonical NT book order (Matthew → Revelation). */
export const NT_BOOK_ORDER = Object.entries(CNTR_BOOKS)
  .map(([id, meta]) => ({ book_id: Number(id), ...meta }))
  .sort((a, b) => a.book_id - b.book_id);

/**
 * @param {Array<{ esn?: number | string; book_id?: number; kind: string }>} units
 */
export function summarizeByBook(units) {
  /** @type {Map<number, { total: number; by_kind: Record<string, number> }>} */
  const byId = new Map();

  for (const unit of units) {
    const bookId =
      unit.book_id ??
      (unit.esn != null ? parseESN(unit.esn).book : null);
    if (bookId == null || !CNTR_BOOKS[bookId]) continue;

    if (!byId.has(bookId)) {
      byId.set(bookId, { total: 0, by_kind: {} });
    }
    const row = byId.get(bookId);
    row.total++;
    row.by_kind[unit.kind] = (row.by_kind[unit.kind] || 0) + 1;
  }

  return NT_BOOK_ORDER.map(({ book_id, name, abbr }) => {
    const stats = byId.get(book_id) ?? { total: 0, by_kind: {} };
    return {
      book_id,
      book: name,
      abbr,
      total: stats.total,
      by_kind: stats.by_kind,
    };
  });
}
