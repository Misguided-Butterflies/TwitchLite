var ObjectId = mongoose.Types.ObjectId;
var Highlight = require('../../db/models/highlight');
var { findAll, findOne, insertOne, updateVote } = require('../../db/controllers/highlight');

var obj = {
  _id: new ObjectId(),
  link: 'this.that.com',
  channelName: 'dk doublelunch',
  vodId: 'v101',
  game: 'pong',
  preview: 'https://example.com/example.png',
  streamStart: 1,
  streamTitle: 'double dk lunch wut',
  highlightStart: 2,
  highlightEnd: 3,
  multiplier: 4.2
};

describe('Highlights Model', function() {

  beforeEach(function(done) {
    var clearDB = function() {
      Highlight.remove(obj).exec();
      return done();
    };

    if (mongoose.connection.readyState === 0) {
      mongoose.connect(process.env.MONGODB_URI, function(err) {
        return clearDB();
      });
    } else {
      return clearDB();
    }

  });

  afterEach(function(done) {
    mongoose.disconnect();
    return done();
  });

  it('is able to add a highlight', function(done) {
    insertOne(obj)
    .then(created => {
      expect(created.game).to.equal('pong');
      expect(created.votes).to.eql({});
      done();
    });
  });

  it('should only add one highlight at once', function(done) {
    insertOne(obj)
    .then( () => {
      return findAll(obj);
    })
    .then(res => {
      expect(res.length).to.equal(1);
      done();
    });
  });

  it('should be able to find by id', function(done) {
    insertOne(obj)
    .then( () => {
      return findOne(obj._id);
    })
    .then(res => {
      expect(res.game).to.equal('pong');
      done();
    });
  });

  it('should only add the same highlight once', function(done) {
    insertOne(obj)
    .then( () => {
      return insertOne(obj);
    })
    .then( () => {
      return findAll(obj);
    })
    .then(results => {
      expect(results.length).to.equal(1);
      done();
    });
  });

  describe('upvotes', function() {
    it('should be able to update upvotes multiple times', function(done) {
      insertOne(obj)
      .then( () => {
        return updateVote({
          highlightId: obj._id,
          username: 'a_seagull',
          vote: -1
        });
      })
      .then(updatedHighlight => {
        expect(updatedHighlight.votes['a_seagull']).to.equal(-1);

        return updateVote({
          highlightId: obj._id,
          username: 'a_seagull',
          vote: 1
        });
      })
      .then(updatedHighlight => {
        expect(updatedHighlight.votes['a_seagull']).to.equal(1);

        return updateVote({
          highlightId: obj._id,
          username: 'a_seagull',
          vote: 0
        });
      })
      .then(updatedHighlight => {
        expect(updatedHighlight.votes['a_seagull']).to.equal(0);

        done();
      });
    });

    it('should be able to store upvotes from multiple users', function(done) {
      insertOne(obj)
      .then( () => {
        return updateVote({
          highlightId: obj._id,
          username: 'a_seagull',
          vote: 1
        });
      })
      .then(updatedHighlight => {
        return updateVote({
          highlightId: obj._id,
          username: 'miro',
          vote: -1
        });
      })
      .then(updatedHighlight => {
        expect(updatedHighlight.votes['a_seagull']).to.equal(1);
        expect(updatedHighlight.votes['miro']).to.equal(-1);

        done();
      });
    });
  });
});
