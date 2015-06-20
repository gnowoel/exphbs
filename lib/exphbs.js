var engine = require('./engine');
var option = require('./option');
var partial = require('./partial');
var render = require('./render');

function Exphbs(handlebars) {
  if (!(this instanceof Exphbs)) {
    return new Exphbs();
  }

  var handlebars = handlebars || require('handlebars').create();

  this.cache = {};
  this.handlebars = handlebars;

  engine.attach(this);
  option.attach(this);
  partial.attach(this);
  render.attach(this);
}

function create() {
  var exphbs = new Exphbs();
  var engine = exphbs.engine;

  engine.handlebars = exphbs.handlebars;
  engine.__express = engine;
  engine.create = create;

  return engine;
}

module.exports = create();
