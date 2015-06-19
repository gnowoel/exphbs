var handlebars = require('handlebars');
var express = require('./express');
var option = require('./option');

function Exphbs() {
  if (!(this instanceof Exphbs)) {
    return new Exphbs();
  }

  this.handlebars = handlebars.create();

  express.attach(this);
  option.attach(this);
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
