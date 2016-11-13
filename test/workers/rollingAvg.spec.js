var createAvg = require('../../workers/rollingAvg');

describe('rolling average', function() {
  var avg = createAvg(5);
  beforeEach(function() {
    avg.add(0);
    avg.add(4);
    avg.add(3);
    avg.add(2);
    avg.add(1);
    avg.add(0);
  });
  
  it('should average to be 2', function() {
    expect(avg.avg()).to.equal(2);
  });
  
  it('should be a rolling average', function() {
    expect(avg.avg()).to.equal(2);
  });
  
  it('should recalculate the average', function() {
    avg.add(10);
    expect(avg.avg()).to.be.above(2);
  });
  
});
