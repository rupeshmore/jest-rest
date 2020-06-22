import { AxiosRequestConfig } from 'axios';

export interface Config {
  // jest?: Partial<JestConfig.GlobalConfig>;
  axios?: AxiosRequestConfig;
  // https://ajv.js.org/#options
  ajv?: Record<string, unknown>;
}

export const DEFAULT_CONFIG: Config = {
  // jest: {
  //     testTimeout: 30000
  // },
  axios: {},
  // https://ajv.js.org/#options
  ajv: {
    allErrors: true,
  },
};
