// Might need to rename this to workerUtil or something; the true 'master' is the server really, I think
// or maybe this file is what is the connection between the db? and the server doesn't actually deal directly with the db
var { findAll, findOne, insertOne, remove } = require('../db/controllers/highlight');
var chat = require('../db/controllers/chat');
var fetch = require('node-fetch');
var worker = require('./worker');

const maximumHighlightAge = 1000 * 60 * 60 * 24 * 7;

var fetchOptions = {
  headers: {
    'Client-ID': process.env.TWITCH_CLIENT_ID
  }
};
var activeWorkers = {};

var workerMaster = {
  // Fetch a single chunk of streams
  getStreams: function(quantity, offset) {
    return fetch(`https://api.twitch.tv/kraken/streams?limit=${quantity}&offset=${offset}`, fetchOptions)
      .then(response => {
        return response.json();
      })
      .then(data => {
        return data.streams;
      });
  },

  // Fetch the top quantity of streams from Twitch
  // There seems to be a limit of 500 active connections at once, so a default
  // of 450 is safely under
  getTopStreams: function(quantity = 450) {
    var streamPromises = [];
    var chunkCount = Math.ceil(quantity / 50);

    for (var i = 0; i < chunkCount; i++) {
      streamPromises.push(this.getStreams(50, 50 * i));
    }

    return Promise.all(streamPromises)
      .then(allStreams => {
        return allStreams.reduce((previousStreams, currentStreams) => {
          return previousStreams.concat(currentStreams);
        });
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

  removeAllWorkers: function() {
    var allChannels = Object.keys(activeWorkers);
    var removedWorkers = [];

    for (var channelName of allChannels) {
      removedWorkers.push(this.removeWorker(channelName));
    }

    return removedWorkers;
  },

  // Get data on the latest video in a channel's list of videos. If a channel is
  // live, then the latest video will be what is currently being recorded.
  getStreamVodData: function(channelName) {
    return fetch(
      `https://api.twitch.tv/kraken/channels/${channelName}/videos/?limit=1&broadcasts=true`,
      fetchOptions
    )
    .then(response => {
      return response.json();
    })
    .then(data => {
      if (!data.videos.length) {
        // Some channels store no VODs, so we need to handle such cases
        throw new Error(`Channel ${channelName} does not store VODs`);
        return;
      }
      var streamStart = new Date(data.videos[0]['recorded_at']);
      streamStart = streamStart.getTime();

      return {
        status: data.videos[0].status,
        vodId: data.videos[0]._id,
        link: data.videos[0].url,
        game: data.videos[0].game,
        streamTitle: data.videos[0].title,
        preview: data.videos[0].preview,
        streamStart
      };
    });
  },

  // Save a highlight to the db. Takes some data about the highlight, combines
  // with data returned by getStreamVodData, and saved to the db.
  saveHighlight: function(highlightData) {
    return this.getStreamVodData(highlightData.channelName)
    .then(vodData => {
      if (vodData.status !== 'recording') { // stream was already over when we detected this highlight.
        return false;
      }
      delete vodData.status;
      // Stitch together highlightData and vodData and save to db
      var combinedData = Object.assign({}, highlightData, vodData);
      return insertOne(combinedData);
    })
    .catch(error => {
      console.error('Some error creating highlight data:', error);
    });
  },

  // Gets list of the top streams, creates new workers for any new channels,
  // and destroys workers for channels that are no longer in the top streams.
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
  },

  purgeOldDbEntries: function() {
    let currentTime = Date.now();
    return findAll({
      streamStart: {
        $lt: currentTime - maximumHighlightAge
      }
    })
    .then(highlights => highlights.map(highlight => highlight._id))
    .then(highlightIds => chat.remove({
      highlightId: {
        $in: highlightIds
      }
    }))
    .then(() => remove({
      streamStart: {
        $lt: currentTime - maximumHighlightAge
      }
    }));
  }
};

module.exports = workerMaster;
