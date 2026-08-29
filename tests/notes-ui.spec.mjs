import { test, expect } from './fixtures.mjs';
import { DevicePage } from './device-page.mjs';

async function connectNotes(page, baseURL) {
  await page.goto(baseURL);
  await page.locator('#accessCode').fill('portfolio-demo');
  await page.getByRole('button', { name: 'Connect' }).click();
  await new DevicePage(page).openNotes();
}

test('autosaves UTF-8 notes, synchronizes two viewers, and deletes through the UI', { tag: ['@mock'] }, async ({ browser, baseURL }) => {
  const authorContext = await browser.newContext();
  const observerContext = await browser.newContext();
  const author = await authorContext.newPage();
  const observer = await observerContext.newPage();

  try {
    await Promise.all([connectNotes(author, baseURL), connectNotes(observer, baseURL)]);

    await author.getByRole('button', { name: 'New note' }).click();
    await author.locator('#noteTitle').fill('São Paulo sync');
    await author.getByRole('textbox', { name: 'Note body' }).fill('café, ação, and Unicode ✓');

    await expect(author.getByText('Saved')).toBeVisible();
    await expect(observer.getByRole('button', { name: /São Paulo sync/ })).toBeVisible();
    await observer.getByRole('button', { name: /São Paulo sync/ }).click();
    await expect(observer.getByRole('textbox', { name: 'Note body' })).toHaveValue('café, ação, and Unicode ✓');

    await author.getByRole('button', { name: 'Delete note' }).click();
    await expect(observer.getByText('No notes yet.')).toBeVisible();
  } finally {
    await authorContext.close();
    await observerContext.close();
  }
});
