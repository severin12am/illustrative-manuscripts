"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import styles from "./SiteNav.module.css";

const links = [
  { href: "/", label: "Timeline", match: (path: string) => path === "/" || path === "" },
  { href: "/variants/", label: "Variants", match: (path: string) => path.startsWith("/variants") },
  { href: "/compare/", label: "Compare", match: (path: string) => path.startsWith("/compare") },
  { href: "/coverage/", label: "Coverage", match: (path: string) => path.startsWith("/coverage") },
];

export default function SiteNav() {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const [navSearch, setNavSearch] = useState("");

  const submitNavSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = navSearch.trim();
      if (!q) return;
      router.push(`/?q=${encodeURIComponent(q)}`);
    },
    [navSearch, router]
  );

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Site">
        <div className={styles.inner}>
          <Link href="/" className={styles.brand}>
            Illustrative Manuscripts
          </Link>
          <div className={styles.right}>
            <form className={styles.searchForm} onSubmit={submitNavSearch}>
              <input
                type="search"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                placeholder="Search witnesses…"
                className={styles.searchInput}
                aria-label="Search witnesses globally"
              />
            </form>
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
