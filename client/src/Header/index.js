import React from 'react';
import {PageHeader} from 'react-bootstrap';

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <PageHeader className='centered'>
        <span className='title'>TwitchLite</span>
      </PageHeader>
    );
  }
}

export default Header;