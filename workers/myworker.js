var tmi = require('tmi.js');
var request = require('request');
var avg = require('./rollingAvg');
/** createClient
 * returns a twitch chat irc client to connect to.
 *
 * usage:
 * var createClient = require('./createClient');
 * var tsm_doublelift = createClient('tsm_doublelift');
 * tsm_doublelift.addListener('message', (from, to, message) => {
 *   // handle message
 * });
 * tsm_doublelift.connect();
 * // ...
 * tsm_doublelift.disconnect();
 *
 * see https://docs.tmijs.org/v1.1.1/index.html for more information.
 */
var createWorker = function(stream, handleHighlight) {
  var worker = new tmi.client({
    identity: {
      username: process.env.TWITCH_USERNAME,
      password: process.env.TWITCH_PASSWORD
    },
    channels: [stream]
  });
  
  //if client is currently connected or not
  var connected = false;
  //CHANGEME: multiplier cutoff for highlights
  var cutoff = 4
  //CHANGEME: total time to measure over. currently set at 10 min
  var totalTime = 600000;
  //CHANGEME: interval for api-related events. MUST BE LESS THAN time. currently set at 2 min
  var apiDelay = 120000;
  //CHANGEME: time interval for data entry point. eg, msgs / delay. currently set at 10s
  var dataDelay = 10000;
  //current number of messages
  var messages = 0;
  //CHANGEME current running average history duration, currently set to 1 min
  var currAvg = avg(6);
  
  //config for twitch api call
  var options = {
    url: 'https://api.twitch.tv/kraken/streams/' + stream,
    headers: {
      'Client-ID': process.env.TWITCH_CLIENT_ID
    }
  };
  //check twitch api for current count of stream viewers
  var checkViewers = function() {
    request(options, function(err, res, body) {
      viewers = JSON.parse(body).stream.viewers;
    });
  };

  worker.addListener('message', (from, to, message) => {
    // handle the message, do checks for highlight
    console.log(message);
    messages++;
  });

  //connect to stream
  worker.connect();
  connected = true;
  
  //disconnect after time period NOTE: REMOVE FOR 24HR USE
  setTimeout(function() {
    connected = false;
    worker.disconnect();
  }, totalTime);
  
  
  //periodically add up number of messages and send it to be averaged
  var checkData = setInterval(function() {
    if (connected) {
      //number of messages per viewer per second
      var currVal = (messages / dataDelay * 1000);
      var currMult = (currVal / currAvg.avg());
      //reset messages counter
      messages = 0;
      //add value to current average
      console.log('adding value ' , currVal);
      console.log('multiplier', currMult);
      if (currMult >= cutoff) {
        console.log('highlight found!!!');
      }
      currAvg.add(currVal);
    } else {
      clearInterval(checkData);
    }
  }, dataDelay);
  
  
  // when highlight detected, call handleHighlight with the appropriate data, eg:
  // handleHighlight({ startTime: 1234, endTime: 5678, channelName: stream});
  
  return worker;
};

var w = createWorker('nadeshot');

module.exports = createWorker;