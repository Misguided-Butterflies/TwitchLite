import React from 'react';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, FormControl, FormGroup} from 'react-bootstrap';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    //init twitch js api
    this.state = {
      name: ''
    };
    Twitch.init({clientId: process.env.TWITCH_CLIENT_ID}, (error, status) => this.status = status);

    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
  }
  
  login() {
    Twitch.login({
      'response_type': 'token',
      'redirect_uri': location.origin,
      scope: ['user_read']
    });
  }
  
  logout() {
    Twitch.logout(err => {
      this.props.updateUser({
        name: '',
        following: []
      });
      this.setState({name: ''});
    });
  }
  
  componentDidMount() {
    //if logged in, get user's name and following channels. pass it up to main app
    if (this.status.authenticated) {
      var name = '';
      var following = [];
      Twitch.api({method: 'user'}, (err, res) => {
        name = res.name;
        Twitch.api({method: 'users/' + name + '/follows/channels'}, (err, list) => {
          for (var elem of list.follows) {
            following.push(elem.channel.name);
          }
          //update userData object in parent app
          this.props.updateUser({
            name: name,
            following: following
          });
          //update menu state with username
          this.setState({
            name: name
          });
        });
      });
    }
  }
  
  render() {
    //change user view depending on whether or not user is logged in
    var auth;
    var user;
    var userLink;
    if (this.state.name.length > 0 && this.status.authenticated) {
      auth = <MenuItem onClick={this.logout}>LOGOUT</MenuItem>;
      user = <MenuItem >{this.state.name}</MenuItem>;
      userLink = <MenuItem onClick={this.props.sort.follow}>Following</MenuItem>;
    } else {
      auth = <MenuItem onClick={this.login}>LOGIN</MenuItem>;
      user = null;
      userLink = null;
    }
    
    return (
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
            <Navbar.Brand>
              <a>TwitchLite</a>
            </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem onClick={this.props.sort.hotness}>Hottest</NavItem>
            <NavItem onClick={this.props.sort.age}>New</NavItem>
            <NavItem onClick={this.props.sort.mult}>Multiplier</NavItem>
            {userLink}
          </Nav>
          <Nav pullRight>
            <NavItem>
              <FormGroup>
                <FormControl placeholder='Search' onChange={this.props.sort.search}/>
              </FormGroup>
            </NavItem>
            <NavDropdown title="User" id="basic-nav-dropdown">
              {user}
              <MenuItem divider />
              {auth}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

Menu.propTypes = {
  sort: React.PropTypes.shape({
    mult: React.PropTypes.func,
    age: React.PropTypes.func,
    follow: React.PropTypes.func,
    hotness: React.PropTypes.func,
    search: React.PropTypes.func,
  }),
  updateUser: React.PropTypes.func
};

export default Menu;