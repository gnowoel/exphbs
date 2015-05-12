var fs = require('fs');
var path = require('path');
var handlebars = require('handlebars');

var ExpHbs = function() {
  this.handlebars = handlebars;
};

ExpHbs.prototype.__express = function(filePath, options, callback) {
  function render(filePath, options, callback) {
    fs.readFile(filePath, 'utf8', function(err, content) {
      if (err) return callback(new Error(err));
      var template = handlebars.compile(content);
      var rendered = template(options);
      return callback(null, rendered);
    });
  }

  function render_with_layout(filePath, options, callback) {
    render(filePath, options, function(err, body) {
      if (err) return callback(err);
      options.body = body;
      render(options.layout, options, callback);
    });
  }

  var extension = path.extname(filePath);

  if (options.layout) {
    options.layout = path.join(options.settings.views, options.layout);
    if (!path.extname(options.layout)) {
      options.layout += extension;
    }
    render_with_layout(filePath, options, callback);
  } else {
    render(filePath, options, callback);
  }
};

module.exports = new ExpHbs();
