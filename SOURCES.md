# Intended Data Sources (Link-Only for v1)

This document lists authoritative sources we plan to reference in future versions. **v1 does not ingest or mirror these databases.** All image access remains outbound links under institutional terms.

## New Testament

| Source | URL | What it provides |
|--------|-----|------------------|
| **NTVMR** (New Testament Virtual Manuscript Room) | https://ntvmr.uni-muenster.de/ | Images, transcriptions, metadata for NT papyri and uncials |
| **INTF Liste** | https://ntvmr.uni-muenster.de/liste | Comprehensive register of NT manuscripts (Gregory–Aland numbers) |
| **CSNTM** (Center for the Study of New Testament Manuscripts) | https://manuscripts.csntm.org/ | High-resolution photographs of NT manuscripts |
| **Editio Critica Maior (ECM)** | http://ntgreek.net/ | Critical apparatus for Catholic Epistles, Acts, Mark (ongoing) |
| **INTF** (Institute for NT Textual Research) | https://www.uni-muenster.de/INTF/ | Parent institute; publications and tools |

## Old Testament / Hebrew Bible

| Source | URL | What it provides |
|--------|-----|------------------|
| **Leon Levy Dead Sea Scrolls Digital Library** | https://www.deadseascrolls.org.il/ | DSS images, transcriptions, translations |
| **West Semitic Research Project** | https://www.inscriptifact.com/ | High-resolution images of inscriptions and manuscripts |
| **British Library — Hebrew manuscripts** | https://www.bl.uk/hebrew-manuscripts | Catalog and digitized Hebrew codices |

## Major codices (dedicated projects)

| Source | URL | What it provides |
|--------|-----|------------------|
| **Codex Sinaiticus Project** | https://codexsinaiticus.org/ | Full digitization, transcription, translation |
| **Vatican Digital Library** | https://digi.vatlib.it/ | Codex Vaticanus (Vat. gr. 1209) and other MSS |
| **British Library — Digitised Manuscripts** | https://www.bl.uk/manuscripts | Sinaiticus, Alexandrinus, and other biblical codices |

## IIIF and federated catalogs

| Source | URL | What it provides |
|--------|-----|------------------|
| **IIIF Manifest Registry** | https://iiif.io/guides/listing_manifests/ | Federated image APIs for manuscripts |
| **Biblissima** | https://biblissima.fr/ | Medieval manuscript federation (more post-biblical, but useful for Vulgate) |
| **e-codices** | https://www.e-codices.unifr.ch/ | Swiss manuscript digitization (Latin Vulgate witnesses) |

## Policy for future integration

1. **Link only** — never bulk-download or re-host institutional photographs without explicit permission.
2. **Metadata from public catalogs** — names, dates, shelfmarks, and bibliography may be compiled under CC-BY with attribution.
3. **Transcriptions** — only include where clearly public domain or licensed (e.g. Sinaiticus Project transcriptions).
4. **Date ranges** — always model as `date_start` / `date_end` with `date_note` for uncertainty.
5. **No invented APIs** — integrate only with documented, public endpoints or static exports.

## Attribution

When we cite data from these sources in witness records, each `bibliography[]` entry includes a direct URL and note. Institutional image rights remain with the holding library or museum.
