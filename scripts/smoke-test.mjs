import assert from "node:assert/strict";
const base = process.env.TEST_URL || "http://127.0.0.1:3000";
const origin = new URL(base).origin;
const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (m) => new URL(m[1]).pathname,
);
const links = new Set();
const titles = new Set();
assert.ok(paths.length >= 25, "Le sitemap contient les pages attendues");
for (const path of paths) {
  const res = await fetch(base + path);
  assert.equal(res.status, 200, path);
  const html = await res.text();
  assert.equal(
    (html.match(/<h1[\s>]/g) || []).length,
    1,
    `${path}: un seul H1`,
  );
  assert.ok(
    html.includes('name="robots" content="noindex, nofollow"'),
    `${path}: prépublication noindex`,
  );
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  assert.ok(canonical, `${path}: canonical`);
  assert.equal(new URL(canonical).pathname, path, `${path}: URL canonique`);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  assert.ok(title, `${path}: titre`);
  assert.equal(titles.has(title), false, `${path}: titre unique`);
  titles.add(title);
  for (const [, data] of html.matchAll(
    /<script type="application\/ld\+json">([^<]+)<\/script>/g,
  ))
    assert.equal(JSON.parse(data)["@context"], "https://schema.org");
  assert.equal(res.headers.get("x-content-type-options"), "nosniff", path);
  assert.equal(res.headers.get("set-cookie"), null, path);
  assert.match(
    res.headers.get("content-security-policy") ?? "",
    /frame-ancestors 'none'/,
  );
  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g))
    if (!m[1].startsWith("/_next/")) links.add(m[1]);
}
for (const path of links) {
  const res = await fetch(base + path);
  assert.equal(res.status, 200, `Lien interne ${path}`);
}
assert.equal((await fetch(base + "/page-inexistante/")).status, 404);
const robots = await (await fetch(base + "/robots.txt")).text();
assert.ok(robots.includes("Disallow: /"));
const valid = {
  firstName: "Test",
  lastName: "Synthétique",
  email: "test@example.com",
  phone: "",
  city: "Saint-Germain-en-Laye",
  postalCode: "78100",
  clientType: "particulier",
  service: "menage-regulier",
  surface: "80",
  frequency: "hebdomadaire",
  date: "",
  message: "Demande synthétique pour le test fonctionnel.",
  website: "",
  startedAt: Date.now() - 10000,
};
async function post(data, extra = {}) {
  return fetch(base + "/api/devis/", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin, ...extra },
    body: JSON.stringify(data),
  });
}
assert.equal(
  (await post(valid, { Origin: "https://autre.example" })).status,
  403,
);
assert.equal((await post({ ...valid, email: "invalide" })).status, 400);
assert.equal(
  (await post(valid, { "Content-Type": "application/jsonp" })).status,
  415,
);
assert.equal((await post({ ...valid, intent: "rappel" })).status, 400);
assert.equal(
  (await post({ ...valid, website: "https://spam.example" })).status,
  400,
);
assert.equal(
  (await post({ ...valid, message: "a".repeat(17000) })).status,
  413,
);
const response = await post(valid);
const data = await response.json();
if (process.env.EXPECT_PRODUCTION === "true") {
  assert.equal(response.status, 503);
  assert.ok(!data.test);
} else {
  assert.equal(response.status, 200);
  assert.equal(data.test, true);
  assert.ok(data.message.includes("Aucun email"));
  assert.equal((await post({ ...valid, intent: "contact" })).status, 200);
  assert.equal(
    (await post({ ...valid, intent: "rappel", phone: "0600000000" })).status,
    200,
  );
  for (let i = 0; i < 2; i++) assert.equal((await post(valid)).status, 200);
  const limited = await post({ ...valid, email: "autre@example.com" });
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get("retry-after")) > 0);
}
console.log(
  `OK : ${paths.length} pages, ${links.size} liens internes, H1, canonical, noindex, robots, 404, API origine/validation/spam/taille/${process.env.EXPECT_PRODUCTION === "true" ? "503 sans SMTP" : "mode test/limite 429"}.`,
);
