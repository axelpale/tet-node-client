/*jshint expr: true*/ // prevent error in ...be.a.Function
var should = require('should');
var ServerMock = require('./ServerMock');
var GazeResponseManager = require('../lib/GazeResponseManager');

var HOST = 'localhost';
var PORT = 6555;
var NOOP = function () {};

describe('GazeResponseManager', function () {

  var resman, servermock;
  var connectionChangeHandler = NOOP;

  beforeEach(function (done) {
    resman = new GazeResponseManager(function (isConnected) {
      connectionChangeHandler(isConnected);
    });
    servermock = new ServerMock(PORT, function onListen() {
      done();
    });
  });

  afterEach(function (done) {
    connectionChangeHandler = NOOP;
    resman.close(function () {
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
        resman.connect(HOST, PORT);
      });
    });

  });

  describe('#close', function () {
    it('should close the connection to the server', function (done) {

      resman.connect(HOST, PORT, function (isConnected) {
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
          resman.close();
        });
      });
    });

  });

  describe('#isConnected', function () {
    it('should tell the state of connection', function (done) {
      resman.isConnected().should.be.False;
      resman.connect(HOST, PORT, function () {
        resman.isConnected().should.be.True;
        done();
      });
    });
  });

  describe('#requestSetTracker', function () {

    beforeEach(function (done) {
      resman.connect(HOST, PORT, function (isConnected) {
        isConnected.should.be.True;
        resman.isConnected().should.be.True;
        done();
      });
    });

    it('should set tracker values', function (done) {
      resman.requestSetTracker('pull', 1, function callback(err, msg) {
        (err === null).should.be.True;
        msg.should.be.eql({
          'category': 'tracker',
          'request': 'set',
          'statuscode': 200
        });
        done();
      });
    });
  });

});
