var Highlight = require('../models/highlight.js');
var mongoose = require ('mongoose');
var ObjectId = mongoose.Types.ObjectId;

// findAll retrieves all highlights
var findAll = function(callback) {
  Highlight.find({}, callback);
};

// findOne will retrieve the highlight associated with the given id
var findOne = function(id, callback) {
  Highlight.findById(id, callback);
};

// insertOne inserts a highlight into the db
var insertOne = function(highlight, callback) {
  Highlight.create(highlight, callback);
};

module.exports = {findAll, findOne, insertOne};
