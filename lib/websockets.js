'use strict'

const socketio = require('socket.io')
//const messages = require('./messages')
const session = require('./session')
//const redis = require('socket.io-redis')
//const config = require('../config')
//const debug = require('debug')('app:websocket')
const players = require('./players')
const game = require('./game')

module.exports = (server) => {
  const io = socketio.listen(server)

  //io.adapter(redis(config.redis))

  io.use((socket, next) => {
    console.log('handshaking')
    session(socket.request, {}, err => {
      if (err) {
        console.log('error grabbing session')
        return next(err)
      }

      if (socket.request.session.user) {
        socket.user = socket.request.session.user
        console.log('OK')
        next()
      } else {
        console.log('Not Authenticated')
        next(new Error('Not Authenticated'))
      }
    })
  })

  io.on('connection', (socket) => {
    console.log("Connection")
    console.log(Object.keys(io.sockets.sockets).map(id => {
      console.log(id, io.sockets.sockets[id].user)
    }))

    console.log('Socket connected', socket.user, process.pid)
    players.setSocket(socket.user, socket)

    // emit to socket:      socket.emit(…)
    // emit to all:         io.emit(…)
    // emit to all but me:  socket.broadcast.emit(…)
    // emit to room:        io.to(room).emit(…)
    // emit to room but me: socket.broadcast.to(room).emit(…)
    socket.emit('bisous')

    io.emit('players', players.listPlayerNames())
    /* socket.on('card-exchange', (user, cardId) => {
      users.exchangeCard(socket.user, user, cardId)
    }) */
    socket.on('card-check', (player, target, index, cb) => {
      cb(players.checkCard(player, target, index))
    })

    socket.on('game-start', () => {
      game.start()
      io.emit('game-start')
    })

    //socket.emit('add-card', {id:23, player:"max", text:"plouf"})
    /*socket.on('sum', (a, b, ack) => {
      ack(a + b)
    })

    socket.on('list', (fromDate, limit, cb) => {
      messages.list(fromDate, limit).then(cb)
      // TODO .catch
    })

    socket.chatroom = null

    socket.on('add', (text, cb) => {
      if (text.match(/^\/join [a-z]+$/)) {
        if (socket.chatroom) {
          socket.leave(socket.chatroom)
        }
        socket.join(socket.chatroom = text.substring(6))
        cb({ author: 'system', date: Date.now(), text: 'You joined ' + socket.chatroom})
        return
      }

      messages.add(socket.user, text).then(message => {
        cb(message)
        let target = socket.broadcast
        if (socket.chatroom) {
          target = target.to(socket.chatroom)
        }
        target.emit('new-message', message)
      })
    })*/

  })

  return io
}
