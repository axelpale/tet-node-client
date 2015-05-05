var GazeApiManager = function (onGazeApiResponse, onGazeApiConnectionChanged) {

  this.requestTracker = function (clientMode, apiVersion) {

  };

  this.requestAllStates = function () {

  };

  this.requestCalibrationStates = function () {

  };

  this.requestScreenStates = function () {

  };

  this.requestTrackerState = function () {

  };

  this.requestHeartbeat = function () {

  };

  this.requestCalibrationStart = function (pointcount) {

  };

  this.requestCalibrationPointStart = function (x, y) {

  };

  this.requestCalibrationPointEnd = function () {

  };

  this.requestCalibrationAbort = function () {

  };

  this.requestCalibrationClear = function () {

  };

  this.requestScreenSwitch = function () {

  };

  this.connect = function (host, port) {
    if (this.isConnected()) {
      this.close();
    }

    return false;
  };

  this.close = function () {

  };

  this.isConnected = function () {
    return false;
  };

};

module.exports = GazeApiManager;
