import { requestLogger, responseLogger, requestErrorLogger, responseErrorLogger } from './logger';
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const sampleAxiosReq: AxiosRequestConfig = {
  method: 'get',
  url: 'https://example.org',
  headers: {
    foo: 'bar',
    'content-type': 'application/json',
    'User-Agent': 'axios',
  },
};

const sampleAxiosRes: AxiosResponse = {
  status: 200,
  headers: { 'content-type': 'application/json' },
  data: 'sample Res',
  statusText: 'sample Res',
  config: {
    ...sampleAxiosReq,
  },
};

const sampleRequestError: AxiosError = {
  config: {
    ...sampleAxiosReq,
  },
  request: {
    ...sampleAxiosReq,
  },
  response: {
    ...sampleAxiosRes,
  },
  isAxiosError: false,
  toJSON: () => [],
  name: 'sample name',
  message: 'sample message',
};

const sampleResponseError: AxiosError = {
  ...sampleRequestError,
};

describe('logger', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    delete process.env.logger;
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  test('should not print any log statements when an environmnet variable is not set', () => {
    process.env.logger = '';
    requestLogger(sampleAxiosReq);
    responseLogger(sampleAxiosRes);
    requestErrorLogger(sampleRequestError);
    responseErrorLogger(sampleResponseError);
    expect(true).toBeTruthy();
  });

  test('should print requests log statements when an environmnet variable "request" is set', () => {
    process.env.logger = 'jest-rest:request';
    const sampleReq: AxiosRequestConfig = {
      url: 'https://example.org',
      headers: {
        'Content-Type': 'application/json',
        common: {
          dummy: 'dummy-header',
        },
      },
      params: { foo: 'bar' },
      data: Buffer.from(sampleAxiosRes.data),
      auth: { username: 'foo', password: 'bar' },
    };

    const req = requestLogger(sampleReq);
    expect(req).toBe(sampleReq);
  });

  test('should print response log statements when an environmnet variable "response" is set', () => {
    process.env.logger = 'jest-rest:response';
    const sampleResponse: AxiosResponse = {
      ...sampleAxiosRes,
      data: { json: { foo: 'bar' } },
    };
    delete sampleResponse.statusText;

    const res = responseLogger(sampleResponse);
    expect(res).toBe(sampleResponse);
  });

  test('should print error log statements when an environmnet variable "error" is set', () => {
    process.env.logger = 'jest-rest:error';
    const sampleReq = {
      ...sampleRequestError,
    };
    delete sampleReq.request.headers;

    const req = requestErrorLogger(sampleReq);
    expect(req).rejects.toBe(sampleReq);
  });

  test('should print error log statements when an environmnet variable "error" is set', async () => {
    process.env.logger = 'jest-rest:error';
    const res = responseErrorLogger(sampleResponseError);
    expect(res).rejects.toBe(sampleResponseError);
  });

  test('should not print error log statements when error.request is undefined', () => {
    process.env.logger = 'jest-rest:error';
    const error = {
      ...sampleRequestError,
    };
    delete error.request;
    const req = requestErrorLogger(error);
    expect(req).rejects.toBe(error);
  });

  test('should not print error log statements when error.response is undefined', async () => {
    process.env.logger = 'jest-rest:error';
    const error: AxiosError = {
      ...sampleResponseError,
    };
    delete error.response;
    const res = responseErrorLogger(error);
    expect(res).rejects.toBe(error);
  });
});
