import React from 'react';

const NavItem = (props) => {
  console.log('is active?', props.isActive);
  return (
    <li className={props.isActive ? 'nav-item active' : 'nav-item'} onClick={props.handleClick}>
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
  handleClick: React.PropTypes.func.isRequired,
  isActive: React.PropTypes.bool
};

export default NavItem;
