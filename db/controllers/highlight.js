var Highlight = require('../models/highlight.js');
var Chat = require('./chat.js');
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
    var chatData = {};
    chatData.messages = highlightData.messages;
    
    if (results.length) {
      let oldHighlight = results[0];
      return appendHighlight(oldHighlight, highlightData);
    } else {
      return Highlight.create(highlightData).then(highlight => {
        chatData.highlightId = highlight._id
        return Chat.insertOne(chatData);
      });
    }
  })
  .catch(error => {
    console.error('Error inserting highlight into database:', error);
  });
};

//appends newHighlight content to oldHighlight, returns promise
var appendHighlight = function(oldHighlight, newHighlight) {
  return Chat.findOne(oldHighlight._id)
    .then(function(oldChat) {
    oldChat.messages =  oldChat.messages.concat(newHighlight.messages.filter(message => message.time > oldHighlight.highlightEnd));

    oldHighlight.highlightEnd = newHighlight.highlightEnd;
    oldHighlight.multiplier = Math.max(oldHighlight.multiplier, newHighlight.multiplier);
    return oldChat.save().then(() => oldHighlight.save());
  });
}

var remove = function(highlightData) {
  return Highlight.remove(highlightData).exec();
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

var findCount = function() {
  //gets total number of highlights out there
  return Highlight.count({});
}

module.exports = {findAll, findOne, insertOne, remove, updateVote, findCount};
