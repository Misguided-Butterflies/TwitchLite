import React from 'react';
import JSONP from 'browser-jsonp';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, FormControl, FormGroup} from 'react-bootstrap';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    //init twitch js api
    this.state = {
      name: '',
      filterByFollowedChannels: false,
      filterByFollowedGames: false
    };

    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
    this.clickFollowedChannels = this.clickFollowedChannels.bind(this);
    this.clickFollowedGames = this.clickFollowedGames.bind(this);
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
    //promisified get user's followed games from twitch api
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
  
  clickFollowedChannels () {
    let prev = this.state.filterByFollowedChannels;
    this.setState({filterByFollowedChannels: !prev});
    this.props.sort.followedChannels();
  }
  
  clickFollowedGames() {
    let prev = this.state.filterByFollowedGames;
    this.setState({filterByFollowedGames: !prev});
    this.props.sort.followedGames();
  }
  
  render() {
    //change user view depending on whether or not user is logged in
    let auth;
    let user;
    let followedChannelsLink;
    let followedGamesLink;
    let followedChannelsClass = this.state.filterByFollowedChannels ? 'filter-active' : 'filter-inactive';
    let followedGamesClass = this.state.filterByFollowedGames ? 'filter-active' : 'filter-inactive';
    if (this.state.name.length > 0 && this.props.twitchStatus.authenticated) {
      auth = <MenuItem onClick={this.logout}>LOGOUT</MenuItem>;
      user = <MenuItem >{this.state.name}</MenuItem>;
      followedChannelsLink = <MenuItem onClick={this.clickFollowedChannels} className={followedChannelsClass}>Followed Channels</MenuItem>;
      followedGamesLink = <MenuItem onClick={this.clickFollowedGames} className={followedGamesClass}>Followed Games</MenuItem>
    } else {
      auth = <MenuItem onClick={this.login}>LOGIN</MenuItem>;
      user = null;
      followedChannelsLink = null;
      followedGamesLink = null;
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
            <NavItem onClick={this.props.sort.age}>New ({this.props.newHighlights})</NavItem>
            {followedChannelsLink}
            {followedGamesLink}
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
    age: React.PropTypes.func,
    follow: React.PropTypes.func,
    hotness: React.PropTypes.func,
    search: React.PropTypes.func,
  }),
  updateUser: React.PropTypes.func,
  twitchStatus: React.PropTypes.object,
  newHighlights: React.PropTypes.number
};

export default Menu;