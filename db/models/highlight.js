var mongoose = require('mongoose');

var HighlightSchema = mongoose.Schema({
  link: String,
  channel: String,
  game: String,
  streamStart: Number,
  highlightStart: Number,
  highlightEnd: Number,
  vote: {type: [{type: String}], default: []},
  multiplier: Number
});

var HighlightModel = mongoose.model('Highlight', HighlightSchema);

module.exports = HighlightModel;
