import { BrowserContext, Page, test } from '@playwright/test';
import { DummyApp } from '../app';

interface Apps {
  dummyApp: DummyApp;
}

// eslint-disable-next-line @typescript-eslint/typedef
export const baseFixture = test.extend<{ apps: Apps }>({
  apps: async (
    { page, context }: { page: Page; context: BrowserContext },
    use: (apps: Apps) => Promise<void>,
  ) => {
    const apps: Apps = {
      dummyApp: new DummyApp(page, context),
    };

    await use(apps);
  },
});
