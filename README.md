# tet-node-client

A Node.js client for The Eye Tribe eye-tracker.

# Install (Not yet)

    $ npm install eyetribe

# Usage (Not yet)

    var eyetribe = require('eyetribe');
    var client = new eyetribe.Client();

    client.activate({
      host: 'localhost',
      port: 6555,
      mode: 'push',
      version: 1
    });

    client.on('gazeUpdate', function (x, y) {
      // do cool stuff
    });

# Calibration (Not yet)

    client.calibrate(numPoints, function (err, startPoint) {
    });
