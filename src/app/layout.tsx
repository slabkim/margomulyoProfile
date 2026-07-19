import type { Metadata } from "next";
import { connection } from "next/server";
import { DM_Sans, Lora } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";
import "./globals.css";

const dmSans = DM_Sans({ variable: "--font-primary", subsets: ["latin"], display: "swap" });
const lora = Lora({ variable: "--font-display", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://margomulyo.desa.id"),
  title: { default: "Desa Margo Mulyo | Pesawaran", template: "%s | Desa Margo Mulyo" },
  description: "Portal resmi Desa Margo Mulyo, Kecamatan Tegineneng, Kabupaten Pesawaran, Lampung.",
  openGraph: { title: "Desa Margo Mulyo", description: "Informasi, layanan, dan kabar terbaru Desa Margo Mulyo.", locale: "id_ID", type: "website" },
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
