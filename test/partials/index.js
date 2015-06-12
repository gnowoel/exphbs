var assert = require('chai').assert;
var request = require('request');
var app = require('./app');

describe('partials', function() {
  it('can register Handlebars partials', function(done) {

    var server = app.listen(3000, function() {
      request('http://localhost:3000/', function(err, res, body) {
        assert.include(body, 'Header');
        assert.include(body, 'Footer');
        server.close();
      });
    })

    server.on('close', function() {
      done();
    });

  });
});
