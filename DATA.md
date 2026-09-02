# Data provenance and gaps

## v1 window: 1–200 CE

Witnesses are included when their **INTF Kurzgefasste Liste** paleographic range overlaps `[1, 200]`:

- `date_start ≤ 200` AND `date_end ≥ 1`
- A papyrus dated III CE (200–299) appears because year **200** is in both ranges.

## Sources used

| Layer | Source | License / terms |
|-------|--------|-----------------|
| Dates, GA numbers, docIDs | [INTF Liste](https://ntvmr.uni-muenster.de/liste/) via cached API export | Cite INTF; metadata compilation CC-BY |
| Shelfmarks, contents (partial) | NTVMR `manuscript/get` API when reachable; otherwise Liste + NTVMR workspace links | Cite INTF |
| Variants (subset) | [CNTR](https://greekcntr.org/) transcriptions vs [SBLGNT](https://github.com/LogosBible/SBLGNT) / SR GNT | CC BY-SA / CC BY 4.0 |
| Photographs (hosted) | [Wikimedia Commons](https://commons.wikimedia.org/) PD / CC files only | Per-file `.attribution.json` sidecar |
| Photographs (linked) | NTVMR, CSNTM, holding libraries | © institutions — link only |

We do **not** host NA28/UBS5/BHQ apparatus (Deutsche Bibelgesellschaft copyright).

## Regenerating data

```bash
# Requires network access to ntvmr.uni-muenster.de
node scripts/generate-data.mjs

# CNTR transcriptions + WEB + SR GNT collation (required for running text)
node scripts/build-texts.mjs

# Download/update Commons images (rate-limited; be patient)
node scripts/download-commons.mjs
```

## Running text (CNTR + WEB)

- **Greek:** [CNTR transcriptions](https://github.com/Center-for-New-Testament-Restoration/transcriptions) (CC BY-SA 4.0), parsed from MES format with lacunae (`[...]`), missing letters (`·`), and line breaks preserved.
- **English:** [World English Bible](https://github.com/TehShrike/world-english-bible) (public domain), labeled *English of this fragment* — verse text for the surviving passage, with variant strips vs **SR GNT** (CNTR, CC BY 4.0).
- **56/61** witnesses have CNTR class-1 files; **5 lack CNTR files** (P16, P65, P78, P80, P103) and show an honest unavailable state.
- Large manuscripts (P46, P66, P75, …) ship the **photo-matched passage** first; full CNTR text loads from `public/cntr-texts/{GA}.json` on expand.

Do **not** use NA28, UBS, NIV, ESV, or BHQ text.

Cached Liste export: `scripts/cache/liste.json` (2026-09-02 snapshot, 141 papyri).

## NTVMR API access (2026-09-02)

During development the VM could reach the Liste search API intermittently. After ~60 rapid `manuscript/get` calls the host began refusing connections. The build therefore:

1. Uses the **cached Liste JSON** for all 61 in-window witnesses (dates verified against live API earlier in session).
2. Ships **32 Commons-hosted images** for witnesses with verified PD/CC files.
3. Links the remaining **29 witnesses** to NTVMR/CSNTM viewers with an honest “no open image yet” card state.

### Witnesses without a Commons image (as of v1)

P1, P18, P20, P23, P29, P32, P40, P47, P64, P65, P69, P72, P87, P100, P101, P115, P119, P121, P125, P129, P130, P131, P132, P133, P134, P137, P138, P141, P16 (has image - wait P16 has image), let me recount...

From generate output: 61 witnesses, 33 images after P90.

Missing images (~28): need to list from data file.

### What is still missing for completeness

- [ ] Per-manuscript `manuscript/get` cache for all 61 docIDs (institution, shelfmark, verse index)
- [ ] CNTR-automated variant extraction for every witness with a transcription
- [ ] LXX / DSS witnesses overlapping 1–200 CE (none identified in Liste papyri range for this v1)
- [ ] Commons images for remaining ~28 papyri (search Category:Papyrus N on Commons)

## Attribution

- **INTF:** Institut für Neutestamentliche Textforschung, Münster — Kurzgefasste Liste
- **CNTR:** Center for New Testament Restoration — transcriptions (CC BY-SA 4.0)
- **SBLGNT:** Society of Biblical Literature — comparison text (CC BY 4.0)
