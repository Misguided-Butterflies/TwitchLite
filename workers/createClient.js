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
module.exports = function(stream) {
  return new tmi.client({
    identity: {
      username: 'twitchlitebot',
      password: 'oauth:d7v5btvb19kqwejktiy6b2wysryr4k'
    },
    channels: [stream]
  });
};