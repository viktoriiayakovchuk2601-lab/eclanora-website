import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createHmac, randomBytes, randomUUID } from "node:crypto";
import { contactSchema, quoteSchema } from "@/lib/quote";
import { showProfessionalServices } from "@/lib/company";
export const runtime = "nodejs";
// Single-instance defence only; enforce a shared edge rate limit before multi-instance production.
const limits = new Map<string, { count: number; until: number }>();
const limiterSecret = randomBytes(32);
const windowMs = 600_000;
function reply(body: object, status = 200, retryAfter?: number) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...(retryAfter === undefined
        ? {}
        : { "Retry-After": String(retryAfter) }),
    },
  });
}
export async function POST(req: NextRequest) {
  const allowedOrigin =
    process.env.NODE_ENV === "production"
      ? new URL(process.env.SITE_URL || req.url).origin
      : `http://${req.headers.get("host")}`;
  if (req.headers.get("origin") !== allowedOrigin)
    return reply({ message: "Origine de la demande non autorisée." }, 403);
  if (
    req.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  )
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
  const schema =
    input?.intent === "contact" || input?.intent === "rappel"
      ? contactSchema
      : quoteSchema;
  const result = schema.safeParse(input);
  if (!result.success) {
    const errors = Object.fromEntries(
      result.error.issues.map(({ path }) => [
        String(path[0]),
        "Vérifiez ce champ et son format.",
      ]),
    );
    return reply(
      { message: "Certains champs doivent être corrigés.", errors },
      400,
    );
  }
  const v = result.data;
  if (
    !showProfessionalServices &&
    "clientType" in v &&
    v.clientType !== "particulier"
  )
    return reply({ message: "Cette prestation n’est pas disponible." }, 400);
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
  for (const [k, b] of limits) if (b.until <= now) limits.delete(k);
  const ip =
    process.env.TRUST_PROXY === "true"
      ? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      : undefined;
  if (ip || process.env.EDGE_RATE_LIMIT_CONFIGURED !== "true") {
    const key = createHmac("sha256", limiterSecret)
      .update(ip || "local")
      .digest("hex");
    const bucket = limits.get(key);
    if ((bucket && bucket.count >= 5) || (!bucket && limits.size >= 10_000))
      return reply(
        {
          message: "Trop de demandes. Merci de patienter avant de réessayer.",
        },
        429,
        Math.ceil(((bucket?.until ?? now + windowMs) - now) / 1000),
      );
    limits.set(key, {
      count: (bucket?.count ?? 0) + 1,
      until: bucket?.until ?? now + windowMs,
    });
  }
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
  const port = Number(SMTP_PORT);
  if (
    !SMTP_HOST ||
    !SMTP_PORT ||
    !/^\d+$/.test(SMTP_PORT) ||
    port < 1 ||
    port > 65535 ||
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
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 10000,
    socketTimeout: 15000,
    tls: { rejectUnauthorized: true },
  });
  const reference = randomUUID();
  try {
    const { website, startedAt, intent = "devis", ...fields } = v;
    void website;
    void startedAt;
    const info = await transporter.sendMail({
      from: QUOTE_FROM,
      to: QUOTE_TO,
      replyTo: v.email,
      subject: `ÉCLANORA — Demande de ${intent} ${reference}`,
      text:
        `Référence : ${reference}\n\n` +
        Object.entries(fields)
          .map(([k, val]) => `${k} : ${val}`)
          .join("\n"),
    });
    if (!info.accepted?.length || info.rejected?.length)
      throw new Error("Delivery rejected");
  } catch {
    console.error("quote_delivery_failed", { reference });
    transporter.close();
    return reply(
      {
        message:
          "L’envoi a échoué. Votre demande n’a pas été confirmée. Merci de réessayer plus tard.",
      },
      502,
    );
  }
  try {
    const confirmation = await transporter.sendMail({
      from: QUOTE_FROM,
      to: v.email,
      subject: `ÉCLANORA — Confirmation de demande ${reference}`,
      text: `Nous avons reçu votre demande. Référence : ${reference}. Cette confirmation ne constitue ni un devis ni une réservation.`,
    });
    if (!confirmation.accepted?.length || confirmation.rejected?.length)
      throw new Error("Confirmation rejected");
    return reply({
      message: `Votre demande a été transmise. Un e-mail de confirmation a été envoyé. Référence : ${reference}.`,
    });
  } catch {
    console.error("quote_confirmation_failed", { reference });
    return reply({
      message: `Votre demande a été transmise. L’e-mail de confirmation n’a pas pu être envoyé. Référence : ${reference}.`,
    });
  } finally {
    transporter.close();
  }
}
