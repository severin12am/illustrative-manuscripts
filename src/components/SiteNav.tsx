"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./SiteNav.module.css";

const links = [
  { href: "/", label: "Timeline", match: (path: string) => path === "/" || path === "" },
  { href: "/variants/", label: "Variants", match: (path: string) => path.startsWith("/variants") },
  { href: "/coverage/", label: "Coverage", match: (path: string) => path.startsWith("/coverage") },
];

export default function SiteNav() {
  const pathname = usePathname() ?? "/";

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Site">
        <div className={styles.inner}>
          <Link href="/" className={styles.brand}>
            Illustrative Manuscripts
          </Link>
          <div className={styles.links}>
            {links.map(({ href, label, match }) => (
              <Link
                key={href}
                href={href}
                className={match(pathname) ? styles.linkActive : undefined}
                aria-current={match(pathname) ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
