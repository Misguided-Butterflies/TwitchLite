var Promise = require('node-fetch').Promise;
var workerMaster = require('../../workers/workerMaster');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

// See explanation in db test .setup.js
mongoose.models = {};
mongoose.modelSchemas = {};
var { findAll, findOne, insertOne, remove } = require('../../db/controllers/highlight');

var sampleChannel = 'twitch';

describe('workerMaster', function() {
  beforeEach(function() {
    var activeWorkerNames = Object.keys(workerMaster.getWorkers());
    activeWorkerNames.forEach(workerName => {
      workerMaster.removeWorker(workerName);
    });
  });

  after(function() {
    workerMaster.removeAllWorkers();
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

  it('should be able to remove all workers', function() {
    workerMaster.addWorker('taimoutv');
    workerMaster.addWorker('vgbootcamp');
    workerMaster.addWorker('blizzard');
    workerMaster.removeAllWorkers();
    expect(workerMaster.getWorkers()).to.eql({});
  });

  describe('getTopStreams', function() {
    it('should return a Promise', function() {
      var result = workerMaster.getTopStreams();

      expect(result).to.be.an.instanceOf(Promise);
    });

    it('should fetch the top Twitch streams', function(done) {
      var desiredStreamCount = 25;
      workerMaster.getTopStreams(desiredStreamCount)
      .then(streams => {
        // 25 is an arbitrary number, but we want to ensure we always have a
        // sizable portion at least
        expect(streams.length > desiredStreamCount).to.be.true;
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
        expect(typeof data.vodId).to.equal('string');
        expect(typeof data.preview).to.equal('string');
        expect(typeof data.streamTitle).to.equal('string');
        done();
      })
      .catch(error => {
        console.error('Error encountered:', error);
      });
    });
  });

  describe('saveHighlight', function() {
    var highlightData = {
      _id: new ObjectId(),
      highlightStart: 1,
      highlightEnd: 2,
      channelName: 'twitch',
      messages: [],
      multiplier: 3
    };

    var highlightDataBase = {
      highlightStart: highlightData.highlightStart,
      highlightEnd: highlightData.highlightEnd,
      channelName: highlightData.channelName,
    };

    beforeEach(function(done) {
      mongoose.connect(process.env.MONGODB_URI)
      .then(() => done());
    });

    afterEach(function(done) {
      remove(highlightDataBase)
      .then(() => mongoose.disconnect())
      .then(() => done());
    });

    it('should return a Promise', function() {
      expect(workerMaster.saveHighlight(highlightData)).to.be.an.instanceOf(Promise);
    });

    it('should save highlights to the database if the stream is still recording', function(done) {
      var getStreamVodDataStub = new Promise((resolve, reject) => {
        resolve({
          status: 'recording',
          vodId: 'v34340593453',
          link: 'fake link',
          game: 'Hungry Hungry Hippos',
          streamTitle: 'testing our function',
          preview: 'link to preview image',
          streamStart: 0
        });
      });

      sinon.stub(workerMaster, 'getStreamVodData').returns(getStreamVodDataStub);

      workerMaster.saveHighlight(highlightData)
      .then( () => {
        return findOne(highlightData._id);
      })
      .then(retrievedHighlight => {
        expect(retrievedHighlight.highlightStart).to.equal(highlightData.highlightStart);
        expect(retrievedHighlight.highlightEnd).to.equal(highlightData.highlightEnd);
        expect(retrievedHighlight.channel).to.equal(highlightData.channel);
        workerMaster.getStreamVodData.restore();
        done();
      })
      .catch(error => {
        console.error('There was an error testing highlight saving to database:', error);
      });
    });

    it('should not save highlights to the database if the stream is over', function(done) {
      var getStreamVodDataStub = new Promise((resolve, reject) => {
        resolve({
          status: 'i dont know',
          vodId: 'v34340593453',
          link: 'fake link',
          game: 'Hungry Hungry Hippos',
          streamTitle: 'testing our function',
          preview: 'link to preview image',
          streamStart: 0
        });
      });
      sinon.stub(workerMaster, 'getStreamVodData').returns(getStreamVodDataStub);

      workerMaster.saveHighlight(highlightData)
      .then( savedHighlight => {
        return findOne(savedHighlight._id);
      })
      .then(retrievedHighlight => {
        expect(retrievedHighlight).to.equal(null);
        workerMaster.getStreamVodData.restore();
        done();
      })
      .catch(error => {
        console.error('There was an error testing highlight not saving to database:', error);
      });

    });
  });

  describe('updateWorkers', function() {
    it('should return a Promise', function(done) {
      var result = workerMaster.updateWorkers()
      .then( () => {
        expect(result).to.be.an.instanceOf(Promise);
        done();
      });
    });

    it('should destroy old workers and add new ones', function(done) {
      // Manually add some streams
      var initialChannels = ['blizzard', 'vgbootcamp', 'taimoutv', 'iddqdow'];
      for (var channelName of initialChannels) {
        workerMaster.addWorker(channelName);
      }

      // Set up new stream data for stubbing
      var newChannels = ['blizzard', 'BeyondTheSummit', 'esl_AlphaCast', 'twitch'];
      var newStreams = []; // Fill this out with what getTopStreams should get
      for (var channelName of newChannels) {
        newStreams.push({
          channel: {
            name: channelName
          }
        });
      }

      // Stub getTopStreams with promise that returns set list of 5 or so items
      var getTopStreamsStub = new Promise((resolve, reject) => {
        resolve(newStreams);
      });

      sinon.stub(workerMaster, 'getTopStreams').returns(getTopStreamsStub);

      // Trigger the update, and verify the differences
      workerMaster.updateWorkers()
      .then(removedWorkers => {
        expect(removedWorkers).to.eql(['vgbootcamp', 'taimoutv', 'iddqdow']);
        expect(Object.keys(workerMaster.getWorkers())).to.eql(newChannels);

        workerMaster.getTopStreams.restore();
        done();
      });
    });
  });

  describe('purgeOldDbEntries', function() {
    var highlightData = {
      highlightStart: 1,
      highlightEnd: 2,
      channelName: 'twitch',
      messages: [],
      multiplier: 3
    };
    var highlightDataBase = {
      highlightStart: highlightData.highlightStart,
      highlightEnd: highlightData.highlightEnd,
      channelName: highlightData.channelName,
    };

    var highlightData2 = {
      highlightStart: Date.now(),
      highlightEnd: Date.now(),
      channelName: 'twitch',
      messages: [],
      multiplier: 3
    };
    
    var highlightData2Base = {
      highlightStart: highlightData2.highlightStart,
      highlightEnd: highlightData2.highlightEnd,
      channelName: highlightData2.channelName,
    };

    beforeEach(function(done) {
      mongoose.connect(process.env.MONGODB_URI)
      .then(() => done());
    });

    afterEach(function(done) {
      remove(highlightDataBase)
      .then(() => remove(highlightData2Base))
      .then(() => mongoose.disconnect())
      .then(() => done());
    });

    it('should remove old db entries', function(done) {
      var getStreamVodDataStub = new Promise((resolve, reject) => {
        resolve({
          status: 'recording',
          vodId: 'v34340593453',
          link: 'fake link',
          game: 'Hungry Hungry Hippos',
          streamTitle: 'testing our function',
          preview: 'link to preview image',
          streamStart: 0
        });
      });
      sinon.stub(workerMaster, 'getStreamVodData').returns(getStreamVodDataStub);
      workerMaster.saveHighlight(highlightData)
      .then(() => findAll({
        highlightStart: 1
      }))
      .then(foundHighlights => expect(foundHighlights).to.have.length(1))
      .then(() => workerMaster.purgeOldDbEntries())
      .then(() => findAll({
        highlightStart: 1
      }))
      .then(foundHighlights => {
        expect(foundHighlights).to.have.length(0);
        workerMaster.getStreamVodData.restore();
        done();
      });
    });

    it('should not remove new db entries', function(done) {
      var getStreamVodDataStub = new Promise((resolve, reject) => {
        resolve({
          status: 'recording',
          vodId: 'v34340593453',
          link: 'fake link',
          game: 'Hungry Hungry Hippos',
          streamTitle: 'testing our function',
          preview: 'link to preview image',
          streamStart: Date.now()
        });
      });
      sinon.stub(workerMaster, 'getStreamVodData').returns(getStreamVodDataStub);
      workerMaster.saveHighlight(highlightData2)
      .then(() => findAll({
        highlightStart: highlightData2.highlightStart
      }))
      .then(foundHighlights => expect(foundHighlights).to.have.length(1))
      .then(() => workerMaster.purgeOldDbEntries())
      .then(() => findAll({
        highlightStart: highlightData2.highlightStart
      }))
      .then(foundHighlights => {
        expect(foundHighlights).to.have.length(1);
        workerMaster.getStreamVodData.restore();
        done();
      });
    });
  });
});
