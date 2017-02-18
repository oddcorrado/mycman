'use strict'

const users = require ('./users')
const _ = require('lodash')

var cards = []
var secretStrings = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
  'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]

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
  console.log("game starts with ", users.list())
  var strings = _.concat(secretStrings)

  var teams = []
  var u = users.list()
//  u = shuffle(u)
  teams[0] = _.slice(u, 0, users.list().length/2)
  teams[1] = _.slice(u, users.list().length/2)
  console.log("teams", teams)

  var id = 0
  var pickSecret = function (names, isHack) {
    //var s = strings[0]
    var s = strings[Math.trunc(Math.random()*strings.length)]
    strings = strings.filter(v => s !== v)
    names.forEach(name => cards.push({id:id++, name, secret:s, isHack}))
    return s
  }

  teams.forEach (t => {
    for (var i = 0; i < t.length; i++) {
      var n1 = t[i]
      var n2 = t[(i+1)%t.length]
      var secret = pickSecret([n1, n2], false)
      users.addSecret(n1, secret)
      users.addSecret(n2, secret)
      secret = pickSecret([n1], false)
      users.addSecret(n1, secret)
    }
  })

  users.list().forEach(u => {
  //  users.emit(u, 'add-card',{id:23, player:"max", text:"plouf"})
    //console.log(u, users.getSecrets(u))
    for(var i = 0; i < 3; i++) {
      var c = cards.pop()
      users.addCard(u, c)
      users.emit(u, 'add-card',{id:c.id, player:c.name, text:c.secret})
    }
    console.log(u, users.getCards(u))
  })
  console.log("users", users.list())
  console.log("cards", cards)
}
