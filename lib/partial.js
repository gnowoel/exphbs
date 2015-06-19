var fs = require('fs');
var path = require('path');
var glob = require('glob');

function attach(exphbs) {
  exphbs.registerPartials = registerPartials;
  exphbs.unregisterPartial = unregisterPartial;
  exphbs.registerPartial = registerPartial;
  exphbs.registerPartialDevelopment = registerPartialDevelopment;
  exphbs.registerPartialProduction = registerPartialProduction;
}

function registerPartials(base, env, callback) {
  var self = this;

  if (env === 'production' && self.registered === true) {
    return callback();
  }

  glob(base + '/**/*.{hbs,html}', function(err, matches) {
    if (err) return callback(err);

    var wait = matches.length;

    if (!wait) return done();

    Object.keys(self.paths).forEach(function(key) {
      if (matches.indexOf(key) < 0) {
        var name = self.paths[key];

        self.unregisterPartial(name);
        delete self.paths[key];
      }
    });

    matches.forEach(function(match) {
      var name = match;

      name = name.replace(new RegExp('^' + base + '/'), '');
      name = name.replace(new RegExp(path.extname(match) + '$'), '');

      self.registerPartial(name, match, env, function(err) {
        if (err) return callback(err);

        wait--;
        done();
      });
    });

    function done() {
      if (!wait) {
        self.registered = true;

        return callback();
      }
    }
  });
}

function unregisterPartial(name) {
  var self = this;

  self.handlebars.unregisterPartial(name);
}

function registerPartial(name, path, env, callback) {
  var self = this;

  if (env === 'production') {
    self.registerPartialProduction(name, path, callback);
  } else {
    self.registerPartialDevelopment(name, path, callback);
  }
}

function registerPartialDevelopment(name, path, callback) {
  var self = this;

  fs.readFile(path, 'utf8', function(err, content) {
    if (err) return callback(err);

    try {
      self.handlebars.registerPartial(name, content);
    } catch(err) {
      return callback(err);
    }

    self.paths[path] = name;

    callback();
  });
}

function registerPartialProduction(name, path, callback) {
  var self = this;

  fs.readFile(path, 'utf8', function(err, content) {
    if (err) return callback(err);

    var compiled;

    try {
      compiled = self.handlebars.compile(content);

      self.handlebars.registerPartial(name, compiled);
    } catch(err) {
      return callback(err);
    }

    callback();
  });
}

exports.attach = attach;
