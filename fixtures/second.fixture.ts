/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/typedef */

import { baseFixture } from './index';
import { getRequest } from '../helpers/api-helper';

interface SecondContext {
  anotherGetRequest: () => Promise<void>;
}

export const secondFixture = baseFixture.extend<SecondContext>({
  anotherGetRequest: async ({}: {}, use) => {
    const anotherGetRequest = async (): Promise<void> => {
      const response = await getRequest('https://jsonplaceholder.typicode.com/todos/1');
      console.log('response', response);
    };

    await use(anotherGetRequest);
  }
});
