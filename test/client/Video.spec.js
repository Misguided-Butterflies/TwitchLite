import Video from '../../client/src/Video';

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

describe('<Video>', () => {
  let video;
  beforeEach(() => {
    video = (<Video video={testVideos[0]} />);
  });

  it('should have a class .video', () => {
    let wrapper = shallow(video);
    expect(wrapper.find('.video')).to.have.length(1);
  });
});
