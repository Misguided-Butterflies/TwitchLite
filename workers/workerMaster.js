// Might need to rename this to workerUtil or something; the true 'master' is the server really, I think
// or maybe this file is what is the connection between the db? and the server doesn't actually deal directly with the db

var fetch = require('node-fetch');
var worker = require('./worker');
var fetchOptions = {
  headers: {
    'Client-ID': process.env.TWITCH_CLIENT_ID
  }
};
var activeWorkers = {};

var workerMaster = {
  getTopStreams: function() {
    return fetch('https://api.twitch.tv/kraken/streams?limit=50', fetchOptions)
      .then(response => {
        return response.json();
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

    activeWorkers[channelName] = worker(channelName, this.saveHighlight.bind(this));
    activeWorkers[channelName].connect()
    .catch(function(err) {
      // Run some code here when disconnect happens
    });

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
  getStreamVodData: function(channelName) {
    return fetch(
      `https://api.twitch.tv/kraken/channels/${channelName}/videos/?limit=1&broadcasts=true`,
      fetchOptions
    )
    .then(response => {
      return response.json();
    })
    .then(data => {
      var streamStart = new Date(data.videos[0]['recorded_at']);
      streamStart = streamStart.getTime();

      return {
        link: data.videos[0].url,
        game: data.videos[0].game,
        streamStart
      };
    });
  },
  saveHighlight: function(highlightData) {
    // highlightData should be: { highlightStart: number, highlightEnd: number, channel: string }
    // call this.getStreamVodData
    // combine results of that with highlightData to form necessary data for db schema
    // save to db, probably return a promise
    return;
  }
};

module.exports = workerMaster;
