var mongoose = require('mongoose');

var HighlightSchema = mongoose.Schema({
  link: String,
  channel: String,
  game: String,
  start: Number,
  end: Number,
  vote: Number
});

var HighlightModel = mongoose.model('Highlight', HighlightSchema);

module.exports = HighlightModel;