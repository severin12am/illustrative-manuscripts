import type { GreekSegment, TextVerse, WitnessText } from "@/types/text";
import styles from "./GreekDiplomatic.module.css";

function renderSegment(seg: GreekSegment, i: number) {
  switch (seg.kind) {
    case "text":
      return (
        <span
          key={i}
          className={seg.nomina ? styles.nomina : undefined}
        >
          {seg.value}
        </span>
      );
    case "missing":
      return (
        <span key={i} className={styles.missing} title="missing letter">
          ·
        </span>
      );
    case "damaged":
      return (
        <span key={i} className={styles.damaged} title="damaged letter">
          ░
        </span>
      );
    case "lacuna":
      return (
        <span key={i} className={styles.lacuna}>
          [...]
        </span>
      );
    case "supplied":
      return (
        <span key={i} className={styles.supplied} title="editorial supplement">
          ⟨⟩
        </span>
      );
    case "linebreak":
      return <br key={i} />;
    case "pagebreak":
      return <span key={i} className={styles.pagebreak}> ¶ </span>;
    default:
      return null;
  }
}

interface Props {
  verse: TextVerse;
}

export default function GreekDiplomatic({ verse }: Props) {
  if (verse.greek_lines?.length > 1) {
    return (
      <div className={styles.block}>
        {verse.greek_lines.map((line, li) => (
          <div key={li} className={styles.line}>
            {line.map((seg, i) => renderSegment(seg, i))}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className={styles.block}>
      {verse.greek.map((seg, i) => renderSegment(seg, i))}
    </div>
  );
}
