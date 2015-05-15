var extend = require('node.extend');
var GazeResponseManager = require('./GazeResponseManager');
var HeartbeatHandler = require('./HeartbeatHandler');


/**
 * @usage new GazeManager()
 */
var GazeManager = function () {

  var NOOP = function () {};

  // GazeResponseManager listeners
  var onConnectionChanged = NOOP;

  var api = new GazeResponseManager(function (isConnected) {
    onConnectionChanged(isConnected);
  });

  var heartbeatHandler = new HeartbeatHandler(api);

  //var isActive = false;
  //var isInitializing = false;



  // Failure handlers

  var handleConnectionFailure = function () {
    heartbeatHandler.stop();
  };

  this.activate = function (options, callback) {
    // Options
    //   version, default '1.0'
    //   clientMode, default 'push'
    //   hostname, default 'localhost'
    //   portnumber, default 6555

    options = extend({
      version: 1,
      clientMode: 'push',
      hostname: 'localhost',
      portnumber: 6555
    }, options);

    if (typeof callback !== 'function') {
      callback = NOOP;
    }

    api.connect(options.hostname, options.portnumber, function (isConnected) {
      if (!isConnected) {
        handleConnectionFailure();
        callback(new Error('Connection not established.'));
        return;
      }

      heartbeatHandler.start();

      var mode = options.clientMode;
      var vers = options.version;
      api.requestSetTracker(mode, vers, function (err, msg) {
        if (err) {
          callback(err, null);
          return;
        }
        api.requestAllStates(function (err, msg) {
          if (err) {
            callback(err, null);
            return;
          }
          callback(null);
        });
      };

    });
  };

  this.deactivate = function (callback) {
    api.close(function () {
      callback();
    });
  };

  /**
   * @return Is the client connected to EyeTribe Server and initialized?
   */
  this.isActivated = function () {
    return api.isConnected();
  };

  this.isCalibrating = function () {
    throw new Error('Not yet implemented.');
  };

  this.isCalibrated = function () {
    throw new Error('Not yet implemented.');
  };

  this.getScreen = function (callback) {
    api.requestAllStates(function (err, msg) {
      if (err) { callback(err, null); return; }
      callback(null, {
        index: msg.values.screenindex,
        resolution: {
          width: msg.values.screenresw,
          height: msg.values.screenresh
        },
        physical: {
          width: msg.values.screenpsyw,
          height: msg.values.screenpsyh
        }
      });
    });
  };

  this.getTrackerState = function (callback) {
    api.requestAllStates(function (err, msg) {
      if (err) { callback(err, null); return; }
      callback(null, msg.values.trackerstate);
    });
  };

  this.getHeartbeatInterval = function (callback) {
    api.requestAllStates(function (err, msg) {
      if (err) { callback(err, null); return; }
      callback(null, msg.values.heartbeatinterval);
    });
  };

  this.getLastCalibrationResult = function (callback) {
    api.requestAllStates(function (err, msg) {
      if (err) { callback(err, null); return; }
      callback(null, msg.values.calibresult);
    });
  };

  this.getFrameRate = function (callback) {
    api.requestAllStates(function (err, msg) {
      if (err) { callback(err, null); return; }
      callback(null, msg.values.framerate);
    });
  };

  this.getVersion = function (callback) {
    api.requestAllStates(function (err, msg) {
      if (err) { callback(err, null); return; }
      callback(null, msg.values.version);
    });
  };

  /**
   * Mode "push" or "pull"
   * @param callback(err, mode)
   */
  this.getClientMode = function (callback) {
    api.requestAllStates(function (err, msg) {
      if (err) { callback(err, null); return; }
      var mode = (msg.values.push ? 'push' : 'pull');
      callback(null, push);
    });
  };

  this.calibrate = function (options) {
    throw new Error('Not yet implemented.');
  };

  this.switchScreen = function (screenOptions, callback) {
    var s = screenOptions;
    api.requestScreenSwitch(s.index, s.resolution.width, s.resolution.height,
      s.physical.width, s.physical.height, function (err, msg) {
        if (err) { callback(err); return; }
        callback(null);
      });
  };

  this.on = function (eventName, eventHandler) {
    // Events
    //   calibrationStarted
    //   calibrationProgress
    //   calibrationProcessing
    //   calibrationResult
    //   calibrationChanged
    //   connectionStateChanged
    //   gazeUpdate
    //   trackerStateChanged
    //   screenStateChanged
    if (eventName === 'gazeUpdate') {
      api.setGazeUpdateHandler(eventHandler);
    }
  };
  this.addListener = this.on;

  this.off = function (eventName) {
    throw new Error('Not yet implemented.');
  };
  this.removeListener = this.off;

  this.clearListeners = function () {
    this.off();
  };
};

module.exports = GazeManager;
