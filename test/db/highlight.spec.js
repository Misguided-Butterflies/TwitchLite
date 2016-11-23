var ObjectId = mongoose.Types.ObjectId;
var Highlight = require('../../db/models/highlight');
var Chat = require('../../db/controllers/chat');
var { findAll, findOne, insertOne, updateVote, remove, updateVote, findCount } = require('../../db/controllers/highlight');

var obj = {
  _id: new ObjectId(),
  link: 'this.that.com',
  channelName: 'dk doublelunch',
  vodId: 'v101',
  game: 'pong',
  preview: 'https://example.com/example.png',
  streamStart: 1,
  streamTitle: 'double dk lunch wut',
  highlightStart: 20,
  highlightEnd: 30,
  multiplier: 4.2,
  messages: [
    {
      time: 21,
      from: 'batman',
      text: 'na na na na'
    }, {
      time: 26,
      from: 'robin',
      text: 'Kappa'
    }
  ]
};

var objBase = {
  vodId: obj.vodId,
  highlightStart: obj.highlightStart
};

var obj2 = {
  _id: new ObjectId(),
  link: 'this.that.com',
  channelName: 'dk doublelunch',
  vodId: 'v101',
  game: 'pong',
  preview: 'https://example.com/example.png',
  streamStart: 1,
  streamTitle: 'double dk lunch wut',
  highlightStart: 25,
  highlightEnd: 40,
  multiplier: 6,
  messages: [
    {
      time: 26,
      from: 'robin',
      text: 'Kappa'
    }, {
      time: 33,
      from: 'hungry_hungry_hippo',
      text: 'HeyGuys feed me'
    }
  ]
};
 
describe('Highlights Model', function() {

  beforeEach(function(done) {
    mongoose.connect(process.env.MONGODB_URI).then(() => done());
  });

  afterEach(function(done) {
    remove({vodId: obj.vodId})
      .then(() => Chat.remove({highlightId: obj._id}))
      .then(() => mongoose.disconnect()).then(() => done());
  });

  it('is able to add a highlight', function(done) {
    insertOne(obj).then(() => findOne(obj._id))
    .then(created => {
      expect(created.game).to.equal('pong');
      expect(created.votes).to.eql({});
      done();
    });
  });

  it('should only add one highlight at once', function(done) {
    insertOne(obj).then(array => {return array[0]})
    .then( () => {
      return findAll(objBase);
    })
    .then(res => {
      expect(res.length).to.equal(1);
      done();
    })
  });
  
  it('should be able to return number of highlights', function(done) {
    var countBefore = 0;
    findCount()
      .then(res => {
        countBefore = res;
        return insertOne(obj);
      })
      .then(() => findCount())
      .then(res => {
      expect(res - 1).to.equal(countBefore);
      done();
    });
  });
  
  it('should be able to add to chat db', function(done) {
    insertOne(obj)
    .then(() => {
      return Chat.findOne(obj._id)
    })
    .then((res) => {
      expect(res.messages.length).to.equal(2);
      done();
    })
  })

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
      return findAll(objBase);
    })
    .then(results => {
      expect(results.length).to.equal(1);
      done();
    });
  });

  it('should combine similar highlights', function(done) {
    insertOne(obj)
    .then(() => insertOne(obj2))
    .then(() => findOne(obj._id))
    .then(res => {
      expect(res.highlightStart).to.equal(obj.highlightStart);
      expect(res._id.toString()).to.equal(obj._id.toString());
      expect(res.highlightEnd).to.equal(obj2.highlightEnd);
      expect(res.multiplier).to.equal(obj2.multiplier);
    }).then(()=> {
      return Chat.findOne(obj._id)
    }).then((resChat) => {
      expect(resChat.messages.length).to.equal(3);
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
