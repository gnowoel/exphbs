var handlebars = require('handlebars');
var option = require('./option');
var render = require('./render');
var partial = require('./partial');

var prepareOptions = option.prepareOptions;
var render = render.render;
var registerPartials = partial.registerPartials;

exports = module.exports = __express;

exports.__express = __express;
exports.handlebars = handlebars;

function __express(filePath, options, callback) {
  options = prepareOptions(options);

  var viewPartials = options.settings['view partials'];
  var env = options.settings['env'];

  registerPartials(viewPartials, env, function(err) {
    if (err) return callback(err);

    render(filePath, options, callback);
  });
}
