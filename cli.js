#!/usr/bin/env node

const meow = require('meow')
const openGithubNotifications = require('./')
const Promise = require('bluebird')
const ghauth = Promise.promisify(require('ghauth'))
const authOptions = {
  configName: 'openGithubNotifications',
  note: 'Open GitHub Notifications from the CLI',
  userAgent: 'openGHNotifications',
  scopes: ['notifications']
}

const cli = meow([`
  Usage
    $ open-github-notifications <organization> <repository> [options]

  Options
    -a, --amount  The amount to open. [Default: 15]
    -p, --participating Only participating notifications. [Default: false]

	Examples
     $ open-github-notifications ifps/go-ipfs
     Now opening 15 notifications from ipfs/go-ipfs...

     $ open-github-notifications ipfs go-ipfs -a10 -p
     Now opening 10 participating notifications from ipfs/go-ipfs...
`], {
  alias: {
    a: 'amount',
    p: 'participating'
  }
})

Promise.try(() => {
  return ghauth(authOptions)
}).then((authData) => {
  if (cli.input.length >= 1) {
    return openGithubNotifications(cli.input, cli.flags, authData.token)
  } else {
    return openGithubNotifications(null, cli.flags, authData.token)
  }
}).then((result) => {
  console.log(result)
})
