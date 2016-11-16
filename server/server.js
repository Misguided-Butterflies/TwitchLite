var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var highlight = require('../db/controllers/highlight.js');

var db = mongoose.connect(process.env.MONGODB_URI);
var port = process.env.PORT || 8000;

var app = module.exports = express();
var jsonParser = bodyParser.json();

app.use(express.static(__dirname + '/../client'));

app.get('/', function(req, res) {
  res.sendFile('index.html');
});

app.get('/highlights', function(req, res) {
  highlight.findAll()
  .then(data => {
    let currentTime = Date.now();
    res.json(data.filter(highlight => highlight.highlightEnd < currentTime - 30 * 60 * 1000));
  });
});

app.post('/votes', jsonParser, function(req, res) {
  highlight.updateVote(req.body)
  .then(updatedHighlight => {
    res.json(updatedHighlight);
  });
});

app.listen(port, function() {
  console.log(`Application server running on port ${port}`);
});
