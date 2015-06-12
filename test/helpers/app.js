var path = require('path');
var express = require('express');
var helpers = require('./helpers');
var app = express();

app.engine('hbs', require('../..'));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function(req, res) {
  res.render('index', {
    google: {
      url: 'http://www.google.com/',
      text: 'Google'
    }
  });
});

module.exports = app;
