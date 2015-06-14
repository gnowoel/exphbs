# exphbs [![Build Status](https://travis-ci.org/gnowoel/exphbs.svg?branch=master)](https://travis-ci.org/gnowoel/exphbs)

A [Handlebars](https://github.com/wycats/handlebars.js) view engine for [Express](https://github.com/strongloop/express) (Beta).

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

## Usage

```bash
$ npm install exphbs
```

```javascript
var express = require('express');
var exphbs = require('exphbs');

var app = express();

app.engine('hbs', exphbs);
app.set('view engine', 'hbs');
```

## Tests

```bash
$ npm install
$ npm test
```

## License

MIT
