/*jshint expr: true*/ // prevent error in ...be.a.Function
var should = require('should');
var ServerMock = require('./ServerMock');
var GazeApiConnection = require('../lib/GazeApiConnection');

var HOST = 'localhost';
var PORT = 6555;
var NOOP = function () {};

describe('GazeApiConnection', function () {

  var gazecon, servermock;

  // Tests can listen responses by assigning a function into responseHandler.
  //   responseHandler = function (msg) { ... };
  // The value of responseHandler is reseted before each test.
  var responseHandler = NOOP;

  beforeEach(function (done) {
    responseHandler = NOOP;
    gazecon = new GazeApiConnection(function onResponse(msg) {
      responseHandler(msg);
    });
    servermock = new ServerMock(PORT, function onListen() {
      done();
    });
  });

  afterEach(function (done) {
    gazecon.close(function () {
      servermock.close(function (err) {
        if (err) { console.error(err); throw err; }
        done();
      });
    });
  });

  describe('#connect', function () {

    it('should be a function', function () {
      gazecon.should.have.property('connect');
      (gazecon.connect).should.be.a.Function;
    });

    it('should establish a connection with the server', function (done) {
      servermock.getNumConnections(function (numConnections) {
        numConnections.should.equal(0);
        gazecon.connect(HOST, PORT, function (isConnected) {
          isConnected.should.be.True;
          servermock.getNumConnections(function (numConnections) {
            numConnections.should.equal(1);
            done();
          });
        });
      });
    });

  });

  describe('#close', function () {
    it('closes the connection to the server', function (done) {
      gazecon.connect(HOST, PORT, function (isConnected) {
        isConnected.should.be.True;
        servermock.getNumConnections(function (num) {
          num.should.equal(1);
          gazecon.close(function () {
            servermock.getNumConnections(function (num) {
              num.should.equal(0);
              done();
            });
          });
        });
      });
    });

    it('calls back even when there is no connection', function (done) {
      gazecon.close(function (nothing) {
        (typeof nothing === 'undefined').should.be.True;
        done();
      });
    });
  });

  describe('#isConnected', function () {
    it('should tell the state of connection', function (done) {
      gazecon.isConnected().should.be.False;
      gazecon.connect(HOST, PORT, function () {
        gazecon.isConnected().should.be.True;
        done();
      });
    });
  });

  describe('#request', function () {

    beforeEach(function (done) {
      gazecon.connect(HOST, PORT, function () {
        done();
      });
    });

    it('should send a message object', function (done) {
      var req = {
        category: 'tracker',
        request: 'get',
        values: ['version', 'push', 'framerate']
      };
      responseHandler = function (msg) {
        msg.should.be.eql({
          'category': 'tracker',
          'request': 'get',
          'statuscode': 200,
          'values': {
            'version': 1,
            'push': false,
            'framerate': 30
          }
        });
        done();
      };
      gazecon.sendRequest(req);
    });
  });

});
