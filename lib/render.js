var fs = require('fs');
var path = require('path');

function attach(Exphbs) {
  Exphbs.prototype.render = render;
  Exphbs.prototype.createFile = createFile;
  // Exphbs.prototype.renderFile = renderFile;
  Exphbs.prototype.compileContent = compileContent;
  // Exphbs.prototype.executeTemplate = executeTemplate;
  // Exphbs.prototype.findLayout = findLayout;
}

function render(filePath, options, callback) {
  var self = this;

  self.createFile(filePath, options, function(err, file) {
    if (err) return callback(err);

    renderFile(file, options, function(err, rendered) {
      if (err) return callback(err);

      findLayout(file, options, function(err, layoutPath) {
        if (err) return callback(err);

        if (layoutPath) {
          if (options._layout[layoutPath]) {
            return callback(
              new Error('Layouts are circular referenced')
            );
          }

          options._layout[layoutPath] = true;

          options.body = rendered;

          self.render(layoutPath, options, callback);
        } else {
          callback(null, rendered);
        }
      });
    });
  });
}

function createFile(filePath, options, callback) {
  var self = this;

  if (self.cache[filePath]) {
    return callback(null, self.cache[filePath]);
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

    self.compileContent(content, function(err, template) {
      if (err) return callback(err);

      file.template = template;

      if (options.cache) {
        self.cache[filePath] = file;
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
  var self = this;

  var template;

  try {
    template = self.handlebars.compile(content);
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
  }

  delete options.layout;

  var layoutPath;

  if (name) {
    var viewPath = options.settings.views;
    var extname = path.extname(file.path);

    name = path.extname(name) ? name : name + extname;
    layoutPath = path.resolve(viewPath, name);
  }

  callback(null, layoutPath);
}

exports.attach = attach;
