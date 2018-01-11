'use strict'

module.exports = {
  addPlayer,
  removePlayer,
  resetPlayers,
  listPlayerNames,
  tracePlayers,
  setData,
  getData,
  setSocket,
  getSocket,
  addCard,
//  checkCard,
  addPendings,
  removePendings,
  checkPendings,
  publishCard,
  pushHistory,
  getHistory
}

const _ = require('lodash')
var players = []
const isClientUpdates = {money:true}

/* A player contains
cards - "info" or "intox"
money
team - "red" or "blue" */

function addPlayer (name) {
  if(players.find(v => v.name === name)) {
    return
  }
  players.push({name})
}

function removePlayer (name) {
  players = players.filter(u => u.name === name ? false : true)
}

function resetPlayers () {
  players.forEach(p => {
    Object.keys(p).forEach(k => {
      if(k!=='name' && k!== 'socket') {
        p[k] = null
      }
    })
    p.money = 10
  })
  players = []
  //players = players.map(u => {return {name:u.name}})
}

function listPlayerNames () {
  return players.map(u=>u.name)
}

function tracePlayers () {
  console.log("############# PLAYER TRACE START")
  players.forEach(p => {
    console.log("player:", p.name)
    console.log("SECRETS:", p.secrets)
    console.log("KNOWLEDGES:", p.knowledges)
  })
  console.log("############# PLAYER TRACE END")
}

function setSocket (name, socket) {
  //players = players.map(u => u.name === name ? {name:u.name, socket} : u)
  var p = _.find(players, {name})
  if(p) {
    p.socket = socket
  }
}

function getSocket (name) {
  var p = _.find(players, {name})
  if(p) {
    return p.socket
  }
}

function addCard (name, isInfo) {
  var p = _.find(players, {name})
  if (p) {
    p.cards = (p.cards || [])
    p.cards.push({isInfo})
  }
}

/* function checkCard (name, targetName, targetIndex) {
  var p = _.find(players, {name})
  var t = _.find(players, {name:targetName})

  if (p && t && t.cards && t.cards[Number(targetIndex) - 1]) {
    if (p.checks) {
      var i = p.checks.indexOf(targetName)
      if(i != -1) {
        p.checks.splice(i, 1)
      }
      if(p.checks.length > 0) {
        getSocket(name).emit('check', p.checks[0])
      }
    }

    return t.cards[Number(targetIndex) - 1].isInfo
  }
} */

/* function checkCard (name, target) {
  var p = _.find(players, {name})
  let result = getData(target, 'card')

  if (p) {
    if (p.checks) {
      var i = p.checks.indexOf(target)
      if(i != -1) {
        p.checks.splice(i, 1)
      }
      if(p.checks.length > 0) {
        getSocket(name).emit('check', p.checks[0])
      }
    }
  }
  return result
} */

function removePendings(name, target) {
  var p = _.find(players, {name})
  if (p.pendings) {
    var i = p.pendings.indexOf(target)
    if(i === -1) {
      i = p.pendings.indexOf('*')
    }
    if(i !== -1) {
      p.pendings.splice(i, 1)
    }
    if(p.pendings.length > 0) {
      getSocket(name).emit('check', p.pendings[0])
    }
  }
  console.log(name, p.pendings)
}

function checkPendings(name) {
  let isEmpty = true
  console.log('checkPendings')
  var p = _.find(players, {name})
  if(p && p.pendings && p.pendings.length > 0) {
    isEmpty = false
    console.log(name, p.pendings)
    getSocket(name).emit('check', p.pendings[0])
  }
  return isEmpty
}

function addPendings (name, target) {
  var p = _.find(players, {name})
  if(!p) {
    return
  }
  if(!p.pendings) {
    p.pendings = []
  }
  p.pendings.push(target)
  console.log(name, p.pendings)
}

function publishCard (targetName, targetIndex) {
  var t = _.find(players, {targetName})
  if (t && t.cards && t.cards[targetIndex]) {
    return t.cards[targetIndex].isInfo
  }
}

function setData (name, key, data) {
  console.log(name, key, data)
  var player = _.find(players, {name})
  if (player) {
    player[key] = data
    if(isClientUpdates[key] === true) {
      player.socket.emit("player-" + key, player[key])
    }
  }
}

function pushHistory (name, key, data) {
  var p = _.find(players, {name})
  if (p) {
    if(!p.history) {
      p.history = {}
    }
    if(!p.history[key]) {
      p.history[key] = []
    }
    p.history[key].push(data)
  }
}

function getHistory (name, key) {
  var t = _.find(players, {name})
  if (t && t.history && t.history[key]) {
    return t.history[key]
  }
}

function getData (name, key) {
  var t = _.find(players, {name})
  if (t && t[key] !== null && t[key]!== undefined) {
    return t[key]
  } else {
    return null
  }
}
