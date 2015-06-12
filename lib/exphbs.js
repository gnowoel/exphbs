var fs = require('fs');
var path = require('path');
var handlebars = require('handlebars');

module.exports = render;

render.handlebars = handlebars;
render.__express = render;

var cache = {};

function render(filePath, options, callback) {
  renderFile(filePath, options, function(err, rendered) {
    if (err) return callback(err);

    findLayout(filePath, options, function(err, layoutPath) {
      if (err) return callback(err);

      if (layoutPath) {
        options.body = rendered;

        render(layoutPath, options, callback);
      } else {
        callback(null, rendered);
      }
    });
  });
}

function findLayout(filePath, options, callback) {
  var layoutPath;

  var pattern = /{{!<\s+([A-Za-z0-9\._\-\/]+)\s*}}/;
  var content = cache[filePath];
  var matches = content.match(pattern);

  delete cache[filePath];

  var name;

  if (matches) {
    name = matches[1];
  } else if (options.layout) {
    name = options.layout;
  }

  if (name) {
    var viewPath = options.settings.views;
    var extname = path.extname(name) || path.extname(filePath);

    layoutPath = path.resolve(viewPath, name + extname);
  }

  callback(null, layoutPath);
}

function renderFile(filePath, options, callback) {
  fs.readFile(filePath, 'utf8', function(err, content) {
    if (err) return callback(err);

    cache[filePath] = content;

    compileContent(content, function(err, template) {
      if (err) return callback(err);

      executeTemplate(template, options, function(err, rendered) {
        if (err) return callback(err);

        callback(null, rendered);
      });
    });
  });
}

function executeTemplate(template, options, callback) {
  var rendered;

  try {
    rendered = template(options, { data: options.data });
  } catch (err) {
    return callback(err);
  }

  callback(null, rendered);
}

function compileContent(content, callback) {
  var template;

  try {
    template = handlebars.compile(content);
  } catch (err) {
    return callback(err);
  }

  callback(null, template);
}
