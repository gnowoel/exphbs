# Partials

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
