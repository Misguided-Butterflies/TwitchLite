var model = require('../models/highlight.js');
var mongoose = require ('mongoose');
var ObjectId = mongoose.Types.ObjectId;

// findAll retrieves all highlights
var findAll = function(callback) {
  model.find({}, callback);
};

// findOne will retrieve the highlight associated with the given id
var findOne = function(id, callback) {
  model.findById(id, callback);
};

// insertOne inserts a highlight into the db
var insertOne = function(highlight, callback) {
  model.create(highlight, callback);
};

module.exports = {findAll, findOne, insertOne};
