import { z } from "zod";
export const quoteSchema = z
  .object({
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    email: z.email().max(200),
    phone: z
      .string()
      .trim()
      .max(30)
      .refine((v) => !v || /^[+\d\s().-]{8,30}$/.test(v)),
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
    frequency: z.enum([
      "ponctuelle",
      "hebdomadaire",
      "bimensuelle",
      "a-definir",
    ]),
    date: z
      .string()
      .refine(
        (v) =>
          !v ||
          (/^\d{4}-\d{2}-\d{2}$/.test(v) &&
            !isNaN(Date.parse(v)) &&
            v >= new Date().toISOString().slice(0, 10)),
      ),
    message: z.string().trim().min(20).max(4000),
    website: z.string().max(200),
    startedAt: z.number().finite(),
  })
  .superRefine((v, ctx) => {
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
