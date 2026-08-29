import { test, expect } from './fixtures.mjs';

test('shows reconnect feedback after an intentional synthetic interruption', { tag: ['@mock'] }, async ({ connectedPage, request, baseURL }) => {
  await request.post(`${baseURL}/api/qa/disconnect`);
  await expect(connectedPage.getByRole('status')).toContainText('Connection interrupted');
});

const viewports = [
  ['mobile-320', 320, 720],
  ['mobile-390', 390, 844],
  ['desktop-1440', 1440, 900],
];

for (const [label, width, height] of viewports) {
  test(`contains the shell at ${label}`, { tag: ['@mock'] }, async ({ page, baseURL }) => {
    await page.setViewportSize({ width, height });
    await page.goto(baseURL);
    const fitsViewport = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    expect(fitsViewport).toBeTruthy();
  });
}

test('has keyboard-reachable, named controls', { tag: ['@mock'] }, async ({ page, baseURL }) => {
  await page.goto(baseURL);
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toHaveAttribute('id', 'accessCode');
  await expect(page.getByRole('button', { name: 'Connect' })).toBeVisible();
});
