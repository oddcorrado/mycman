'use strict'

/* const session = require('express-session')
//const RedisStore = require('connect-redis')(session)
//const config = require('../config')

module.exports = session({
  secret: 'azerty',
  resave: true,
  saveUninitialized: false,
  //store: new RedisStore(config.redis)
})*/

const session = require('cookie-session')
//const RedisStore = require('connect-redis')(session)
//const config = require('../config')

module.exports = session({
  name: 'mycmansession',
  keys: ['iamthemsotbcat', 'tyoiuouiiui'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
})
