import { NextRequest } from "next/server";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { POST } from "../src/app/api/devis/route";

const { sendMail, close } = vi.hoisted(() => ({
  sendMail: vi.fn(),
  close: vi.fn(),
}));
vi.mock("nodemailer", () => ({
  default: { createTransport: () => ({ sendMail, close }) },
}));

beforeEach(() => {
  vi.resetAllMocks();
  for (const [key, value] of Object.entries({
    NODE_ENV: "production",
    SITE_URL: "https://eclanora.test",
    QUOTE_MODE: "smtp",
    SMTP_HOST: "smtp.test",
    SMTP_PORT: "587",
    SMTP_USER: "test",
    SMTP_PASS: "synthetic",
    QUOTE_FROM: "site@example.com",
    QUOTE_TO: "entreprise@example.com",
    TRUST_PROXY: "true",
  }))
    vi.stubEnv(key, value);
});

afterEach(() => vi.unstubAllEnvs());

function submit(ip: string) {
  return POST(
    new NextRequest("https://eclanora.test/api/devis/", {
      method: "POST",
      headers: {
        host: "eclanora.test",
        origin: "https://eclanora.test",
        "content-type": "application/json",
        "x-forwarded-for": ip,
      },
      body: JSON.stringify({
        intent: "contact",
        firstName: "Jeanne",
        lastName: "Test",
        email: "jeanne@example.com",
        phone: "",
        message: "Message synthétique pour vérifier la confirmation.",
        website: "",
        startedAt: Date.now() - 3000,
      }),
    }),
  );
}

test("confirme au client après l’acceptation du message métier", async () => {
  sendMail.mockResolvedValue({ accepted: ["email@example.com"], rejected: [] });
  const response = await submit("192.0.2.1");
  expect(response.status).toBe(200);
  expect(sendMail).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ to: "entreprise@example.com" }),
  );
  expect(sendMail).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ to: "jeanne@example.com" }),
  );
  expect(sendMail.mock.calls[1][0].text).not.toContain("Message synthétique");
  expect(close).toHaveBeenCalledOnce();
});

test("un échec métier interrompt l’envoi avant toute confirmation", async () => {
  sendMail.mockRejectedValueOnce(new Error("SMTP unavailable"));
  const response = await submit("192.0.2.2");
  expect(response.status).toBe(502);
  expect(sendMail).toHaveBeenCalledOnce();
  expect(close).toHaveBeenCalledOnce();
});

test("un échec de confirmation conserve la référence de la demande transmise", async () => {
  sendMail.mockResolvedValueOnce({
    accepted: ["entreprise@example.com"],
    rejected: [],
  });
  sendMail.mockResolvedValueOnce({
    accepted: [],
    rejected: ["jeanne@example.com"],
  });
  const response = await submit("192.0.2.3");
  expect(response.status).toBe(200);
  expect((await response.json()).message).toMatch(
    /n’a pas pu être envoyé.*Référence/,
  );
  expect(sendMail).toHaveBeenCalledTimes(2);
  expect(close).toHaveBeenCalledOnce();
});
