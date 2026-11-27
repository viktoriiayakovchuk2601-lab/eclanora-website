import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("navigation, accessibilité et absence de traceurs", async ({
  page,
  context,
  baseURL,
  browserName,
}) => {
  test.setTimeout(90_000);
  const thirdParty = new Set<string>();
  const errors: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (["https:", "http:"].includes(url.protocol) && url.origin !== baseURL) {
      thirdParty.add(url.origin);
    }
  });
  page.on("pageerror", (error) => errors.push(error.message));
  for (const path of ["/", "/devis/", "/contact/", "/cookies/"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    if (path === "/") {
      const skip = page.getByRole("link", { name: "Aller au contenu" });
      if (browserName === "webkit") {
        await skip.focus();
      } else {
        await page.keyboard.press("Tab");
      }
      await expect(skip).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page.locator("#main")).toBeFocused();
      const mobileMenu = page.locator(".mobile-nav summary");
      if (await mobileMenu.isVisible()) {
        await mobileMenu.focus();
        await page.keyboard.press("Enter");
        await expect(
          page.getByRole("navigation", { name: "Navigation mobile" }),
        ).toBeVisible();
        await page.keyboard.press("Enter");
      }
    }
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    expect(overflow, path).toBe(false);
    expect(await context.cookies(), path).toEqual([]);
    expect(
      await page.evaluate(() => [localStorage.length, sessionStorage.length]),
      path,
    ).toEqual([0, 0]);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      results.violations.map(({ id, nodes }) => ({
        id,
        targets: nodes.map(({ target }) => target),
      })),
      path,
    ).toEqual([]);
    await page.waitForLoadState("networkidle");
  }
  await page.reload();
  await page.waitForLoadState("networkidle");
  await expect(
    page.getByRole("link", { name: "Gérer mes cookies" }),
  ).toBeVisible();
  expect(await context.cookies()).toEqual([]);
  expect(
    await page.evaluate(() => [localStorage.length, sessionStorage.length]),
  ).toEqual([0, 0]);
  expect([...thirdParty]).toEqual([]);
  expect(errors).toEqual([]);
});

test("le tarif de travail est calculé sans avantage fiscal", async ({
  page,
}) => {
  await page.goto("/tarifs/");
  await page.getByLabel("Heures par intervention").fill("3");
  await page.getByLabel("Fréquence").selectOption("4");
  await expect(page.locator("output")).toContainText(/360,00\s*€ pour 12 h/);
  await expect(page.locator("output")).not.toContainText("crédit d’impôt");
});

test("un rappel exige un téléphone", async ({ page }) => {
  await page.goto("/contact/");
  await page.getByLabel("Motif du contact").selectOption("rappel");
  await expect(page.getByLabel("Téléphone")).toHaveAttribute("required", "");
  await page.getByLabel("Motif du contact").selectOption("contact");
  await expect(page.getByLabel("Téléphone")).not.toHaveAttribute(
    "required",
    "",
  );
});

test("le formulaire de contact affiche l’indisponibilité SMTP", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "Chromium",
    "Un seul envoi suffit pour vérifier le serveur partagé.",
  );
  await page.goto("/contact/");
  await page
    .getByLabel("Votre message")
    .fill("Message synthétique pour un test navigateur.");
  await page.getByLabel("Prénom").fill("Camille");
  await page.getByLabel("Nom *", { exact: true }).fill("Test");
  await page.getByLabel("Email").fill("camille@example.com");
  await expect
    .poll(() => page.evaluate(() => performance.now()))
    .toBeGreaterThan(2300);
  await page.getByRole("button", { name: "Transmettre ma demande" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "Le formulaire n’est pas encore disponible",
  );
});
