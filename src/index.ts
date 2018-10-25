import { Schema } from './Schema';
import * as schemaGenerator from './schemaGenerator';

Schema.string = schemaGenerator.createPrimitiveValidator('string');
Schema.number = schemaGenerator.createPrimitiveValidator('number');
Schema.date = schemaGenerator.createPrimitiveValidator('date');
Schema.boolean = schemaGenerator.createPrimitiveValidator('boolean');
Schema.array = schemaGenerator.createPrimitiveValidator('array');
Schema.object = schemaGenerator.createPrimitiveValidator('object');

Schema.enum = schemaGenerator.createEnumValidator;
Schema.shape = schemaGenerator.createShapeValidator;
Schema.arrayOf = schemaGenerator.createArrayOfTypeValidator;

export { Schema };
