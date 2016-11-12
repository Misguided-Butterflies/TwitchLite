var fakeHighlight = {
  link: 'v343453459',
  channel: 'lsv',
  game: 'Magic',
  streamStart: 1234,
  highlightStart: 1235,
  highlightEnd: 1236,
  vote: 0
};

describe('server', () => {

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
      .then(() => done());
    });

    afterEach(done => {
      highlights.remove(fakeHighlight)
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
          expect(res.body[0].link).to.eql(fakeHighlight.link);
        })
        .end(err => err ? done(err) : done());
    });
  });
});
