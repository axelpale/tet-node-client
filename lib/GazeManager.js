var extend = require('node.extend');




/**
 * @usage new GazeManager()
 */
var GazeManager = function () {

  // Shallow copy
  var options = extend({}, DEFAULT_OPTIONS);

  var heartbeatHandler = null;
  var apiManager = null;

  var isActive = false;
  var isInitializing = false;

  // GazeApiManager listeners
  var onGazeApiResponse = function () {

  };

  var onGazeApiConnectionChanged = function () {

  };

  // Failure handlers

  var handleInitFailure = function () {
    if (heartbeatHandler.isAlive()) {
      heartbeatHandler.stop();
    }

    if (apiManager !== null) {
      apiManager.close();
    }

    if (isInitializing) {
      isInitializing = false;
      isInitialized = false;
    }
  };

  this.activate = function (options, onConnectionStateChanged) {
    // Options
    //   version, default '1.0'
    //   clientMode, default 'push'
    //   hostname, default 'localhost'
    //   portnumber, default 6555

    options = extend({
      version: '1.0',
      clientMode: 'push',
      hostname: 'localhost',
      portnumber: 6555
    }, options);

    if (typeof onConnectionStateChange === 'function') {
      this.on('connectionStateChanged', onConnectionStateChanged);
    }

    if (!this.isActivated()) {
      isInitializing = true;

      if (apiManager === null) {
        apiManager = new GazeApiManager(onGazeApiResponse,
          onGazeApiConnectionChanged);
      } else {
        apiManager.close();
      }

      apiManager.connect(options.hostname, options.portnumber);

      if (apiManager.isConnected()) {
        apiManager.requestTracker(options.clientMode, options.version);
        apiManager.requestAllStates();
      }
    }

    // timeout
    if (!isInitialized) {
      handleInitFailure();
      console.error('Error initializing GazeManager, ' +
        'is EyeTribe Server running?');
    } else {
      if (!heartbeatHandler.isAlive()) {
        heartbeatHandler.start();
      }

      isActive = true;

      // notify connection listeners
      onGazeApiConnectionStateChanged(this.isActivated());
    }
  };

  this.deactivate = function () {

  };

  /**
   * @return Is the client connected to EyeTribe Server and initialized?
   */
  this.isActivated = function () {
    return (apiManager !== null ? apiManager.isConnected() : false) && isActive;
  };

  this.isCalibrating = function () {

  };

  this.isCalibrated = function () {

  };

  this.getScreen = function () {
    return {
      index: 0,
      resolutionWidth: 0,
      resolutionHeight: 0,
      physicalWidth: 0,
      physicalHeight: 0
    };
  };

  this.getTrackerState = function () {

  };

  this.getHeartbeatMillis = function () {

  };

  this.getLastCalibrationResult = function () {

  };

  this.getFrameRate = function () {

  };

  this.getVersion = function () {

  };

  this.getClientMode = function () {

  };

  this.calibrationStart = function (numPoints, handlers) {

  };

  this.calibrationPointStart = function (x, y) {

  };

  this.calibrationPointEnd = function () {

  };

  this.calibrationAbort = function () {

  };

  this.calibrationClear = function () {

  };

  this.switchScreen = function (screen) {

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
  };
  this.addListener = this.on;

  this.off = function (eventName) {

  };
  this.removeListener = this.off;

  this.clearListeners = function () {
    this.off();
  };
};

module.exports = GazeManager;
