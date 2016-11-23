var Chat = require('../models/chat.js');
var mongoose = require ('mongoose');

var insertOne = function(obj) {
  return Chat.create(obj);
}

var findOne = function(id) {
  return Chat.findOne({highlightId: id});
}

var remove = function(obj) {
  return Chat.remove(obj);
}

module.exports = {insertOne, findOne, remove};