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

## Feature highlighs

Layouts:

  * Declaring layout with a comment (`{{!< layouts}}`)
  * Nested layouts with arbitrary depth

Partials:

  * Autoloading partials in a given directory (default: `views/partials`)
  * Partial names are namespaced based on the relative paths
  * Dynamically applying changes in partials during development

Variables:

  * Defining variables in Handlebars data channel (`{{@variable}}`)

Precompiling:

  * Compiled templates are cached in production


## Getting started

Install `exphbs`:

```bash
$ npm install exphbs
```

Register `exphbs` for rendering `.hbs` templates:

```javascript
var express = require('express');
var app = express();

app.engine('hbs', require('exphbs'));
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

We can also define a variable in handlebars data channel. These variables can either be global or local ones, and can later be accessed in the templates with syntax `{{@variable}}`.

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

In both examples, we use `{{@name}}` in the templates to access the variable, like this:

```html
<p>The value is {{@name}}.</p>
```

Like render options, a local @variable will override a global one with the same name.

## Layouts

exphbs supports flexible layouts. You can set a layout as a render option or a special comment in the templates. Layouts can also be nested, no matter how deep they are.

### Content interpolation

A layout file is just a normal Handlebars template. But we put a ```{{{body}}}``` tag in the file as a placeholder where the content being rendered will be inserted.

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

And an page template as below:

```html
<h1>Hello world!</h1>
```

The result of rendering the page would be:

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

app.locals.layout = 'layouts/default';

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/admin', function(req, res) {
  res.render('admin', {
    layout: 'layouts/admin'
  });
});
```

In this example, the `/` page would use the `layouts/default` layout, and the `admin` page would use `layouts/admin`.

A layout name like `layouts/default` or `layouts/admin` is just the path of the template file, relative to the `views` directory of the application. The file extension is optional. So both `layouts/default.hbs` and `layouts/default` would work.

### Layout comment

Alternative to a render option, a layout can be specified in the template with a special comment. Take the example from the previous section, instead of using a local option, we can declare a layout for the `admin` template by adding a line in the file `view/admin.hbs`:

```
{{!< layouts/admin}}
```

This comment line can be put anywhere in the template file, but it's conventional to put it on top to make it stand out.

The layout specified with a comment has higher precedence. If we also set a layout with a render option, the one in the comment will be used.

### Nested layouts

Sometimes it's convenient to have a layout belong to another layout. For example, if we are building a blogging software, we would like to have a `post` layout and a `page` layout. Since these two layouts share a large chunk of code, we could add a `default` layout as the parent of both.

*views/layouts/default.hbs*

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

*views/layouts/post.hbs*

```html
{{!< layouts/default}}

<main id="post">

  {{{body}}}

</main>
```

*views/layouts/page.hbs*

```html
{{!< layouts/default}}

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

During development, the changes in a partial will be applied dynamically. There's no need to restart the server just because of an updated partial.

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
