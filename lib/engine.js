function attach(exphbs) {
  exphbs.engine = engine.bind(exphbs);
};

function engine(filePath, options, callback) {
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
