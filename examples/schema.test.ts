/// <reference types="../types/global" />

import { toMatchSchema } from '../src/to-match-schema';

expect.extend({ toMatchSchema });

const schema = {
  host: 'cert',
  paths: {
    products: {
      get: {
        responses: {
          '401': {
            description: 'Problem with the client request',
            headers: {
              'x-correlator': {
                type: 'string',
                format: 'uuid',
                description: 'Correlation id',
              },
            },
            schema: {
              Unauthenticated: {
                allOf: [
                  {
                    type: 'object',
                    required: ['code'],
                    properties: {
                      code: {
                        type: 'string',
                        enum: ['UNAUTHENTICATED'],
                        default: 'UNAUTHENTICATED',
                        description: 'Request not authenticated due to missing, invalid, or expired credentials.',
                      },
                    },
                  },
                  {
                    type: 'object',
                    required: ['message'],
                    properties: {
                      message: {
                        type: 'string',
                        description: 'A human readable description',
                      },
                    },
                  },
                ],
              },
            },
            examples: {
              'application/json': {
                code: 'UNAUTHENTICATED',
                message: 'Authentication error',
              },
            },
          },
        },
      },
    },
  },
};

describe('Schema test', () => {
  const unAuthenticatedSchema = schema.paths.products.get.responses[401].schema.Unauthenticated;

  test('fails', () => {
    const data = { code: 'AAA', message: 'token expired' };
    expect(() => expect(data).toMatchSchema(unAuthenticatedSchema)).toThrowError();
  });

  test('passes', async () => {
    const data = { code: 'UNAUTHENTICATED', message: 'token expired' };
    expect(data).toMatchSchema(unAuthenticatedSchema);
  });
});
