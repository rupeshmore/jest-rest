import NodeEnvironment from 'jest-environment-node';
import { Config as JestConfig } from '@jest/types';
import { requestLogger, responseLogger, requestErrorLogger, responseErrorLogger } from './logger';

const KEYS = {
  CONTROL_C: '\u0003',
  CONTROL_D: '\u0004',
  ENTER: '\r',
};

declare type DoneFn = (reason?: string | Error) => void;
declare type HookFn = (done?: DoneFn) => Promise<unknown> | null | undefined;
declare type Event = {
  name: string;
  fn: HookFn;
};

declare type State = {
  testTimeout: number;
};

export default class JestRestEnvironment extends NodeEnvironment {
  private _config: JestConfig.ProjectConfig;
  private myRequestInterceptor!: number;
  private myResponseInterceptor!: number;
  constructor(config: JestConfig.ProjectConfig) {
    super(config);
    this._config = config;
  }

  async setup(): Promise<void> {
    this.global.axios = require('axios');

    this.global.jestRest = {
      debug: async (): Promise<void> => {
        console.log('\n\n🕵️‍  Code is paused, press enter to resume \n');

        // Run an infinite promise
        return new Promise((resolve) => {
          const { stdin } = process;
          const onKeyPress = (key: string): void => {
            if (key === KEYS.CONTROL_C || key === KEYS.CONTROL_D || key === KEYS.ENTER) {
              stdin.removeListener('data', onKeyPress);
              if (!listening) {
                if (stdin.isTTY) {
                  stdin.setRawMode(false);
                }
                stdin.pause();
              }
              resolve();
            }
          };
          const listening = stdin.listenerCount('data') > 0;
          if (!listening) {
            if (stdin.isTTY) {
              stdin.setRawMode(true);
            }
            stdin.resume();
            stdin.setEncoding('utf8');
          }
          stdin.on('data', onKeyPress);
        });
      },
    };

    this.myRequestInterceptor = this.global.axios.interceptors.request.use(requestLogger, requestErrorLogger);
    this.myResponseInterceptor = this.global.axios.interceptors.response.use(responseLogger, responseErrorLogger);
  }

  async handleTestEvent(event: Event, state: State): Promise<void> {
    // Hack to set testTimeout for jestRest debugging
    if (
      event.name === 'add_test' &&
      event.fn &&
      event.fn.toString().includes('jestRest.debug()') &&
      process.stdin.isTTY
    ) {
      // Set timeout to 4 days
      state.testTimeout = 4 * 24 * 60 * 60 * 1000;
    }
  }

  async teardown(): Promise<void> {
    if (this.global.axios) {
      this.global.axios.interceptors.request.eject(this.myRequestInterceptor);
      this.global.axios.interceptors.response.eject(this.myResponseInterceptor);
    }
  }
}
