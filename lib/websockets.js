'use strict'

const socketio = require('socket.io')
const moment = require('moment')
//const messages = require('./messages')
const session = require('./session')
//const redis = require('socket.io-redis')
//const config = require('../config')
const _ = require('lodash')
const players = require('./players')
const game = require('./game')
const scan = require('./scan')
const powerup = require('./powerup')
let timeoutId = null

var colors = ["chocolate", "blue", "yellow", "green", "violet", "red", "olive", "cyan", "orange", "grey"]
var userColors = []
var user2color = {}
var users = []
// var timeLeft = 3000
var tick = 1000
var auctions = []
var decisions = {}
let votes = {}
let doReset = false
let timeLeft
let isPaused = false

var heartbits = {}

let gameOptions = {
  doScan:1,
  fakeRatio:0.25,
  secretPlayerCount:3,
  voteTimeout:20000,
  phaseTimeout:240000,
  mpCredit:-1,
  soloRevealTotalCount:7,
  soloRevealTotalCountStep:2,
  soloRevealTeamCount:4,
  soloRevealTeamCountStep:1,
  numberOfChecksPerTurn:-1,
  numberOfChecksAtStart:3,
  lg:-1
}

module.exports = (server) => {
  const io = socketio.listen(server)

  game.setIo(io)

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
        if(_.find(users, u => u===socket.user) === undefined) {
          users.push(socket.user)
        }
        if(!user2color[socket.user]) {
          user2color[socket.user] = colors.pop()
          userColors.push(user2color[socket.user])
        } else {
          console.warn("RECONNECT FOR ", socket.user)
        }
        socket.userColor = user2color[socket.user]
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

    io.emit('players', scan.getIds()) // players.listPlayerNames())
    /* socket.on('card-exchange', (user, cardId) => {
      users.exchangeCard(socket.user, user, cardId)
    }) */
  /*   socket.on('check-card', (player, target, cb) => {
      cb(players.checkCard(player, target))
    }) */

    /* socket.on('decision-start', () => {
      io.emit('decision-start')
      timeLeft = 2000
      decisions = {}
      setTimeout(() => {
        io.emit('decision-stop')
        game.decisionStop(decisions)
      }, timeLeft)
      users.forEach(u => io.emit('decision-move', 0, 0, u, user2color[u]))
      var decisionTick = () => {
        timeLeft -= tick
        io.emit('decision-tick', timeLeft)
        if(timeLeft > 0) {
          setTimeout(decisionTick, tick)
        }
      }
      decisionTick()
    }) */

    /* socket.on('decision-move', (x,y) => {
      decisions[socket.user] = {x, y}
      if(timeLeft > 0) {
        io.emit('decision-move', x, y, socket.user, socket.userColor)
      }
    }) */

    let voteStart = () => {
      io.emit('vote-start', users, user2color)
      timeLeft = gameOptions.voteTimeout
      votes = players.listPlayerNames().map(name => ({voter:name, target:name}))
      game.voteStart()
      io.emit('vote-select', votes)
      users.forEach(u => io.emit('vote-move', 0, 0, u, user2color[u]))
      var voteTick = () => {
        if(doReset) {
          doReset = false
          return
        }
        timeLeft -= tick
        io.emit('vote-tick', timeLeft)
        if(timeLeft > 0) {
          timeoutId = setTimeout(voteTick, tick)
        } else {
          if(!game.voteStop(votes)) {
            // let timeLeft = phaseTimeout
            // setTimeout(voteStart, timeLeft)
            timeLeft = gameOptions.phaseTimeout
            var phaseTick = () => {
              if(doReset) {
                doReset = false
                return
              }
              if(!isPaused) {
                timeLeft -= tick
              }
              io.emit('phase-tick', timeLeft)
              if(timeLeft > 0) {
                timeoutId = setTimeout(phaseTick, tick)
              } else {
                voteStart()
              }
            }
            phaseTick()
          }
          let powerupLog = powerup.getVoteLog()
          let gameLog = game.getVoteLog()
          io.emit('vote-stop', {powerupLog, gameLog})
        }
      }
      voteTick()
    }

    socket.on('vote-start', () => timeLeft = Math.max(0, timeLeft - 30000))

    socket.on('vote-select', (target) => {
      // console.log(socket.user, target)
      var vote = votes.find(vote => vote.voter === socket.user)
      if(!vote) {
        vote = {voter:socket.user}
        votes.push(vote)
      }
      vote.target = target
      console.log(votes)
      let scrambled = votes.map(vote => ({
        target:players.listPlayerNames()[Math.trunc(4 * Math.random())], // TODO fix me
        voter:vote.voter}))
      console.log(scrambled)
      players.listPlayerNames().forEach(player => {
        players.getSocket(player).emit('vote-select', votes)
      })
      //} */
    })

    socket.on('player-money-transfer', (target, amount) => {
      game.transferMoney(socket.user, target, amount)
    })

    socket.on('secret-share', (to, name, index, text, cb) => {
      game.shareSecret(to, name, index, text, socket.user)
      cb('success')
    })

    socket.on('game-pause', () => {
      isPaused = !isPaused
      console.log('pause', isPaused)
    })

    socket.on('mp-get-credit', (cb) => {
      cb(players.getData(socket.user, 'mp-credit'))
    })

    socket.on('mp', (player, target, message, cb) => {
      var actions = game.mp(player, target, message, socket.user)
      let credit = players.getData(socket.user, 'mp-credit')
      actions.forEach(action => {
        var targetSocket = players.getSocket(action.target)
        if(targetSocket) {
          targetSocket.emit('mp', action.user, action.message)
          players.pushHistory(action.user, 'mp', {isEcho:true, target:action.target, message:action.message})
          players.pushHistory(action.target, 'mp', {isEcho:false, target:action.user , message:action.message})
        }
      })

      if(players.getSocket(target)) {
        console.log('credit', credit)
        if(actions.length !== 0) {
          cb(target, message, credit)
        } else {
          cb(target, 'no credit', credit)
        }
      }

      /* var targetSocket = players.getSocket(target)
      if(targetSocket) {
        targetSocket.emit('mp', player, message)
        players.pushHistory(socket.user, 'mp', {isEcho:true, target, message})
        players.pushHistory(target, 'mp', {isEcho:false, target:socket.user , message})
        cb(target, message)
      }
      else {
        console.warn("can't find mp socket for ", target)
      } */

    })

    socket.on('game-start', () => {
      if(timeoutId) {
        clearTimeout(timeoutId)
      }
      doReset = false
      game.start()
      timeLeft = gameOptions.phaseTimeout + 60000
      var phaseTick = () => {
        if(doReset) {
          doReset = false
          return
        }
        if(!isPaused) {
          timeLeft -= tick
        }
        io.emit('phase-tick', timeLeft)
        if(timeLeft > 0) {
          timeoutId = setTimeout(phaseTick, tick)
        } else {
          voteStart()
        }
      }
      phaseTick()
      io.emit('game-start')
    })

    socket.on('game-reset', () => {
      userColors = []
      user2color = {}
      users = []
      heartbits = {}
      doReset = true
      colors = ["chocolate", "blue", "yellow", "green", "violet", "red", "olive", "cyan", "orange", "grey"]
      game.reset()
      io.emit('game-reset')
      if(timeoutId) {
        clearTimeout(timeoutId)
      }
    })

    socket.on('game-get-data', (keys, cb) => {
      cb(game.getData(keys, socket.user))
    })

    socket.on('game-action', (keys, cb) => {
      cb(game.action(keys, socket.user))
    })

    socket.on('game-get-history', (key, cb) => {
      cb(players.getHistory(socket.user, key))
    })

    socket.on('game-get-pendings', () => {
      players.checkPendings(socket.user)
    })

    socket.on('game-get-revelations', (cb) => {
      cb(game.getRevelations())
    })

    socket.on('game-get-status', (cb) => {
      cb(game.getStatus())
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

    socket.on('game-options-get', (cb) => {
      cb(gameOptions)
    })

    socket.on('powerup-get-all', (cb) => {
      let output = powerup.getAll(socket.user)
      cb(output)
    })

    socket.on('powerup-use', (name, target, cb) => {
      if(target) {
        players.getSocket(target).emit('scan', socket.user)
      }
      let result = powerup.activate(socket.user, name, target)
      // socket.emit('powerup-update', [{name:socket.user, available:true,  cooldownPeriod:2, cooldown: ccc, help:"this is a powerup"}])
      cb(result)
    })

    socket.on('game-options-set', (newGameOptions) => {
      gameOptions = Object.assign({}, newGameOptions)
      game.setOptions(newGameOptions)
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
