var assert = require('chai').assert;
var request = require('request');
var app = require('./app');

describe('variables', function() {

  before(function(done) {
    server = app.listen(3000, function() {
      done();
    });
  });

  it('should interpolate local variables passed as render options', function(done) {
    request('http://localhost:3000/', function(err, res, body) {
      assert.include(body, 'Home');
      done();
    });
  });

  it('should interpolate global variables', function(done) {
    request('http://localhost:3000/globals', function(err, res, body) {
      assert.include(body, 'Global');
      done();
    });
  });

  it('should interpolate local variables in layout', function(done) {
    request('http://localhost:3000/local-layout', function(err, res, body) {
      assert.include(body, 'Default');
      assert.include(body, 'Home');
      done();
    });
  });

  it('should interpolate global variables in layout', function(done) {
    request('http://localhost:3000/global-layout', function(err, res, body) {
      assert.include(body, 'Page');
      assert.include(body, 'Home');
      done();
    });
  });

  after(function(done) {
    server.close(function() {
      done();
    });
  });

});
