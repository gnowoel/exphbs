var fs = require('fs');
var path = require('path');
var handlebars = require('handlebars');
var File = require('./file');
var cache = {};

module.exports = render;

render.handlebars = handlebars;
render.__express = render;

function render(filePath, options, callback) {
  var file;

  createFile(filePath, function(err, file) {
    if (err) return callback(err);

    renderFile(file, options, function(err, rendered) {
      if (err) return callback(err);

      findLayout(file, options, function(err, layout) {
        if (err) return callback(err);

        if (layout) {
          options.body = rendered;

          render(layout.path, options, callback);
        } else {
          callback(null, rendered);
        }
      });
    });
  });
}

function findLayout(file, options, callback) {
  var pattern = /{{!<\s+([A-Za-z0-9\._\-\/]+)\s*}}/;
  var content = file.content;
  var matches = content.match(pattern);

  delete cache[file.path];

  var name;

  if (matches) {
    name = matches[1];
  } else if (options.layout) {
    name = options.layout;
    delete options.layout
  }

  var layoutPath;

  if (name) {
    var viewPath = options.settings.views;
    var extname = path.extname(file.path);

    name = path.extname(name) ? name : name + extname;
    layoutPath = path.resolve(viewPath, name);
  }

  if (layoutPath) {
    createFile(layoutPath, function(err, layout) {
      if (err) return callback(err);

      callback(null, layout);
    });
  } else {
    callback(null, null);
  }
}

function renderFile(file, options, callback) {
  compileContent(file, function(err, template) {
    if (err) return callback(err);

    executeTemplate(template, options, function(err, rendered) {
      if (err) return callback(err);

      callback(null, rendered);
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

function compileContent(file, callback) {
  var template;

  try {
    template = handlebars.compile(file.content);
  } catch (err) {
    return callback(err);
  }

  callback(null, template);
}

function createFile(filePath, callback) {
  if (cache[filePath]) {
    callback(null, cache[filePath]);
  } else {
    fs.readFile(filePath, 'utf8', function(err, content) {
      if (err) return callback(err);

      var file = new File({ path: filePath, content: content });
      cache[filePath] = file;

      callback(null, file);
    });
  }
}
