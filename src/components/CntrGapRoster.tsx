import {
  cntrGapDocUrl,
  cntrManuscriptUrl,
  listeUrlForGa,
} from "@/lib/witnessOutbound";
import styles from "./CntrGapRoster.module.css";

interface CntrGapRosterProps {
  missing: string[];
}

/** Documented CNTR class-1 gaps — outbound Liste + CNTR catalog only. */
export default function CntrGapRoster({ missing }: CntrGapRosterProps) {
  if (!missing.length) return null;

  return (
    <div className={styles.wrap}>
      <p className={styles.lead}>
        <strong>{missing.length}</strong> in-window witnesses have no CNTR class-1
        transcription in this build ({missing.join(", ")}). We still link INTF
        Liste and CNTR manuscript pages where published — see{" "}
        <a href={cntrGapDocUrl()} target="_blank" rel="noopener noreferrer">
          DATA.md gaps ↗
        </a>
        .
      </p>
      <ul className={styles.list}>
        {missing.map((ga) => (
          <li key={ga}>
            <span className={styles.ga}>{ga}</span>
            <a
              href={listeUrlForGa(ga)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Liste ↗
            </a>
            <a
              href={cntrManuscriptUrl(ga)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              CNTR ↗
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
