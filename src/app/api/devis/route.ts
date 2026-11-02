import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { randomUUID } from "node:crypto";
import { quoteSchema } from "@/lib/quote";
export const runtime = "nodejs";
// Single-instance defence only; enforce a shared edge rate limit before multi-instance production.
const limits = new Map<string, { count: number; until: number }>();
function reply(body: object, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}
export async function POST(req: NextRequest) {
  const allowedOrigin =
    process.env.NODE_ENV === "production"
      ? process.env.SITE_URL || new URL(req.url).origin
      : `http://${req.headers.get("host")}`;
  if (req.headers.get("origin") !== allowedOrigin)
    return reply({ message: "Origine de la demande non autorisée." }, 403);
  if (!req.headers.get("content-type")?.startsWith("application/json"))
    return reply({ message: "Format de demande non accepté." }, 415);
  const max = 16_000;
  if (Number(req.headers.get("content-length") || 0) > max)
    return reply({ message: "Demande trop volumineuse." }, 413);
  const reader = req.body?.getReader();
  if (!reader) return reply({ message: "Demande vide." }, 400);
  let size = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > max) {
      await reader.cancel();
      return reply({ message: "Demande trop volumineuse." }, 413);
    }
    chunks.push(value);
  }
  let input;
  try {
    input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return reply({ message: "Demande illisible." }, 400);
  }
  const result = quoteSchema.safeParse(input);
  if (!result.success) {
    const errors: Record<string, string> = {};
    for (const issue of result.error.issues)
      errors[String(issue.path[0])] = "Vérifiez ce champ et son format.";
    return reply(
      { message: "Certains champs doivent être corrigés.", errors },
      400,
    );
  }
  const v = result.data;
  if (
    v.website ||
    Date.now() - v.startedAt < 2000 ||
    Date.now() - v.startedAt > 86400000
  )
    return reply(
      {
        message:
          "La demande n’a pas été acceptée. Rechargez la page puis réessayez.",
      },
      400,
    );
  const now = Date.now();
  for (const [k, b] of limits) if (b.until < now) limits.delete(k);
  const ip =
    process.env.TRUST_PROXY === "true"
      ? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
      : "local";
  const key = `${ip}:${v.email.toLowerCase()}`;
  const bucket = limits.get(key) || { count: 0, until: now + 600000 };
  bucket.count++;
  limits.set(key, bucket);
  if (bucket.count > 5)
    return reply(
      {
        message:
          "Trop de demandes. Merci de patienter dix minutes avant de réessayer.",
      },
      429,
    );
  if (process.env.QUOTE_MODE !== "smtp") {
    if (process.env.NODE_ENV === "production")
      return reply(
        {
          message:
            "Le formulaire n’est pas encore disponible pour l’envoi. Merci de réessayer après son activation.",
        },
        503,
      );
    // Deliberately no disk, log or mail persistence of personal data in test mode.
    return reply({
      test: true,
      message:
        "Test réussi : les champs ont été validés. Aucun email n’a été envoyé et aucune donnée n’a été conservée.",
    });
  }
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, QUOTE_FROM, QUOTE_TO } =
    process.env;
  if (
    !SMTP_HOST ||
    !SMTP_PORT ||
    !SMTP_USER ||
    !SMTP_PASS ||
    !QUOTE_FROM ||
    !QUOTE_TO
  )
    return reply(
      {
        message:
          "Le service d’envoi est indisponible. Votre demande n’a pas été envoyée.",
      },
      503,
    );
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    requireTLS: Number(SMTP_PORT) !== 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 10000,
    socketTimeout: 15000,
    tls: { rejectUnauthorized: true },
  });
  try {
    const reference = randomUUID();
    const { website, startedAt, ...fields } = v;
    void website;
    void startedAt;
    const info = await transporter.sendMail({
      from: QUOTE_FROM,
      to: QUOTE_TO,
      replyTo: v.email,
      subject: `ÉCLANORA — Demande de devis ${reference}`,
      text:
        `Référence : ${reference}\n\n` +
        Object.entries(fields)
          .map(([k, val]) => `${k} : ${val}`)
          .join("\n"),
    });
    if (!info.accepted?.length || info.rejected?.length)
      throw new Error("Delivery rejected");
    return reply({
      message: `Votre demande a été transmise au service de messagerie. Référence : ${reference}.`,
    });
  } catch {
    return reply(
      {
        message:
          "L’envoi a échoué. Votre demande n’a pas été confirmée. Merci de réessayer plus tard.",
      },
      502,
    );
  } finally {
    transporter.close();
  }
}
