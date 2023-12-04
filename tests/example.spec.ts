import { mergeTests } from '@playwright/test';
import { firstFixture } from '../fixtures/first.fixture';
import { secondFixture } from '../fixtures/second.fixture';

const mergedFixtures = mergeTests(firstFixture, secondFixture);

mergedFixtures.describe('Merged fixtures', () => {
  mergedFixtures.beforeAll(async ({firstGetRequest}) => {
    await firstGetRequest();
  });

  mergedFixtures.beforeEach(async ({page, anotherGetRequest}) => {
    await anotherGetRequest();
    await page.waitForTimeout(10000);
  });


  mergedFixtures('wait for some time', async ({apps}) => {
    await apps.dummyApp.dummyPage.open();
    await apps.dummyApp.dummyPage.waitForTimeout(10000);
  });
});
