var protocol = require('../../lib/protocol');

/**
 * Mock of the tracker device
 */

var Tracker = function () {

  var state = {
    push: false,
    heartbeatinterval: protocol.DEFAULT_HEARTBEAT_INTERVAL,
    version: protocol.VERSION,
    trackerstate: protocol.TRACKER_NOT_CONNECTED,
    framerate: 30,
    iscalibrated: false,
    iscalibrating: false,
    calibresult: {},
    frame: {},
    screenindex: 1,
    screenresw: 640,
    screenresh: 480,
    screenpsyw: 0.32,
    screenpsyh: 0.24
  };

  this.get = function (key) {
    if (state.hasOwnProperty(key)) {
      return state[key];
    }
  };
};

module.exports = Tracker;
