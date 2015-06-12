var assert = require('chai').assert;
var request = require('request');
var app = require('./app');

describe('layouts (global)', function() {
  it('can use layout file specified as a global option', function(done) {

    var server = app.listen(3000, function() {
      request('http://localhost:3000/', function(err, res, body) {
        assert.include(body, 'Default');
        assert.include(body, 'Home');
        server.close();
      });
    })

    server.on('close', function() {
      done();
    });

  });

  it('should be overridden by a local layout', function(done) {

    var server = app.listen(3000, function() {
      request('http://localhost:3000/overridden', function(err, res, body) {
        assert.include(body, 'Page');
        assert.include(body, 'Home');
        server.close();
      });
    })

    server.on('close', function() {
      done();
    });

  });
});
