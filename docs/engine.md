# View engine

Register `exphbs` for rendering `.hbs` templates:

```javascript
var express = require('express');
var app = express();

app.engine('hbs', require('exphbs'));
app.set('view engine', 'hbs');
```

Sometimes, we may want to use more than one instances of the view engine, with each using its own template cache and partial registry. This would be the case when embedding an Express app in another. Use `create()` method to create a new instance:

```javascript
var express = require('express');
var exphbs = require('exphbs');
var app = express();

app.engine('hbs', exphbs.create());
app.set('view engine', 'hbs');
```

Optionally, we can instantiate it with a custom Handlebars object. This is useful when we want to use a different version of Handlebars than the one comes with exphbs:

```
var handlebars = require('handlebars');
var express = require('express');
var exphbs = require('exphbs');
var app = express();

app.engine('hbs', exphbs.create(handlebars));
app.set('view engine', 'hbs');
```
