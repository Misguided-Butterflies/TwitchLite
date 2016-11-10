var Promise = require('node-fetch').Promise;
var workerMaster = require('../../workers/workerMaster');
// var worker = require('../../workers/worker');

describe('workerMaster', function() {
  beforeEach(function() {
    var activeWorkerNames = Object.keys(workerMaster.getWorkers());
    activeWorkerNames.forEach(workerName => {
      workerMaster.removeWorker(workerName);
    });
  });

  it('should be able to add workers', function() {
    var channelName = 'twitch';
    expect(workerMaster.getWorkers()).to.eql({});
    workerMaster.addWorker(channelName);
    expect(workerMaster.getWorkers()[channelName]).to.exist;
  });

  it('should be able to remove workers', function() {
    var channelName = 'twitch';
    workerMaster.addWorker(channelName);
    workerMaster.removeWorker(channelName);
    expect(workerMaster.getWorkers()[channelName]).to.not.exist;
  });

  describe('getTopStreams', function() {
    it('should return a Promise', function() {
      var result = workerMaster.getTopStreams();

      expect(result).to.be.an.instanceOf(Promise);
    });

    it('should fetch the top Twitch streams', function(done) {
      workerMaster.getTopStreams()
      .then(response => {
        return response.json();
      })
      .then(data => {
        // 25 is an arbitrary number, but we want to ensure we always have a
        // sizable portion at least
        expect(data.streams.length > 25).to.be.true;
        done();
      })
      .catch(error => {
        console.error('Failed to fetch top 50 streams:', error);
      });
    });
  });
});
