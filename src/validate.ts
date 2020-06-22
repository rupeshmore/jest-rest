import Ajv, { EnumParams } from 'ajv';
import { readConfig } from './utils';

const config = readConfig();
const ajvConfig = config.ajv;

type ValidateType = {
  valid: boolean;
  errorText: string;
};

export const validate = (data: Record<string, unknown>, schema: Record<string, unknown>): ValidateType => {
  const ajv = new Ajv({ $data: true, ...ajvConfig });
  const valid = ajv.validate(schema, data);

  const ajvErrors = ajv.errors || [];
  let errorText = '';
  for (const error of ajvErrors) {
    if (errorText !== '') {
      errorText += ', ';
    }

    errorText += `data${error.dataPath} ${error.message}`;

    const params = error.params as EnumParams;
    const allowedValues = (params || {}).allowedValues;
    if (allowedValues) {
      errorText += ` ['${allowedValues.join(', ')}']`;
    }
  }

  return {
    errorText,
    valid: !!valid,
  };
};
