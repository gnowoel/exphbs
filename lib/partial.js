var fs = require('fs');
var path = require('path');
var handlebars = require('handlebars');
var glob = require('glob');

var registered = false;
var paths = {};

function registerPartials(base, env, callback) {
  if (env === 'production' && registered === true) {
    return callback();
  }

  glob(base + '/**/*.{hbs,html}', function(err, matches) {
    if (err) return callback(err);

    var wait = matches.length;

    if (!wait) return callback();

    Object.keys(paths).forEach(function(key) {
      if (matches.indexOf(key) < 0) {
        var name = paths[key];

        unregisterPartial(name);
        delete paths[key];
      }
    });

    matches.forEach(function(match) {
      var name = match;

      name = name.replace(new RegExp('^' + base + '/'), '');
      name = name.replace(new RegExp(path.extname(match) + '$'), '');

      registerPartial(name, match, env, function(err) {
        if (err) return callback(err);

        wait--;
        done();
      });
    });

    function done() {
      if (!wait) {
        registered = true;
        callback();
      }
    }
  });
}

function unregisterPartial(name) {
  handlebars.unregisterPartial(name);
}

function registerPartial(name, path, env, callback) {
  if (env === 'production') {
    registerPartialProduction(name, path, callback);
  } else {
    registerPartialDevelopment(name, path, callback);
  }
}

function registerPartialDevelopment(name, path, callback) {
  fs.readFile(path, 'utf8', function(err, content) {
    if (err) return callback(err);

    try {
      handlebars.registerPartial(name, content);
    } catch(err) {
      return callback(err);
    }

    paths[path] = name;

    callback();
  });
}

function registerPartialProduction(name, path, callback) {
  fs.readFile(path, 'utf8', function(err, content) {
    if (err) return callback(err);

    var compiled;

    try {
      compiled = handlebars.compile(content);

      handlebars.registerPartial(name, compiled);
    } catch(err) {
      return callback(err);
    }

    callback();
  });
}

exports.registerPartials = registerPartials;
