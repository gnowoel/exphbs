var path = require('path');
var express = require('express');
var app = express();

app.engine('hbs', require('../..'));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.set('view options', {
  layout: 'layout'
});

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/override', function(req, res) {
  res.render('override', {
    layout: false
  });
});

module.exports = app;
