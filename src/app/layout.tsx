import type { Metadata } from "next";
import { Header, Footer } from "@/components/site";
import { siteUrl, published, company } from "@/lib/company";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ÉCLANORA — Nettoyage à Saint-Germain-en-Laye",
    template: "%s | ÉCLANORA",
  },
  description:
    "L’exigence du propre, l’élégance du service. Nettoyage pour particuliers, bureaux et copropriétés à Saint-Germain-en-Laye.",
  robots: published
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    locale: "fr_FR",
    siteName: "ÉCLANORA",
    type: "website",
    images: ["/images/interior.webp"],
  },
  twitter: { card: "summary_large_image", images: ["/images/interior.webp"] },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const json = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: siteUrl,
    identifier: company.siren,
    areaServed: company.confirmedZones,
  };
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main">
          Aller au contenu
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(json).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
