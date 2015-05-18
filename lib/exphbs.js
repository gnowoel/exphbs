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
  var extension = path.extname(filePath);
  var layoutPath = path.join(options.settings.views, options.layout);

  if (!path.extname(layoutPath)) {
    layoutPath += extension;
  }

  fs.readFile(layoutPath, 'utf8', function(err, layoutContent) {
    if (err) return callback(err);
    callback(null, layoutContent);
  });
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
