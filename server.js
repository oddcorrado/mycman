'use strict'

const http = require('http')
const app = require('./app')
const ws = require('./lib/websockets')
const config = require('./config')

const server = http.createServer(app)

ws(server)

module.exports = server
//if (!module.parent) {
  server.listen(config.port, /*'127.0.0.1',*/ () => {
    console.log('Server ready', server.address())
  })
//}

server.on('error', (err) => {
  console.error('Error:', err)
  process.exit(1)
})


// Detect blocked event loop
const timeout = 1000
function detectBlocking () {
  const start = Date.now() // TODO process.hrtime()
  setTimeout(() => {
    const delay = Date.now() - start
    if (delay > timeout * 1.1) {
      // late? event-loop was blocked more than "timeout" ms
      console.error('BLOCKING EVENT LOOP!', delay)
    }
    detectBlocking()
  }, timeout)
}
detectBlocking()
