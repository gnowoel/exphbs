var glob = require('glob');

function attach(Exphbs) {
  Exphbs.prototype.registerHelpers = registerHelpers;
}

function registerHelpers(base, callback) {
  glob(base + '/*.js', function(err, matches) {
    if (err) return callback(err);

    matches.forEach(function(match) {
      match = match.replace(new RegExp('^' + __dirname), '.');
      require(match);
    });

    callback();
  });
}

exports.attach = attach;
