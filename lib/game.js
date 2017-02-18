'use strict'

const players = require ('./players')
const _ = require('lodash')

//var cards = []
var secretStrings = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
  'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'BB', 'CC', 'DD', 'EE', 'FF', 'GG', 'HH', 'II'
]

var secrets = []

var teamStrings = ["Illuminati", "Scientolog", "UFO"]

var soloCounts = [0, 0, 0, 0, 0, 1, 2, 1, 2]


//var id

// this function picks a secret and adds it to the list of cards
// it returns a secret
function pickSecret (/*, names*/) {
  var s = secrets[Math.trunc(Math.random()*secrets.length)]
  secrets = secrets.filter(v => s !== v)
  //names.forEach(name => cards.push({id:id++, name, secret:s}))
  return s
}

function addSecret (name, secret) {
  var secrets = players.getData(name, "secrets") || []
  secrets.push(secret)
  players.setData(name, "secrets", secrets)
}

function buildTeamSecrets (teams, shareCount, secretCount) {
  teams.forEach ((team, teamIndex) => {
    team.forEach ((name, nameIndex) => {
      players.setData(name, "team", teamStrings[teamIndex])
      for (let j=0; j < shareCount; j++) {
        let nextName = team[(nameIndex+1)%team.length]
        let secret = pickSecret(secrets, [name, nextName])
        addSecret(name, secret)
        addSecret(nextName, secret)
      }
      for (let j = 0; j < secretCount - shareCount * 2; j++) {
        let secret = pickSecret(secrets, [name])
        addSecret(name, secret)
      }
    })
  })
}

function buildSoloSecrets (names, secretCount) {
  names.forEach ((name) => {
    players.setData(name, "team", "solo")
    for (let j = 0; j < secretCount; j++) {

      let secret = pickSecret(secrets, [name])
      addSecret(name, secret)
    }
  })
}

function shuffleSecrets () {
  var playerNames = players.listPlayerNames()
  playerNames.forEach(name => {
    var secrets = players.getData(name, "secrets")
    secrets = shuffle(secrets)
    players.setData(name, "secrets", secrets)
  })
}

// create teams
function createTeams (playerNames) {
  var teams = []
  playerNames = shuffle(playerNames)
  teams[0] = _.slice(playerNames, 0, playerNames.length/2)
  teams[1] = _.slice(playerNames, playerNames.length/2)
  return teams
}


module.exports = {
  start,
  getData
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

  // create teams
  var teamNames = players.listPlayerNames()
  teamNames = shuffle(teamNames)
  var soloNames = []
  var soloCount = soloCounts[teamNames.length]
  for(let i=0;i<soloCount;i++) {
    soloNames.push(teamNames.pop())
  }
  var teams = createTeams(teamNames)

  // clone secret strings
  secrets = _.concat(secretStrings)

  // build team secrets
  buildTeamSecrets(teams, 2, 5)
  buildSoloSecrets(soloNames, 5)
  shuffleSecrets ()

  players.listPlayerNames().forEach(p => console.log(p, players.getData(p, "secrets"), players.getData(p, "team")))
}

function getData (keys) {
  switch(keys[0]) {
  case "player": {
    let name = keys[1]
    let data = {team:players.getData(name, "team"), secrets:players.getData(name, "secrets")}
    return data
  }
  case "card": {
    let name = keys[1]
    let secrets = players.getData(name, "secrets")
    let secret = "bug"
    if(secrets && secrets[Number(keys[2])]) {
      secret = secrets[Number(keys[2])]
    }
    let data = secret
    return data
  }
  }
}
