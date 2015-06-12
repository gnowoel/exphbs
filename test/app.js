var assert = require('chai').assert;
var request = require('request');
var path = require('path');
var express = require('express');
var app = express();

app.engine('hbs', require('..'));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function(req, res) {
  res.render('index');
});

describe('index', function() {
  it('should render `index` template', function(done) {

    var server = app.listen(3000, function() {
      request('http://localhost:3000/', function(err, res, body) {
        assert.match(body, /^Home/);
        server.close();
      });
    })

    server.on('close', function() {
      done();
    });

  });
});
