import type { Metadata } from "next";
import { Header, Footer } from "@/components/site";
import {
  siteUrl,
  published,
  company,
  showProfessionalServices,
} from "@/lib/company";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ÉCLANORA — Nettoyage à Saint-Germain-en-Laye",
    template: "%s | ÉCLANORA",
  },
  description: showProfessionalServices
    ? "Nettoyage pour particuliers, bureaux et copropriétés à Saint-Germain-en-Laye. Demandez un devis personnalisé à ÉCLANORA."
    : "Nettoyage de logements à Saint-Germain-en-Laye. Demandez un devis personnalisé à ÉCLANORA.",
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
  verification: published
    ? {
        google: process.env.GOOGLE_SITE_VERIFICATION,
        other: process.env.BING_SITE_VERIFICATION
          ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
          : undefined,
      }
    : undefined,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const json = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: company.name,
        url: siteUrl,
        inLanguage: "fr-FR",
        publisher: { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: company.name,
        url: siteUrl,
        identifier: company.siren,
        areaServed: company.confirmedZones,
        ...(company.phone ? { telephone: company.phone } : {}),
        ...(company.email ? { email: company.email } : {}),
      },
    ],
  };
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main">
          Aller au contenu
        </a>
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
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
