var Promise = require('node-fetch').Promise;
var workerMaster = require('../../workers/workerMaster');

var sampleChannel = 'twitch';

describe('workerMaster', function() {
  beforeEach(function() {
    var activeWorkerNames = Object.keys(workerMaster.getWorkers());
    activeWorkerNames.forEach(workerName => {
      workerMaster.removeWorker(workerName);
    });
  });

  it('should be able to add workers', function() {
    expect(workerMaster.getWorkers()).to.eql({});
    workerMaster.addWorker(sampleChannel);
    expect(workerMaster.getWorkers()[sampleChannel]).to.exist;
  });

  it('should be able to remove workers', function() {
    workerMaster.addWorker(sampleChannel);
    workerMaster.removeWorker(sampleChannel);
    expect(workerMaster.getWorkers()[sampleChannel]).to.not.exist;
  });

  describe('getTopStreams', function() {
    it('should return a Promise', function() {
      var result = workerMaster.getTopStreams();

      expect(result).to.be.an.instanceOf(Promise);
    });

    it('should fetch the top Twitch streams', function(done) {
      workerMaster.getTopStreams()
      .then(data => {
        // 25 is an arbitrary number, but we want to ensure we always have a
        // sizable portion at least
        expect(data.streams.length > 25).to.be.true;
        done();
      })
      .catch(error => {
        console.error('Failed to fetch top streams:', error);
      });
    });
  });

  describe('getStreamVodData', function() {
    it('should return a Promise', function() {
      var result = workerMaster.getStreamVodData(sampleChannel);

      expect(result).to.be.an.instanceOf(Promise);
    });

    it('should fetch the VOD data of the channel\'s latest broadcast', function(done) {
      workerMaster.getStreamVodData(sampleChannel)
      .then(data => {
        expect(typeof data.link).to.equal('string');
        expect(typeof data.game).to.equal('string');
        expect(typeof data.streamStart).to.equal('number');
        done();
      })
      .catch(error => {
        console.error('Error encountered:', error);
      });
    });
  });

  describe('saveHighlight', function() {
    it('should return a Promise', function() {
      var highlightData = {
        highlightStart: 1,
        highlightEnd: 2,
        channel: 'twitch'
      };

      var result = workerMaster.saveHighlight(highlightData);

      expect(result).to.be.an.instanceOf(Promise);
    });

    xit('should save highlights to the database', function() {

    });
  });

});
