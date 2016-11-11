var tmi = require('tmi.js');

/** createClient
 * returns a twitch chat irc client to connect to.
 *
 * usage:
 * var createClient = require('./createClient');
 * var tsm_doublelift = createClient('tsm_doublelift');
 * tsm_doublelift.addListener('message', (from, to, message) => {
 *   // handle message
 * });
 * tsm_doublelift.connect();
 * // ...
 * tsm_doublelift.disconnect();
 *
 * see https://docs.tmijs.org/v1.1.1/index.html for more information.
 */
var createWorker = function(stream, handleHighlight) {
  var worker = new tmi.client({
    identity: {
      username: process.env.TWITCH_USERNAME,
      password: process.env.TWITCH_PASSWORD
    },
    channels: [stream]
  });

  worker.addListener('message', (from, to, message) => {
    // handle the message, do checks for highlight
    console.log('message from', from, 'to', to);
    console.log(message);
  });

  // when highlight detected, call handleHighlight with the appropriate data, eg:
  // handleHighlight({ startTime: 1234, endTime: 5678, channelName: stream});

  return worker;
};

module.exports = createWorker;
