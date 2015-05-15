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

Get tracker values asynchronously:

    client.activate({...}, function (err) {
      if (err) { console.error('Connection failed.'); return; }

      client.getScreen(function (err, screen) {
        if (err) { console.error(err); return; }

        console.log(screen.index); // 1
        console.log(screen.resolution.width); // 1920 (px)
        console.log(screen.resolution.height); // 1080
        console.log(screen.physical.width); // 0.29 (m)
        console.log(screen.physical.height); // 0.18
      });
    });



# Calibration (Not yet)

    client.calibrate({
      numPoints: 20,
      beforePoint: function (err, index, start, abort) {
        // Here, decide the point location and draw a point to focus to.
        ...

        // Tell tracker the point location and start measuring.
        setTimeout(function () {
          start(x, y);
        }, 1000);
      },
      startPoint: function (err, index, end, abort) {
        // Determine how long the measuring lasts and do possible some
        // graphical effects to keep eyes fixed to the point.
        ...

        // Tell tracker to end measuring.
        setTimeout(function () {
          end();
        }, 1000);
      },
      afterPoint: function (err, index, then, abort) {
        // Here, remove the old point
        ...

        // Begin a new measure or jump to results if was last.
        setTimeout(then, 1000);
      },
      afterCalibration: function (err, calibrationResults) {

      }
    });



# Versioning

[Semantic Versioning 2.0.0](http://semver.org/)



# License

[MIT License](../blob/master/LICENSE)
