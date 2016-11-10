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

  it('should fetch the top 50 Twitch streams', function() {

  });

  describe('getTopStreams', function() {
    it('should return a Promise', function() {

    });

    it('should fetch the top 50 Twitch streams', function() {

    });
  });
});
