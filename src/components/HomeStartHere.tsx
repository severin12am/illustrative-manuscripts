import Link from "next/link";
import styles from "./HomeStartHere.module.css";

export default function HomeStartHere() {
  return (
    <aside className={styles.strip} aria-label="Start here">
      <p className={styles.inner}>
        <span className={styles.label}>Start here</span>
        <Link href="/use/">Use &amp; claims</Link>
        <span className={styles.sep} aria-hidden="true">·</span>
        <Link href="/methodology/">Methods</Link>
        <span className={styles.sep} aria-hidden="true">·</span>
        <Link href="/coverage/">Coverage</Link>
      </p>
    </aside>
  );
}
