import React from 'react';
import VideoContainer from '../VideoContainer';

/** VideoList
 * a collection of VideoContainer components.
 * usage: <VideoList list={[video1, video2, video3]} />
 * each videoN above is the video from the database to pass to a Video component.
 */
class VideoList extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render()  {
    let spinner = this.props.list.length ? null : 
    <svg className="spinner" width="65px" height="65px" viewBox="0 0 66 66">
      <circle className="path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
      <circle className="altPath" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="20"></circle>
    </svg>;
    
    return (
      <div className='video-list'>
        {spinner}
        {this.props.list.map((video, i) => (
          <VideoContainer key={video.vodId + video.highlightStart} video={video} username={this.props.username} emotes={this.props.emotes} dbHandleVote={this.props.dbHandleVote}/>
        ))}
      </div>
    );
  }
};

VideoList.propTypes = {
  list: React.PropTypes.array.isRequired,
  emotes: React.PropTypes.object.isRequired,
  username: React.PropTypes.string,
  dbHandleVote: React.PropTypes.func
};

export default VideoList;
