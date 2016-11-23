import React from 'react';

const NavItem = (props) => {
  return (
    <li className='nav-item' onClick={props.handleClick}>
      <button className='nav-button'>
        {props.children}
      </button>
    </li>
  );
};

NavItem.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.array
  ]),
  handleClick: React.PropTypes.func.isRequired
};

export default NavItem;
