import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  connectedPage: async ({ page, baseURL }, use) => {
    await page.goto(baseURL);
    await page.locator('#accessCode').fill('portfolio-demo');
    await page.getByRole('button', { name: 'Connect' }).click();
    await expect(page.locator('#app')).not.toHaveClass(/hidden/);
    await use(page);
  },
});

export { expect };
