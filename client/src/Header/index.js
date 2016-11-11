import React from 'react';

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <span className='title'>TwitchLite</span>
      </div>
    );
  }
}

export default Header;