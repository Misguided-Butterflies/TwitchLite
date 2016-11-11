var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var chai = require('chai');
var expect = chai.expect;
var {findAll, findOne, insertOne} = require('../../db/controllers/highlight');
var model = require('../../db/models/highlight');


var obj = {
  _id: new ObjectId('582514df57a32e10c426ec3b'),
  link: "this.that.com",
  channel: "dk doublelunch",
  game: "pong",
  start: 1,
  end: 2,
  vote: 10
}

describe("Highlights Model", function(){  
  
  beforeEach(function(done) {
    var clearDB = function() {
      model.remove({}).exec();
      return done()
    };
    
    if (mongoose.connection.readyState === 0) {
      mongoose.connect(process.env.MONGODB_URI, function(err) {
        console.log("connecting: " + process.env.MONGODB_URI);
        console.log("connection error: " , err);
        return clearDB();
      });
    } else {
      return clearDB();
    }
    
  });
  
  afterEach(function(done) {
    mongoose.disconnect();
    return done();
  })
  
  it("is able to add a highlight", function(done){
    insertOne(obj, function(err, created) {
      //there shouldn't be an error
      expect(err).to.not.exist;
      expect(created.game).to.equal('pong');
      done();
    });
  });
  
  it("should only add one highlight at once", function(done) {
    insertOne(obj, function() {
      findAll(function(err, res) {
        expect(res.length).to.equal(1);
        done();
      });
    });
  });
  
  it("should be able to find by id", function(done) {
    insertOne(obj, function() {
      findOne('582514df57a32e10c426ec3b', function(err, res) {
        expect(res.game).to.equal('pong');
        done();
      })
    })
  });
});