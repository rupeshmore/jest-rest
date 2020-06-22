import fs from 'fs';
import path from 'path';
import { readConfig } from './utils';
import { DEFAULT_CONFIG } from './constants';

describe('readConfig', () => {
  const jestSpy = jest.spyOn(fs, 'existsSync');

  beforeEach(() => {
    jest.resetModules();
  });

  test('should return the default configuration if there was no separate configuration specified', () => {
    const config = readConfig();
    expect(config).toMatchObject(DEFAULT_CONFIG);
  });

  test('should return default config if file not found', () => {
    jestSpy.mockImplementationOnce(() => false).mockImplementationOnce(() => false);

    jest.mock(path.join(__dirname, '..', ''), () => ({}), { virtual: true });

    const config = readConfig();
    expect(config).toMatchObject(DEFAULT_CONFIG);
  });

  test('should overwrite with a custom js configuration', () => {
    jestSpy.mockImplementationOnce(() => true).mockImplementationOnce(() => false);

    jest.mock(
      path.join(__dirname, '..', 'jest-rest.config.js'),
      () => ({
        jest: {
          setTimeout: 50000,
        },
        axios: {},
        avj: {
          allErrors: true,
        },
      }),
      { virtual: true },
    );

    const config = readConfig();
    const expectedConfig = {
      jest: {
        setTimeout: 50000,
      },
      axios: {},
      avj: {
        allErrors: true,
      },
    };
    expect(config).toMatchObject(expectedConfig);
  });

  test('should overwrite with a custom json configuration', () => {
    jestSpy.mockImplementationOnce(() => false).mockImplementationOnce(() => true);

    jest.mock(
      path.join(__dirname, '..', 'jest-rest.config.json'),
      () => ({
        jest: {
          setTimeout: 150000,
        },
        axios: {},
        avj: {
          allErrors: true,
        },
      }),
      { virtual: true },
    );
    const config = readConfig();
    const expectedConfig = {
      jest: {
        setTimeout: 150000,
      },
      axios: {},
      avj: {
        allErrors: true,
      },
    };
    expect(config).toMatchObject(expectedConfig);
  });
});
