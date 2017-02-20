'use strict'

const socketio = require('socket.io')
const moment = require('moment')
//const messages = require('./messages')
const session = require('./session')
//const redis = require('socket.io-redis')
//const config = require('../config')
//const debug = require('debug')('app:websocket')
const players = require('./players')
const game = require('./game')

var colors = ["chocolate", "blue", "yellow", "green", "violet", "red"]
var userColors = []
var user2color = {}
var users = []
var timeLeft = 3000
var tick = 100

var heartbits = {}

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
        users.push(socket.user)
        console.log("color", user2color[socket.use])
        if(!user2color[socket.user]) {
          user2color[socket.user] = colors.pop()
          userColors.push(user2color[socket.user])
        }
        socket.userColor = user2color[socket.user]
        console.log('OK', socket.user, socket.userColor)
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

    socket.on('decision-start', () => {
      io.emit('decision-start')
      timeLeft = 10000
      setTimeout(() => io.emit('decision-stop'), timeLeft)
      users.forEach(u => io.emit('decision-move', 0, 0, u, user2color[u]))
      var decisionTick = () => {
        timeLeft -= tick
        io.emit('decision-tick', timeLeft)
        if(timeLeft > 0) {
          setTimeout(decisionTick, tick)
        }
      }
      decisionTick()
    })

    socket.on('decision-move', (x,y) => {
      if(timeLeft > 0) {
        console.log('decision-move', socket.user, socket.userColor)
        io.emit('decision-move', x, y, socket.user, socket.userColor)
      }
    })

    socket.on('mp', (player, target, message) => {
      var targetSocket = players.getSocket(target)
      if(targetSocket) {
        console.log(player, target, message)
        targetSocket.emit('mp', player, message)
      }

    })

    socket.on('game-start', () => {
      game.start()
      io.emit('game-start')
    })

    socket.on('game-reset', () => {
      game.reset()
      io.emit('game-reset')
    })

    socket.on('game-get-data', (keys, cb) => {
      cb(game.getData(keys))
    })


    socket.on('players-heartbit', () => {
      heartbits[socket.user] = moment(Date())
    })

    socket.on('players-status', (cb) => {
      var status = {}
      Object.keys(heartbits).forEach(k => {
        status[k] = moment(Date()).diff(heartbits[k], 's')
      })
      cb(status)
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
