"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SiteNavSearch from "@/components/SiteNavSearch";
import styles from "./SiteNav.module.css";

const links = [
  { href: "/", label: "Timeline", match: (path: string) => path === "/" || path === "" },
  { href: "/variants/", label: "Variants", match: (path: string) => path.startsWith("/variants") },
  { href: "/famous/", label: "Famous passages", match: (path: string) => path.startsWith("/famous") },
  { href: "/quran/uthmani/", label: "Uthmanic rasm", match: (path: string) => path.startsWith("/quran") },
  { href: "/compare/", label: "Compare", match: (path: string) => path.startsWith("/compare") },
  { href: "/coverage/", label: "Coverage", match: (path: string) => path.startsWith("/coverage") },
  { href: "/use/", label: "Use / Claims", match: (path: string) => path.startsWith("/use") },
  { href: "/cite/", label: "Cite & learn", match: (path: string) => path.startsWith("/cite") },
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
          <div className={styles.right}>
            <SiteNavSearch />
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
        </div>
      </nav>
    </header>
  );
}
