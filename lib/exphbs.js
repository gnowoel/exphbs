var handlebars = require('handlebars');
var express = require('./express');
var option = require('./option');
var partial = require('./partial');
var render = require('./render');

function Exphbs() {
  if (!(this instanceof Exphbs)) {
    return new Exphbs();
  }

  this.cache = {};

  this.handlebars = handlebars.create();

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
