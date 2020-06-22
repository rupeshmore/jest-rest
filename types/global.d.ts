import { AxiosStatic } from 'axios';

interface JestRest {
  /**
   * Suspends test execution and gives you opportunity to see what's going on with test
   * - Jest is suspended (no timeout)
   *
   * ```ts
   * it('should put test in debug mode', async () => {
   *   await jestRest.debug();
   * })
   * ```
   */
  debug: () => Promise<void>;
}

declare global {
  const axios: AxiosStatic;
  const jestRest: JestRest;
  namespace jest {
    interface Matchers<R> {
      toMatchSchema(schema: Record<string, unknown>): R;
    }
  }
}
