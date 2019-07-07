# alby
A JSON validator and safe fallback utility for those rare times you can't trust your config. 

<p align="center">
  <img src="./bin/alby.jpg" alt="Love you, boy." width="600" height="800">
</p>

## 🚀 Getting Started

Using [npm](https://www.npmjs.com/package/alby):

```bash
npm install --save alby
```

Using [yarn](https://www.npmjs.com/package/jsonschema):

```bash
yarn add alby
```

### ⚠️ Warning
It is **not** recommended at this time suitable to use alby for sanitizing JSON which describes any complex relationships or references between  data sources, as these will be malformed.

## 🤔 How does it work?
[`jsonschema`](https://www.npmjs.com/package/jsonschema) is a proven tool for defining the expected structure, types and formatting of a particular JSON objects by declaring a corresponding schema. Unfortunately in practice, just defining the schema does not make it so. Poor form validation, developer errors or short-sighted data manipulation all conspire against the frontend developer. This can be particularly common case when third-partys are permitted to bulk datasets to your database. (See: [Murphy's Law](https://en.wikiquote.org/wiki/Murphy%27s_law)).

[alby](https://www.npmjs.com/package/alby) builds upon [`jsonschema`](https://www.npmjs.com/package/jsonschema) by taking its analysis results and in case of error, reverting these back to a safe default value.

In effect, it turns responses like this:

```json
{
  "uuid": "12d31a68-66ba-4857-8263-0512bace0385",
  "branding": "Unknown column '%all%' in 'where clause'",
}
```

Into something more like this:

```json
{
  "uuid": "12d31a68-66ba-4857-8263-0512bace0385",
  "branding": {
    "backgroundColor": "firebrick",
    "title": "Default Title"
  }
}
```

Meanwhile, the actual errors from the failed response are _still retained_. This helps keep your frontend app working in production at a sensible default configuration, whilst you can fire off the failures using an analytics service.

## ✍️ Example

```javascript
const { Validator } = require('jsonschema');
const alby = require('alby');

const validator = new Validator();

const schema = {
  id: '/Example',
  type: 'object',
  properties: {
    title: {
      type: 'string',
    },
  },
  required: [
    'title',
  ],
};

const backup = {
  title: 'Default Title',
};

validator.addSchema(
  schema,
);

const getErroneousJson = () => ({
  title: 39248,
});

const {
  result,
  warnings,
} = alby(
  validator,
  schema,
  backup,
  getErroneousJson(),
);
console.log(result); // { title: 'Default Title' },
console.log(warnings); // Lots of warnings!
```

Please check out the [tests](./index.test.js) for further detail.

## 🙏 Dependencies 
  - [jsonschema](https://www.npmjs.com/package/jsonschema)
  - [lodash.clonedeep](https://lodash.com/)
  - [lodash.get](https://lodash.com/)
  - [lodash.merge](https://lodash.com/)
  - [lodash.set](https://lodash.com/)

## ✌️ License
[MIT](https://opensource.org/licenses/MIT)
