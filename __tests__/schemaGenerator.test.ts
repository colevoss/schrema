import 'jest';
import * as schemaGenerator from '../src/schemaGenerator';
import { Schema } from '../src';

const testData = {
  string: 'test-string',
  number: 1,
  array: [1, 2, 3],
  boolean: true,
  object: { test: 'object' },
};

describe('createPrimitiveValidator', () => {
  test('string success', () => {
    const validator = schemaGenerator.createPrimitiveValidator('string');

    expect(validator('string', testData)).toBe('test-string');
  });

  test('string failure', () => {
    const validator = schemaGenerator.createPrimitiveValidator('string');

    expect(validator('number', testData)).toBeInstanceOf(TypeError);
  });

  test('number success', () => {
    const validator = schemaGenerator.createPrimitiveValidator('number');

    expect(validator('number', testData)).toBe(1);
  });

  test('number failure', () => {
    const validator = schemaGenerator.createPrimitiveValidator('number');

    expect(validator('string', testData)).toBeInstanceOf(TypeError);
  });

  test('array success', () => {
    const validator = schemaGenerator.createPrimitiveValidator('array');

    expect(validator('array', testData)).toEqual([1, 2, 3]);
  });

  test('array failure', () => {
    const validator = schemaGenerator.createPrimitiveValidator('array');

    expect(validator('string', testData)).toBeInstanceOf(TypeError);
  });

  test('boolean success', () => {
    const validator = schemaGenerator.createPrimitiveValidator('boolean');

    expect(validator('boolean', testData)).toBeTruthy();
  });

  test('boolean failure', () => {
    const validator = schemaGenerator.createPrimitiveValidator('boolean');

    expect(validator('string', testData)).toBeInstanceOf(TypeError);
  });

  test('object success', () => {
    const validator = schemaGenerator.createPrimitiveValidator('object');

    expect(validator('object', testData)).toEqual({ test: 'object' });
  });

  test('object failure', () => {
    const validator = schemaGenerator.createPrimitiveValidator('object');

    expect(validator('string', testData)).toBeInstanceOf(TypeError);
  });
});

describe('createShapeValidator', () => {
  const shapeData = {
    test: {
      a: 'b',
      b: 2,
    },
  };

  const badShapeData = {
    test: {
      a: 1,
      b: '2',
    },
  };

  const shape = {
    a: Schema.string,
    b: Schema.number,
  };

  test('Validates an entire object', () => {
    const validator = schemaGenerator.createShapeValidator;

    expect(validator(shape)('test', shapeData)).toEqual(shapeData.test);
  });

  test('Returns errors if any are invalid', () => {
    const validator = schemaGenerator.createShapeValidator;

    const validated = validator(shape)('test', badShapeData);

    expect(validated).toHaveLength(2);
    expect(validated[0]).toBeInstanceOf(TypeError);
    expect(validated[1]).toBeInstanceOf(TypeError);
  });
});

describe('createEnumValidator', () => {
  test('enum success', () => {
    const validator = schemaGenerator.createEnumValidator;

    const validatedTest = validator(['test', 'enum'])('test', { test: 'test' });
    const validatedEnum = validator(['test', 'enum'])('test', { test: 'enum' });

    expect(validatedTest).toBe('test');
    expect(validatedEnum).toBe('enum');
  });

  test('enum failure', () => {
    const validator = schemaGenerator.createEnumValidator;

    const validated = validator(['test', 'enum'])('test', { test: 'not-test' });

    expect(validated).toBeInstanceOf(TypeError);
  });
});

describe('createArrayOfTypeValidator', () => {
  const testArray = ['test', 'array', 'of', 'strings'];

  test('arrayOf success', () => {
    const validator = schemaGenerator.createArrayOfTypeValidator(Schema.string);

    const valdiated = validator('test', {
      test: testArray,
    });

    expect(valdiated).toEqual(testArray);
  });

  test('arrayOf failure', () => {
    const validator = schemaGenerator.createArrayOfTypeValidator(Schema.number);

    const valdiated = validator('test', {
      test: testArray,
    });

    expect(valdiated).toHaveLength(testArray.length);
  });
});
