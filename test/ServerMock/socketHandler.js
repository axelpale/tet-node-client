var utils = require('../../lib/utils');
var rawDataToMessages = utils.rawDataToMessages;
var messageToRawData = utils.messageToRawData;
var Response = require('./Response');
var Tracker = require('./Tracker');

var tracker = new Tracker();

/**
 * @param {socket} A connected socket.
 */
var socketHandler = function (socket) {

  socket.setEncoding('utf8');

  var sendResponse = function (message) {
    socket.write(messageToRawData(message));
  };

  var handleMessage = function (message) {
    var res;
    if (message.category === 'tracker') {
      if (message.request === 'get') {
        res = new Response('tracker', 'get', 200);
        message.values.forEach(function (key) {
          res.addValue(key, tracker.get(key));
        });
        sendResponse(res.getMessage());
      } else if (message.request === 'set') {
        tracker.set(message.values);
        res = new Response('tracker', 'set', 200);
        sendResponse(res.getMessage());
      }
    } else if (message.category === 'calibration') {

    } else if (message.category === 'heartbeat') {

    }
  };

  socket.on('data', function (rawData) {
    var msgs = rawDataToMessages(rawData);
    msgs.forEach(handleMessage);
  });
};

module.exports = socketHandler;
