var fakeHighlight = {
  vodId: 'v343453459',
  link: 'https://example.com',
  channel: 'lsv',
  game: 'Magic',
  streamStart: 1234,
  highlightStart: 1235,
  highlightEnd: 1236,
};

var fakeHighlight2 = {
  vodId: 'v8098092',
  link: 'https://example.com',
  channel: 'haumph',
  game: 'Magic',
  streamStart: 12343,
  highlightStart: 12355,
  highlightEnd: 12376,
};

describe('server', () => {

  beforeEach(done => {
    highlights.remove({})
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
          expect(res.body[0].vodId).to.equal(fakeHighlight.vodId);
        })
        .end(err => err ? done(err) : done());
    });

    it('should find multiple highlights', done => {
      request(app)
        .get('/highlights')
        .expect(res => {
          expect(res.body).to.have.length(2);
        })
        .end(err => err ? done(err) : done());
    });
  });
});
