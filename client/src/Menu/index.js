import React from 'react';
import JSONP from 'browser-jsonp';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, FormControl, FormGroup} from 'react-bootstrap';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    //init twitch js api
    this.state = {
      name: ''
    };

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
        followedChannels: [],
        followedGames: []
      });
      this.setState({name: ''});
    });
  }
  

  getTwitchUser(obj) {
    //promisified Twitch get user, gets token
    return new Promise((succ, fail) => {
      Twitch.api({method: 'user'}, (err, res) => {
        if (err) {
          fail(err);
        } else {
          obj.name = res.name;
          obj.token = Twitch.getToken();
          succ(obj);
        }
      });
    });
  }
  
  getTwitchFollowedChannels(obj) {
    //promisified get user's followed channels
    let followedChannels = [];
    return new Promise((succ, fail) => {
      Twitch.api({method: 'users/' + obj.name + '/follows/channels'}, (err, list) => {
        if (err) {
          fail(err)
        } else {
          for (let elem of list.follows) {
            followedChannels.push(elem.channel.name);
          }
          obj.followedChannels = followedChannels;
          succ(obj);
        }
      });
    });
  }
  
  getTwitchFollowedGames(obj) {
    //promisified get user's followed games
    let followedGames = [];
    return new Promise((succ, fail) => {
      JSONP({
        url: 'https://api.twitch.tv/api/users/' + obj.name + '/follows/games',
        data: { oauth_token: obj.token },
        success: function(data) { 
          for (let elem of data.follows) {
            followedGames.push(elem.name);
          }
          obj.followedGames = followedGames;
          succ(obj);
        }
      });
    })
  }
  
  componentDidMount() {
    //if logged in, get user's name and followed things. pass it up to main app
    var that = this;
    if (this.props.twitchStatus.authenticated) {
      this.getTwitchUser({})
        .then(this.getTwitchFollowedChannels)
        .then(this.getTwitchFollowedGames)
        .then(
        function(data) {
          //update userData object in parent app
          that.props.updateUser({
            name: data.name,
            followedChannels: data.followedChannels,
            followedGames: data.followedGames
          });
          //update menu state with username
          that.setState({
            name: data.name
          });
        }
      );
    }
  }
  
  render() {
    //change user view depending on whether or not user is logged in
    var auth;
    var user;
    var followedChannelLink;
    var followedGameLink;
    if (this.state.name.length > 0 && this.props.twitchStatus.authenticated) {
      auth = <MenuItem onClick={this.logout}>LOGOUT</MenuItem>;
      user = <MenuItem >{this.state.name}</MenuItem>;
      followedChannelLink = <MenuItem onClick={this.props.sort.followedChannels}>Followed Channels</MenuItem>;
      followedGameLink = <MenuItem onClick={this.props.sort.followedGames}>Followed Games</MenuItem>
    } else {
      auth = <MenuItem onClick={this.login}>LOGIN</MenuItem>;
      user = null;
      followedChannelLink = null;
      followedGameLink = null;
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
            {followedChannelLink}
            {followedGameLink}
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