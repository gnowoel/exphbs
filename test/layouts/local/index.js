var assert = require('chai').assert;
var request = require('request');
var app = require('./app');

describe('layouts (local)', function() {
  it('can use layout file passed as a render option', function(done) {

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

  it('can use layout file with extension', function(done) {

    var server = app.listen(3000, function() {
      request('http://localhost:3000/extension', function(err, res, body) {
        assert.include(body, 'Default');
        assert.include(body, 'Home');
        server.close();
      });
    })

    server.on('close', function() {
      done();
    });

  });

  it('can use layout file under a directory', function(done) {

    var server = app.listen(3000, function() {
      request('http://localhost:3000/directory', function(err, res, body) {
        assert.include(body, 'Page');
        assert.include(body, 'Home');
        server.close();
      });
    })

    server.on('close', function() {
      done();
    });

  });

  it('can use layout file under a directory with extention', function(done) {

    var server = app.listen(3000, function() {
      request('http://localhost:3000/directory-extention', function(err, res, body) {
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
