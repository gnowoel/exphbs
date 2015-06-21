var path = require('path');
var glob = require('glob');

function attach(Exphbs) {
  Exphbs.prototype.registerHelpers = registerHelpers;
}

function registerHelpers(helpersPath, callback) {
  var self = this;

  glob(helpersPath + '/*.js', function(err, matches) {
    if (err) return callback(err);

    matches.forEach(function(match) {
      match = path.relative(__dirname, match);
      match = match.replace(new RegExp(path.extname(match) + '$'), '');

      require(match);
    });

    callback();
  });
}

exports.attach = attach;
