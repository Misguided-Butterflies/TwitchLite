var mongoose = require('mongoose');

var HighlightSchema = mongoose.Schema({
  vodId: String,
  link: String,
  channelName: String,
  game: String,
  preview: String,
  streamStart: Number,
  streamTitle: String,
  highlightStart: Number,
  highlightEnd: Number,
  vote: {type: mongoose.Schema.Types.Mixed, default: {}},
  multiplier: Number
});

var HighlightModel = mongoose.model('Highlight', HighlightSchema);

module.exports = HighlightModel;
