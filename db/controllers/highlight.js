var HighlightModel = require('../models/highlight.js');
var mongoose = require 'mongoose'
var ObjectId = mongoose.Types.ObjectId;

// findAll retrieves all highlights
function findAll(callback) {
  HighlightModel.find({}, callback);
}

// findOne will retrieve the highlight associated with the given id
function findOne(id, callback) {
  HighlightModel.findById(id, callback);
}

// insertOne inserts a highlight into the db
function insertOne(story, callback) {
  HighlightModel.create(story, callback);
}

exports.findOne = findOne;
exports.findAll = findAll;
exports.insertOne = insertOne;