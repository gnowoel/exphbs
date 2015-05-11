var fs = require('fs');

var ExpHbs = function() {
};

ExpHbs.prototype.__express = function(filePath, options, callback) {
  fs.readFile(filePath, function(err, content) {
    if (err) return callback(new Error(err));
    var rendered = content.toString();
    return callback(null, rendered);
  });
};

module.exports = new ExpHbs();
