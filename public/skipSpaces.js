'use strict'

const skipSpaces = (s) => {
  return s.replace(/[ ']/g, '_')
}

module.exports = skipSpaces
