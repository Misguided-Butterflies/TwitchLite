var express = require('express');
var mongoose = require('mongoose');
var highlight = require('../db/controllers/highlight.js');

var db = mongoose.connect(process.env.MONGODB_URI);

var app = express();

app.use(express.static(__dirname + '/../client'));

app.get('/', function(req, res) {
  res.sendFile('index.html');
});

app.listen(process.env.PORT || 8000);