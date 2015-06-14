var assert = require('chai').assert;
var request = require('request');
var app = require('./app');

describe('layouts (nested)', function() {
  it('should support nested layouts specified as a render option', function(done) {

    var server = app.listen(3000, function() {
      request('http://localhost:3000/', function(err, res, body) {
        assert.include(body, 'Default');
        assert.include(body, 'Page');
        assert.include(body, 'Home');
        server.close();
      });
    })

    server.on('close', function() {
      done();
    });

  });

  it('should work with another page with same render options', function(done) {

    var server = app.listen(3000, function() {
      request('http://localhost:3000/another', function(err, res, body) {
        assert.include(body, 'Default');
        assert.include(body, 'Page');
        assert.include(body, 'Home');
        server.close();
      });
    })

    server.on('close', function() {
      done();
    });

  });

  it('should support nested layouts specified as inline comment', function(done) {

    var server = app.listen(3000, function() {
      request('http://localhost:3000/inline', function(err, res, body) {
        assert.include(body, 'Default');
        assert.include(body, 'Page');
        assert.include(body, 'Home');
        server.close();
      });
    })

    server.on('close', function() {
      done();
    });

  });

  it('should support deep nested layouts', function(done) {

    var server = app.listen(3000, function() {
      request('http://localhost:3000/deep', function(err, res, body) {
        assert.include(body, 'Default');
        assert.include(body, 'Page');
        assert.include(body, 'Post');
        assert.include(body, 'Home');
        server.close();
      });
    })

    server.on('close', function() {
      done();
    });

  });
});
