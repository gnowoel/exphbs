var assert = require('chai').assert;
var request = require('request');
var app = require('./app');

describe('render', function() {
  it('should render a Handlebars template', function(done) {

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
});
