var handlebars = require('handlebars');
var prepareOptions = require('./option').prepareOptions;
var render = require('./render').render;
var registerPartials = require('./partial').registerPartials;

exports = module.exports = __express;

exports.__express = __express;
exports.handlebars = handlebars;

function __express(filePath, options, callback) {
  options = prepareOptions(options);

  registerPartials(options.settings['view partials'], function(err) {
    if (err) return callback(err);

    render(filePath, options, callback);
  });
}
