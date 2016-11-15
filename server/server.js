var express = require('express');
var mongoose = require('mongoose');
var highlight = require('../db/controllers/highlight.js');

var db = mongoose.connect(process.env.MONGODB_URI);
var port = process.env.PORT || 8000;

var app = module.exports = express();

app.use(express.static(__dirname + '/../client'));

app.get('/', function(req, res) {
  res.sendFile('index.html');
});

app.get('/highlights', function(req, res) {
  highlight.findAll()
  .then(data => res.json(data));
});

app.listen(port, function() {
  console.log(`Application server running on port ${port}`);
});
