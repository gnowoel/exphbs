var fs = require('fs');
var path = require('path');
var handlebars = require('handlebars');

exports.handlebars = handlebars;

exports.__express = function(path, options, callback) {
  // if (!options.layout) {
    // return renderFile(filePath, options, callback);
  // }

  // var extension = path.extname(filePath);
  // var layoutPath = path.join(options.settings.views, options.layout);

  // if (!path.extname(layoutPath)) {
    // layoutPath += extension;
  // }

  // renderFileWithLayout(layoutPath, filePath, options, callback);
  render(path, options, callback);
}

function render(path, options, callback) {
  var layoutContent = '{{{body}}}';

  renderFile(path, options, function(err, rendered) {
    if (err) return callback(err);
    options.body = rendered;
    renderContent(layoutContent, options, callback);
  });
}

function renderFile(path, options, callback) {
  fs.readFile(path, 'utf8', function(err, content) {
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

    return callback(null, rendered);
  });
}

// function compileFile(path, callback) {
  // fs.readFile(path, 'utf8', function(err, content) {
    // if (err) return callback(err);
    // compileContent(content, callback);
  // });
// }

function compileContent(content, callback) {
  var template;

  try {
    template = handlebars.compile(content);
  } catch (err) {
    return callback(err);
  }

  return callback(null, template);
}
