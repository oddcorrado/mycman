'use strict'

const players = require ('./players')
const _ = require('lodash')
const removeDiacritics = require('diacritics').remove

module.exports = {
  setIo,
  start,
  getData,
  reset,
  decisionStop,
  auctionStop,
  transferMoney,
  mp,
  action
}

//var cards = []
var secretStrings = [
  "nous avons des nano bots pour le controle mental",
  "nous avons des nano bots qui infligent une apathie débilitante",
  "nous avons des nano bots qui rendent euphorique et consentant",
  "nous avons des satellites pour le controle mental",
  "nous avons des satellites qui infligent une apathie débilitante",
  "nous avons des satellites qui rendent euphorique et consentant",
  "nous avons des séries télé pour le controle mental",
  "nous avons des séries télé qui infligent une apathie débilitante",
  "nous avons des séries télé qui rendent euphorique et consentant",
  "nous controlons les opérationnels du KGB",
  "nous controlons les opérationnels de la CIA",
  "nous controlons les opérationnels du MOSSAD",
  "nous avons soudoyé les cadres du KGB",
  "nous avons soudoyé les cadres de la CIA",
  "nous avons soudoyé les cadres du MOSSAD",
  "nous a la main mise sur la trésorerie du KGB",
  "nous a la main mise sur la trésorerie de la CIA",
  "nous a la main mise sur la trésorerie du MOSSAD",
  "nous a racheté au marché noir la moitié des missiles de l'armée russe",
  "nous a racheté au marché noir l'ensemble de l'aviation russe",
  "nous a racheté sur eBay l'ensemble des fusils de l'armée russe",
  "nous a racheté au marché noir la moitié des missiles de l'armée nord coréenne",
  "nous a racheté au marché noir l'ensemble de l'aviation nord coréenne",
  "nous a racheté sur eBay l'ensemble des fusils de l'armée nord coréenne",
  "nous a racheté au marché noir la moitié des missiles de l'armée américaine",
  "nous a racheté au marché noir l'ensemble de l'aviation américaine",
  "nous a racheté sur eBay l'ensemble des fusils de l'armée américaine",
  "nous a retrouvé et décongelé le cerveau d'Hitler",
  "nous a resynthétisé l'ADN d'Hitler",
  "nous a modélisé sur une puce la conscience d'Hitler",
  "nous a retrouvé et décongelé le cerveau de Staline",
  "nous a resynthétisé l'ADN de Staline",
  "nous a modélisé sur une puce la conscience de Staline",
  "nous a retrouvé et décongelé le cerveau de Napoléon",
  "nous a resynthétisé l'ADN de Napoléon",
  "nous a modélisé sur une puce la conscience de Napoléon",
]
/* var secretStrings = [
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
] */

var secrets = []

var allSecrets = []

var teamStrings = ["Illuminati", "Scientolog", "UFO"]

var soloCounts = [0, 0, 0, 0, 0, 0, 0, 1, 2]

var bank = 0

var io

//var id
function setIo(ioIn) {
  io = ioIn
}
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
        addSecret(name, {secret, isShared:true})
        addSecret(nextName, {secret, isShared:true})
      }
      for (let j = 0; j < secretCount - shareCount * 2; j++) {
        let secret = pickSecret(secrets, [name])
        addSecret(name, {secret, isShared:false})
      }
    })
  })
}

