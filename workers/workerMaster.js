// Might need to rename this to workerUtil or something; the true 'master' is the server really, I think
// or maybe this file is what is the connection between the db? and the server doesn't actually deal directly with the db
var { findAll, findOne, insertOne } = require('../db/controllers/highlight');
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
      })
      .then(data => {
        return data.streams;
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

    return channelName;
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
    return this.getStreamVodData(highlightData.channel)
    .then(vodData => {
      // Stitch together highlightData and vodData and save to db
      var combinedData = Object.assign({}, highlightData, vodData);
      return insertOne(combinedData);
    })
    .catch(error => {
      console.error('Some error creating highlight data:', error);
    });
  },
  updateWorkers: function() {
    return this.getTopStreams()
    .then(streams => {
      var currentWorkers = Object.keys(this.getWorkers());
      var oldWorkers = [];
      var newStreamsHash = {};

      for (var stream of streams) {
        // Create hash of the new streams for easy lookup/comparison
        newStreamsHash[stream.channel.name] = true;
        // Add every thing from new set
        this.addWorker(stream.channel.name);
      }

      for (var channelName of currentWorkers) {
        // Remove any current workers that aren't part of the new set
        if (!newStreamsHash[channelName]) {
          this.removeWorker(channelName);
          oldWorkers.push(channelName);
        }
      }

      // Return a list of all the old channels; not necessary but maybe useful
      // down the line
      return oldWorkers;
    });
  }
};

module.exports = workerMaster;
