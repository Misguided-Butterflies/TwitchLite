var ObjectId = mongoose.Types.ObjectId;
var Highlight = require('../../db/models/highlight');
var { findAll, findOne, insertOne } = require('../../db/controllers/highlight');

var obj = {
  _id: new ObjectId('582514df57a32e10c426ec3b'),
  link: 'this.that.com',
  channel: 'dk doublelunch',
  game: 'pong',
  streamStart: 1,
  highlightStart: 2,
  highlightEnd: 3,
  vote: 10
};

describe('Highlights Model', function() {

  beforeEach(function(done) {
    var clearDB = function() {
      Highlight.remove({}).exec();
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
      done();
    });
  });

  it('should only add one highlight at once', function(done) {
    insertOne(obj)
    .then( () => {
      findAll()
      .then(res => {
        expect(res.length).to.equal(1);
        done();
      });
    });
  });

  it('should be able to find by id', function(done) {
    insertOne(obj)
    .then( () => {
      findOne('582514df57a32e10c426ec3b')
      .then(res => {
        expect(res.game).to.equal('pong');
        done();
      });
    });
  });
});
