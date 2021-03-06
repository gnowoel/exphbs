var path = require('path');
var express = require('express');
var exphbs = require('../../..');
var app = express();

app.engine('hbs', exphbs.create());
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.set('view helpers', path.join(__dirname, 'helpers'))

app.get('/', function(req, res) {
  res.render('index', {
    google: {
      url: 'http://www.google.com/',
      text: 'Google'
    }
  });
});

module.exports = app;
