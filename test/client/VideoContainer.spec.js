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
    videoContainer = (<VideoContainer video={testVideo} username='batman' />);
  });

  it('should be able to calculate total vote counts', () => {
    let wrapper = shallow(videoContainer);
    var totalCount = wrapper.instance().calculateVotes(testVideo.votes);

    expect(totalCount).to.equal(2);
  });

  it('should initialize state.userVote based on props.username and props.video.votes', () => {
    let wrapper = shallow(videoContainer);

    // Should be -1 based on the username prop of 'batman' and batman's -1 vote
    // inside testVideo above
    expect(wrapper.state().userVote).to.equal(-1);
  });

  it('should be able to update the user\'s vote and total vote count', () => {
    let wrapper = shallow(videoContainer);

    wrapper.instance().updateUserVote(1);
    expect(wrapper.state().userVote).to.equal(1);
    expect(wrapper.state().voteCount).to.equal(4);

    wrapper.instance().updateUserVote(1);
    expect(wrapper.state().userVote).to.equal(0);
    expect(wrapper.state().voteCount).to.equal(3);

    wrapper.instance().updateUserVote(-1);
    expect(wrapper.state().userVote).to.equal(-1);
    expect(wrapper.state().voteCount).to.equal(2);
  });

  it('should show an active vote button if the current user has previously voted', () => {
    let wrapper = shallow(videoContainer);

    expect(wrapper.find('.downvote.active')).to.have.length(1);
    expect(wrapper.find('.upvote.active')).to.have.length(0);
  });
});
