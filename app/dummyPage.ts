import { expect } from '@playwright/test';
import { AppPage } from './abstractClass';


export class DummyPage extends AppPage {
  public pagePath: string = 'https://playwright.dev/';

  public async expectLoaded() {
    await expect(this.page).toHaveTitle(/Playwright/);
  }

  public async waitForTimeout(timeout: number) {
    await this.page.waitForTimeout(timeout);
  }
}
