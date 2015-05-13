var protocol = require('../../lib/protocol');
var _ = require('lodash');

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

  this.set = function (obj) {
    // See valid keys to set http://dev.theeyetribe.com/api/#cat_tracker
    var validSubset = _.pick(obj, [
      protocol.TRACKER_SCREEN_INDEX,
      protocol.TRACKER_SCREEN_RESOLUTION_WIDTH,
      protocol.TRACKER_SCREEN_RESOLUTION_HEIGHT,
      protocol.TRACKER_SCREEN_PHYSICAL_WIDTH,
      protocol.TRACKER_SCREEN_PHYSICAL_HEIGHT,
      protocol.TRACKER_VERSION,
      protocol.TRACKER_MODE_PUSH
    ]);

    // Value validation here...

    // Assign new values ("extend")
    _.assign(state, validSubset);
  };
};

module.exports = Tracker;
