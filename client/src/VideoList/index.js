import React from 'react';
import Video from '../Video';

/** VideoList
 * a collection of Video components.
 * usage: <VideoList list={[video1, video2, video3]} />
 * each videoN above is the video prop to pass to a Video component.
 */
const VideoList = function(props) {
  return (
    <div>
      <ul className='video-list'>
        {props.list.map(video => (<Video video={video} />))}
      </ul>
    </div>
  );
};

VideoList.propTypes = {
  list: React.PropTypes.array.isRequired
};

export default VideoList;