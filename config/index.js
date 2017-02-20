'use strict'

const merge = require('lodash/merge')

let conf = module.exports = {}

merge(conf, require('./defaults.json'))

try {
  merge(conf, require('./' + (process.env.NODE_ENV || 'development') + '.json'))
} catch (e) {
  //console.error(e)
}

try {
  merge(conf, require('./local.json'))
} catch (e) {
//  console.error(e)
}

if (process.env.PORT) {
  conf.port = process.env.PORT
}
