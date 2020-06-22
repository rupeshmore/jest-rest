/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = require('./lib/JestRestEnvironment').default;
module.exports.globalSetup = require('./lib/global').setup;
module.exports.globalTeardown = require('./lib/global').teardown;
