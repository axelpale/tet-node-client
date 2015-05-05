/**
 * For the unit tests a mock of The Eye Tribe server is required.
 */
var net = require('net');

var ServerMock = function (port, onListening) {
  var server, host;

  // Defaults
  var DEFAULT_HOST = 'localhost';
  var DEFAULT_PORT = 6555;
  var NOOP = function () {};
  if (typeof port === 'function') { onListening = port; port = DEFAULT_PORT; }
  if (typeof port !== 'number') { port = DEFAULT_PORT; }
  if (typeof onListening !== 'function') { onListening = NOOP; }
  host = DEFAULT_HOST;

  server = net.createServer(function (socket) {
    // socket.end('Hello and bye');
  });

  server.on('error', function (err) {
    if (err.code == 'EADDRINUSE') {
      console.log('Address in use, retrying...');
      setTimeout(function () {
        server.close();
        server.listen(port, host);
      }, 1000);
    } else {
      console.error('Unknown server error', err);
    }
  });

  server.listen(port, function () {
    onListening();
    console.log('The Eye Tribe Tracker Server listening port ' + port);
  });

  this.getNumConnections = function (callback) {
    server.getConnections(function (err, num) {
      if (err) { console.error(err); callback(null); return; }
      callback(num);
    });
  };

  this.close = function (onClosed) {
    server.close(onClosed);
  };
};

module.exports = ServerMock;
