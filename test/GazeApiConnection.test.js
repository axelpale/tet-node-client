/*jshint expr: true*/ // prevent error in ...be.a.Function
var should = require('should');
var ServerMock = require('./eyetribe-server-mock');
var GazeApiConnection = require('../lib/GazeApiConnection');

describe('GazeApiConnection', function () {

  var gazecon, servermock;

  beforeEach(function (done) {
    servermock = new ServerMock(6555, function () {
      done();
    });
  });

  afterEach(function (done) {
    servermock.close(function (err) {
      if (err) { console.error(err); throw err; }
      done();
    });
  });

  describe('#connect()', function () {

    it('should be a function', function () {
      gazecon = new GazeApiConnection();
      gazecon.should.have.property('connect');
      (gazecon.connect).should.be.a.Function;
    });

    it('should establish a connection with the server', function (done) {
      servermock.getNumConnections(function (numConnections) {
        numConnections.should.equal(0);
        gazecon.connect('localhost', 6555, function (isConnected) {
          isConnected.should.be.True;
          servermock.getNumConnections(function (numConnections) {
            numConnections.should.equal(1);
            done();
          });
        });
      });
    });

  });

});
