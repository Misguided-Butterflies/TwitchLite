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

    it('should fetch the top 50 Twitch streams', function(done) {
      workerMaster.getTopStreams()
      .then(response => {
        return response.json();
      })
      .then(data => {
        expect(data.streams.length).to.equal(50);
        done();
      })
      .catch(error => {
        console.error('Error fetching top 50 streams:', error);
      });
    });
  });
});