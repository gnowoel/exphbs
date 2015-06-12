var exphbs = require('../..');
var handlebars = exphbs.handlebars;

handlebars.registerHelper('link', function(object) {
  var url = handlebars.escapeExpression(object.url);
  var text = handlebars.escapeExpression(object.text);

  return new handlebars.SafeString(
    '<a href="' + url + '">' + text + '</a>'
  );
});
