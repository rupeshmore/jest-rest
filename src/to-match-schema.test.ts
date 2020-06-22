import { toMatchSchema } from './to-match-schema';

const schema = {
  properties: {
    foo: { type: 'string' },
    bar: { type: 'number', maximum: 3 },
  },
  required: ['foo'],
};

describe('.toMatchSchema', () => {
  test('passes', async () => {
    const data = { foo: 'a', bar: 3 };
    const val = toMatchSchema(data, schema);
    expect(val.pass).toBeTruthy();
    expect(val.message()).toBe('');
  });

  test('fails', async () => {
    const data = { foo: 2, bar: 4 };
    const val = toMatchSchema(data, schema);
    expect(val.pass).toBeFalsy();
  });
});
