var path = require('path');
var express = require('express');
var app = express();

app.engine('hbs', require('../..'));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.locals.data = {
  title: 'Global',
  page: 'Page'
}

app.get('/', function(req, res) {
  res.render('index', {
    title: 'Home'
  });
});

app.get('/globals', function(req, res) {
  res.render('globals');
});

app.get('/local-layout', function(req, res) {
  res.render('local-layout', {
    layout: 'layouts/page',
    default: 'Default',
  });
});

app.get('/global-layout', function(req, res) {
  res.render('global-layout');
});

module.exports = app;
