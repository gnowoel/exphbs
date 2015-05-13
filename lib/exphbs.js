var fs = require('fs');
var path = require('path');
var handlebars = require('handlebars');

exports.handlebars = handlebars;

exports.__express = function(filePath, options, callback) {
  if (!options.layout) {
    return renderFile(filePath, options, callback);
  }

  var extension = path.extname(filePath);
  var layoutPath = path.join(options.settings.views, options.layout);

  if (!path.extname(layoutPath)) {
    layoutPath += extension;
  }

  renderFileWithLayout(layoutPath, filePath, options, callback);
}

function renderFile(filePath, options, callback) {
  fs.readFile(filePath, 'utf8', function(err, content) {
    if (err) return callback(err);
    var template = handlebars.compile(content);
    var rendered = template(options, { data: options.data });
    return callback(null, rendered);
  });
}

function renderFileWithLayout(layoutPath, filePath, options, callback) {
  renderFile(filePath, options, function(err, str) {
    if (err) return callback(err);
    options.body = str;
    renderFile(layoutPath, options, callback);
  });
}
