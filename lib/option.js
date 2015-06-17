function prepareOptions(options) {
  var opts = {};

  var settings = {};

  for (var key in options.settings) {
    settings[key] = options.settings[key];
  }

  var viewOptions = settings['view options'];

  if (viewOptions) {
    for (var key in viewOptions) {
      opts[key] = viewOptions[key];
    }
  }

  for (var key in options) {
    if (key !== 'settings') {
      opts[key] = options[key];
    }
  }

  delete settings['view options'];
  opts['settings'] = settings;

  opts._layout = {};

  return opts;
}

exports.prepareOptions = prepareOptions;
