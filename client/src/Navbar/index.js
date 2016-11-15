import React from 'react';

class Navbar extends React.Component {
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
      scope: ['user_follows_edit', 'user_read']
    });
  }
  
  logout() {
    Twitch.logout(function(err) {
      this.setState({name: ''});
    }.bind(this));
  }
  
  componentDidMount() {
    Twitch.api({method: 'user'}, function(err, user) {
      this.setState({name: user.name});
    }.bind(this));
  }
  
  render() {
    if (this.state.name === '' || !this.status.authenticated) {
      return (
        <div>
          <div onClick={this.login.bind(this)}>LOGIN</div>
        </div>
      );
    } else {
      return (
        <div>
          <div>Welcome {this.state.name}</div>
          <div onClick={this.logout.bind(this)}>LOGOUT</div>
        </div>
      );
    }
  }
};

export default Navbar;