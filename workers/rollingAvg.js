//rolling average constructor of n entries
var createAvg = function(n) {
  //rolling store of last n values
  var arr = [];
  //CHANGEME: percentile we are looking for to be cut off eg. 90th percentile
  var percentile = 0.9;
  //averages, cutoffs are precalculated on change for quick retrieval
  //note: cutoff is incusive
  var currAvg = undefined;
  var currCutoff = undefined;
  
  return {
    avg: function() {
      return currAvg;
    },
    debug: function() {
      return arr;
    },
    cutoff: function() {
      return currCutoff;
    },
    //add an element to rolling average
    add: function(val) {
      //if arr is full, remove oldest, start calculating averages, cutoffs
      if (arr.length === n) {
        arr = arr.slice(1);
        //add element to array
        arr.push(val);
        //recalculate average
        var sum = arr.reduce(function(a, b) {
          return a + b;
        }, 0);
        currAvg = sum / arr.length;
      } else {
        //add element to array
        arr.push(val);
      }
    }
  }
}

module.exports = createAvg;