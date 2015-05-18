var fs = require('fs');
var path = require('path');
var handlebars = require('handlebars');

exports.handlebars = handlebars;

exports.__express = function(filePath, options, callback) {
  renderFile(filePath, options, function(err, rendered) {
    if (err) return callback(err);
    options.body = rendered;
    readLayout(filePath, options, function(err, layoutContent) {
      if (err) return callback(err);
      renderContent(layoutContent, options, callback);
    });
  });
}

function readLayout(filePath, options, callback) {
  resolveLayout(filePath, options, function(err, layoutPath) {
    if (err) return callback(err);

    if (!layoutPath) {
      return callback(null, '{{{body}}}');
    }

    fs.readFile(layoutPath, 'utf8', function(err, layoutContent) {
      if (err) return callback(err);
      callback(null, layoutContent);
    });
  });
}

function resolveLayout(filePath, options, callback) {
  var layoutPath
  var extension = path.extname(filePath);
  var layoutPattern = /{{!<\s+([A-Za-z0-9\._\-\/]+)\s*}}/;

  fs.readFile(filePath, 'utf8', function(err, fileContent) {
    if (err) return callback(err);
    var matches = fileContent.match(layoutPattern);
    if (matches) {
      var layout = matches[1];
      layoutPath = path.resolve(options.settings.views, layout);
      return callback(null, fixExtension(layoutPath));
    } else if (options.layout) {
      layoutPath = path.resolve(options.settings.views, options.layout);
      return callback(null, fixExtension(layoutPath));
    }
    callback(null, null);
  });

  function fixExtension(layoutPath) {
    if (layoutPath && !path.extname(layoutPath)) {
      layoutPath += extension;
    }

    return layoutPath;
  }
}

function renderFile(filePath, options, callback) {
  fs.readFile(filePath, 'utf8', function(err, content) {
    if (err) return callback(err);
    renderContent(content, options, callback);
  });
}

function renderContent(content, options, callback) {
  var rendered;

  compileContent(content, function(err, template) {
    if (err) return callback(err);

    try {
      rendered = template(options, { data: options.data });
    } catch(err) {
      return callback(err);
    }

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
