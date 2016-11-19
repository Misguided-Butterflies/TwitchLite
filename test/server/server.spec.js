var ObjectId = mongoose.Types.ObjectId;

var fakeHighlight = {
  _id: '582bac8d3ca3f34ca40b0f9c',
  vodId: 'v343453459',
  link: 'https://example.com',
  preview: 'https://example.com/example.png',
  channel: 'lsv',
  game: 'Magic',
  streamStart: 1234,
  streamTitle: 'Playin Magic yo!',
  highlightStart: 1235,
  highlightEnd: 1236,
};

var fakeHighlight2 = {
  _id: '582bac8d3ca3f34ca40b0f9d',
  vodId: 'v8098092',
  link: 'https://example.com',
  preview: 'https://example.com/example.png',
  channel: 'haumph',
  game: 'Magic',
  streamStart: 12343,
  streamTitle: 'Playin Magic',
  highlightStart: 12355,
  highlightEnd: 12376,
};

describe('server', () => {

  beforeEach(done => {
    highlights.remove(fakeHighlight)
    .then(() => {
      return highlights.remove(fakeHighlight2);
    })
    .then(() => {
      done();
    });
  });

  before(done => {
    if (mongoose.connection.readyState !== 0) {
      return done();
    }

    mongoose.connect()
    .then(() => {
      done();
    });
  });

  after(done => {
    if (mongoose.connection.readyState === 0) {
      return done();
    }

    mongoose.disconnect()
    .then(() => {
      done();
    });
  });

  it('should exist', () => {
    expect(app).to.exist;
  });

  describe('GET /', () => {
    it('should serve html', done => {
      request(app)
        .get('/')
        .expect(/html/, done);
    });
  });

  describe('GET /highlights', () => {
    beforeEach(done => {
      highlights.insertOne(fakeHighlight)
      .then(() => highlights.insertOne(fakeHighlight2))
      .then(() => done());
    });

    afterEach(done => {
      highlights.remove(fakeHighlight)
      .then(() => highlights.remove(fakeHighlight2))
      .then(() => done());
    });

    it('should respond with json', done => {
      request(app)
        .get('/highlights')
        .expect('Content-Type', /json/, done);
    });

    it('should respond with the highlights from the database', done => {
      request(app)
        .get('/highlights')
        .expect(res => {
          expect(res.body[res.body.length - 1].vodId).to.equal(fakeHighlight2.vodId);
        })
        .end(err => err ? done(err) : done());
    });

    it('should find multiple highlights', done => {
      request(app)
        .get('/highlights')
        .expect(res => {
          // Use >= 2 to not make assumptions about how many real entries
          // were in our db before this test
          expect(res.body.length >= 2).to.equal(true);
        })
        .end(err => err ? done(err) : done());
    });
  });

  describe('GET /emotes', () => {
    it('should get emotes', done => {
      request(app)
        .get('/emotes')
        .expect(res => {
          expect(JSON.parse(res.body).Kappa).to.equal('25');
        })
        .end(err => err ? done(err) : done());
    });
  });

  describe('POST /votes', () => {
    beforeEach(done => {
      highlights.insertOne(fakeHighlight)
      .then(() => done());
    });

    afterEach(done => {
      highlights.remove(fakeHighlight)
      .then(() => done());
    });

    it('should update votes', (done) => {
      var voteData = {
        username: 'batman',
        highlightId: fakeHighlight._id,
        vote: 1
      };

      request(app)
        .post('/votes')
        .send(voteData)
        .set('Accept', /application\/json/)
        .expect(function(res) {
          expect(res.body._id).to.equal(fakeHighlight._id);
          expect(res.body.votes).to.eql({
            'batman': 1
          });
        })
        .end(done);
    });
  });
});
