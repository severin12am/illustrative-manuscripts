import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Source_Serif_4,
  Gentium_Plus,
  Noto_Naskh_Arabic,
  Source_Sans_3,
} from "next/font/google";
import SiteNav from "@/components/SiteNav";
import "./globals.css";
import "./print.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
});

const body = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const ui = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ui",
});

const greek = Gentium_Plus({
  subsets: ["latin", "greek"],
  weight: ["400", "700"],
  variable: "--font-greek",
});

const arabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-arabic",
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  metadataBase: new URL(
    basePath
      ? `https://severin12am.github.io${basePath}`
      : "http://localhost:3000",
  ),
  title: "Illustrative Manuscripts",
  description:
    "A year-by-year illustrated history of the written Bible — manuscripts, scraps, and witnesses through time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${ui.variable} ${greek.variable} ${arabic.variable}`}
    >
      <body>
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
