import { company } from "./company.ts";
export function productionIssues(
  env: Record<string, string | undefined> = process.env,
) {
  const issues: string[] = [];
  for (const field of [
    "civilName",
    "siret",
    "address",
    "email",
    "phone",
    "publicationDirector",
    "rne",
    "vatStatus",
    "host",
    "mediator",
    "retention",
  ] as const)
    if (!company[field]) issues.push(`company.${field} manquant`);
  if (!company.processors.length)
    issues.push("Sous-traitants et lieux de traitement non documentés");
  const url = URL.parse(env.SITE_URL ?? "");
  if (
    !url ||
    url.protocol !== "https:" ||
    url.origin !== env.SITE_URL ||
    !url.hostname.includes(".") ||
    /(?:^|\.)(?:localhost|example\.com|example\.org|example\.net)$/.test(
      url.hostname,
    )
  )
    issues.push("Domaine HTTPS de production manquant");
  if (env.QUOTE_MODE !== "smtp") issues.push("Envoi SMTP réel non activé");
  for (const key of [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "QUOTE_FROM",
    "QUOTE_TO",
  ])
    if (!env[key]) issues.push(`${key} manquant`);
  if (
    env.SMTP_PORT &&
    (!/^\d+$/.test(env.SMTP_PORT) ||
      Number(env.SMTP_PORT) < 1 ||
      Number(env.SMTP_PORT) > 65535)
  )
    issues.push("SMTP_PORT doit être un numéro de port TCP valide");
  for (const key of [
    "LEGAL_APPROVED",
    "DATA_PROCESSING_APPROVED",
    "EDGE_RATE_LIMIT_CONFIGURED",
  ])
    if (env[key] !== "true") issues.push(`${key} non validé`);
  if (
    company.SAP_STATUS === "registered" &&
    (!company.SAP_DECLARATION_NUMBER || !company.SAP_LEGAL_APPROVED)
  )
    issues.push("Activation SAP incomplète");
  return issues;
}
