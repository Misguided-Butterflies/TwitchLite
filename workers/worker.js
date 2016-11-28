var tmi = require('tmi.js');
var createAvg = require('./rollingAvg');

const numberOfSecondsToAddToBeginningOfHighlights = 30;
const minimumMultiplierToBeConsideredAHighlight = 5;
const secondsPerBlockOfMessages = 10;
const numberOfDataPointsInRollingAvg = 120;
const minimumCommentsPerSecond = 1;

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

  var currAvg = createAvg(numberOfDataPointsInRollingAvg);
  var messagesCount = 0;
  var highlightStart = Date.now();
  var highlightEnd = 0;
  var currentHighlightMultiplier = 0;
  var highlightMessages = [];
  var messagesDataPoint = [];

  //event handler for receiving messages
  worker.on('message', (to, from, message) => {
    messagesDataPoint.push({
      time: Date.now(),
      text: message,
      from: from['display-name'] || from['name'] || 'Anonymous'
    });
    messagesCount++;
  });
  
  //if reconnecting, reset everything.
  worker.on('connecting', () => {
    currAvg = createAvg(numberOfDataPointsInRollingAvg);
    messagesCount = 0;
    highlightStart = Date.now();
    highlightEnd = 0;
    currentHighlightMultiplier = 0;
    highlightMessages = [];
    messagesDataPoint = [];
  })

  //given a multiplier and cutoff, records start times, end times for highlights
  //calls handleHighlight when highlight is over
  var checkHighlight = function(detectedMultiplier) {
    if (detectedMultiplier > minimumMultiplierToBeConsideredAHighlight
      && highlightMessages[highlightMessages.length - 1].length >= minimumCommentsPerSecond * secondsPerBlockOfMessages) {
      //if highlight is detected, increment end time, calculate multiplier
      if (detectedMultiplier > currentHighlightMultiplier) {
        currentHighlightMultiplier = detectedMultiplier;
      }
      highlightEnd = Date.now();
    } else if (highlightEnd > 0) {
      //if highlight is now over, send highlight off to worker manager
      handleHighlight({
        highlightStart: highlightStart - (numberOfSecondsToAddToBeginningOfHighlights * 1000),
        highlightEnd: highlightEnd,
        channelName: stream,
        multiplier: currentHighlightMultiplier,
        messages: highlightMessages.reduce((result, next) => result.concat(next))
      });
      highlightEnd = 0;
      currentHighlightMultiplier = 0;
    } else {
      //if no highlight activity, keep incrementing start time
      while (highlightMessages.length > numberOfSecondsToAddToBeginningOfHighlights / secondsPerBlockOfMessages) {
        highlightMessages.shift();
      }
      highlightStart = Date.now();
    }
  };

  //periodically add up number of messages and send it to be averaged
  var checkData = setInterval(function() {
    highlightMessages.push(messagesDataPoint);
    messagesDataPoint = [];
    //number of messages per viewer per second
    var currVal = (messagesCount / secondsPerBlockOfMessages);
    var currMult = (currVal / currAvg.avg());
    //reset messages counter
    messagesCount = 0;
    //add value to current average
    currAvg.add(currVal);
    //check for highlights
    checkHighlight(currMult);
  }, secondsPerBlockOfMessages * 1000);

  worker.on('disconnected', function (event) {
    clearInterval(checkData);
  });

  return worker;
};


module.exports = createWorker;
