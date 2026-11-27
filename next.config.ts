import type { NextConfig } from "next";
import { productionIssues } from "./src/lib/readiness";
if (process.env.PUBLICATION_APPROVED === "true") {
  const issues = productionIssues();
  if (issues.length)
    throw new Error("Publication bloquée : " + issues.join("; "));
}
const config: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...(process.env.PUBLICATION_APPROVED === "true"
            ? [{ key: "Strict-Transport-Security", value: "max-age=31536000" }]
            : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]),
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: `default-src 'self'; script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; form-action 'self'; base-uri 'self'; object-src 'none'`,
          },
        ],
      },
    ];
  },
};
export default config;
