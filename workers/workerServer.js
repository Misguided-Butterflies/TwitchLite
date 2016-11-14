var workerMaster = require('./workerMaster');
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);

var updateWorkers = function() {
  console.log('Updating workers with latest Twitch streams...');
  workerMaster.updateWorkers();
};

updateWorkers();

setInterval(() => {
  updateWorkers();
}, 1000 * 60 * 10);
