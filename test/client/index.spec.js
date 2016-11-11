import Video from '../../client/src/Video';
import 'twitch-embed';

let component = (
  <div>
    <h1>Test Component</h1>
  </div>
);

let testVideo = {
  start: '2h6s',
  id: 'v97978712'
};

describe('client tests', () => {

  describe('video', () => {
    let video;
    global.Twitch = window.Twitch;
    beforeEach(() => {
      video = (<Video video={testVideo} />);
    });

    it('should have a class .video', () => {
      let wrapper = shallow(video);
      expect(wrapper.find('.video')).to.have.length(1);
    });
  });
});
