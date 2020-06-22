import { validate } from './validate';

const schema = {
  properties: {
    foo: { type: 'string' },
    bar: { type: 'number', maximum: 3 },
    foobar: { type: 'string', enum: ['AAA'] },
  },
  required: ['foo'],
};

describe('validate tests', () => {
  test('without errors', async () => {
    const data = { foo: 'a' };
    const val = validate(data, schema);
    expect(val).toStrictEqual({ errorText: '', valid: true });
  });

  test('with errors', async () => {
    const data = { foo: 1 };
    const val = validate(data, schema);
    expect(val).toStrictEqual({ errorText: 'data.foo should be string', valid: false });
  });

  test('when data is empty object', async () => {
    const data = {};
    const val = validate(data, schema);
    expect(val).toStrictEqual({ errorText: "data should have required property 'foo'", valid: false });
  });

  test('with more than one error', async () => {
    const data = { foo: 101, bar: 'abc' };
    const val = validate(data, schema);
    expect(val).toStrictEqual({ errorText: 'data.foo should be string, data.bar should be number', valid: false });
  });

  test('enum is valid', async () => {
    const data = { foo: 'a', bar: 1, foobar: 'AAA' };
    const val = validate(data, schema);
    expect(val).toStrictEqual({ errorText: '', valid: true });
  });

  test('enum is invalid', async () => {
    const data = { foo: 'a', foobar: 'BBB' };
    const val = validate(data, schema);
    expect(val).toStrictEqual({
      errorText: "data.foobar should be equal to one of the allowed values ['AAA']",
      valid: false,
    });
  });
});
