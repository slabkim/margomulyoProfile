import type { Metadata } from "next";
import { connection } from "next/server";
import { DM_Sans, Lora } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import "./globals.css";

const dmSans = DM_Sans({ variable: "--font-primary", subsets: ["latin"], display: "swap" });
const lora = Lora({ variable: "--font-display", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: "Desa Margomulyo, Tegineneng, Pesawaran | Portal Resmi",
    template: "%s | Desa Margomulyo",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Margomulyo",
    "Desa Margomulyo",
    "Margomulyo Tegineneng",
    "Desa Margomulyo Pesawaran",
    "Pemerintah Desa Margomulyo",
    "Tegineneng",
    "Pesawaran",
    "Lampung",
  ],
  authors: [{ name: "Pemerintah Desa Margomulyo", url: SITE_URL }],
  creator: "Pemerintah Desa Margomulyo",
  publisher: "Pemerintah Desa Margomulyo",
  category: "Pemerintahan Desa",
  formatDetection: { email: false, address: false, telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Desa Margomulyo, Tegineneng, Pesawaran",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: absoluteUrl("/images/hero-bg.png"),
        alt: "Lanskap pertanian Desa Margomulyo, Tegineneng, Pesawaran",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Desa Margomulyo, Tegineneng, Pesawaran",
    description: SITE_DESCRIPTION,
    images: [absoluteUrl("/images/hero-bg.png")],
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  other: {
    "geo.region": "ID-LA",
    "geo.placename": "Desa Margomulyo, Tegineneng, Pesawaran",
    "geo.position": "-5.154402370581577;105.1494179157779",
    ICBM: "-5.154402370581577, 105.1494179157779",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await connection();
  return (
    <html
      lang="id"
      className={`${dmSans.variable} ${lora.variable}`}
      suppressHydrationWarning
    >
      <body><SiteChrome>{children}</SiteChrome></body>
    </html>
  );
}
