import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  _testState: [async ({ request, baseURL }, use) => {
    const resetBefore = await request.post(`${baseURL}/api/qa/reset`);
    expect(resetBefore.ok(), 'test-state reset before test succeeds').toBeTruthy();
    try {
      await use();
    } finally {
      const resetAfter = await request.post(`${baseURL}/api/qa/reset`);
      expect(resetAfter.ok(), 'test-state reset after test succeeds').toBeTruthy();
    }
  }, { auto: true }],
  page: async ({ page }, use) => {
    const runtimeErrors = [];
    page.on('console', (message) => { if (message.type() === 'error') runtimeErrors.push(`console: ${message.text()}`); });
    page.on('pageerror', (error) => runtimeErrors.push(`pageerror: ${error}`));
    await use(page);
    expect(runtimeErrors, `unexpected browser runtime errors: ${runtimeErrors.join('\n')}`).toEqual([]);
  },
  connectedPage: async ({ page, baseURL }, use) => {
    await page.goto(baseURL);
    await page.locator('#accessCode').fill('portfolio-demo');
    await page.getByRole('button', { name: 'Connect' }).click();
    await expect(page.locator('#app')).not.toHaveClass(/hidden/);
    await use(page);
  },
});

export { expect };
