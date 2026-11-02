import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/company";
import { services, articles } from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    ...services.map((s) => s.slug),
    "a-propos",
    "tarifs",
    "zones-intervention",
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
