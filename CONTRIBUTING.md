# Contributing

Because many of the project's unit tests depend on sensitive API keys, and Travis CI has no easy way to handle this sensitive data from external pull requests, there are some gymnastics required to submit a pull request.

## General Workflow

1. Fork the repo
1. Cut a namespaced feature branch from master
  - bug/...
  - feat/...
  - test/...
  - doc/...
  - refactor/...
1. Make commits to your feature branch. Please ensure commit messages are written in present tense.
1. When you've finished with your fix or feature, rebase upstream changes into your branch. submit a [pull request](https://github.com/Misguided-Butterflies/TwitchLite/pulls)
   to the `develop` branch. Include a description of your changes.
1. Your pull request (PR) will be reviewed by another maintainer. A maintainer will
   create a new namespaced branch, alter your PR's destination to be that branch,
   and merge it.
1. A maintainer will make an essentially identical PR from your new namespaced branch
   on the main repo to the `develop` branch. This ensures that Travis will run
   its tests with the necessary API keys.
1. Once the pull request has been reviewed, it will be merged by another member of the team.

## Questions?

For any additional questions, related to workflow or otherwise, feel free to [open an issue](https://github.com/Misguided-Butterflies/TwitchLite/issues) to start a conversation.
