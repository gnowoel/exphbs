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

  * Declaring layout with a render option or template comment (`{{!< layouts}}`)
  * Nested layouts with arbitrary depth

Partials:

  * Autoloading partials from defined directory (default: `views/partials`)
  * Partial names are namespaced based on the relative paths
  * Changes in a partial will be dynamically applied during development

Helpers:

  * Autoloading helpers from defined directory (default: `views/helpers`)

Variables:

  * Defining `@variables` that can be accessed from any context in a template

Precompiling:

  * Templates and partials are precompiled and cached in production

Instances:

  * Creating a new instance of its own cache
  * Instantiating with user-provided Handlebars object

## Overview

Installation:

```bash
$ npm install exphbs
```

Registering view engine:

```javascript
app.engine('hbs', require('exphbs'));
app.set('view engine', 'hbs');
```

Default directory structure:

```
.
├── app.js
└─┬ views/
  ├── index.hbs
  ├── helpers/
  ├── layouts/
  └── partials/
```

## Docs

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
