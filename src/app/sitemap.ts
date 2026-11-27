import type { MetadataRoute } from "next";
import { company, showProfessionalServices, siteUrl } from "@/lib/company";
import {
  services,
  articles,
  isProfessionalService,
  localPages,
} from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "services",
    ...services
      .map((s) => s.slug)
      .filter(
        (slug) => showProfessionalServices || !isProfessionalService(slug),
      ),
    "a-propos",
    "tarifs",
    "zones-intervention",
    ...localPages
      .filter(({ city }) => company.confirmedZones.includes(city))
      .map(({ slug }) => slug),
    "services-a-la-personne",
    "devis",
    "contact",
    "faq",
    "conseils",
    "mentions-legales",
    "politique-confidentialite",
    "cookies",
    "cgv",
    "accessibilite",
    ...articles.map((a) => `conseils/${a.slug}`),
  ].map((p) => ({
    url: `${siteUrl}/${p}${p ? "/" : ""}`,
    changeFrequency: p ? "monthly" : "weekly",
    priority: p ? 0.7 : 1,
  }));
}
