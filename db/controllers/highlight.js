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
    channel: highlightData.channel,
    highlightStart: highlightData.highlightStart,
    highlightEnd: highlightData.highlightEnd
  })
  .then(results => {
    if (results.length) {
      return results[0];
    } else {
      return Highlight.create(highlightData);
    }
  })
  .catch(error => {
    console.error('Error finding highlight in database:', error);
  });
};

module.exports = {findAll, findOne, insertOne};
