import type { Witness } from "@/types/witness";
import type { CoveragePerWitness } from "@/types/coverage";
import {
  cntrGapDocUrl,
  witnessCntrUrl,
  witnessCsntmUrl,
  witnessListeUrl,
  witnessNtvmrUrl,
} from "@/lib/witnessOutbound";
import styles from "./WitnessOutboundBar.module.css";

interface WitnessOutboundBarProps {
  witness: Witness;
  ntCoverage: CoveragePerWitness | null;
}

export default function WitnessOutboundBar({
  witness,
  ntCoverage,
}: WitnessOutboundBarProps) {
  const isQuran = witness.corpus === "quran";
  const isNagHammadi = witness.corpus === "nag-hammadi";
  const isHebrewLxx = witness.corpus === "ot" || witness.corpus === "lxx";
  const isNt =
    !isQuran && !isNagHammadi && !isHebrewLxx && witness.corpus === "nt";

  const listeUrl = isNt ? witnessListeUrl(witness) : undefined;
  const ntvmrUrl = isNt ? witnessNtvmrUrl(witness) : undefined;
  const cntrUrl = isNt ? witnessCntrUrl(witness) : undefined;
  const csntmUrl = isNt ? witnessCsntmUrl(witness) : undefined;
  const hasCntrTranscription = Boolean(ntCoverage?.cntr_transcription);

  const links: { href: string; label: string }[] = [];
  let gapNote: { text: string; href: string; label: string } | null = null;

  if (isNt) {
    if (listeUrl) links.push({ href: listeUrl, label: "INTF Liste ↗" });
    if (ntvmrUrl) {
      links.push({ href: ntvmrUrl, label: "NTVMR workspace ↗" });
    }
    if (csntmUrl) {
      links.push({ href: csntmUrl, label: "CSNTM catalog ↗" });
    }
    if (hasCntrTranscription && cntrUrl) {
      links.push({ href: cntrUrl, label: "CNTR transcription ↗" });
    } else if (cntrUrl) {
      links.push({
        href: cntrUrl,
        label: "CNTR manuscript page ↗",
      });
      gapNote = {
        text: "No CNTR class-1 transcription in this build",
        href: cntrGapDocUrl(),
        label: "DATA.md gaps ↗",
      };
    } else if (ntCoverage) {
      gapNote = {
        text: "No CNTR class-1 transcription in this build",
        href: cntrGapDocUrl(),
        label: "DATA.md gaps ↗",
      };
    }
  } else if (isQuran) {
    if (witness.corpus_coranicum_url) {
      links.push({
        href: witness.corpus_coranicum_url,
        label: "Corpus Coranicum ↗",
      });
    }
    if (witness.library_url) {
      links.push({ href: witness.library_url, label: "Library viewer ↗" });
    }
    if (witness.iiif_manifest) {
      links.push({ href: witness.iiif_manifest, label: "IIIF manifest ↗" });
    }
  } else if (isNagHammadi) {
    if (witness.claremont_url) {
      links.push({ href: witness.claremont_url, label: "Claremont NHA ↗" });
    }
    if (witness.library_url) {
      links.push({ href: witness.library_url, label: "Leaf viewer ↗" });
    }
    if (witness.iiif_manifest) {
      links.push({ href: witness.iiif_manifest, label: "IIIF manifest ↗" });
    }
  } else if (isHebrewLxx) {
    if (witness.corpus === "ot" && witness.library_url) {
      links.push({ href: witness.library_url, label: "Leon Levy DSS ↗" });
    } else if (witness.library_url) {
      links.push({ href: witness.library_url, label: "Library ↗" });
    }
    if (
      witness.iiif_manifest &&
      witness.iiif_manifest !== witness.library_url
    ) {
      links.push({ href: witness.iiif_manifest, label: "IIIF manifest ↗" });
    }
    if (
      witness.source_page_url &&
      witness.source_page_url !== witness.library_url &&
      witness.source_page_url !== witness.iiif_manifest
    ) {
      links.push({ href: witness.source_page_url, label: "Catalog ↗" });
    }
  }

  if (links.length === 0 && !gapNote) return null;

  return (
    <nav
      className={styles.bar}
      aria-label="Authoritative catalogs and transcriptions"
    >
      <span className={styles.kicker}>Primary catalogs</span>
      <div className={styles.actions}>
        {links.map((l) => (
          <a
            key={l.href + l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.chip}
          >
            {l.label}
          </a>
        ))}
        {gapNote && (
          <span className={styles.gap}>
            {gapNote.text}
            {" · "}
            <a
              href={gapNote.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.gapLink}
            >
              {gapNote.label}
            </a>
          </span>
        )}
      </div>
    </nav>
  );
}
