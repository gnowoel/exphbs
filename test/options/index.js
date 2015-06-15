var assert = require('chai').assert;
var request = require('request');
var app = require('./app');

describe('options', function() {

  before(function(done) {
    server = app.listen(3000, function() {
      done();
    });
  });

  it('should honor view options', function(done) {
    request('http://localhost:3000/', function(err, res, body) {
      assert.include(body, 'Default');
      assert.include(body, 'Home');
      done();
    });
  });

  it('should still work for a second request', function(done) {
    request('http://localhost:3000/', function(err, res, body) {
      assert.include(body, 'Default');
      assert.include(body, 'Home');
      done();
    });
  });

  it('view options have low priority', function(done) {
    request('http://localhost:3000/override', function(err, res, body) {
      assert.notInclude(body, 'Default');
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
