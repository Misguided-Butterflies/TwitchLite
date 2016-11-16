import React from 'react';
import VideoContainer from '../VideoContainer';

/** VideoList
 * a collection of VideoContainer components.
 * usage: <VideoList list={[video1, video2, video3]} />
 * each videoN above is the video from the database to pass to a Video component.
 */
const VideoList = function(props) {
  return (
    <div className='video-list'>
      {props.list.map((video, i) => (
        <VideoContainer key={i} video={video} />
      ))}
    </div>
  );
};

VideoList.propTypes = {
  list: React.PropTypes.array.isRequired
};

export default VideoList;