function buildSoloSecrets (names, secretCount) {
  names.forEach ((name) => {
    players.setData(name, "team", "solo")
    for (let j = 0; j < secretCount; j++) {

      let secret = pickSecret(secrets, [name])
      addSecret(name, {secret, isShared:false})
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
  console.log(teams)

  // clone secret strings
  secrets = _.concat(secretStrings)

  // build team secrets
  buildTeamSecrets(teams, 1, 5)
  buildSoloSecrets(soloNames, 5)
  shuffleSecrets ()

  setBank(10)
  players.listPlayerNames().forEach(p => players.setData(p, "money", 10))
  players.listPlayerNames().forEach(p => console.log(p, players.getData(p, "secrets"), players.getData(p, "team")))
}

function setBank(value) {
  bank = value
  io.emit("players-bank", bank)
}

function reset () {
  players.resetPlayers()
}

function getData (keys, playerName) {
  switch(keys[0]) {
  case "player": {
    let name = keys[1]
    let data = {
      team:players.getData(name, "team"),
      secrets:players.getData(name, "secrets"),
      money:players.getData(name, "money"),
      bank:bank,
      allSecrets:allSecrets
    }
    players.pushHistory(playerName, "player", data)
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
    players.pushHistory(playerName, "card", {name, card:keys[2], data})
    return data
  }
  case "word": {
    let word = removeDiacritics(keys[1]).toLowerCase()
    let names = {}
    players.listPlayerNames().forEach(name => {
      let secrets = players.getData(name, "secrets")
      secrets.forEach(secret => {
        if(removeDiacritics(secret.secret).toLowerCase().search('.*'+word) !== -1) {
          names[name] = name
        }
      })
    })
    let data = word + ":"+ Object.keys(names).reduce((a, c) => a + ' ' + c, '')
    players.pushHistory(playerName, "word", {word, data:data})
    return data
  }
  }
}

function removeAllHacks() {
  var extraBank = 0
  players.listPlayerNames().forEach(player => {
    var hacks = players.getData(player, "hacks") || {}
    if(hacks.mp) {
      Object.keys(hacks.mp).forEach(type => {
        hacks.mp[type].forEach(hack => {
          players.getSocket(player).emit('hack-stop', type, hack.name)
        })
      })
    }
  })
  setBank(bank + extraBank)
}

function activateHack(target, source, type, isTarget, cost, duration) {
  console.log(target, source, type, isTarget, cost, duration)
  if(players.getData(source, "money") < cost) {
    return false
  }
  var player = isTarget ? target : source
  var hacks = players.getData(player, "hacks") || {}
  hacks.mp = hacks.mp || {}
  hacks.mp[type] = hacks.mp[type] || []
  var hack = {origin:source, name:isTarget ? source : target, left:duration, cost}
  hacks.mp[type].push(hack)
  players.setData(player, "hacks", hacks)
  players.setData(source, "money", players.getData(source, "money") - cost)
  players.getSocket(player).emit('hack-start', type, target)
  /* var check = function() {
    if(hack.left <= 0) {
      //setBank(bank + cost)
      let index = _.findIndex(hacks.mp[type], {origin:source})
      if(index >= 0) {
        _.pullAt(hacks.mp[type], [index])
      }
    } else {
      hack.left -= 1000
      setTimeout(check, 1000)
    }
  }
  check() */
  return true
}

function action (keys, playerName) {
  switch(keys[0]) {
  case "hack-jam": {
    return activateHack(keys[1], playerName, "jammers", true, 5, 15000)
  }
  case "hack-spy": {
    return activateHack(keys[1], playerName, "spies", true, 5, 15000)
  }
  case "hack-usurp": {
    return activateHack(keys[1], playerName, "usurpators", false, 3, 5000)
  }
  }
}

function auctionStop(auctions) {
  var highestBid = auctions.reduce((highest, auction) => auction.value > highest ? auction.value : highest, 0)
  var winners = auctions.filter(auction => auction.value >= highestBid ? true : false)
  winners.forEach(winner => {
    setBank(bank + winner.value)
    winner.bids.forEach(bid => {
      players.setData(bid.player, "money", players.getData(bid.player, "money") - bid.value)
    })
  })
  removeAllHacks()
}

function decisionStop(decisions) {
  var bankCount = Object.keys(decisions).reduce((total, name) => decisions[name].y < 75 ? total + 1 : total, 0)
  var revealCount = Object.keys(decisions).reduce((total, name) => decisions[name].y > 325 ? total + 1 : total, 0)
  var moneyUpdate = 0
  if(bankCount > 0) {
    moneyUpdate = Math.trunc(bank/bankCount)
  }
  var revealCost = revealCount
  Object.keys(decisions).forEach(name => {

    if(decisions[name].y < 75) {
      players.setData(name, "money", players.getData(name, "money") + moneyUpdate)
    }
    if(decisions[name].y > 325) {
      players.setData(name, "money", players.getData(name, "money") - revealCost)
    }
  })
  setBank(bank - moneyUpdate * bankCount + revealCost * revealCount)
}

function transferMoney (source, destination, amount) {
  if(destination === "bank") {
    players.setData(source, 'money', players.getData(source, 'money') + amount)
    setBank(bank - amount)
  }
}

function mp (player, target, message) {
  let actions = []
  let playerHacks = players.getData(player, "hacks")
  let targetHacks = players.getData(target, "hacks")
  let messageUser = player
  if(playerHacks && playerHacks.mp && playerHacks.mp.usurpators && playerHacks.mp.usurpators.length > 0) {
    messageUser = playerHacks.mp.usurpators[0].name
  }


  if(targetHacks && targetHacks.mp && targetHacks.mp.jammers && targetHacks.mp.jammers.length > 0) {
    message = message.replace(/[AEIOUYaeiouy]/g, function() {
      return message.charAt(Math.trunc(message.length * Math.random()))
    })
  }
  if(targetHacks && targetHacks.mp && targetHacks.mp.spies) {
    targetHacks.mp.spies.forEach(spy => actions.push({user:messageUser, target:spy.name, message:'=>' + target + '[' + message + ']'}))
  }
  actions.push({user:messageUser, target, message})
  return actions
}