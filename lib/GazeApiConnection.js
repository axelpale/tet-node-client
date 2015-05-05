var net = require('net');

/**
 * @return {message[]} Array of message objects.
 * @throws on malformed JSON
 */
var rawDataToMessages = function (rawData) {
  // Is is possible that data includes two or more json objects,
  // apparently separated by a newline.

  // Split newlines OS independent way.
  // See http://stackoverflow.com/a/21895354/638546
  var jsons, json, message, messages;
  messages = [];

  jsons = rawdata.split(/\r?\n/);

  while (jsons.length !== 0) {
    json = jsons.shift();

    if (json.length < 1) {
      // There has been empty newline in the end of rawdata
      continue;
    }

    try {
      message = JSON.parse(json);
    } catch (e) {
      throw e;
    }

    messages.push(message);
  }

  return messages;
};

/**
 * Purpose of GazeApiConnection is to abstract connection and message logic.
 * GazeApiConnection does not consider the protocol; it understands things
 * only as incoming and outgoing message objects.
 *
 * @param onResponse function (Object message)
 * @param onConnectionStateChanged function (bool isConnected)
 */
var GazeApiConnection = function (onResponse, onConnectionStateChanged) {

  var socket = null;
  var isConnected = false;

  this.connect = function (host, port, onConnect) {

    var initConnection = function () {
      socket = net.connect({ip: host, port: port});
      socket.setEncoding('utf8');

      socket.on('connect', function () {
        isConnected = true;
        onConnectionStateChanged(true);
      });

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
        isConnected = false;
        socket.destroy();
        onConnectionStateChanged(false);
      });

      socket.on('close', function (hadError) {
        isConnected = false;
        onConnectionStateChanged(false);
      });
    };

    if (isConnected()) {
      this.close(initConnection);
    } else {
      initConnection();
    }

  };

  this.close = function (onClosed) {
    if (socket !== null) {
      socket.on('close', function (hadError) {
        // - Ignore hadError because user wants socket to be closed anyway.
        // - Note that default close handler will be also fired.
        isConnected = false; // to ensure consistent state for onClosed
        onClosed();
      });
      socket.end();
    } else {
      onClosed();
    }
  };

  this.isConnected = function () {
    return (socket !== null) && isConnected;
  };

  this.request = function (message) {
    if (this.isConnected()) {
      socket.write(JSON.stringify(message));
    } else {
      // do nothing
    }
  };
};

module.exports = GazeApiConnection;
