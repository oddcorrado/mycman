'use strict'

const players = require ('./players')
const _ = require('lodash')


module.exports = {
  start,
  getData,
  reset
}

//var cards = []
var secretStrings = [
  "ils ont retrouvé et décongelé le cerveau d'Hitler",
  "ils contrôlent la mafia sicilienne",
  "ils ont la main basse sur tous les systèmes d'égout de paris",
  "ils ont les codes de la moitié des missiles nucléaires de la Corée du Nord",
  "ils sont de mèche avec les mormons et ont un accès à leur base de donnée",
  "ils ont une base sur la face cachée de la lune",
  "ils ont des satellites de contrôle mental par rayon laser",
  "ils ont recollé les morceaux du crâne de cristal",
  "ils préparent l'élection d'un zombie à la présidence russe",
  "ils ont cloné tous les plus grands scientifiques",
  "ils ont resynthétisé l'ADN du T-REX",
  "ils maîtrisent la fusion froide",
  "ils ont soudoyé presque tous les responsables de la CIA",
  "ils ont mis au point une drogue d’obéissance indétectable",
  "ils ont racheté la moitié des missiles russe",
  "ils ont créé une émission pour enfants qui leur lave le cerveau",
  "ils ont réussi à introduire leurs messages subliminaux dans la plupart des publicités",
  "ils ont les principaux opérateurs de TV sous leur coupe",
  "ils ont les chanteurs pops à leur solde pour diffuser leurs messages",
  "ils ont des nano bots près à répandre n’importe quel virus",
  "ils ont retrouvé le saint graal et s'apprêtent à s’en servir",
  "ils ont trouvé un wormhole au fond d’une cavité sous marine",
  "ils ont des postes clés au sein des principaux ministères de l’éducation",
  "ils ont creusé un tunnel pour accéder au Warehouse 23",
  "ils ont téléchargé tous les documents techniques de la zone 51",
  "ils ont synthétisé une enzyme qui rend nos arbres carnivores",
  "ils ont des satellites qui contrôlent la météo en n’importe quel point du globe",
  "ils ont créé un soleil miniature",
  "ils ont implanté une puce de contrôle dans chaque opérationnel du KGB",
  "ils ont piraté l’ensemble des drones de guerre américains",
]

var secrets = []

var allSecrets = []

var teamStrings = ["Illuminati", "Scientolog", "UFO"]

var soloCounts = [0, 0, 0, 0, 0, 1, 2, 1, 2]


//var id

// this function picks a secret and adds it to the list of cards
// it returns a secret
function pickSecret (/*, names*/) {
  var s = secrets[Math.trunc(Math.random()*secrets.length)]
  secrets = secrets.filter(v => s !== v)
  allSecrets.push(s)
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
  buildTeamSecrets(teams, 1, 5)
  buildSoloSecrets(soloNames, 5)
  shuffleSecrets ()

  players.listPlayerNames().forEach(p => console.log(p, players.getData(p, "secrets"), players.getData(p, "team")))
}

function reset () {
  players.resetPlayers()
}

function getData (keys) {
  switch(keys[0]) {
  case "player": {
    let name = keys[1]
    let data = {
      team:players.getData(name, "team"),
      secrets:players.getData(name, "secrets"),
      allSecrets:allSecrets
    }
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
