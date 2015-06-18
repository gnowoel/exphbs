var fs = require('fs');
var path = require('path');
var handlebars = require('handlebars');
var glob = require('glob');

function registerPartials(base, callback) {
  glob(base + '/**/*.{hbs,html}', function(err, matches) {
    if (err) return callback(err);

    var wait = matches.length;

    if (!wait) return callback();

    matches.forEach(function(match) {
      var name = match;

      name = name.replace(new RegExp('^' + base + '/'), '');
      name = name.replace(new RegExp(path.extname(match) + '$'), '');

      registerPartial(name, match, function(err) {
        if (err) return callback(err);

        wait--;
        done();
      });
    });

    function done() {
      if (!wait) {
        callback();
      }
    }
  });
}

function registerPartial(name, path, callback) {
  try {
    Object.defineProperty(handlebars.partials, name, {
      value: function() {
        return fs.readFileSync(path, 'utf8');
      },
      writable: true,
      enumerable: true,
      configurable: true
    });
  } catch (err) {
    return callback(err);
  }

  callback();
}

exports.registerPartials = registerPartials;
