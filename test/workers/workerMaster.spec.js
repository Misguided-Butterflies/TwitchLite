var workerMaster = require('../../workers/workerMaster');
// var worker = require('../../workers/worker');

describe('workerMaster', function() {
  it('should have no activeWorkers on init', function() {
    expect(workerMaster.getActiveWorkers()).to.eql({});
  });

  it('should be able to add workers', function() {

  });

  it('should be able to remove workers', function() {

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
