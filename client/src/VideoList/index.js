import React from 'react';
import Video from '../Video';

/** VideoList
 * a collection of Video components.
 * usage: <VideoList list={[video1, video2, video3]} />
 * each videoN above is the video from the database to pass to a Video component.
 */
const VideoList = function(props) {
  return (
    <div>
      <ul className='video-list'>
        {props.list.map(video => (
          <Video video={{
            id: video.link.split('/').map((element, index, array) => index >= array.length - 2 ? element : '').join(''),
            start: Math.floor((video.highlightStart - video.streamStart) / 1000),
            duration: Math.floor((video.highlightEnd - video.highlightStart) / 1000)
          }} />
        ))}
      </ul>
    </div>
  );
};

VideoList.propTypes = {
  list: React.PropTypes.array.isRequired
};

export default VideoList;