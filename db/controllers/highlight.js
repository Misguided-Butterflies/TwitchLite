var model = require('../models/highlight.js');
var mongoose = require ('mongoose');
var ObjectId = mongoose.Types.ObjectId;

// findAll retrieves all highlights
function findAll(callback) {
  model.find({}, callback);
}

// findOne will retrieve the highlight associated with the given id
function findOne(id, callback) {
  model.findById(id, callback);
}

// insertOne inserts a highlight into the db
function insertOne(highlight, callback) {
  model.create(highlight, callback);
}



module.exports = {findAll, findOne, insertOne};
