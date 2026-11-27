import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  use: { baseURL: "http://127.0.0.1:3100" },
  projects: [
    { name: "Chromium", use: devices["Desktop Chrome"] },
    { name: "Firefox", use: devices["Desktop Firefox"] },
    { name: "WebKit", use: devices["Desktop Safari"] },
    { name: "Mobile", use: devices["iPhone 13"] },
    { name: "Tablette", use: devices["iPad Mini"] },
    ...(process.env.PLAYWRIGHT_EDGE === "true"
      ? [
          {
            name: "Edge",
            use: { ...devices["Desktop Edge"], channel: "msedge" },
          },
        ]
      : []),
  ],
  webServer: {
    command: "npm run start -- --port 3100",
    url: "http://127.0.0.1:3100",
    env: { SITE_URL: "http://127.0.0.1:3100", QUOTE_MODE: "test" },
    reuseExistingServer: process.env.PLAYWRIGHT_REUSE_SERVER === "true",
    timeout: 60_000,
  },
});
