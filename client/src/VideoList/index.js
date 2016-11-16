import React from 'react';
import Video from '../Video';

const numberOfSecondsToAddToBeginningOfHighlights = 30;

/** VideoList
 * a collection of Video components.
 * usage: <VideoList list={[video1, video2, video3]} />
 * each videoN above is the video from the database to pass to a Video component.
 */
const VideoList = function(props) {
  return (
    <div>
      <div className='video-list'>
        {props.list.map((video, i) => (
          <div key={i}>
            <Video video={{
              id: video.vodId,
              preview: video.preview,
              start: Math.floor((video.highlightStart - video.streamStart) / 1000) - numberOfSecondsToAddToBeginningOfHighlights,
              duration: Math.floor((video.highlightEnd - video.highlightStart) / 1000) + numberOfSecondsToAddToBeginningOfHighlights
            }} />
          </div>
        ))}
      </div>
    </div>
  );
};

VideoList.propTypes = {
  list: React.PropTypes.array.isRequired
};

export default VideoList;