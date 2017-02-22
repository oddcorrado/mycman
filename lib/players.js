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
  checkCard,
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
  //players = players.map(u => {return {name:u.name}})
}

function listPlayerNames () {
  return players.map(u=>u.name)
}

function tracePlayers () {
  players.forEach(p => {
    console.log("player:", p.name, p.secrets)
  })
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

function checkCard (name, targetName, targetIndex) {
  var p = _.find(players, {name})
  var t = _.find(players, {name:targetName})

  if (p && t && t.cards && t.cards[Number(targetIndex) - 1]) {
    return t.cards[Number(targetIndex) - 1].isInfo
  }
}

function publishCard (targetName, targetIndex) {
  var t = _.find(players, {targetName})
  if (t && t.cards && t.cards[targetIndex]) {
    return t.cards[targetIndex].isInfo
  }
}

function setData (name, key, data) {
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
  if (t && t[key]) {
    return t[key]
  } else {
    return null
  }
}

 /* function getSecrets (name) {
  return (_.find(players, {name}) || {}).secrets
}

function getCards (name) {
  return (_.find(players, {name}) || {}).cards
}

 function exchangeCard (name, player, cardId) {
  console.log('exchnage', name, player, cardId)
  var u = _.find(players, {name})
  if(!u)
    return
  u.xchg = {player, cardId}
  var p = _.find(players, {name:player})

  if(p && p.xchg && p.xchg.player === name) {
    console.log("exchange", p.xchg.player)
    var uCard = removeCard(name, u.xchg.cardId)
    var pCard = removeCard(player, p.xchg.cardId)
    emit(name, "remove-card", {id:cardId})
    emit(player, "remove-card", {id:p.xchg.cardId})
    emit(name, "add-card", {id:pCard.id, player:pCard.name, text:pCard.secret})
    emit(player, "add-card", {id:uCard.id, player:uCard.name, text:uCard.secret})
    console.log(uCard, pCard)
    p.xchg = null
    u.xchg = null
  }
}

function addCard (name, card) {
  players = players.map(u => u.name === name ?
    {xchg: u.xchg, name:u.name, socket:u.socket, secrets:u.secrets, cards:_.concat(u.cards||[], [card])} : u)
}

function removeCard (name, id) {
  var card
  players = players.map(u => u.name === name ?
    {xchg: u.xchg, name:u.name, socket:u.socket, secrets:u.secrets, cards:_.remove(u.cards||[],
      (c) => {
        if(c.id === id) {
          card = c
          return true
        }
      } )} : u)
  return card
}

function addSecret (name, secret) {
  players = players.map(u => u.name === name ?
    {xchg: u.xchg, name:u.name, socket:u.socket, cards:u.cards, secrets:_.concat(u.secrets||[], [secret])} : u)
}

function emit (name, type, data) {
  players.forEach(u => {
    if(u.name === name && u.socket) {
      u.socket.emit(type, data)
      console.log("emit", name, type, data)
    }
  })
}

function list () {
  return players.map(u=>u.name)
  //return players
} */
