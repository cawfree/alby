const deepMerge = require('lodash.merge');
const deepClone = require('lodash.clonedeep');
const get = require('lodash.get');
const set = require('lodash.set');

const validateCompareAgainstSchema = (validator, compare, schema, template) => {
  const {
    errors,
    ...extraProps
  } = validator.validate(
    compare,
    schema,
  );
  return {
    result: errors.reduce(
      (obj, error) => {
        const {
          property,
          argument,
        } = error;
        const path = property === 'instance' ? argument : property.substring(property.indexOf('.') + 1);
        const correction = get(template, path);
        return set(
          deepClone(obj),
          path,
          correction,
        );
      },
      // XXX: Ensure that all of the keys specified in the template are present,
      //      whilst iteratively correcting for errors.
      //      Note we are careful not to overwrite the original template.
      deepMerge(deepClone(template), deepClone(compare)),
    ),
    warnings: errors,
  };
}

// XXX: Note the schema is expected to have already been added to the validator.
// TODO: enforce this
const alby = (
  validator,
  schema,
  template = {},
  compare,
) => {
  if (!validator) {
    throw new Error(
      `Expected validator, encountered ${JSON.stringify(validator)}.`,
    );
  }
  if (!schema) {
    throw new Error(
      `Expected valid .json schema, encountered ${JSON.stringify(schema)}.`,
    );
  }
  if (typeof schema !== 'object') {
    throw new Error(
      `Expected object, encountered ${typeof schema}.`,
    );
  }
  if (typeof template !== 'object') {
    throw new Error(
      `Expected template object, encountered ${typeof compare}.`,
    );
  }
  // XXX: Ensure the provided template is a valid one before permitting
  //      the caller to use it as a filter.
  const {
    errors,
  } = validator.validate(
    template,
    schema,
  );
  if (errors.length > 0) {
    throw new Error(
      'You have not specified a suitable template for the provided schema.',
    );
  }
  return validateCompareAgainstSchema(
    validator,
    (typeof compare === 'object') ? compare : {},
    schema,
    template,
  );
};

module.exports = alby;
