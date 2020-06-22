module.exports = {
  preset: 'ts-jest',
  testPathIgnorePatterns: ['/node_modules/', 'lib'],
  testMatch: ['**/examples/**/*.test.ts'],
  globalSetup: './setup.js',
  globalTeardown: './teardown.js',
  testEnvironment: './testEnvironment.js',
  testTimeout: 30000,
  testRunner: 'jest-circus/runner',
  setupFilesAfterEnv: ['./setup-files-after-env.js'],
};
