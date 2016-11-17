import VideoList from '../../client/src/VideoList';

let testHighlights = [
  {
    _id: '12345abcdef',
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
    votes: {}
  }, {
    _id: '12345abcdef2',
    highlightStart: 1479151790914,
    highlightEnd: 1479151793916,
    multiplier: 3.8888888888888884,
    link: 'https://www.twitch.tv/cartmanzbs/v/101042097',
    game: 'Dota 2',
    streamTitle: 'some stream,',
    streamStart: 1479137664000,
    vodId: 'v101042097',
    channelName: 'cartmanzbs',
    preview: 'example.png',
    votes: {}
  }, {
    _id: '12345abcd3',
    highlightStart: 1479151778948,
    highlightEnd: 1479151796955,
    multiplier: 4.6875,
    link: 'https://www.twitch.tv/kubon_/v/101042878',
    game: 'Gothic II: Night of the Raven',
    streamTitle: 'some stream,',
    streamStart: 1479138061000,
    vodId: 'v101042878',
    channelName: 'kubon_',
    preview: 'example.png',
    votes: {}
  }
];

describe('<VideoList>', () => {
  let list;
  beforeEach(() => {
    list = (<VideoList list={testHighlights} username='batman' />);
  });

  it('should render one video per item in the list', () => {
    let wrapper = render(list);
    expect(wrapper.find('.video')).to.have.length(testHighlights.length);
  });
});
