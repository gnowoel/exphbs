var fs = require('fs');
var path = require('path');
var handlebars = require('handlebars');

var cache = {};

exports = module.exports = __express;

exports.handlebars = handlebars;
exports.__express = __express;

function __express(filePath, options, callback) {
  options = prepareOptions(options);

  render(filePath, options, callback);
}

function prepareOptions(options) {
  var opts = {};

  var settings = {};

  for (var key in options.settings) {
    settings[key] = options.settings[key];
  }

  var viewOptions = settings['view options'];

  if (viewOptions) {
    for (var key in viewOptions) {
      opts[key] = viewOptions[key];
    }
  }

  for (var key in options) {
    if (key !== 'settings') {
      opts[key] = options[key];
    }
  }

  delete settings['view options'];
  opts['settings'] = settings;

  return opts;
}

function render(filePath, options, callback) {
  createFile(filePath, options, function(err, file) {
    if (err) return callback(err);

    renderFile(file, options, function(err, rendered) {
      if (err) return callback(err);

      findLayout(file, options, function(err, layoutPath) {
        if (err) return callback(err);

        if (layoutPath) {
          options.body = rendered;

          render(layoutPath, options, callback);
        } else {
          callback(null, rendered);
        }
      });
    });
  });
}

function createFile(filePath, options, callback) {
  if (cache[filePath]) {
    return callback(null, cache[filePath]);
  }

  var file = {};

  file.path = filePath;

  fs.readFile(filePath, 'utf8', function(err, content) {
    if (err) return callback(err);

    var layoutName;

    var pattern = /{{!<\s+([A-Za-z0-9\._\-\/]+)\s*}}/;
    var matches = content.match(pattern);

    if (matches) {
      layoutName = matches[1];
    }

    file.layoutName = layoutName;

    compileContent(content, function(err, template) {
      if (err) return callback(err);

      file.template = template;

      if (options.cache) {
        cache[filePath] = file;
      }

      callback(null, file);
    });
  });
}

function renderFile(file, options, callback) {
  var template = file.template;

  executeTemplate(template, options, function(err, rendered) {
    if (err) return callback(err);

    callback(null, rendered);
  });
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

function executeTemplate(template, options, callback) {
  var rendered;

  try {
    rendered = template(options, { data: options.data });
  } catch (err) {
    return callback(err);
  }

  callback(null, rendered);
}

function findLayout(file, options, callback) {
  var name;

  if (file.layoutName) {
    name = file.layoutName;
  } else if (options.layout) {
    name = options.layout;
    delete options.layout;
  }

  var layoutPath;

  if (name) {
    var viewPath = options.settings.views;
    var extname = path.extname(file.path);

    name = path.extname(name) ? name : name + extname;
    layoutPath = path.resolve(viewPath, name);
  }

  callback(null, layoutPath);
}
