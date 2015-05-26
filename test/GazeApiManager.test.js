/*jshint expr: true*/ // prevent error in ...be.a.Function
var should = require('should');
var ServerMock = require('./ServerMock');
var GazeApiManager = require('../lib/GazeApiManager');

var HOST = 'localhost';
var PORT = 6555;
var NOOP = function () {};

describe('GazeApiManager', function () {

  var apiman, servermock;

  // Tests can listen responses by assigning a function into responseHandler.
  //   responseHandler = function (msg) { ... };
  // The value of responseHandler is reseted before each test.
  var responseHandler = NOOP;
  var connectionChangeHandler = NOOP;

  beforeEach(function (done) {
    apiman = new GazeApiManager(function onResponse(msg) {
      responseHandler(msg);
    }, function onConnectionChanged(isConnected) {
      connectionChangeHandler(isConnected);
    });
    servermock = new ServerMock(PORT, function onListen() {
      done();
    });
  });

  afterEach(function (done) {
    responseHandler = NOOP;
    connectionChangeHandler = NOOP;
    apiman.close(function () {
      servermock.close(function (err) {
        if (err) { console.error(err); throw err; }
        done();
      });
    });
  });

  describe('#connect', function () {

    it('should establish a connection with the server', function (done) {

      connectionChangeHandler = function (isConnected) {
        isConnected.should.be.True;
        servermock.getNumConnections(function (num) {
          num.should.equal(1);
          done();
        });
      };

      servermock.getNumConnections(function (num) {
        num.should.equal(0);
        apiman.connect(HOST, PORT);
      });
    });

  });

  describe('#close', function () {
    it('should close the connection to the server', function (done) {

      apiman.connect(HOST, PORT, function (isConnected) {
        isConnected.should.be.True;

        connectionChangeHandler = function (isConnected) {
          isConnected.should.be.False;
          servermock.getNumConnections(function (num) {
            num.should.equal(0);
            done();
          });
        };

        servermock.getNumConnections(function (num) {
          num.should.equal(1);
          apiman.close();
        });
      });
    });

  });

  describe('#isConnected', function () {
    it('should tell the state of connection', function (done) {
      apiman.isConnected().should.be.False;
      apiman.connect(HOST, PORT, function () {
        apiman.isConnected().should.be.True;
        done();
      });
    });
  });

  describe('#requestSetTracker', function () {

    beforeEach(function (done) {
      apiman.connect(HOST, PORT, function () {
        done();
      });
    });

    it('should set tracker values', function (done) {

      responseHandler = function (msg) {
        msg.should.be.eql({
          'category': 'tracker',
          'request': 'set',
          'statuscode': 200
        });
        done();
      };
      apiman.requestSetTracker('pull', 1);
    });
  });

  describe('#requestAllStates', function () {

    beforeEach(function (done) {
      apiman.connect(HOST, PORT, function () {
        done();
      });
    });

    it('should get all state values', function (done) {

      responseHandler = function (msg) {
        msg.should.have.properties('category', 'request', 'values');
        msg.values.should.have.properties('push', 'iscalibrated', 'version');
        done();
      };
      apiman.requestAllStates();
    });
  });

});
