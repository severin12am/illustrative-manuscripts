import Link from "next/link";
import styles from "./SiteNav.module.css";

export default function SiteNav() {
  return (
    <nav className={styles.nav} aria-label="Site">
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          Illustrative Manuscripts
        </Link>
        <div className={styles.links}>
          <Link href="/">Timeline</Link>
          <Link href="/coverage/">Coverage</Link>
        </div>
      </div>
    </nav>
  );
}
