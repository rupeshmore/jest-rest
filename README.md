# Jest-Rest 🎪

Jest Rest is a Rest API testing framework using Jest, Axios and Ajv.

Schema definition matching is done using AJV. (one of the fastest schema matcher).

### Highlights

- **Debug** 🕵️ - Pause the tests to see what's happening in real-time.
- **Logger** 📝- log request and response to the terminal for more debugging capability.
- **Contract Tests** 🤝 - Perform contract testing / schema validation testing.
- **Parallel tests** 🧪🧪 - Run parallel tests to speed-up testing.

<!-- [![Coverage Status](https://coveralls.io/repos/github/rupeshmore/jest-rest/badge.svg?branch=master)](https://coveralls.io/github/rupeshmore/jest-rest?branch=master) -->

### Installation

```bash
npm install -D jest jest-rest-preset
```

## Requirements

- Node.js >= 10.15.0
- Jest >=25

## Usage

Update your Jest configuration, either:

- with `package.json`:

```json
"jest": {
  "preset": "jest-rest-preset"
}
```

- with `jest.config.js`:

```javascript
module.exports = {
    preset: "jest-rest-preset",
    ...
}
```

**NOTE**: Be sure to remove any existing `testEnvironment` option from your Jest configuration. The `jest-rest-preset` preset needs to manage that option itself.

Use Jest-Rest in your tests:

- with `package.json`

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

```js
describe('Get test', () => {
  test('get', async () => {
    const get = await axios.get('https://httpbin.org/get', { headers: { token: 'sometoken' } });
    await jestRest.debug();
    expect(get.status).toBe(200);
  });
});
```

## Configuration

You can specify a `jest-rest.config.js` or `jest-rest.config.json` at the root of the project. It should export a config object.

```javascript
{

  /*
  * Define all global config for axios here
  *
  * More info at https://github.com/axios/axios#request-config
  */
  "axios": {},

  /*
  * Define all global config for ajv here
  *
  * More info at https://ajv.js.org/#options
  * default option added is {"allError": true}
  */
  "ajv": {}
}
```

> Default jest timeout is 30 seconds

## Put the tests in debug mode

Jest Rest exposes a method `jestRest.debug()` that suspends test execution and allows to see what's going on.

```javascript
await jestRest.debug();
```

> This will work perfectly when the tests are run sequentially using the jests `--runInBand` option or only single test is run.

## Schema Validation

Jest-Rest extends the jest matcher to include schema validation using ajv.
`toMatchSchema`

usage:

```javascript
const schema = {
  properties: {
    foo: { type: 'string' },
    bar: { type: 'number', maximum: 3 },
  },
};
test('schema validation', async () => {
  const data = { foo: 'abc', bar: 2 };
  expect(data).toMatchSchema(schema);
});
```

## Log request & response of axios

Use environment variable `logger` to log request and/ or response from axios to the console/terminal.

`logger="*request"` - To log axios request to console.

`logger="*response"` - To log axios response to console.

`logger="*info"` - To log axios request and response to console.

`logger="*error"` - To log axios error request and / or response to console.

usage:
On Windows cmd

```sh
set logger=*request
```

using powershell

```sh
$env:logger="*request, *response"
```

on Mac/linux

```sh
export logger="*request, *response"
```

To disable logs, set an empty value `logger=""`.

## Usage with Typescript

Example Jest configuration in combination with [ts-jest](https://github.com/kulshekhar/ts-jest):

```javascript
module.exports = {
  preset: 'jest-rest-preset',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};
```

Types are also available, which you can either use via directly in your test:

or at your central `tsconfig.json` either via `types`:

```json
{
  "compilerOptions": {
    "types": ["jest-rest-preset", "@types/jest"]
  }
}
```

or via `files`:

```json
{
  "files": ["@types/jest", "node_modules/jest-rest-preset/types/global.d.ts"]
}
```

## HTML Reporters

There are multiple Html reporter plugin's available. Feel free to add as per your choice.

- https://github.com/zaqqaz/jest-allure
- https://github.com/dkelosky/jest-stare
- https://github.com/Hazyzh/jest-html-reporters

## Inspiration

Thanks to [jest-playwright](https://github.com/playwright-community/jest-playwright)

## License

MIT
