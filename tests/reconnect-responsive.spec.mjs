import { test, expect } from './fixtures.mjs';

test.describe('intentional WebSocket interruption', () => {
  test.use({
    allowedConsoleErrorPatterns: [
      "^WebSocket connection to 'ws://127\\.0\\.0\\.1:\\d+/ws' failed: Received invalid WebSocket response from the server$",
    ],
  });

  test('shows reconnect feedback after an intentional synthetic interruption', { tag: ['@mock'] }, async ({ connectedPage, request, baseURL }) => {
    const disconnect = await request.post(`${baseURL}/api/qa/disconnect`);
    expect(disconnect.ok(), 'synthetic disconnect request succeeds').toBeTruthy();
    await expect(connectedPage.getByRole('status')).toContainText('Connection interrupted');
  });
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
    for (const selector of ['#authCard', '#accessCode', '#connectButton']) {
      const box = await page.locator(selector).boundingBox();
      expect(box, `${selector} is visible`).not.toBeNull();
      expect(box.x, `${selector} starts inside viewport`).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width, `${selector} is not clipped`).toBeLessThanOrEqual(width + 1);
    }
    const connect = await page.locator('#connectButton').boundingBox();
    expect(connect.height, 'Connect remains a touch-sized target').toBeGreaterThanOrEqual(44);
  });
}

test('has keyboard-reachable, named controls', { tag: ['@mock'] }, async ({ page, baseURL }) => {
  await page.goto(baseURL);
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toHaveAttribute('id', 'accessCode');
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toHaveAttribute('id', 'connectButton');
  await page.locator('#accessCode').fill('portfolio-demo');
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toHaveAttribute('id', 'connectButton');
  await page.keyboard.press('Enter');
  await expect(page.locator('#app')).not.toHaveClass(/hidden/);
});
