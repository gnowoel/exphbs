var assert = require('chai').assert;
var request = require('request');
var app = require('./app');

describe('variables', function() {
  it('should interpolate local variables passed as render options', function(done) {

    var server = app.listen(3000, function() {
      request('http://localhost:3000/', function(err, res, body) {
        assert.include(body, 'Home');
        server.close();
      });
    })

    server.on('close', function() {
      done();
    });

  });

  it('should interpolate global variables', function(done) {

    var server = app.listen(3000, function() {
      request('http://localhost:3000/globals', function(err, res, body) {
        assert.include(body, 'Global');
        server.close();
      });
    })

    server.on('close', function() {
      done();
    });

  });

  it('should interpolate local variables in layout', function(done) {

    var server = app.listen(3000, function() {
      request('http://localhost:3000/local-layout', function(err, res, body) {
        assert.include(body, 'Default');
        assert.include(body, 'Home');
        server.close();
      });
    })

    server.on('close', function() {
      done();
    });

  });

  it('should interpolate global variables in layout', function(done) {

    var server = app.listen(3000, function() {
      request('http://localhost:3000/global-layout', function(err, res, body) {
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
