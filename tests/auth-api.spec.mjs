import { test, expect } from './fixtures.mjs';

test('rejects an invalid access code', { tag: ['@mock', '@negative'] }, async ({ page, baseURL }) => {
  await page.goto(baseURL);
  await page.locator('#accessCode').fill('wrong');
  await page.getByRole('button', { name: 'Connect' }).click();
  await expect(page.getByRole('alert')).toBeVisible();
});

test('connects with the synthetic access code', { tag: ['@mock'] }, async ({ connectedPage }) => {
  await expect(connectedPage.getByText('Connected to a synthetic LAN device.')).toBeVisible();
});

test('rejects protected notes API without a bearer token', { tag: ['@mock', '@negative'] }, async ({ request, baseURL }) => {
  const response = await request.get(`${baseURL}/api/notes`);
  expect(response.status()).toBe(401);
  await expect(response.json()).resolves.toEqual({ error: 'unauthorized' });
});

test('rejects malformed JSON with a stable error contract', { tag: ['@mock', '@negative'] }, async ({ request, baseURL }) => {
  const response = await request.post(`${baseURL}/api/notes`, {
    headers: {
      authorization: 'Bearer synthetic-session-token',
      'content-type': 'application/json',
    },
    data: '{',
  });

  expect(response.status()).toBe(400);
  await expect(response.json()).resolves.toEqual({ error: 'invalid_json' });
});
