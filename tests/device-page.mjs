import { expect } from '@playwright/test';

export class DevicePage {
  constructor(page) {
    this.page = page;
  }

  async openNotes() {
    await this.page.getByRole('button', { name: 'Notes' }).click();
    await expect(this.page.locator('#notesPanel')).not.toHaveClass(/hidden/);
  }
}
