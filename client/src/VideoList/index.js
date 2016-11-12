import React from 'react';
import Video from '../Video';

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