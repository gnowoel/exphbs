# exphbs [![Build Status](https://travis-ci.org/gnowoel/exphbs.svg?branch=master)](https://travis-ci.org/gnowoel/exphbs)

A [Handlebars](https://github.com/wycats/handlebars.js) view engine for [Express](https://github.com/strongloop/express) 4.x/3.x, with Node.js and io.js support.

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

## Feature highlights

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

## Installation

Install `exphbs`:

```bash
$ npm install exphbs
```

## View engine

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


## Render options

From the highest precedence to the lowest, render options can be specified in the following ways:

  * Local options
  * Global options
  * View options

In the following sections, we give examples for defining the variable `name` in different ways. In all cases, the variable can be accessed with `{{name}}` in the templates.

### Local options

Variable `name` is available only when rendering the current view:

```javascript
app.get('/', function(req, res) {
  res.render('index', {
    name: 'value';
  });
});
```

Local options have the highest precedence, which will override the same options specified otherwise.

### Global options

Variable `name` is applied each time when rendering a view. In this case, we can use `{{name}}` to get the value in both `index.hbs` and `another.hbs` templates:

```javascript
app.locals.name = 'value';

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/another', function(req, res) {
  res.render('another');
});
```

Global options have lower precedence than the local ones. If the same variable is defined in multiple ways, the one with higher precedence will override the lower one.

### View options

Like a global option, variable `name` defined as a view option is available when redering any view (both `index.hbs` or `another.hbs` in this case), but with a lower precedence:

```javascript
app.set('view options', {
  name: 'value';
});

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/another', function(req, res) {
  res.render('another');
});
```

Global options and view options are useful for setting default values. For a special case, we can then use a local option to override the default value.

## Variables

A variable can be defined as a [render option](#render-options). In the above section, we have seen examples for defining a variable in three different ways (a local option, a global option and a view option).

We can also define a variable in Handlebars data channel. These variables can either be global ones, which applies whenever `render()` is executed, or local ones, which applies to the current `render()` method. In both cases, they can be accessed in the templates with syntax `{{@variable}}`.

Here is an example of defining a global @variable::

```javascript
app.locals.data = {
  name: 'value';
};

app.get('/', function(req, res) {
  res.render('index');
});
```

Alternatively, we can define it locally:

```javascript
app.get('/', function(req, res) {
  res.render('index', {
    data: {
      name: 'another value'
    }
  });
});
```

In the templates, we use `{{@name}}` to access the variable, as shown below:

```html
<p>The value is {{@name}}.</p>
```

Local `@variables` have higher precedence than the global ones. If we define the same `@variable` in both ways, the local one will be used.

`@variables` are different from render options in that they can be accessed in any template context. So, it's handy to use them for commonly used variables like `@siteName` or `@currentUser`.

In the following example, we will define `@production` to check if it's running in production:

```
app.locals.data = {
  production: app.get('env') === 'production'
};
```

After that, we can use it to check the environment anywhere in the templates:

```html
{{#if @production}}
  <!-- do something -->
{{/if}}

{{#anotherContext}}

  {{#if @production}}
    <!-- do something -->
  {{/if}}

{{/anotherContext}}
```

## Layouts

exphbs supports flexible layouts. You can set a layout as a render option or a special comment in the templates. Layouts can also be nested, no matter how deep they are.

### Content interpolation

A layout file is just a normal Handlebars template. But we put a ```{{{body}}}``` tag in the file as a placeholder where the rendered content will be inserted.

Suppose we can have a layout like this:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
  </head>
  <body>

    {{{body}}}

  </body>
</html>
```

And a page template as below:

```html
<h1>Hello world!</h1>
```

The resulting HTML of the rendered page would be:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
  </head>
  <body>

    <h1>Hello, world!</h1>

  </body>
</html>
```

### Layout names

A layout is specified with its name. A layout name is the path relative to the directory where we put layout files. By default, the layouts should be save under `views/layouts`.

Suppose we have a layout file `views/layouts/default.hbs`, the name will be `default`. File extension can be included, so `default.hbs` will also work.

The subdirectory of the path is respected. A layout file named `default.hbs` in `views/layouts/page ` would have name `page/default`.

The layouts directory can be customized with the `view layouts` application setting. For example:

```javascript
var path = require('path');

app.set('view layouts', path.join(__dirname, `views`, `custom`));
```

In this case, all layout names would be relative paths to the `views/custom` directory.

### Layout option

A layout can be specified as a [render option](#render-options). As an example, suppose we have a `default` layout and an `admin` layout, with the file structure as below:

```
.
├── app.js
└─┬ view/
  ├── admin.hbs
  ├── index.hbs
  └─┬ layouts/
    ├── admin.hbs
    └── default.hbs
```

We can set the `default` layout as default and use the `admin` layout as a special case:

```javascript
app.set('views', __dirname + '/views'));

app.locals.layout = 'default';

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/admin', function(req, res) {
  res.render('admin', {
    layout: 'admin'
  });
});
```

In this example, the `/` page would use the `default` layout, and the `admin` page would use `admin`.

A layout name like `default` or `admin` is just the relative path of the template file. By default, the path is relative to `views/layouts`, but we can customize the layouts path with `view layouts` application setting:

```javascript
var path = require('path');

app.set('view layouts', path.join(__dirname, 'views', 'custom');
```

When specifying a layout, the file extension is optional. Both `default.hbs` and `default` would work.

### Layout comment

Alternative to a render option, a layout can be specified in the template with a special comment. Take the example from the previous section, instead of using a local option, we can declare a layout for the `admin` template by adding a line in the file `view/admin.hbs`:

```
{{!< admin}}
```

This comment line can be put anywhere in the template file, but it's conventional to put it on top to make it stand out.

The layout specified with a comment has higher precedence. If we also set a layout with a render option, the one in the comment will be used.

### Nested layouts

Sometimes it's convenient to have a layout belong to another layout. For example, if we are building a blogging software, we would like to have a `post` layout and a `page` layout. Since these two layouts share a large chunk of code, we could add a `default` layout as the parent of both.

*views/default.hbs*

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
  </head>
  <body>

    {{{body}}}

  </body>
</html>
```

*views/post.hbs*

```html
{{!< default}}

<main id="post">

  {{{body}}}

</main>
```

*views/page.hbs*

```html
{{!< default}}

<main id="page">

  {{{body}}}

</main>
```

There are no limit on the depth of the nesting, as long as the layouts are not circular referenced. But exphbs would be smart enough to detect this kind of error.

The layout options and layout comments can be mixed. It's allowed to use a layout comment for a template and a render option for its parent, or the other way around.

## Partials

We can use the exposed `handlebars` object to register a partial, but it's not necessary. By default, all partials in `views/partials` will be registered automatically.

For example, if there are partial files for header and footer in `views/partials` directory:

*views/partials/header.hbs*

```html
<header>
  This is a header
</header>
```

*views/partials/footer.hbs*

```html
<footer>
  This is a footer
</footer>
```

And there's template that includes the partial:

```html
{{> header}}

<main>
  This is the main part.
</main>

{{> footer}}
```

After rendering, the resulting HTML would be:

```html
<header>
  This is a footer
</header>

<main>
  This is the main part.
</main>

<footer>
  This is a footer
</footer>
```

The names of the automatically registered partials are namespaced, based on the relative path from `views/partials` directory. Take the above example, if we save the header and footer partials under `views/partials/shared` directory, the `views/index.hbs` template would be updated as:

```html
{{> shared/header}}

<main>
  This is the main part.
</main>

{{> shared/footer}}
```

You can customize the partials directory by changing `views partials` application setting, for example:

```javascript
app.set('view partials', path.join(__dirname, 'views', 'custom'));
```

Now, the partials in `views/custom` directory will be autoloaded.

Changes in a partial will be applied dynamically during development. No need to restart the server just because of an updated partial.

But in production, the partials are precompiled and cached. They are always available even if the underlying files are changed or deleted.

## Helpers

For now, we can only use the exposed `handlebars` object to register a helper, like this:

```javascript
var handlebars = require('exphbs').handlebars;

// handlebars.registerHelper(...);
```

## Tests

More examples can be found in the [test](test) directory. Or, just run the tests to get a feature list:

```bash
$ npm install
$ npm test
```

## License

MIT
