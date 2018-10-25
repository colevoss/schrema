export type PrimitiveType =
  | 'array'
  | 'number'
  | 'string'
  | 'boolean'
  | 'date'
  | 'object';

export type ExpectedType = PrimitiveType | 'enum' | 'shape' | any[];

export interface Validator {
  (key: string, obj: object): Error | any;
}

export interface Requirable extends Validator {
  required: Validator;
}

export type SchemaType<T> = { [K in keyof T]-?: Validator };
export type DataType<T> = { [K in keyof T]-?: any };
