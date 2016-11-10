/*
  what jobs does master have?
  needs to keep track of how many bots are out there
  needs to probably get top channels, and poll for those channels being active
  needs to send bots to popular channels when that happens
  needs to communicate with bot and know that when one bot is done (ie a channel goes offline),
    a new bot space is freed up
  needs to send data to the db
  needs to store obj of channel names with active bots
  every time it gets the list of top 50 again, if one item that has an active both is no longer in top 50,
    then stop that bot
  so that means bot should probably be instantiated like `new Bot(channelName)`


*/

var fetch = require('node-fetch');
var secret = require('./../.secret');
// var worker = require('./worker');
// REPLACE THE FOLLOWING WITH THE REAL MODULE LATER
var Worker = function() {
  this.connect = () => '';
  this.disconnect = () => '';
};

var activeWorkers = {};

var workerMaster = {
  getTopStreams: function() {
    return fetch('https://api.twitch.tv/kraken/streams?limit=50', {
      headers: {
        'Client-ID': secret.TWITCH_CLIENT_ID
      }
    });
  },
  getWorkers: function() {
    return activeWorkers;
  },
  addWorker: function(channelName) {
    if (activeWorkers[channelName]) {
      // Signify invalid command; worker already exists
      return false;
    }

    activeWorkers[channelName] = new Worker(channelName);
    activeWorkers[channelName].connect();

    return activeWorkers[channelName];
  },
  removeWorker: function(channelName) {
    var workerToRemove = activeWorkers[channelName];
    if (!workerToRemove) {
      // Signify invalid command; worker doesn't exist
      return false;
    }

    workerToRemove.disconnect();
    delete activeWorkers[channelName];

    return workerToRemove;
  },
  getStreamVODID: function(channelName) {

  }
};

module.exports = workerMaster;
