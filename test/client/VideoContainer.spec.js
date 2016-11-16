import VideoContainer from '../../client/src/VideoContainer';

let testVideo = {
  highlightStart: 1479151790954,
  highlightEnd: 1479151793955,
  multiplier: 5,
  link: 'https://www.twitch.tv/comanchedota/v/101060439',
  game: 'Dota 2',
  streamTitle: 'some stream,',
  streamStart: 1479145561000,
  vodId: 'v101060439',
  channelName: 'comancedota',
  preview: 'example.png',
  votes: {
    me: 1,
    you: 0,
    dawg: 1,
    batman: -1,
    winston: 1
  }
};

describe('<VideoContainer>', () => {
  let videoContainer;

  beforeEach(() => {
    videoContainer = (<VideoContainer video={testVideo} />);
  });

  it('should be able to calculate total vote counts', () => {
    let wrapper = shallow(videoContainer);
    var totalCount = wrapper.instance().calculateVotes(testVideo.votes);

    expect(totalCount).to.equal(2);
  });

  it('should show an active vote button if the current user has previously voted', () => {
    // provide videoContainer a user, and make sure that user has a voting record
    // in the testVideo that also gets passed to videoContainer
    // now make sure that the upvote button has an active class, or whatever
  });
});
