function attach(exphbs) {
  exphbs.__express = __express.bind(exphbs);
};

function __express(filePath, options, callback) {
  var self = this;

  options = this.prepareOptions(options);

  var viewPartials = options.settings['view partials'];
  var env = options.settings['env'];

  self.registerPartials(viewPartials, env, function(err) {
    if (err) return callback(err);

    self.render(filePath, options, callback);
  });
}

exports.attach = attach;
