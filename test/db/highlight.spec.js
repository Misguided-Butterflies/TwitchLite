var mongoose = require('mongoose');

// Necessary to prevent some model duplication errors
// See: https://github.com/Automattic/mongoose/issues/1251#issuecomment-41844298
// Could also consider a solution that would fix the problem in the
// model files themselves; see excellent example here:
// https://github.com/j0ni/beachenergy.ca/blob/master/datamodel/index.js#L20
mongoose.models = {};
mongoose.modelSchemas = {};


var ObjectId = mongoose.Types.ObjectId;
var chai = require('chai');
var expect = chai.expect;
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
    insertOne(obj, function(err, created) {
      //there shouldn't be an error
      expect(err).to.not.exist;
      expect(created.game).to.equal('pong');
      done();
    });
  });

  it('should only add one highlight at once', function(done) {
    insertOne(obj, function() {
      findAll(function(err, res) {
        expect(res.length).to.equal(1);
        done();
      });
    });
  });

  it('should be able to find by id', function(done) {
    insertOne(obj, function() {
      findOne('582514df57a32e10c426ec3b', function(err, res) {
        expect(res.game).to.equal('pong');
        done();
      });
    });
  });
});
