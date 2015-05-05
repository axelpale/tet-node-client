/*jshint expr: true*/ // prevent error in ...be.a.Function
var should = require('should');
var ServerMock = require('./eyetribe-server-mock');
var GazeApiConnection = require('../lib/GazeApiConnection');

describe('GazeApiConnection', function () {

  var gazecon;

  beforeEach(function () {
    gazecon = new GazeApiConnection();
  });

  describe('#connect()', function () {
    it('should be a function', function () {
      gazecon.should.have.property('connect');
      (gazecon.connect).should.be.a.Function;
    });
  });

});
