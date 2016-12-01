# TwitchLite
TwitchLite is a service that distills [Twitch](https://twitch.tv) streams into
bite-size highlight chunks for a more compact viewing experience. The chats of the
top 400+ Twitch streams are monitored at any given moment to detect when a
highlight occurs, and how standout that particular highlight is.

## Team

  - __Product Owner__: John Oksasoglu
  - __Scrum Master__: Shensen Wang
  - __Development Team Members__: Sam Sherman, John Oksasoglu, Shensen Wang

## Table of Contents

1. [Usage](#Usage)
1. [Development](#development)
1. [Contributing](#contributing)
1. [Project Structure](#project-structure)

## Usage

> Visit [our site](twitchlite.herokuapp.com)

> Click on an image to load a highlight, or log in with your Twitch account for a more personalized feed.

> You can also use the search bar to narrow down the results.


## Development

### Requirements

- Node 6.6.0
- npm 3.10.8

### Installing Dependencies

From within the root directory:

```sh
npm install
```

### Configuring Environment Variables

In order for the app to be fully functional while developing (and for many of the tests to work),
you will need to configure a few environment variables. You can do so by editing the appropriate
terminal config file based on what shell you are using. If using bash on OS X, you will most likely
need to open up `~/.bashrc`, or `~/.zshrc` if using ZSH. Whichever file it is, paste the following
at the end of the file:

```
export TWITCH_CLIENT_ID=REPLACE_ME
export TWITCH_USERNAME=REPLACE_ME
export TWITCH_PASSWORD=REPLACE_ME
export MONGODB_URI=REPLACE_ME
```

Ensure that each `REPLACE_ME` is replaced with the appropriate values. Credentials for Twitch
will need to be obtained from the developer section of your Twitch account.
If you are using a local Mongo database for development, your `MONGODB_URI` will most likely
be `mongodb://localhost/twitchlite`.

### Tasks

`mongod` to start Mongo if it is not already running.

`npm run build:watch` to start Webpack and have it recompile the front-end on file change.

`npm run start:server` to start the server running (defauls to port 8000).

`npm run start:workers` to start the worker processes of finding and saving highlights.


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## Project Structure

TwitchLite consists of 4 main components: _front-end_, _server_, _workers_, and _database_.

### Front-End (`/client`)

The TwitchLite front-end is written in [React](https://facebook.github.io/react/) and integrates with
Twitch's OAuth login system.

### Server (`/server`)

TwitchLite uses a [Node](https://nodejs.org/en/) server.

### Workers (`/workers`)

TwitchLite workers are Node-based, IRC bots that monitor Twitch chats.

### Database (`/db`)

TwitchLite uses MongoDB to store both metadata about highlights, and chat logs for each highlight.
