var render = require('./render');
var partial = require('./partial');

var render = render.render;
var registerPartials = partial.registerPartials;

function attach(exphbs) {
  exphbs.__express = __express.bind(exphbs);
};

function __express(filePath, options, callback) {
  options = this.prepareOptions(options);

  var viewPartials = options.settings['view partials'];
  var env = options.settings['env'];

  registerPartials(viewPartials, env, function(err) {
    if (err) return callback(err);

    render(filePath, options, callback);
  });
}

exports.attach = attach;
