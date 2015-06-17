var handlebars = require('handlebars');
var prepareOptions = require('./option').prepareOptions;
var render = require('./render').render;

exports = module.exports = __express;

exports.__express = __express;
exports.handlebars = handlebars;

function __express(filePath, options, callback) {
  options = prepareOptions(options);

  render(filePath, options, callback);
}
