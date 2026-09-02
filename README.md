# Illustrative Manuscripts

A year-by-year illustrated history of the written Bible. Pick a year (e.g. 150 CE) and see manuscripts, scraps, and other written witnesses from around that time: where they were found, where they are now, a representative translation, notable textual variants, and links to scholarship and institutional image pages.

**v1 is a scaffold** with ~10 famous seed witnesses (NT-heavy, a few OT anchors). It is not a comprehensive database.

## What this is

- A browsable timeline of biblical manuscripts and related witnesses
- Honest metadata with paleographic date ranges (`date_start` / `date_end`)
- Outbound links to institutional image pages and scholarly resources
- Public-domain English renderings of representative passages

## What this is not

This project is **not** a replacement for professional text-critical tools and catalogs:

- [NTVMR](https://ntvmr.uni-muenster.de/) — New Testament Virtual Manuscript Room (Münster)
- [INTF](https://www.uni-muenster.de/INTF/) — Institute for New Testament Textual Research
- [ECM](http://ntgreek.net/) — Editio Critica Maior
- [Liste](https://ntvmr.uni-muenster.de/liste) — Comprehensive manuscript register

Use those resources for apparatus work, transcriptions, and high-resolution images under institutional terms.

## Legal and ethical rule

**We link images; we do not host them.**

Photographs of manuscripts are usually under institutional copyright even when the ancient text itself is public domain. This app:

- Stores metadata and outbound links only
- Does not scrape or bundle institutional image archives (CSNTM, INTF, Vatican, British Library, etc.)
- Uses placeholder thumbnails that link to the holding institution's page
- Marks uncertain dates and readings honestly

Our code and metadata compilation are licensed **MIT** (code) and **CC-BY 4.0** (metadata). We do not claim ownership of manuscript photographs.

## Run locally

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm start       # serve production build
```

## Data model

Each witness (`src/types/witness.ts`) includes:

| Field | Description |
|-------|-------------|
| `traditional_name`, `aliases[]` | Common names |
| `corpus` | `nt` \| `ot` \| `lxx` \| `version` \| `other` |
| `language`, `material`, `contents` | Physical and textual description |
| `date_start`, `date_end`, `date_note` | Paleographic range (negative = BCE) |
| `find_place`, `find_year_or_note` | Discovery information |
| `current_institution`, `current_shelfmark` | Present location |
| `image_policy` | `hosted` \| `link_only` \| `missing` |
| `source_page_url` | Link to institutional image/page |
| `translation` | Short public-domain English passage |
| `modern_base_text` | e.g. NA28, BHS |
| `known_variants[]` | Locus, readings, significance |
| `bibliography[]` | Scholarly links |
| `license_note` | Image rights disclaimer |

Seed data lives in `src/data/witnesses.ts`.

## Seed witnesses (v1)

1. Ketef Hinnom Silver Amulets
2. Great Isaiah Scroll (1QIsᵃ)
3. Nash Papyrus
4. Papyrus 52 (P⁵² / Rylands)
5. Papyrus 66 (P⁶⁶)
6. Papyrus 75 (P⁷⁵)
7. Papyrus 46 (P⁴⁶)
8. Codex Vaticanus (B / 03)
9. Codex Sinaiticus (א / 01)
10. Codex Alexandrinus (A / 02)

## Future sources

See [SOURCES.md](./SOURCES.md) for intended later data sources (link-only for now).

## License

- **Code:** MIT — see [LICENSE](./LICENSE)
- **Metadata compilation:** CC-BY 4.0
- **Manuscript images:** © respective holding institutions — not included in this repository
