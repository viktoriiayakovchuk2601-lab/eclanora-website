import test from "node:test";
import assert from "node:assert/strict";
import { quoteSchema } from "../src/lib/quote.ts";
import { productionIssues } from "../src/lib/readiness.ts";
const valid = {
  firstName: "Jeanne",
  lastName: "Test",
  email: "jeanne@example.com",
  phone: "",
  city: "Saint-Germain-en-Laye",
  postalCode: "78100",
  clientType: "particulier",
  service: "menage-regulier",
  surface: "80",
  frequency: "hebdomadaire",
  date: "",
  message: "Un entretien régulier des pièces de vie.",
  website: "",
  startedAt: Date.now() - 5000,
};
test("demande valide et téléphone facultatif", () =>
  assert.equal(quoteSchema.safeParse(valid).success, true));
test("refuse les données malformées et les messages trop longs", () => {
  for (const patch of [
    { email: "bad" },
    { postalCode: "7810" },
    { surface: "-1" },
    { date: "2020-01-01" },
    { message: "x".repeat(4001) },
    { clientType: "autre" },
  ])
    assert.equal(quoteSchema.safeParse({ ...valid, ...patch }).success, false);
});
test("exige une organisation pour un professionnel", () => {
  assert.equal(
    quoteSchema.safeParse({ ...valid, clientType: "professionnel" }).success,
    false,
  );
  assert.equal(
    quoteSchema.safeParse({
      ...valid,
      clientType: "professionnel",
      organization: "Organisation test",
    }).success,
    true,
  );
});
test("refuse les prestations B2B pour un particulier", () =>
  assert.equal(
    quoteSchema.safeParse({ ...valid, service: "nettoyage-bureaux" }).success,
    false,
  ));
test("bloque la publication avec la configuration non validée", () => {
  const issues = productionIssues({});
  assert.ok(issues.includes("company.siret manquant"));
  assert.ok(issues.includes("LEGAL_APPROVED non validé"));
  assert.ok(issues.length > 10);
});
