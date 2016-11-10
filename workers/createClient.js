var tmi = require('tmi.js');

module.exports = function(stream) {
  return new tmi.client({
    identity: {
      username: 'twitchlitebot',
      password: 'oauth:d7v5btvb19kqwejktiy6b2wysryr4k'
    },
    channels: [stream]
  });
};