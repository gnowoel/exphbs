var path = require('path');
var express = require('express');
var app = express();

app.engine('hbs', require('../../..'));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function(req, res) {
  res.render('index', {
    layout: 'layouts/page'
  });
});

app.get('/another', function(req, res) {
  res.render('another', {
    layout: 'layouts/page'
  });
});

app.get('/inline', function(req, res) {
  res.render('inline');
});

app.get('/deep', function(req, res) {
  res.render('deep');
});

module.exports = app;
