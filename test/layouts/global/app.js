var path = require('path');
var express = require('express');
var app = express();

app.engine('hbs', require('../../..'));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.locals.layout = 'layout';

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/overridden', function(req, res) {
  res.render('index', {
    layout: 'layouts/page.hbs'
  });
});

module.exports = app;
