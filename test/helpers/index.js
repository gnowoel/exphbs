var assert = require('chai').assert;
var request = require('request');
var app = require('./app');

describe('helpers', function() {
  it('can register Handlebars helpers', function(done) {

    var server = app.listen(3000, function() {
      request('http://localhost:3000/', function(err, res, body) {
        assert.include(body, '<a href="http://www.google.com/">Google</a>');
        server.close();
      });
    })

    server.on('close', function() {
      done();
    });

  });
});
