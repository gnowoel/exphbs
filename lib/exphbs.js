var handlebars = require('handlebars');
var option = require('./option');
var render = require('./render');
var partial = require('./partial');

var prepareOptions = option.prepareOptions;
var render = render.render;
var registerPartials = partial.registerPartials;


function Exphbs() {
  if (!(this instanceof Exphbs)) {
    return new Exphbs();
  }

  this.handlebars = handlebars.create();
  this.__express = __express.bind(this);
}

function __express(filePath, options, callback) {
  options = prepareOptions(options);

  var viewPartials = options.settings['view partials'];
  var env = options.settings['env'];

  registerPartials(viewPartials, env, function(err) {
    if (err) return callback(err);

    render(filePath, options, callback);
  });
}

var exphbs = new Exphbs();

exports = module.exports = exphbs.__express;

exports.__express = exphbs.__express;
exports.handlebars = exphbs.handlebars;

exports.create = function() {
  var exphbs = new Exphbs();
  var instance = exphbs.__express;

  instance.__express = exphbs.__express;
  instance.handlebars = exphbs.handlebars;

  return instance;
};
