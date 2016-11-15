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

let testHighlights = [
  {
    "highlightStart" : 1479151790954,
    "highlightEnd" : 1479151793955,
    "multiplier" : 5,
    "link" : "https://www.twitch.tv/comanchedota/v/101060439",
    "game" : "Dota 2",
    "streamStart" : 1479145561000,
  }, {
    "highlightStart" : 1479151790914,
    "highlightEnd" : 1479151793916,
    "multiplier" : 3.8888888888888884,
    "link" : "https://www.twitch.tv/cartmanzbs/v/101042097",
    "game" : "Dota 2",
    "streamStart" : 1479137664000,
  }, {
    "highlightStart" : 1479151778948,
    "highlightEnd" : 1479151796955,
    "multiplier" : 4.6875,
    "link" : "https://www.twitch.tv/kubon_/v/101042878",
    "game" : "Gothic II: Night of the Raven",
    "streamStart" : 1479138061000,
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
      list = (<VideoList list={testHighlights} />);
    });

    it('should render one video per item in the list', () => {
      let wrapper = render(list);
      expect(wrapper.find('.video')).to.have.length(testHighlights.length);
    });
  });
});
