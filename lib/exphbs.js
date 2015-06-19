var express = require('./express');
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

  express.attach(this);
  option.attach(this);
  partial.attach(this);
  render.attach(this);
}

function create() {
  var exphbs = new Exphbs();
  var engine = exphbs.__express;

  engine.handlebars = exphbs.handlebars;
  engine.__express = engine;
  engine.create = create;

  return engine;
}

var engine = create();

module.exports = engine;
