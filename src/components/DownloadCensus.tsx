import Link from "next/link";
import { assetUrl } from "@/lib/assetUrl";
import { variantIndex } from "@/data/variant-index";
import { TIMELINE_START, TIMELINE_END } from "@/data/witnesses";
import styles from "./DownloadCensus.module.css";

export default function DownloadCensus() {
  const csvUrl = assetUrl("/variant-census.csv");
  const jsonUrl = assetUrl("/variant-census.json");

  return (
    <section className={styles.section} aria-labelledby="download-census-title">
      <h2 id="download-census-title" className={styles.title}>
        Download open census
      </h2>
      <p className={styles.lead}>
        Machine-readable export of our <strong>{TIMELINE_START}–{TIMELINE_END} CE Greek NT</strong> variation
        units vs <strong>SR GNT</strong> — the same counted index that powers the{" "}
        <Link href="/variants/">variant explorer</Link>. This is{" "}
        <em>not</em> a full New Testament tradition census; it covers CNTR
        transcriptions in this repository only. Whole missing blocks (e.g. John
        7:53–8:11) are taught on{" "}
        <Link href="/famous/">Famous passages</Link>, not as variant rows.
      </p>
      <ul className={styles.stats}>
        <li>
          <strong>{variantIndex.total.toLocaleString()}</strong> variation units
        </li>
        <li>
          <strong>{variantIndex.witness_count}</strong> witnesses
        </li>
        <li>
          <strong>{variantIndex.book_count}</strong> books
        </li>
      </ul>
      <div className={styles.links}>
        <a href={csvUrl} download className={styles.downloadBtn}>
          variant-census.csv
        </a>
        <a href={jsonUrl} download className={styles.downloadBtn}>
          variant-census.json
        </a>
      </div>
      <p className={styles.note}>
        Columns: unit_id, witness, verse, kind, witness_reading, sr_reading.
        Licenses and provenance:{" "}
        <a
          href="https://github.com/severin12am/illustrative-manuscripts/blob/main/DATA.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          DATA.md
        </a>{" "}
        (CNTR CC BY-SA 4.0, SR GNT CC BY-SA 4.0).
      </p>
    </section>
  );
}
