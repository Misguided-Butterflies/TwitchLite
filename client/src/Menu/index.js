import React from 'react';
import JSONP from 'browser-jsonp';
import NavItem from '../NavItem';
import InlineSVG from 'svg-inline-react';

import menuSVG from '../icons/menu.svg';

/** Menu
 * this is the component for the nav bar on our site. it has various buttons to change how the data is sorted and displayed.
 * the actual sorting functions must be passed in.
 */
class Menu extends React.Component {
  constructor(props) {
    super(props);
    //init twitch js api
    this.state = {
      name: '',
      filterByFollowedChannels: false,
      filterByFollowedGames: false,
      isMenuOpen: false,
    };

    this.toggleMenu = this.toggleMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
    this.handleClickFollowedChannels = this.handleClickFollowedChannels.bind(this);
    this.handleClickFollowedGames = this.handleClickFollowedGames.bind(this);
  }

  toggleMenu(event) {
    // Prevent the event from propagating so that the document-wide click handler
    // for closeMenu() is not called
    event.nativeEvent.stopImmediatePropagation();
    this.setState({
      isMenuOpen: !this.state.isMenuOpen
    });
  }

  closeMenu() {
    this.setState({
      isMenuOpen: false
    });
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
    return new Promise((resolve, reject) => {
      Twitch.api({method: 'user'}, (err, res) => {
        if (err) {
          reject(err);
        } else {
          obj.name = res.name;
          obj.token = Twitch.getToken();
          resolve(obj);
        }
      });
    });
  }

  getTwitchFollowedChannels(obj) {
    //promisified get user's followed channels
    let followedChannels = [];
    return new Promise((resolve, reject) => {
      Twitch.api({method: 'users/' + obj.name + '/follows/channels'}, (err, list) => {
        if (err) {
          reject(err);
        } else {
          for (let elem of list.follows) {
            followedChannels.push(elem.channel.name);
          }
          obj.followedChannels = followedChannels;
          resolve(obj);
        }
      });
    });
  }

  getTwitchFollowedGames(obj) {
    //promisified get user's followed games from twitch api
    let followedGames = [];
    return new Promise((resolve, reject) => {
      JSONP({
        url: 'https://api.twitch.tv/api/users/' + obj.name + '/follows/games',
        data: { 'oauth_token': obj.token },
        success: function(data) {
          for (let elem of data.follows) {
            followedGames.push(elem.name);
          }
          obj.followedGames = followedGames;
          resolve(obj);
        }
      });
    });
  }

  componentDidMount() {
    document.addEventListener('click', this.closeMenu);

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

  handleClickFollowedChannels (event) {
    event.nativeEvent.stopImmediatePropagation();
    let prev = this.state.filterByFollowedChannels;
    this.setState({filterByFollowedChannels: !prev});
    this.props.sort.followedChannels();
  }

  handleClickFollowedGames(event) {
    event.nativeEvent.stopImmediatePropagation();
    let prev = this.state.filterByFollowedGames;
    this.setState({filterByFollowedGames: !prev});
    this.props.sort.followedGames();
  }

  render() {
    //change user view depending on whether or not user is logged in
    let auth;
    let followedChannelsLink = null;
    let followedGamesLink = null;
    if (this.state.name.length > 0 && this.props.twitchStatus.authenticated) {
      auth = <NavItem handleClick={this.logout}>LOGOUT {this.state.name}</NavItem>;
      followedChannelsLink = (
        <NavItem handleClick={this.handleClickFollowedChannels} isActive={this.state.filterByFollowedChannels}>Followed Channels</NavItem>
      );
      followedGamesLink = (
        <NavItem handleClick={this.handleClickFollowedGames} isActive={this.state.filterByFollowedGames}>Followed Games</NavItem>
      );
    } else {
      auth = <NavItem handleClick={this.login}>LOGIN</NavItem>;
    }

    return (
      <nav className='nav'>
        <div className='nav-logo-container'>
          <img className='logo' src='/logo.png' alt='TwitchLite logo' title='Twitchlite logo' />
        </div>

        <button
          className={this.state.isMenuOpen ? 'menu-toggle active' : 'menu-toggle'}
          onClick={this.toggleMenu}
        >
          <InlineSVG src={menuSVG} />
        </button>

        <div className={this.state.isMenuOpen ? 'nav-menu open' : 'nav-menu'}>
          <div className='nav-left'>
            <ul className='nav-section'>
            <NavItem handleClick={this.props.sort.hotness}>Hottest</NavItem>
            <NavItem handleClick={this.props.sort.age}>New ({this.props.newHighlights})</NavItem>
            {followedChannelsLink}
            {followedGamesLink}
            </ul>
          </div>

          <div className='nav-right'>
            <ul className='nav-section'>
              <input placeholder='Search' onChange={this.props.sort.search}/>
              {auth}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

Menu.propTypes = {
  sort: React.PropTypes.shape({
    age: React.PropTypes.func,
    follow: React.PropTypes.func,
    hotness: React.PropTypes.func,
    search: React.PropTypes.func,
    followedGames: React.PropTypes.func,
    followedChannels: React.PropTypes.func
  }),
  updateUser: React.PropTypes.func,
  twitchStatus: React.PropTypes.object,
  newHighlights: React.PropTypes.number
};

export default Menu;
