var tmi = require('tmi.js');
var createAvg = require('./rollingAvg');
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
    connection: {
      reconnect: true
    },
    identity: {
      username: process.env.TWITCH_USERNAME,
      password: process.env.TWITCH_PASSWORD
    },
    channels: [stream]
  });
  
  //CHANGEME: multiplier cutoff for highlights, currently set to 3x
  var cutoff = 3;
  //CHANGEME: time interval for data entry point. eg, msgs / delay. currently set at 10s
  var dataDelay = 10000;
  //CHANGEME current running average history duration, currently set to 5 min
  var currAvg = createAvg(30);
  
  //current number of messages
  var messages = 0;
  //highlight start time
  var start = Date.now();
  //highlight end time
  var end = 0;
  //highlight multiplier
  var multiplier = 0;

  //event handler for receiving messages
  worker.on('message', (from, to, message) => {
    // handle the message, do checks for highlight
    console.log(message);
    messages++;
  });


  
  //given a multiplier and cutoff, records start times, end times for highlights
  //calls handleHighlight when highlight is over
  var checkHighlight = function(mult) {
    console.log('current mult: ' , mult);
    if (mult > cutoff) {
      //if highlight is detected, increment end time, calculate multiplier
      console.log('highlight detected');
      mult > multiplier ? multiplier = mult : null;
      end = Date.now();
    } else if (end > 0) {
      //if highlight is now over, send highlight off to worker manager
      handleHighlight({ startTime: start, endTime: end, channelName: stream, multiplier: multiplier});
      console.log('start: ', start);
      console.log('end: ', end);
      end = 0;
      multiplier = 0;
    } else {
      //if no highlight activity, keep incrementing start time
      start = Date.now();
    }
  }
  
  
  //periodically add up number of messages and send it to be averaged
  var checkData = setInterval(function() {
    //number of messages per viewer per second
    var currVal = (messages / dataDelay * 1000);
    var currMult = (currVal / currAvg.avg());
    //reset messages counter
    messages = 0;
    //add value to current average
    console.log('adding value ' , currVal);
    currAvg.add(currVal);
    //check for highlights
    checkHighlight(currMult);
  }, dataDelay);
  
  worker.on("disconnected", function (event) {
    clearInterval(checkData);
  });

  return worker;
};


module.exports = createWorker;