import React from 'react';

/** NavItem
 * Represents a button/item in the site nav.
 * usage:
 * <NavItem handleClick={this.handleClick} isActive={this.state.isActive}>Some text</NavItem>
 */
const NavItem = (props) => {
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
