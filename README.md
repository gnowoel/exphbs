# exphbs [![Build Status](https://travis-ci.org/gnowoel/exphbs.svg?branch=master)](https://travis-ci.org/gnowoel/exphbs)

A [Handlebars](https://github.com/wycats/handlebars.js) view engine for [Express](https://github.com/strongloop/express).

<table>
  <tr>
    <td></td>
    <td>Node.js 0.12.x</td>
    <td>Node.js 0.10.x</td>
    <td>io.js 2.x</td>
  </tr>
  <tr>
    <td>Express 4.x</td>
    <td>✓</td>
    <td>✓</td>
    <td>✓</td>
  </tr>
  <tr>
    <td>Express 3.x</td>
    <td>✓</td>
    <td>✓</td>
    <td>✓</td>
  </tr>
</table>

## Features

Layouts:

  * Declaring layout with a comment (`{{!< layouts}}`)
  * Nested layouts with arbitrary depth

Partials:

  * Autoloading partials in a given directory (default: `views/partials`)
  * Partial names are namespaced based on the relative paths
  * Dynamically applying changes in partials during development

Variables:

  * Defining `@variables` which are accessible in any template context

Precompiling:

  * Templates and partials are precompiled and cached in production

Instances:

  * Creating a new instance of separate cache
  * Using with custom Handlebars object

## Quick start

Installation:

```bash
$ npm install exphbs
```

Registering view engine:

```javascript
app.engine('hbs', require('exphbs'));
app.set('view engine', 'hbs');
```

File structure:

```
.
├── app.js
└─┬ views/
  ├── index.hbs
  ├── helpers/
  ├── layouts/
  └── partials/
```

## Documentation

  * [View engine](docs/engine.md)
  * [Render options](docs/options.md)
  * [Variables](docs/variables.md)
  * [Layouts](docs/layouts.md)
  * [Partials](docs/partials.md)
  * [Helpers](docs/helpers.md)

## Tests

```bash
$ npm install
$ npm test
```

## License

MIT
