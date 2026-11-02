import type { MetadataRoute } from "next";
import { published, siteUrl } from "@/lib/company";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: published ? "/" : undefined,
      disallow: published ? "/api/" : "/",
    },
    sitemap: published ? `${siteUrl}/sitemap.xml` : undefined,
  };
}
