var Chat = require('../models/chat.js');
var mongoose = require ('mongoose');

var insertOne = function(obj) {
  return Chat.create(obj);
}

var findOne = function(id) {
  return Chat.find({highlightId: id});
}

module.exports = {insertOne, findOne};