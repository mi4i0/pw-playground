import type { BrowserContext, Page } from '@playwright/test';

export abstract class PageHolder {
  public constructor(protected page: Page, protected context: BrowserContext) {}
}

export abstract class Component extends PageHolder {
  public abstract expectLoaded(message?: string): Promise<void>;

  public async isLoaded(): Promise<boolean> {
    try {
      await this.expectLoaded();
      return true;
    } catch {
      return false;
    }
  }
}

export abstract class AppPage extends Component {
  /**
   * Path to the page can be relative to the baseUrl defined in playwright.config.ts
   * or absolute (on your own risk)
   */
  public abstract pagePath: string;

  /**
   * Opens the page in the browser and expectLoaded should pass
   */
  public async open(path?: string) {
    await this.page.goto(path ?? this.pagePath);
    await this.expectLoaded();
  }
}
