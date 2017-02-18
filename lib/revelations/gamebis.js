'use strict'

const players = require ('./players')
const _ = require('lodash')

var cards = []
var isInfos = [false, false, true, true, true]

module.exports = {
  start
}

function shuffle (array) {
  var currentIndex = array.length, temporaryValue, randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

function start () {
  console.log("game starts with ")
  players.tracePlayers()

  var teams = []
  var playerNames = players.listPlayerNames()
//  u = shuffle(u)
  teams[0] = _.slice(playerNames, 0, playerNames.length/2)
  teams[1] = _.slice(playerNames, playerNames.length/2)
  console.log("teams", teams)


  playerNames.forEach( p => {
    isInfos = shuffle(isInfos)
    isInfos.forEach(i => players.addCard(p,i))
  })

  players.tracePlayers()
}
