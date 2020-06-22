import { matcherHint, printReceived } from 'jest-matcher-utils';
import { validate } from './validate';

type AnyObj = Record<string, unknown>;

type MatchSchemaType = {
  pass: boolean;
  message(): string;
};

export const toMatchSchema = (data: AnyObj, schema: AnyObj): MatchSchemaType => {
  const schemaValid = validate(data, schema);

  const pass = schemaValid.valid;
  const errorText = schemaValid.errorText;

  if (pass) {
    return {
      pass,
      message: () => errorText,
    };
  }
  return {
    pass,
    message: () => {
      return [
        matcherHint(`.toMatchSchema`, 'data', 'schema'),
        '',
        `Error matching schema:`,
        `  ${printReceived(errorText)}`,
      ].join('\n');
    },
  };
};
