import { getRequest } from '../helpers/api-helper';
import { baseFixture } from './index';

interface FirstContext {
  firstGetRequest: () => Promise<void>;
}

export const firstFixture = baseFixture.extend<FirstContext>({
  firstGetRequest: async ({}: {}, use) => {
    const firstGetRequest = async (): Promise<void> => {
      const response = await getRequest('https://jsonplaceholder.typicode.com/todos/1');
      console.log('response', response);
    };
    console.log('before timer')
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log('after timer')

    await use(firstGetRequest);
  }
});
