var Highlight = require('../models/highlight.js');
var mongoose = require ('mongoose');

// Plug in global promises since mongoose warns its built in promise library
// is deprecated
mongoose.Promise = global.Promise;
var ObjectId = mongoose.Types.ObjectId;

// findAll retrieves all highlights
var findAll = function() {
  return Highlight.find({});
};

// findOne will retrieve the highlight associated with the given id
var findOne = function(id) {
  return Highlight.findById(id);
};

// insertOne inserts a highlight into the db
var insertOne = function(highlight) {
  return Highlight.create(highlight);
};

module.exports = {findAll, findOne, insertOne};
