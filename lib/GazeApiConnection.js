var net = require('net');
var utils = require('./utils');
var rawDataToMessages = utils.rawDataToMessages;
var messageToRawData = utils.messageToRawData;

/**
 * Purpose of GazeApiConnection is to abstract connection and message logic.
 * GazeApiConnection does not consider the protocol; it understands things
 * only as incoming and outgoing message objects.
 *
 * @param onResponse function (Object message)
 * @param onConnectionStateChanged function (bool isConnected)
 */
var GazeApiConnection = function (onResponse, onConnectionStateChanged) {

  var NOOP = function () {};
  if (typeof onResponse !== 'function') { onResponse = NOOP; }
  if (typeof onConnectionStateChanged !== 'function') {
    onConnectionStateChanged = NOOP;
  }

  var socket = null;
  var isConnected = false;

  /**
   * @param host
   * @param port
   * @param {function} onConnect - function (bool isConnected)
   */
  this.connect = function (host, port, onConnect) {
    if (typeof onConnect === 'undefined') { onConnect = NOOP; }

    var initConnection = function () {

      // Has onConnect callback been called.
      var isOnConnectCalled = false;

      socket = net.connect({ip: host, port: port}, function connected() {
        isConnected = true;
        onConnectionStateChanged(true);
        if (!isOnConnectCalled) {
          isOnConnectCalled = true;
          onConnect(true);
        }
      });

      socket.setEncoding('utf8');

      socket.on('data', function (rawData) {
        var msgs;

        try {
          msgs = rawDataToMessages(rawData);
        } catch (e) {
          console.log('Malformed JSON', e, rawData);
          return;
        }

        msgs.forEach(function (msg) {
          onResponse(msg);
        });
      });

      socket.on('error', function (err) {
        console.error('GazeApiConnection:', err);
        isConnected = false;
        socket.destroy();
        onConnectionStateChanged(false);
        if (!isOnConnectCalled) {
          isOnConnectCalled = true;
          onConnect(false);
        }
      });

      socket.on('close', function (hadError) {
        if (hadError) {
          console.error('GazeApiConnection: close error');
        }
        isConnected = false;
        onConnectionStateChanged(false);
        if (!isOnConnectCalled) {
          isOnConnectCalled = true;
          onConnect(false);
        }
      });
    };

    if (this.isConnected()) {
      this.close(initConnection);
    } else {
      initConnection();
    }

  };

  /**
   * @param {function} onClosed - function ()
   */
  this.close = function (onClosed) {
    if (typeof onClosed === 'undefined') { onClosed = NOOP; }

    if (this.isConnected()) {
      socket.on('close', function (hadError) {
        // - Ignore hadError because user wants socket to be closed anyway.
        // - Note that default close handler will be also fired.
        isConnected = false; // to ensure consistent state for onClosed
        onClosed();
      });
      socket.end(); // closes the socket
    } else {
      onClosed();
    }
  };

  this.isConnected = function () {
    return (socket !== null) && isConnected;
  };

  /**
   * @param {object} message
   */
  this.sendRequest = function (message) {
    if (this.isConnected()) {
      socket.write(messageToRawData(message));
    } else {
      // do nothing
    }
  };
};

module.exports = GazeApiConnection;
