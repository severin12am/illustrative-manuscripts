import Link from "next/link";
import styles from "./IntentionalTagsProvisionalNotice.module.css";

type Props = {
  /** Tighter padding for witness cards and table rows */
  compact?: boolean;
};

export default function IntentionalTagsProvisionalNotice({ compact }: Props) {
  return (
    <aside
      className={compact ? styles.compact : styles.banner}
      role="note"
      aria-label="Intentional tagging limits"
    >
      <strong>Provisional heuristic labels only.</strong> Intentional-vs-error tags
      on a bounded Greek NT sample are model-assisted guesses — not ECM, NA28, or
      IGNTP apparatus judgments. Do not cite tag counts as settled scholarship.{" "}
      <Link href="/methodology/#greek-evidence-layers">Methods</Link>
      {" · "}
      <Link href="/coverage/#intentional-tagging">Coverage limits</Link>
    </aside>
  );
}
