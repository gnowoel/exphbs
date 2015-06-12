var path = require('path');
var express = require('express');
var app = express();

app.engine('hbs', require('../../..'));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function(req, res) {
  res.render('index', {
    layout: 'layout'
  });
});

app.get('/extension', function(req, res) {
  res.render('index', {
    layout: 'layout.hbs'
  });
});

app.get('/directory', function(req, res) {
  res.render('index', {
    layout: 'layouts/page'
  });
});

app.get('/directory-extention', function(req, res) {
  res.render('index', {
    layout: 'layouts/page.hbs'
  });
});

module.exports = app;
