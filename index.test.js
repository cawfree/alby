const alby = require('./');
const colorFormat = require('is-css3-color');
const { Validator } = require('jsonschema');

const validator = new Validator();

Object.assign(
  validator
    .customFormats,
  {
    colorFormat,
  },
);

const schema = {
  id: '/Alby',
  type: 'object',
  properties: {
    uuid: {
      type: 'string',
    },
    branding: {
      type: 'object',
      properties: {
        backgroundColor: {
          type: 'string',
          format: 'colorFormat',
        },
        title: {
          type: 'string',
        },
      },
    },
  },
  required: [
    'uuid', 'branding',
  ],
};

validator.addSchema(
  schema,
);

const template = {
  uuid: '0ef3bbdf-d7df-44a9-8a48-7c5c1e76882c',
  branding: {
    backgroundColor: 'hsla(65, 100%, 50%, 1)',
    title: 'Default Title',
  },
};

it('should fail when not initialized correctly', function() {
  expect(
    () => alby(),
  )
    .toThrow();
  expect(
    () => alby(null),
  )
    .toThrow();
  expect(
    () => alby(validator),
  )
    .toThrow();
  expect(
    () => alby(
      validator,
      schema,
    )
  )
    .toBeTruthy();
  expect(
    () => alby(
      validator,
      schema,
      null,
    ),
  )
    .toThrow();
  expect(
    () => alby(
      validator,
      schema,
      {
        uuid: '0ef3bbdf-d7df-44a9-8a48-7c5c1e76882c',
      },
    ),
  )
    .toThrow();
  expect(
    () => alby(
      validator,
      schema,
      {
        uuid: '0ef3bbdf-d7df-44a9-8a48-7c5c1e76882c',
        branding: {
          
        },
      },
    ),
  )
    .toBeTruthy();
});

it('should sanitize json when inappropriate values are found', function() {
  const good = {
    uuid: 'ae06b0ae-6a74-48f0-a394-641ee508c494',
    branding: {
      backgroundColor: 'firebrick',
      title: 'Who\'s a good boy?',
    },
  };
  const bad = {
    branding: {
      backgroundColor: '13',
      title: 'No! Bad boy, get down!',
    },
  };
  const awful = {
    uuid: '12d31a68-66ba-4857-8263-0512bace0385',
    branding: "Unknown column '%all%' in 'where clause'",
  };
  expect(JSON.stringify(alby(validator, schema, template, good).result))
    .toEqual(JSON.stringify(good));
  expect(JSON.stringify(alby(validator, schema, template, good).warnings))
    .toEqual(JSON.stringify([]));
  expect(JSON.stringify(alby(validator, schema, template, null).result))
    .toEqual(JSON.stringify(template));
  expect(alby(validator, schema, template, null).warnings.length)
    .toBeGreaterThan(0);
  expect(JSON.stringify(alby(validator, schema, template, bad).result))
    .toEqual(JSON.stringify({
      uuid: template.uuid,
      branding: {
        backgroundColor: template.branding.backgroundColor,
        title: bad.branding.title,
      },
    }));
  expect(JSON.stringify(alby(validator, schema, template, awful).result))
    .toEqual(JSON.stringify({
      uuid: awful.uuid,
      branding: template.branding,
    }));
});
