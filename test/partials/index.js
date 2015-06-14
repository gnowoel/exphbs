var assert = require('chai').assert;
var request = require('request');
var app = require('./app');

describe('partials', function() {

  before(function(done) {
    server = app.listen(3000, function() {
      done();
    });
  });

  it('can register Handlebars partials', function(done) {
    request('http://localhost:3000/', function(err, res, body) {
      assert.include(body, 'Header');
      assert.include(body, 'Footer');
      done();
    });
  });

  after(function(done) {
    server.close(function() {
      done();
    });
  });

});
