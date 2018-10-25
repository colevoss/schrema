import 'jest';
import { Schema } from '../src';

describe('Schema', () => {
  const data = {
    a: 'string',
    b: 1,
  };

  const schema = Schema.create({
    a: Schema.string,
    b: Schema.number,
  });

  test('.create returns an instance of Schema', () => {
    const schema = Schema.create({});

    expect(schema).toBeInstanceOf(Schema);
  });

  test('<instance>.validate validates the given schema againts data', () => {
    const validated = schema.validate(data);

    expect(validated).toEqual(data);
  });

  test('Schema.validate validates the given schema againts data', () => {
    const validated = Schema.validate(data, {
      a: Schema.string,
      b: Schema.number,
    });

    expect(validated).toEqual(data);
  });

  test('.validate throws an error if data is invalid', () => {
    const validate = () =>
      schema.validate({
        a: 1,
        b: 'number',
      });

    expect(validate).toThrowError();
  });
});
