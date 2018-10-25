import {
  isArray,
  isNumber,
  isString,
  isBoolean,
  isDate,
  isPlainObject,
  isFunction
} from "lodash";
import * as SchemaTypes from "./types";
import { Schema } from "./Schema";

const createError = <T>(
  key: keyof T,
  obj: SchemaTypes.DataType<T>,
  expected: string,
  received: string
) => {
  return new TypeError(
    `Expected ${key} to be of type ${expected} but recieved ${received} of ${
      obj[key]
    }!`
  );
};

const primitiveCheckers = {
  array: isArray,
  number: isNumber,
  string: isString,
  boolean: isBoolean,
  date: isDate,
  object: isPlainObject
};

const getPropType = (value?: any | any[]): string => {
  for (let key in primitiveCheckers) {
    if (primitiveCheckers[key](value)) return key;
  }

  return typeof value;
};

const createChainableValidator = (
  validator: SchemaTypes.Validator
): SchemaTypes.Requirable => {
  const chainable = (
    required: boolean,
    defaultValue: any,
    key: string,
    obj: object
  ) => {
    const val: any = obj[key];

    if (val === null || val === undefined) {
      if (required) {
        return new TypeError(`${key} is required`);
      }

      if (defaultValue) {
        obj[key] = isFunction(defaultValue) ? defaultValue() : defaultValue;

        return validator(key, obj);
      }

      return val;
    }

    return validator(key, obj);
  };

  const chained = chainable.bind(null, false, undefined);

  chained.required = chainable.bind(null, true, undefined);

  chained.default = (defaultVal: any) => {
    return chainable.bind(null, false, defaultVal);
  };

  return chained;
};

export const createPrimitiveValidator = (
  expectedType: SchemaTypes.PrimitiveType
) => {
  const validator: SchemaTypes.Validator = (key, obj) => {
    const val = obj[key];
    const valType = getPropType(val);

    if (valType !== expectedType) {
      return createError(key, obj, valType, expectedType);
    }

    return val;
  };

  return createChainableValidator(validator);
};

export const createShapeValidator = <T>(shape: SchemaTypes.SchemaType<T>) => {
  if (!isPlainObject(shape)) {
    throw new Error("Please provide a plaine object to Schema.shape");
  }

  const validator: SchemaTypes.Validator = (key: string, obj: object) => {
    const val = obj[key];

    if (!isPlainObject(val)) {
      return new TypeError(`Expected object for ${key} but received ${val}`);
    }

    try {
      const validated = Schema.validate(val, shape);

      return validated;
    } catch (errors) {
      return errors;
    }
  };

  return createChainableValidator(validator);
};

export const createEnumValidator = (types: string[]) => {
  const validator: SchemaTypes.Validator = (key: string, obj: object) => {
    const val = obj[key];

    if (types.indexOf(val) > -1) {
      return val;
    }

    return new TypeError(
      `Expected one of ${JSON.stringify(types)} for ${key} but received ${val}`
    );
  };

  return createChainableValidator(validator);
};

export const createArrayOfTypeValidator = (checker: Function) => {
  const validator: SchemaTypes.Validator = (key: string, obj: object) => {
    const val = obj[key];
    const errors: Error[] = [];

    if (!isArray(val)) {
      return new TypeError(
        `Expected ${key} to be an array but received ${val}`
      );
    }

    for (let i = 0; i < val.length; i++) {
      const checked: any = checker(i, val);

      if (checked instanceof Error) {
        errors.push(checked);
      }
    }

    if (errors.length > 0) return errors;

    return val;
  };

  return createChainableValidator(validator);
};
