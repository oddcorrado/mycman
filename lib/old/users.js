'use strict'

module.exports = {
  add,
  addSecret,
  addCard,
  removeCard,
  setSocket,
  remove,
  getSecrets,
  exchangeCard,
  getCards,
  list,
  emit
}

const _ = require('lodash')
var users = []

function add (name) {
  users.push({name})
}

function setSocket (name, socket) {
  users = users.map(u => u.name === name ? {name:u.name, socket} : u)
}

function getSecrets (name) {
  return (_.find(users, {name}) || {}).secrets
}

function getCards (name) {
  return (_.find(users, {name}) || {}).cards
}

function exchangeCard (name, player, cardId) {
  console.log('exchnage', name, player, cardId)
  var u = _.find(users, {name})
  if(!u)
    return
  u.xchg = {player, cardId}
  var p = _.find(users, {name:player})

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
  users = users.map(u => u.name === name ?
    {xchg: u.xchg, name:u.name, socket:u.socket, secrets:u.secrets, cards:_.concat(u.cards||[], [card])} : u)
}

function removeCard (name, id) {
  var card
  users = users.map(u => u.name === name ?
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
  users = users.map(u => u.name === name ?
    {xchg: u.xchg, name:u.name, socket:u.socket, cards:u.cards, secrets:_.concat(u.secrets||[], [secret])} : u)
}

function remove (name) {
  users = users.filter(u => u.name === name ? false : true)
}

function emit (name, type, data) {
  users.forEach(u => {
    if(u.name === name && u.socket) {
      u.socket.emit(type, data)
      console.log("emit", name, type, data)
    }
  })
}

function list () {
  return users.map(u=>u.name)
  //return users
}
