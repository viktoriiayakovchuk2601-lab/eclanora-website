import { z } from "zod";
// Keep client-side validation compatible with the production script policy.
z.config({ jitless: true });
const quoteFields = z.object({
  intent: z.literal("devis").optional(),
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.email().max(200),
  phone: z
    .string()
    .trim()
    .max(30)
    .refine((v) => {
      if (!v) return true;
      const digits = v.replace(/\D/g, "").length;
      return /^\+?[\d ().-]+$/.test(v) && digits >= 8 && digits <= 15;
    }),
  city: z.string().trim().min(2).max(100),
  postalCode: z.string().regex(/^\d{5}$/),
  clientType: z.enum(["particulier", "professionnel", "syndic"]),
  organization: z.string().trim().max(160).optional(),
  service: z.enum([
    "nettoyage-maison-appartement",
    "menage-regulier",
    "nettoyage-ponctuel",
    "nettoyage-bureaux",
    "nettoyage-coproprietes",
    "nettoyage-fin-de-location",
  ]),
  surface: z
    .string()
    .refine((v) => !v || (/^\d{1,6}$/.test(v) && Number(v) > 0)),
  frequency: z.enum(["ponctuelle", "hebdomadaire", "bimensuelle", "a-definir"]),
  date: z
    .string()
    .refine(
      (v) =>
        !v ||
        (z.iso.date().safeParse(v).success &&
          v >= new Date().toISOString().slice(0, 10)),
    ),
  message: z.string().trim().max(4000).default(""),
  website: z.string().max(200),
  startedAt: z.number().finite(),
});
export const quoteSchema = quoteFields.superRefine((v, ctx) => {
  if (v.clientType !== "particulier" && !v.organization)
    ctx.addIssue({
      code: "custom",
      message: "Organisation requise",
      path: ["organization"],
    });
  if (
    v.clientType === "particulier" &&
    ["nettoyage-bureaux", "nettoyage-coproprietes"].includes(v.service)
  )
    ctx.addIssue({
      code: "custom",
      message: "Choisissez une prestation pour particuliers",
      path: ["service"],
    });
});
export type Quote = z.infer<typeof quoteSchema>;

export const contactSchema = quoteFields
  .pick({
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
    message: true,
    website: true,
    startedAt: true,
  })
  .extend({
    intent: z.enum(["contact", "rappel"]),
    message: z.string().trim().min(20).max(4000),
  })
  .superRefine(({ intent, phone }, ctx) => {
    if (intent === "rappel" && !phone) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Téléphone requis pour un rappel.",
      });
    }
  });
