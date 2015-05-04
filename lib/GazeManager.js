var GazeManager = function () {

};

module.exports = GazeManager;
var proto = GazeManager.prototype;


proto.activate = function (options, onConnectionStateChange) {
  // Options
  //   version, default '1.0'
  //   clientMode, default 'push'
  //   hostname, default 'localhost'
  //   portnumber, default 6555

};

proto.deactivate = function () {

};

proto.isActivated = function () {

};

proto.isCalibrating = function () {

};

proto.isCalibrated = function () {

};

proto.getScreen = function () {
  return {
    index: 0,
    resolutionWidth: 0,
    resolutionHeight: 0,
    physicalWidth: 0,
    physicalHeight: 0
  };
};

proto.getTrackerState = function () {

};

proto.getHeartbeatMillis = function () {

};

proto.getLastCalibrationResult = function () {

};

proto.getFrameRate = function () {

};

proto.getVersion = function () {

};

proto.getClientMode = function () {

};

proto.calibrationStart = function (numPoints, handlers) {

};

proto.calibrationPointStart = function (x, y) {

};

proto.calibrationPointEnd = function () {

};

proto.calibrationAbort = function () {

};

proto.calibrationClear = function () {

};

proto.switchScreen = function (screen) {

};

proto.on = function (eventName, eventHandler) {
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
proto.addListener = proto.on;

proto.off = function (eventName) {

};
proto.removeListener = proto.off;

proto.clearListeners = function () {
  this.off();
};
