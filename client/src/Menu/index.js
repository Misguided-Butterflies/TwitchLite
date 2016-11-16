import React from 'react';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    //init twitch js api
    this.state = {
      name: ''
    };
    Twitch.init({clientId: process.env.TWITCH_CLIENT_ID}, function(error, status) {
      this.status = status;
    }.bind(this));
  }
  
  login() {
    Twitch.login({
      response_type: 'token',
      redirect_uri: 'http://localhost:8000',
      scope: ['user_read']
    });
  }
  
  logout() {
    Twitch.logout(function(err) {
      this.props.user({
        name: '',
        following: []
      });
      this.setState({name: ''});
    }.bind(this));
  }
  
  componentDidMount() {
    //if logged in, get user's name and following channels. pass it up to main app
    if (this.status.authenticated) {
      var name = '';
      var following = [];
      Twitch.api({method: 'user'}, function(err, res) {
        name = res.name;
        Twitch.api({method: 'users/' + name + '/follows/channels'}, function(err, list) {
          for (var elem of list.follows) {
            following.push(elem.channel.name);
          }
          //update userData object in parent app
          this.props.user({
            name: name,
            following: following
          })
          //update menu state with username
          this.setState({
            name: name
          });
        }.bind(this));
      }.bind(this))
    }
  }
  
  
  render() {
    //change user view depending on whether or not user is logged in
    var auth;
    var user;
    var userLink;
    if (this.state.name.length > 0 && this.status.authenticated) {
      auth = <MenuItem onClick={this.logout.bind(this)}>LOGOUT</MenuItem>;
      user = <MenuItem >{this.state.name}</MenuItem>;
      userLink = <MenuItem onClick={this.props.sort.follow}>Following</MenuItem>;
    } else {
      auth = <MenuItem onClick={this.login.bind(this)}>LOGIN</MenuItem>;
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
            <NavItem onClick={this.props.sort.mult}>Hottest</NavItem>
            <NavItem onClick={this.props.sort.age}>New</NavItem>
            {userLink}
          </Nav>
          <Nav pullRight>
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
};

export default Menu;