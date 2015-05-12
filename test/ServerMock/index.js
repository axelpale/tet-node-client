/**
 * For the unit tests a mock of The Eye Tribe server is required.
 *
 * Usage:
 *   var server = new ServerMock(port, onListen);
 *   server.getNumConnections();
 *   server.close();
 */
var net = require('net');
var connectionHandler = require('./connectionHandler');

/**
 * @param {number} port
 * @param {function} onListening
 */
var ServerMock = function (port, onListening) {

  // Settings and defaults
  var host;
  var DEFAULT_HOST = 'localhost';
  var DEFAULT_PORT = 6555;
  var NOOP = function () {};
  if (typeof port === 'function') { onListening = port; port = DEFAULT_PORT; }
  if (typeof port !== 'number') { port = DEFAULT_PORT; }
  if (typeof onListening !== 'function') { onListening = NOOP; }
  host = DEFAULT_HOST;

  // State
  var server;
  var isListening = false;

  server = net.createServer(function (socket) {
    connectionHandler(socket);
  });

  // Error handling
  // - Reconnecting until port becomes available.
  server.on('error', function (err) {
    if (err.code == 'EADDRINUSE') {
      console.log('Address in use, retrying...');
      setTimeout(function () {
        server.close();
        server.listen(port, host, function () {
          isListening = true;
        });
      }, 1000);
    } else {
      console.error('Unknown server error', err);
    }
  });

  server.listen(port, function () {
    isListening = true;
    onListening();
    //console.log('The Eye Tribe Tracker Server listening port ' + port);
  });

  // API - Connection

  // Close
  // @param onClosed function (err)
  this.close = function (onClosed) {
    server.close(onClosed);
  };


  // API - Debugging tools

  /**
   * getNumConnections
   * @param callback - function (numberOfConnections)
   */
  this.getNumConnections = function (callback) {
    if (!isListening) {
      callback(0);
    }
    server.getConnections(function (err, num) {
      if (err) { console.error(err); callback(0); return; }
      callback(num);
    });
  };

};

module.exports = ServerMock;
