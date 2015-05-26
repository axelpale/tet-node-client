/*jshint expr: true*/ // prevent error in ...be.a.Function
var should = require('should');
var ServerMock = require('./ServerMock');
var GazeManager = require('../lib/GazeManager');

var HOST = 'localhost';
var PORT = 6555;
var NOOP = function () {};

describe('GazeManager', function () {

  var gazman, servermock;

  beforeEach(function (done) {
    gazman = new GazeManager();
    servermock = new ServerMock(PORT, function onListen() {
      done();
    });
  });

  afterEach(function (done) {
    gazman.deactivate(function () {
      servermock.close(function (err) {
        if (err) { console.error(err); throw err; }
        done();
      });
    });
  });

  describe('#activate #deactivate #isActivated', function () {

    it('should open and close a connection with the server', function (done) {
      gazman.activate({ port: PORT }, function (err) {
        should(err).be.exactly(null);
        gazman.isActivated().should.equal(true);

        servermock.getNumConnections(function (num) {
          num.should.equal(1);

          gazman.deactivate(function () {
            gazman.isActivated().should.equal(false);

            servermock.getNumConnections(function (num) {
              num.should.equal(0);
              done();
            });
          });
        });
      });
    });

  });

  describe('#on:gazeUpdate', function () {

    beforeEach(function (done) {
      gazman.activate({ port: PORT, clientMode: 'push' }, function (err) {
        should(err).be.exactly(null);
        done();
      });
    });

    it('should tell frame values', function (done) {
      gazman.on('gazeUpdate', function (frame) {
        frame.should.have.properties('raw', 'avg');
        done();
      });
    });
  });

  describe('#getTrackerState', function () {
    it('should get the state', function (done) {
      gazman.activate({ port: PORT, clientMode: 'push' }, function () {
        gazman.getTrackerState(function (err, trackerState) {
          should(err).equal(null);
          trackerState.should.be.Number;
          done();
        });
      });
    });
  });

  describe('#getScreen', function () {
    it('should return a screen object', function (done) {
      gazman.activate({ port: PORT }, function () {
        gazman.getScreen(function (err, screen) {
          should(err).equal(null);
          screen.should.have.properties('index', 'resolution', 'physical');
          done();
        });
      });
    });
  });

});
