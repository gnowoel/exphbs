# Helpers

Modules located in a defined directory will be autoloaded as view helpers. By default, the directory is `views/helpers`. But we can customize it with `view helpers` application setting.

Note subdirectories are not supported. A module in a subdirectory will be simply ignored.

exphbs also exposes the vanilla `handlebars` object, which can be used to register helpers if you prefer doing it manually.

## Autoloading

A helper module should expose a single function with signature `function(handlebars)`. The filename (without extension) of the module will be used as the helper name.

If we create a file `hello.js` with following content under `views/helpers`:

```javascript
module.exports = function(handlebars) {
  return function() {
    return new handlebars.SafeString('Hello!');
  };
}
```

The `hello` helper will be automatically registered. And we can use it in the templates as below:

```html
{{hello}}
```

After rendering, the resulting HTML would be:

```html
Hello!
```

## Custom directory

We can change the helpers directory by customize `view helpers` application setting, for example:

```javascript
app.set('view helpers', __dirname + '/custom');
```

## Vanilla handlebars

We can use the exposed `handlebars` object to register a helper manually.

Here's an example:

*helper.js*

```javascript
var exphbs = require('exphbs');
var handlebars = exphbs.handlebars;

handlebars.registerHelper('hello', function() {
  return new handlebars.SafeString('Hello!');
});
```

Then require the file as normal:

*app.js*

```javascript
require('./helper');
```

However, if we use a new instance of exphbs, we have to pass along the `handlebars` object across modules, since a new instance of exphbs creates a new instance of Handlebars.

Here's the updated code:

*helper.js*

```javascript

module.exports = function(handlebars) {
  handlebars.registerHelper('hello', function() {
    return new handlebars.SafeString('Hello!');
  });  
};
```

*app.js*

```javascript
var exphbs = require('exphbs').create();

require('./helper')(exphbs.handlebars);
```
