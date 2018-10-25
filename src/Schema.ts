import * as SchemaTypes from './types';

export class Schema<T> {
  schema: SchemaTypes.SchemaType<T>;

  constructor(schema: SchemaTypes.SchemaType<T>) {
    this.schema = schema;
  }

  validate(data: SchemaTypes.DataType<T>) {
    return Schema.validate(data, this.schema);
  }

  static create<T>(schema: SchemaTypes.SchemaType<T>) {
    return new Schema(schema);
  }

  static validate<T>(
    data: SchemaTypes.DataType<T>,
    schema: SchemaTypes.SchemaType<T>,
  ): T {
    const errors: TypeError[] = [];
    const validatedData = {} as T;

    for (let key in schema) {
      const val = schema[key](key, data);

      if (val instanceof Error) {
        errors.push(val);
      } else {
        validatedData[key] = val;
      }
    }

    if (errors.length > 0) {
      throw errors;
    }

    return validatedData;
  }

  static string: SchemaTypes.Requirable;
  static number: SchemaTypes.Requirable;
  static date: SchemaTypes.Requirable;
  static boolean: SchemaTypes.Requirable;
  static array: SchemaTypes.Requirable;
  static object: SchemaTypes.Requirable;

  static enum: (types: string[]) => SchemaTypes.Requirable;
  static shape: <T>(shape: SchemaTypes.SchemaType<T>) => SchemaTypes.Requirable;
  static arrayOf: (validator: SchemaTypes.Validator) => SchemaTypes.Requirable;
}
