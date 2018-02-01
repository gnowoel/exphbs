var path = require('path');
var express = require('express');
var exphbs = require('../../..');
var app = express();

app.set('view partialsExt', 'handlebars');
app.engine('handlebars', exphbs);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function(req, res) {
  res.render('index');
});

module.exports = app;
