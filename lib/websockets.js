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

var colors = ["chocolate", "blue", "yellow", "green", "violet", "red", "olive", "cyan", "orange", "grey"]
var userColors = []
var user2color = {}
var users = []
// var timeLeft = 3000
var tick = 100
var auctions = []
var decisions = {}
let votes = {}
let doReset = false

var heartbits = {}

let gameOptions = {
  fakeRatio:0.25,
  secretPlayerCount:3,
  voteTimeout:20000,
  phaseTimeout:90000
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

    io.emit('players', players.listPlayerNames())
    /* socket.on('card-exchange', (user, cardId) => {
      users.exchangeCard(socket.user, user, cardId)
    }) */
  /*   socket.on('check-card', (player, target, cb) => {
      cb(players.checkCard(player, target))
    }) */

    socket.on('decision-start', () => {
      io.emit('decision-start')
      let timeLeft = 2000
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
    })

    /* socket.on('decision-move', (x,y) => {
      decisions[socket.user] = {x, y}
      if(timeLeft > 0) {
        io.emit('decision-move', x, y, socket.user, socket.userColor)
      }
    }) */

    let voteStart = () => {
      io.emit('vote-start', users, user2color)
      let timeLeft = gameOptions.voteTimeout
      votes = players.listPlayerNames().map(name => ({voter:name, target:name}))
    /*  setTimeout(() => {
        io.emit('vote-stop')
        if(!game.voteStop(votes)) {
          let timeLeft = phaseTimeout
          setTimeout(voteStart, timeLeft)
          var phaseTick = () => {
            timeLeft -= tick
            io.emit('phase-tick', timeLeft)
            if(timeLeft > 0) {
              setTimeout(phaseTick, tick)
            }
          }
          phaseTick()
        }
      }, timeLeft) */
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
          setTimeout(voteTick, tick)
        } else {
          io.emit('vote-stop')
          if(!game.voteStop(votes)) {
            // let timeLeft = phaseTimeout
            // setTimeout(voteStart, timeLeft)
            timeLeft = gameOptions.phaseTimeout
            var phaseTick = () => {
              if(doReset) {
                doReset = false
                return
              }
              timeLeft -= tick
              io.emit('phase-tick', timeLeft)
              if(timeLeft > 0) {
                setTimeout(phaseTick, tick)
              } else {
                voteStart()
              }
            }
            phaseTick()
          }
        }
      }
      voteTick()
    }

    socket.on('vote-start', () => voteStart())

    socket.on('vote-select', (target) => {
      console.log(socket.user, target)
      var vote = votes.find(vote => vote.voter === socket.user)
      if(!vote) {
        vote = {voter:socket.user}
        votes.push(vote)
      }
      vote.target = target
      console.log(votes)
       // if(timeLeft > 0) {
      io.emit('vote-select', votes)
      //} */
    })

    /*socket.on('vote-move', (x,y) => {
      votes[socket.user] = {x, y}
      if(timeLeft > 0) {
        io.emit('vote-move', x, y, socket.user, socket.userColor)
      }
    })*/

     /* socket.on('auction-start', () => {
      auctions = users.map(u => {
        return {
          player:u,
          value:0,
          bids:users.map(u =>
            {return {player:u, value:0}}
          )}
      })
      io.emit('auction-start', users, user2color, auctions)
      timeLeft = 20000
      setTimeout(() => {
        io.emit('auction-stop')
        game.auctionStop(auctions)
      }, timeLeft)
      //users.forEach(u => io.emit('decision-move', 0, 0, u, user2color[u]))
      var auctionTick = () => {
        timeLeft -= tick
        io.emit('auction-tick', timeLeft)
        if(timeLeft > 0) {
          setTimeout(auctionTick, tick)
        }
      }
      auctionTick()
    }) */

    /* socket.on('auction-bid', (player, target) => {
      var auctionTotal = auctions.reduce((total, auction) => {
        return total += _.find(auction.bids, {player:player}).value
      }, 0)
      if(timeLeft > 0 && players.getData(player, "money") > auctionTotal) {
        var auction = _.find(auctions, {player:target})
        var bid = _.find(auction.bids, {player:player})
        auction.value++
        bid.value++
        io.emit('auction-bid', auctions, user2color)
      }
    }) */

    socket.on('player-money-transfer', (target, amount) => {
      game.transferMoney(socket.user, target, amount)
    })

    socket.on('secret-share', (to, name, index, text, cb) => {
      game.shareSecret(to, name, index, text, socket.user)
      cb('success')
    })
    socket.on('mp', (player, target, message, cb) => {


      var actions = game.mp(player, target, message)
      actions.forEach(action => {
        var targetSocket = players.getSocket(action.target)
        if(targetSocket) {
          targetSocket.emit('mp', action.user, action.message)
          players.pushHistory(action.user, 'mp', {isEcho:true, target:action.target, message:action.message})
          players.pushHistory(action.target, 'mp', {isEcho:false, target:action.user , message:action.message})
        }
      })
      if(players.getSocket(target)) {
        cb(target, message)
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
      doReset = false
      game.start()
      let timeLeft = gameOptions.phaseTimeout
      var phaseTick = () => {
        if(doReset) {
          doReset = false
          return
        }
        timeLeft -= tick
        io.emit('phase-tick', timeLeft)
        if(timeLeft > 0) {
          setTimeout(phaseTick, tick)
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

let ccc = 0
    socket.on('powerup-get-all', (cb) => {
      cb([{name:socket.user, available:true, cooldownPeriod:2, cooldown: ccc, help:"this is a powerup"}])
    })

    socket.on('powerup-use', (name, cb) => {
      ccc++
      console.log('powerup-use ' + name + ' for ' + socket.user)
      socket.emit('powerup-update', [{name:socket.user, available:true,  cooldownPeriod:2, cooldown: ccc, help:"this is a powerup"}])
      cb("success")
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
