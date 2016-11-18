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
  votes: { type: mongoose.Schema.Types.Mixed, default: {} },
  multiplier: Number,
  messages: { type: Array, default: [] },
}, {
  // See http://stackoverflow.com/a/31794645
  minimize: false
});

var HighlightModel = mongoose.model('Highlight', HighlightSchema);

module.exports = HighlightModel;
