import VideoContainer from '../../client/src/VideoContainer';

let testVideo = {
  _id: '12345abcdef',
  highlightStart: 20,
  highlightEnd: 40,
  multiplier: 5,
  link: 'https://www.twitch.tv/comanchedota/v/101060439',
  game: 'Dota 2',
  streamTitle: 'some stream,',
  streamStart: 1,
  vodId: 'v101060439',
  channelName: 'comancedota',
  preview: 'example.png',
  messages: [
    {
      text: 'some chat message',
      time: 22,
      from: 'batman'
    },
    {
      text: 'some chat message',
      time: 30,
      from: 'dad 76'
    },
    {
      text: 'some chat message',
      time: 35,
      from: 'winston'
    }
  ],
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
    videoContainer = (<VideoContainer video={testVideo} username='batman' emotes={{}} dbHandleVote={()=>null}/>);
  });

  it('should be able to calculate total vote counts', () => {
    let wrapper = shallow(videoContainer);
    var totalCount = wrapper.instance().calculateVotes(testVideo.votes);

    expect(totalCount).to.equal(2);
  });

  it('should update state.messagesPointer when handleTimeChange is called', () => {
    let wrapper = shallow(videoContainer);
    wrapper.setState({messages: testVideo.messages});
    expect(wrapper.state().messagesPointer).to.equal(0);
    wrapper.instance().handleTimeChange(3);
    expect(wrapper.state().messagesPointer).to.equal(1);
    wrapper.instance().handleTimeChange(18);
    expect(wrapper.state().messagesPointer).to.equal(3);
  });

  it('should initialize state.userVote based on props.username and props.video.votes', () => {
    let wrapper = shallow(videoContainer);

    // Should be -1 based on the username prop of 'batman' and batman's -1 vote
    // inside testVideo above
    expect(wrapper.state().userVote).to.equal(-1);
  });

  it('should be able to update the user\'s vote and total vote count', () => {
    let wrapper = shallow(videoContainer);

    // Stub sendVote so that we don't try to make an actual AJAX request
    stub(wrapper.instance(), 'sendVote').returns(null);

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

  it('should not render any voting buttons if no user is supplied', () => {
    let wrapper = shallow(<VideoContainer video={testVideo} emotes={{}} />);

    expect(wrapper.find('.downvote')).to.have.length(0);
    expect(wrapper.find('.upvote')).to.have.length(0);
  });
});
