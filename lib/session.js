'use strict'

const session = require('express-session')
//const RedisStore = require('connect-redis')(session)
//const config = require('../config')

module.exports = session({
  secret: 'azerty',
  resave: true,
  saveUninitialized: false,
  //store: new RedisStore(config.redis)
})
