var Highlight = require('../models/highlight.js');
var mongoose = require ('mongoose');
var fetch = require('node-fetch');

// Plug in global promises since mongoose warns its built in promise library
// is deprecated
mongoose.Promise = fetch.Promise;
var ObjectId = mongoose.Types.ObjectId;

// findAll retrieves all highlights
var findAll = function(options = {}) {
  return Highlight.find(options);
};

// findOne will retrieve the highlight associated with the given id
var findOne = function(id) {
  return Highlight.findById(id);
};

// insertOne inserts a highlight into the db if it doesn't yet exist
var insertOne = function(highlightData) {
  return findAll({
    vodId: highlightData.vodId,
    highlightEnd: {
      $gt: highlightData.highlightStart
    }
  })
  .then(results => {
    if (results.length) {
      if (results.length > 1) {
        throw new Error('too many similar results when inserting' + highlightData + ' into the database: ' + results);
      }

      let highlight = results[0];

      highlight.messages = highlight.messages.concat(highlightData.messages.filter(message => message.time > highlight.highlightEnd));
      highlight.highlightEnd = highlightData.highlightEnd;
      highlight.multiplier = Math.max(highlight.multiplier, highlightData.multiplier);
      return highlight.save();

    } else {
      return Highlight.create(highlightData);
    }
  })
  .catch(error => {
    console.error('Error finding highlight in database:', error);
  });
};

var remove = function(highlightData) {
  return Highlight.remove(highlightData);
};

var updateVote = function(voteData) {
  // voteData should be in the form: { highlightId: 'abcd', username: 'batman', vote: -1 }
  // where -1 could also be 0 or 1, to indicate the user's vote
  return findOne(voteData.highlightId)
  .then(highlight => {
    highlight.votes[voteData.username] = voteData.vote;

    // See http://mongoosejs.com/docs/schematypes.html#mixed
    highlight.markModified('votes');
    return highlight.save();
  })
  .catch(error => {
    console.error(`Error saving upvote data into highlight with id ${voteData.highlightId}: ${error}`);
  });
};

module.exports = {findAll, findOne, insertOne, remove, updateVote};
