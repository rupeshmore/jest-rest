/* eslint-disable @typescript-eslint/no-var-requires */
import chalk from 'chalk';
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
const debug = require('debug');

const debugInfo = debug('jest-rest:info');
const debugError = debug('jest-rest:error');
const debugRequest = debug('jest-rest:request');
const debugResponse = debug('jest-rest:response');

const requestColor = chalk.grey;
const responseColor = chalk.cyan;

export const requestLogger = (req: AxiosRequestConfig): AxiosRequestConfig => {
  const loggerEnvVariable: string = getEnvVariable();
  if (!loggerEnvVariable) return req;

  enableDebugIfNotFor(loggerEnvVariable);

  reqLogger(req);

  return req;
};

export const responseLogger = (res: AxiosResponse): AxiosResponse => {
  const loggerEnvVariable: string = getEnvVariable();
  if (!loggerEnvVariable) return res;

  enableDebugIfNotFor(loggerEnvVariable);

  resLogger(res);
  return res;
};

export const requestErrorLogger = (error: AxiosError): AxiosError | Promise<AxiosError> => {
  const loggerEnvVariable: string = getEnvVariable();
  if (!loggerEnvVariable) return error;

  enableDebugIfNotFor(loggerEnvVariable);

  if (error.request !== undefined) {
    const req = reqLogger(error.request);
    debugError(`%s`, req);
  }
  return Promise.reject(error);
};

export const responseErrorLogger = (error: AxiosError): AxiosError | Promise<AxiosError> => {
  const loggerEnvVariable: string = getEnvVariable();
  if (!loggerEnvVariable) return error;

  enableDebugIfNotFor(loggerEnvVariable);

  if (error.response !== undefined) {
    const reqLog = formatRequest(error.response.config);
    const prettifyRequest = requestColor(JSON.stringify(reqLog, null, 2));
    debugError(`%s`, prettifyRequest);

    const res = resLogger(error.response);
    debugError(`%s`, res);
  }

  return Promise.reject(error);
};

const reqLogger = (req: AxiosRequestConfig) => {
  const reqLog = formatRequest(req);
  const prettifyRequest = requestColor(JSON.stringify(reqLog, null, 2));

  debugRequest(`%s`, prettifyRequest);
  debugInfo(`%s`, prettifyRequest);

  return prettifyRequest;
};

const resLogger = (res: AxiosResponse) => {
  const resLog = formatResponse(res);
  const prettifyResponse = responseColor(JSON.stringify(resLog, null, 2));

  debugResponse(`%s`, prettifyResponse);
  debugInfo(`%s`, prettifyResponse);

  return prettifyResponse;
};

const getEnvVariable = (): string => process.env.logger || '';

const enableDebugIfNotFor = (name: string): void => {
  if (!debug.enabled(`${name}`)) {
    debug.enable(`${name}`);
  }
};

const formatRequest = (req: AxiosRequestConfig): AxiosRequestConfig => {
  const method = req.method;
  const url = req.url;
  let headers = req.headers;
  if (headers) {
    headers = Object.assign(headers.common ? { ...headers.common } : {}, method ? { ...headers[method] } : {}, {
      ...headers,
    });

    ['common', 'get', 'post', 'head', 'put', 'patch', 'delete'].forEach((header) => {
      if (headers[header]) {
        delete headers[header];
      }
    });

    if (headers['User-Agent']) delete headers['User-Agent'];
  }

  if (method) {
    method.toUpperCase();
  }

  let body = req.data;

  if (Buffer.isBuffer(body)) {
    body = `buffer body; will not be printed`;
  }

  return Object.assign(
    {
      method,
      url,
    },
    req.params ? { params: req.params } : {},
    { headers },
    body ? { body } : {},
    req.auth ? { auth: req.auth } : {},
  );
};

const formatResponse = (res: AxiosResponse) => {
  let body = res.data;
  const headers = res.headers;
  const status = res.status;

  if (headers['content-type'].includes('application/json')) {
    body = body.json;
  }

  return {
    status,
    headers,
    body,
  };
};
