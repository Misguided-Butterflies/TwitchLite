import Video from '../../client/src/Video';
import VideoList from '../../client/src/VideoList'; 
 
let testVideos = [
  {
    id: 'v97978712',
    start: 7206,
    duration: 6,
  }, {
    id: 'v99478815',
    start: 9342,
    duration: 55,
  }, {
    id: 'v100239687',
    start: 22,
    duration: 9,
  }
];

describe('client tests', () => {

  describe('Video', () => {
    let video;
    beforeEach(() => {
      video = (<Video video={testVideos[0]} />);
    });

    it('should have a class .video', () => {
      let wrapper = shallow(video);
      expect(wrapper.find('.video')).to.have.length(1);
    });
  });

  describe('VideoList', () => {
    let list;
    beforeEach(() => {
      list = (<VideoList list={testVideos} />);
    });

    it('should render one video per item in the list', () => {
      let wrapper = render(list);
      expect(wrapper.find('.video')).to.have.length(testVideos.length);
    });
  });
});
