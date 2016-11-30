var mongoose = require('mongoose');

var ChatSchema = mongoose.Schema({
  highlightId: String,
  messages: { type: Array, default: [] }
});

var ChatModel = mongoose.model('Chat', ChatSchema);

module.exports = ChatModel;