import fs from 'fs';
import path from 'path';
import { DEFAULT_CONFIG, Config } from './constants';

const exists = (path: string): boolean => fs.existsSync(path);

export const readConfig = (rootDir: string = process.cwd()): Config => {
  const jsConfigPath = path.resolve(rootDir, 'jest-rest.config.js');
  const jsonConfigPath = path.resolve(rootDir, 'jest-rest.config.json');
  const jsConfig = exists(jsConfigPath);
  const jsonConfig = exists(jsConfigPath);

  let localConfig = {};

  if (jsConfig) {
    localConfig = require(jsConfigPath);
  } else if (jsonConfig) {
    localConfig = require(jsonConfigPath);
  }

  return {
    ...DEFAULT_CONFIG,
    ...localConfig,
  };
};
