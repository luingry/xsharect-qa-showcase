import { defineConfig, devices } from '@playwright/test';
const port = Number(process.env.PORT || 4173);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests',
  timeout: 15_000,
  expect: { timeout: Number(process.env.PW_EXPECT_TIMEOUT || 5_000) },
  fullyParallel: false,
  // The demo intentionally models one stateful device, so tests run serially.
  workers: 1,
  retries: Number(process.env.PW_RETRIES ?? (process.env.CI ? 1 : 0)),
  reporter: [
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
  ],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'node demo/server.mjs',
    url: `${baseURL}/api/health`,
    reuseExistingServer: false,
  },
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'firefox', use: devices['Desktop Firefox'] },
    { name: 'webkit', use: devices['Desktop Safari'] },
  ],
});
