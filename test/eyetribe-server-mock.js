/**
 * For the unit tests a mock of The Eye Tribe server is required.
 */
var net = require('net');

var ServerMock = function (port) {
  var server, host;

  // Defaults
  if (typeof port !== 'number') { port = 6555; }
  host = 'localhost';

  server = net.createServer(function (socket) {
    socket.end('Hello and bye');
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

  server.listen(port, function onListening() {
    console.log('The Eye Tribe Tracker Server listening port ' + port);
  });
};

module.exports = ServerMock;
