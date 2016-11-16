import React from 'react';
import Video from '../Video';

/** VideoComponent
 * this is a component that wraps <Video> and handles all other UI and logic
 * for rendering a <Video>
 * usage:
 * let video = {
 *   id: 'v97978712', // twitch video id
 *   start: 7206, // start time of the hightlight in seconds
 *   duration: 15, // duration of the highlight in seconds
 * };
 * // ...
 * <VideoContainer video={video} />
 */
const VideoContainer = function(props) {
  return (
    <div className='video-container'>
      <Video video={props.video} />
    </div>
  );
};

VideoContainer.propTypes = {
  video: React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    start: React.PropTypes.number.isRequired,
    duration: React.PropTypes.number.isRequired,
    preview: React.PropTypes.string.isRequired,
  }).isRequired,
};

export default VideoContainer;
