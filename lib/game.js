'use strict'

const players = require ('./players')
const log = require ('./log')
const _ = require('lodash')
const removeDiacritics = require('diacritics').remove
const secretStrings = require('./secrets')
const powerup = require('./powerup')
const scan = require('./scan')

module.exports = {
  setIo,
  start,
  getData,
  getRevelations,
  reset,
  decisionStop,
  voteStart,
  voteStop,
  voteCount,
  auctionStop,
  transferMoney,
  mp,
  shareSecret,
  setOptions,
  getOptions,
  getVoteLog : () => voteLog,
  getStatus : () => status
}

// var soloCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2]
let topologies = [
  [0], // 0
  [[1]], // 1
  [[1,1]], // 2
  [[2,1]], // 3
  [[2,2], [2,2]], // 4
  [[1,2,2], [1,2,2], [1,2,2]], // 5
  [[3,3]], // 6
  [[4,3], [4,3]], // 7
  [[4,4]], // 8
  [[4,5], [5,4]], // 9
  [[5,5]], // 10
  [[6,5], [5,5,1]], // 11
  [[6,6]] // 12
]

let gameOptions = {
  doScan:-1,
  mpCredit:-1,
  fakeRatio:-1,
  secretPlayerCount:3,
  soloRevealTotalCount:7,
  soloRevealTotalCountStep:2,
  soloRevealTeamCount:4,
  soloRevealTeamCountStep:1
}

let status = {state: 'idle', turn: 0}
let topology = null
let soloNames = []
let bank = 0
let io
let loseCount = 5
let knowledgePlayerCount = 0
let revelationTeamIndex = 0
let soloLoseCount = Math.min(4, gameOptions.secretPlayerCount)
let secrets = []
let allSecrets = []
let teamStrings = ["Illuminati", "Templar"]
let teamCommonSecrets = []
let teams = []
let teamLeaders = []
let isLeaderMode = true
let hintHistory = []
let useTeamCommonSecrets = true

let gameSecrets = []
let unusedNonLeaderSecrets = []
let voteLog = {}

const soloGoalTexts = {
  soloRevealOneSolo:'Révéler tous les secrets d\'un joueur solo',
  soloRevealOneSecretEach:'Révéler un secret par joueur',
  soloRevealTeamCount:'Révéler les secrets d\'une équipe : ',
  soloRevealTotalCount:'Révéler un nombre total de secrets : '
}

const soloGoalKeys = [
  'soloRevealOneSolo',
  'soloRevealOneSecretEach',
  'soloRevealTeamCount',
  'soloRevealTotalCount'
]

let soloGoalKey = 'soloRevealTeamCount'

function setOptions(options) {
  gameOptions = Object.assign({}, options)
  soloLoseCount = Math.min(4, gameOptions.secretPlayerCount)
}

function getOptions(options) {
  return gameOptions
}

//var id
function setIo(ioIn) {
  io = ioIn
}
// this function picks a secret and adds it to the list of cards
// it returns a secret
function pickSecret (name, type) {
  let filteredSecrets = secrets
  let types = []
  if(name) {
    let secrets = players.getData(name, "secrets")
    types = secrets.map(s => s.secret.type)
    filteredSecrets = filteredSecrets.filter(v => {
      if(types.find(t => t === v.type)){
        return false
      } else {
        return true
      }
    })
  }
  if(type) {
    filteredSecrets = filteredSecrets.filter(v => type === v.type)
  }
  let s = Object.assign({} , filteredSecrets[Math.trunc(Math.random() * filteredSecrets.length)])

  secrets = secrets.filter(v => s.secret !== v.secret) // remove secret
  allSecrets.push(s)
  gameSecrets.push(s)
  unusedNonLeaderSecrets.push(s)
  // console.log(unusedNonLeaderSecrets)
  //names.forEach(name => cards.push({id:id++, name, secret:s}))
  return s
}

function addSecret (name, secret) {
  var secrets = players.getData(name, "secrets") || []
  secrets.push(secret)
  players.setData(name, "secrets", secrets)
}

function addKnowledge (name, knowledge) {
  var knowledges = players.getData(name, "knowledges") || []
  knowledges.push(knowledge)
  players.setData(name, "knowledges", knowledges)
}

/* function buildTeamSecretsShared (teams, shareCount, secretCount) {
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
} */

function randomElement(table) {
  return table[Math.trunc(Math.random() * table.length)]
}

function randomRange(range) {
  return Math.trunc(Math.random() * range)
}

function getTeamPlayer(team, exclude) {
  let index = teamStrings.findIndex(name => name === team)
  let names =  teams[index]
  if(!names) {
    return null
  }
  names = names.filter(name => name !== exclude)
  return randomElement(names)
}

function getOtherTeam(team) {
  return teamStrings.find(name => name !== team)
}

function getTeamSecret(team, exclude) {
  let output = null
  let teamPlayer = getTeamPlayer(team)
  if(teamPlayer === null) {
    return secretStrings[randomRange(secretStrings.length)].hint
  }
  while(!output || output === exclude) {
    output = players.getData(teamPlayer, "secrets")[randomRange(gameOptions.secretPlayerCount)].secret.hint
  }
  return output
}

function buildHintHasExactlyOne(team) {
  let secrets = []
  secrets[0] = getTeamSecret(team)
  secrets[1] = getTeamSecret(getOtherTeam(team), secrets[0])
  shuffle(secrets)
  let output = "Les " + team + " ont SOIT " + secrets[0] + " SOIT " + secrets[1]
  return output
}

function buildHintHasAtLeast(team) {
  let secrets = []
  secrets[0] = getTeamSecret(team)

  if(Math.random() > 0.5) {
    secrets[1] = getTeamSecret(team, secrets[0])
  } else {
    secrets[1] = getTeamSecret(getOtherTeam(team), secrets[0])
  }
  shuffle(secrets)
  let output = "Les " + team + " ont " + secrets[0] + " ET/OU " + secrets[1]
  return output
}

function buildHintLeader() {
  let leaderSecrets = teamLeaders.map(name => players.getData(name, "secrets")[randomRange(gameOptions.secretPlayerCount)].secret.hint)
  shuffle(leaderSecrets)

  let output = leaderSecrets.reduce((a, v) => a += v + ' ET ', 'Les élus ont ')
  output = output.slice(0, output.length - 4)
  return output
}

function buildHintLeaderNegative() {
  shuffle(unusedNonLeaderSecrets)

  if(unusedNonLeaderSecrets.length <= 0) {
    return null
  }

  if(teams.length <= 2) {
    return "Les élus n'ont pas " + unusedNonLeaderSecrets.pop().secret
  }

  let output = ''
  for (let i = 0; i < teams[0].length - 1; i++) {
    output += 'ni ' + unusedNonLeaderSecrets.pop().secret + ' '
  }

  return "Les élus n'ont " + output
}

function buildHintDirect(team) {
  let isTrue = Math.random() > gameOptions.fakeRatio
  let secret = null
  let output = null
  while(output === null || hintHistory.find(hint => hint === output)) {
    secret =  isTrue ? getTeamSecret(team) : getTeamSecret(getOtherTeam(team))
    output = "Les " + team + " ont " + secret
  }
  hintHistory.push(output)
  return isTrue ? output : "!" + output
}

function buildHint(team) {
  if (!team) {
    return buildHintLeaderNegative()
  }
  return buildHintDirect(team)
}

function buildSoloSecrets (names, secretCount) {
  names.forEach ((name) => {
    let countText = ''
    soloGoalKey = randomElement(soloGoalKeys)
    if(soloGoalKey === 'soloRevealTotalCount') {
      countText = gameOptions.soloRevealTotalCount + gameOptions.soloRevealTotalCountStep * (teams[0].length - 2)
    }
    if(soloGoalKey === 'soloRevealTeamCount') {
      countText = gameOptions.soloRevealTeamCount + gameOptions.soloRevealTeamCountStep * (teams[0].length - 2)
    }
    players.setData(name, "team", "solo - " + soloGoalTexts[soloGoalKey] + countText)
    for (let j = 0; j < secretCount; j++) {

      let secret = pickSecret(name)
      addSecret(name, {secret, isShared:false})
    }

    /* players.listPlayerNames().forEach(other => {
      let secrets = players.getData(other, "secrets")
      let secret = secrets[Math.trunc(Math.random() * gameOptions.secretPlayerCount)]
      addKnowledge(name, secret.secret.hint)
    }) */

  })
}

function buildTeamSecretsCommonSecret (teams, secretCount) {
  teams.forEach ((team, teamIndex) => {
    teamCommonSecrets[teamIndex] = pickSecret(null, 'bomb')
    // add secrets
    team.forEach ((name) => {
      let commonSecret = Object.assign({}, teamCommonSecrets[teamIndex])
      gameSecrets.push(commonSecret)
      addSecret(name, {secret:commonSecret, isRevealed:false, isShared:true})
      players.setData(name, "team", teamStrings[teamIndex])
      for (let j = 0; j < secretCount - 1; j++) {
        let secret = pickSecret(name)
        addSecret(name, {secret, isRevealed:false, isShared:false})
      }
    })
  })
}

function buildTeamSecretsWithKnowledges (teams, knowledgeCount, secretCount) {
  teams.forEach ((team, teamIndex) => {
    // add secrets
    team.forEach ((name) => {
      players.setData(name, "team", teamStrings[teamIndex])
      for (let j = 0; j < secretCount; j++) {
        let secret = pickSecret(name)
        addSecret(name, {secret, isRevealed:false})
      }
    })

    // add knowledges
    team.forEach ((name, nameIndex) => {
      for (let j = 0; j < knowledgeCount; j++) {
        // FIXME
        let nextName = null
        if(team.length > 2 && Math.random() > 0.5) {
          nextName = team[(nameIndex + 1 /*+j*/) % team.length]
        } else {
          nextName = team[(nameIndex + 1 /*+j */)%team.length]
        }

        let secrets = players.getData(name, "secrets")
        let secret = secrets[j]
        addKnowledge(nextName, secret.secret.hint)
      }
    })
  })
}

function filterLeadersIndex() {
  teamLeaders.forEach(leader => {
    let secrets = players.getData(leader, "secrets")

    secrets.forEach(secret => {
      unusedNonLeaderSecrets = unusedNonLeaderSecrets.filter(v => secret.secret.secret !== v.secret)
    })
  })
}

function buildTeamLeaders (teams) {
  teamLeaders = []
  teams.forEach((team, i) => {
    let leaderIndex = randomRange(team.length)
    teamLeaders[i] = team[leaderIndex]
    team.forEach ((name, i) => {
      players.setData(name, "leader", i === leaderIndex)
    })
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
function createTeams (playerNames, teamCount) {
  let teams = []
  playerNames = shuffle(playerNames)
  if(teamCount !== 1) {
    teams[0] = _.slice(playerNames, 0, playerNames.length / 2)
    teams[1] = _.slice(playerNames, playerNames.length / 2)
  } else {
    teams[0] = _.slice(playerNames, 0, playerNames.length)
  }

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

  log.reset()
  players.listPlayerNames().forEach(name => {
    players.setData(name, "knowledges", [])
    players.setData(name, "secrets", [])
    players.resetHistory(name)
  })

  hintHistory = []
  // create teams
  var teamNames = players.listPlayerNames()
  teamNames = shuffle(teamNames)
  // clone secret strings
  secrets = _.concat(secretStrings).slice(0, 22) //teamNames.length * gameOptions.secretPlayerCount)
  soloNames = []
  unusedNonLeaderSecrets = []
  gameSecrets = []
  allSecrets = []
  teamCommonSecrets = []

  topology = topologies[teamNames.length][Math.trunc(Math.random() * topologies[teamNames.length].length)]

  console.log("topology", topology)

  var soloCount = topology.reduce((a,v) => v === 1 ? a + 1 : a, 0)

  var teamCount = topology.reduce((a,v) => v !== 1 ? a + 1 : a, 0)

  for(let i=0;i<soloCount;i++) {
    soloNames.push(teamNames.pop())
  }
  teams = createTeams(teamNames, teamCount)
  console.log(teams, soloNames)

  // build team secrets
  // buildTeamSecrets(teams, 1, 5)
//  buildTeamSecrets(teams, knowledgePlayerCount, gameOptions.secretPlayerCount
  if(useTeamCommonSecrets) {
    buildTeamSecretsCommonSecret(teams, gameOptions.secretPlayerCount)
  } else {
    buildTeamSecretsWithKnowledges(teams, knowledgePlayerCount, gameOptions.secretPlayerCount)
  }

  buildSoloSecrets(soloNames, gameOptions.secretPlayerCount)
  buildTeamLeaders(teams)
  filterLeadersIndex()

  shuffleSecrets ()
  players.tracePlayers()

  setBank(10)
  let names = players.listPlayerNames()
  //names.forEach(p => players.setData(p, "money", 10))
  names.forEach(p => players.setData(p, "actions", 0))
  /* names.forEach(name=>{
    names.forEach(target => {
      if(name !== target) {
        players.addPendings(name, target)
      }
    })
    players.checkPendings(name)
  }) */

  // TODO check solo

  let knowledges = []
  if(useTeamCommonSecrets) {
    knowledges = [
      'Les ' + teamStrings[0] + ' ont ' + teamCommonSecrets[0].secret,
      'Les ' + teamStrings[1] + ' ont ' + teamCommonSecrets[1].secret,
    ]
  } else {
    knowledges = [
      buildHint(teamStrings[0]),
      buildHint(teamStrings[1])
    ]
  }


  if(isLeaderMode) {
    knowledges.push(buildHint(null))
  }

  names.forEach(name=>{
    players.clearPendings(name)
    players.addPendings(name, '*')
    players.checkPendings(name)
    players.setData(name, "mp-credit", gameOptions.mpCredit)
    knowledges.forEach(knowledge =>
      addKnowledge(name, knowledge)
    )
  })

  players.listPlayerNames().forEach(p => console.log(p, players.getData(p, "secrets"), players.getData(p, "team")))

  powerup.start(gameSecrets)

  status = {state: 'start', turn: 1}
}

function setBank(value) {
  bank = value
  io.emit("players-bank", bank)
}

function gameOver(winners) {
  console.log("GAME OVER #############")
  console.log(winners)
  let data = {}

  if(winners === -1) {
    data.winnerTeams = 'Solo'
    data.winners = []
    soloNames.forEach(name => data.winners = data.winners.concat(name))
  }
  else {
    data.winnerTeams = winners.reduce((a,v) => a + ' ' + teamStrings[v], '')
    data.winners = []
    winners.forEach(i => data.winners = data.winners.concat(teams[i]))
  }

  console.log(data.winners)
  data.messages = log.messagesAll()
  data.votes = log.votesAll()
  console.log(data)
  io.emit("gameOver", data)
}

function reset () {
  status = {state: 'idle', turn: 0}
  players.resetPlayers()
  log.reset()
  scan.reset()
}

function getRevelations () {
  let revelations = []
  players.listPlayerNames().forEach(name => {
    secrets = players.getData(name, "secrets")
    if(secrets) {
      secrets.forEach((secret, i) => {
        if(secret.isRevealed) {
          revelations.push({name, card:i+1, secret})
        }
      })
    }
  })
  // console.log("revelations", revelations)
  return revelations
}

function shareSecret(playerName, name, index, text, src) {
  players.getSocket(playerName).emit('secret-share-rx', name, index, text, src)
  players.pushHistory(playerName, "card", {name, src, card:index - 1, data: {secret:{secret:text, hint:text}}})
}

function getData (keys, playerName) {
  switch(keys[0]) {
  case "player": {
    let name = keys[1]
    let isLeader = players.getData(name, "leader")
    let data = {
      team:isLeader ? "élu" : players.getData(name, "team"),
      secrets:(isLeader && useTeamCommonSecrets) ? [] : players.getData(name, "secrets"),
      money:players.getData(name, "money"),
      actions:players.getData(name, "actions"),
      knowledges:players.getData(name, "knowledges"),
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
    players.pushHistory(playerName, "card", {name, src:'check', card:keys[2], data})
    players.removePendings(playerName, name)
    data.doHide = players.checkPendings(playerName)
    data.checkee = name
    data.index = Number(keys[2])
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
  // var extraBank = 0
  players.listPlayerNames().forEach(player => {
    /* var hacks = players.getData(player, "hacks") || {}
     if(hacks.mp) {
      Object.keys(hacks.mp).forEach(type => {
        hacks.mp[type].forEach(hack => {
          extraBank += hack.cost
          players.getSocket(player).emit('hack-stop', type, hack.name)
        })
      })
    } */
    players.setData(player, 'hacks', {})
  })
//  setBank(bank + extraBank)
}

function updateHacks() {
  players.listPlayerNames().forEach(player => {
    let hacks = players.getData(player, "hacks") || {}
    hacks.mp = hacks.mp || {}
    Object.keys(hacks.mp).forEach(type => {
      for(let index = hacks.mp[type] - 1; index >= 0; index --) {
        let hack = hacks.mp[type][index]
        hack.turnsLeft--
        if(hack.turnsLeft < 0) {
          _.pullAt(hacks.mp[type], [index])
        }
      }
    })
  })
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

function voteCount(targets) {
  var names = players.listPlayerNames()
  var counts = names.map(name => {
    var count = targets.reduce((a,v) => v.target === name ? a + 1 : a, 0)
    return {name, count}
  })
  return counts
}

function voteStart () {
  status.state = "vote"
}

function voteStop(targets) {
  // removeAllHacks()
  var names = players.listPlayerNames()
  console.log("############ VOTES")

  console.log(targets)
  // log the votes
  targets.forEach(item => log.votesAdd(item.voter, item.target))

  // call the powerup module to update vote powerup
  powerup.votePower(targets)

  // count the votes against each possible target
  var counts = names.map(name => {
    var count = targets.reduce((a,v) => v.target === name ? a + (v.power || 1) : a, 0)
    return {name, count}
  })

  // sort the counts and keep only those with the highest value
  counts.sort( (a, b) => b.count - a.count )

  // create decision table
  let decisions = counts.map(v => {
    return { name:v.name, isRevealed : v.count >= counts[0].count}
  })

  // call the powerup module to update vote powerup
  powerup.voteDecide(counts, decisions)

  // TODO check isActive
  // TODO solo for 4 players
  // TODO fix common secret noself target

  // TODO ambiance text
  // TODO ambiance instro
  // TODO pimp revelation
  // TODO multi targets

  //counts = counts.filter(v => v.count >= counts[0].count)
  decisions = decisions.filter(v => v.isRevealed)

  voteLog = {revelations:[]}
  // reveal secrets using filter counts
  decisions.forEach(decision => {
    let secrets = players.getData(decision.name, "secrets")
    let notRevealed = secrets.filter(v => !v.isRevealed)
    if(notRevealed.length > 1) {
      notRevealed = notRevealed.filter(v => !v.isShared)
    }

    if(notRevealed.length > 0) {
      let index = Math.trunc(Math.random() * notRevealed.length)
      notRevealed[index].isRevealed = true
      voteLog.revelations.push({secret:notRevealed[index].secret.secret, name:decision.name})
    }
  })

  // set the actions count for hacks (not used)
  names.forEach(name => {
    let count = players.getData(name, "secrets").reduce((a,v) => v.isRevealed ? a + 1 : a, 0)
    players.setData(name, "actions", count)
    players.setData(name, "mp-credit", gameOptions.mpCredit)
  })

  // build the hint
  let knowledge
  if(useTeamCommonSecrets) {
    knowledge = buildHint(null)
  } else {
    knowledge = buildHint(teamStrings[revelationTeamIndex])

    // revelationTeamIndex = (revelationTeamIndex + 1) % 2
    if(isLeaderMode) {
      revelationTeamIndex = (revelationTeamIndex + 1) % 3
    }
    else {
      revelationTeamIndex = (revelationTeamIndex + 1) % 2
    }
  }


  // send hints for each player
  names.forEach(name=>{
    players.addPendings(name, '*')
    players.checkPendings(name)
    if(knowledge) {
      addKnowledge(name, knowledge)
    }
    players.getSocket(name).emit('hint-update', players.getData(name, "knowledges"))
  })

  // update powerups
  powerup.update()

  // emit revelation update
  io.emit('revelation-update')

  // check victory
  if(isLeaderMode) {
    let isGameOver = checkVictoryLeader()
    if(isGameOver) {
      status = {state:"idle", turn: status.turn}
    } else {
      status = {state:"check", turn: status.turn + 1}
    }
    return isGameOver
  } else {
    return checkVictoryCount()
  }
}

function checkVictoryLeader()
{
  console.log("################# CHECK VICTORY LEADER")
  let soloWin = false
  let isGameOver = false
  let leaderCount = []
  let revealCount = []
  let soloGoalChecks = {
    soloRevealOneSolo:false,
    soloRevealTotalCount:false,
    soloRevealOneSecretEach:false,
    soloRevealTeamCount:false
  }



  if(soloNames.length > 0) {
    soloNames.forEach((name) => {
      let secrets = players.getData(name, "secrets")
      if(secrets.filter(v => v.isRevealed).length >= secrets.length) {
        soloGoalChecks.soloRevealOneSolo = true
      }
    })

    let totalCount = 0
    soloNames.forEach((name) => {
      let secrets = players.getData(name, "secrets")
      totalCount += secrets.filter(v => v.isRevealed).length
    })
    teams.forEach((team) => {
      team.forEach(name => {
        let secrets = players.getData(name, "secrets")
        totalCount += secrets.filter(v => v.isRevealed).length
      })
    })
    if(totalCount >= gameOptions.soloRevealTotalCount + (teams[0].length - 2) * gameOptions.soloRevealTotalCountStep) {
      soloGoalChecks.soloRevealTotalCount = true
    }

    soloGoalChecks.soloRevealOneSecretEach = true
    soloNames.forEach((name) => {
      let secrets = players.getData(name, "secrets")
      if(secrets.filter(v => v.isRevealed).length <= 0) {
        soloGoalChecks.soloRevealOneSecretEach = false
      }
    })
    teams.forEach((team) => {
      team.forEach(name => {
        let secrets = players.getData(name, "secrets")
        if(secrets.filter(v => v.isRevealed).length <= 0) {
          soloGoalChecks.soloRevealOneSecretEach = false
        }
      })
    })

    let bestTeamCount = 0
    teams.forEach((team) => {
      let teamCount = 0
      team.forEach(name => {
        let secrets = players.getData(name, "secrets")
        teamCount += secrets.filter(v => v.isRevealed).length
      })
      bestTeamCount = Math.max(teamCount, bestTeamCount)
    })
    if(bestTeamCount >= gameOptions.soloRevealTeamCount  + (teams[0].length - 2) * gameOptions.soloRevealTeamCount) {
      soloGoalChecks.soloRevealTeamCount = true
    }
  }

  if(soloGoalChecks[soloGoalKey]) {
    soloWin = true
    isGameOver = true
  }

  teams.forEach((team, i) => {
    let secrets = players.getData(teamLeaders[i], "secrets")
    leaderCount[i] = secrets.filter(v => v.isRevealed).length

    if (leaderCount[i] >= gameOptions.secretPlayerCount) {
      isGameOver = true
    }

    console.log("team", team, i, leaderCount[i], isGameOver)
    team.forEach(name => {
      let secrets = players.getData(name, "secrets")
      revealCount[i] += secrets.filter(v => v.isRevealed).length
    })

  })

  if(isGameOver) {
    let winners = []
    if(soloWin) {
      winners = -1
    }
    else {
      leaderCount.forEach((count, i) => {
        if (count < gameOptions.secretPlayerCount) {
          isGameOver = true
          console.log("team", i, "wins")
          console.log("team", teamStrings[i], "wins")
          teams[i].forEach(name => {
            console.log(name, "wins")
          })
          winners.push(i)
        }
      })
    }
    gameOver(winners)
  }

  return isGameOver
}

function checkVictoryCount()
{
  let revealCount = []
  let soloWin = false
  let isGameOver = false

  if(soloNames.length > 0) {
    soloNames.forEach((name) => {
      let secrets = players.getData(name, "secrets")
      console.log('solo', name, secrets.filter(v => v.isRevealed).length)
      if(secrets.filter(v => v.isRevealed).length >= soloLoseCount) {
        soloWin = false
        isGameOver = true
      }
    })

    teams.forEach((team) => {
      team.forEach(name => {
        let secrets = players.getData(name, "secrets")
        console.log('team', name, secrets.filter(v => v.isRevealed).length)
        if(secrets.filter(v => v.isRevealed).length >= soloKillOneCount) {
          soloWin = true
          isGameOver = true
        }
      })
    })
  }

  teams.forEach((team, i) => {
    revealCount[i] = 0
    team.forEach(name => {
      let secrets = players.getData(name, "secrets")
      revealCount[i] += secrets.filter(v => v.isRevealed).length
    })
  })

  revealCount.forEach((count, i) => {
    if (count >= loseCount) {
      isGameOver = true
      // console.log("team", i, "loses")
      // console.log("team", teamStrings[i], "loses")
      teams[i].forEach(name => {
        console.log(name, "loses")
      })
    }
  })

  if(isGameOver) {
    let winners = []
    if(soloWin) {
      winners = -1
    }
    else {
      revealCount.forEach((count, i) =>{
        if (count < loseCount) {
          isGameOver = true
          // console.log("team", i, "wins")
          // console.log("team", teamStrings[i], "wins")
          teams[i].forEach(name => {
            console.log(name, "wins")
          })
          winners.push(i)
        }
      })
    }
    gameOver(winners)
  }

  return isGameOver
}

function decisionStop(decisions) {
  /* var bankCount = Object.keys(decisions).reduce((total, name) => decisions[name].y < 75 ? total + 1 : total, 0)
  var revealCount = Object.keys(decisions).reduce((total, name) => decisions[name].y > 325 ? total + 1 : total, 0)
  var moneyUpdate = 0
  if(bankCount > 0) {
    moneyUpdate = Math.trunc(bank/bankCount)
  }
  var revealCost = revealCount */
  var checks = []
  var names = players.listPlayerNames()
  Object.keys(decisions).forEach(name => {

    /* if(decisions[name].y < 75) {
      players.setData(name, "money", players.getData(name, "money") + moneyUpdate)
    } */
    /*if(decisions[name].y > 325) {
      players.setData(name, "money", players.getData(name, "money") - revealCost)
    }*/
/*     if((decisions[name].y > 75) && (decisions[name].y < 500)) {
      var index = Math.trunc((decisions[name].y- 75) / 50)
      checks.push({checker:name, checkee:names[index]})
    }*/
    var index = Math.trunc((decisions[name].y - 45) / 50)
    checks.push({checker:name, checkee:names[index]})
  })
  checks.forEach(check => {
    var checkee = check.checkee || names[Math.trunc(Math.random() * names.length)]
    while(names.length > 1 && check.checker === checkee) {
      checkee = names[Math.trunc(Math.random() * names.length)]
    }
    players.getSocket(check.checker).emit('check', checkee)
  })
//  setBank(bank - moneyUpdate * bankCount + revealCost * revealCount)
  console.log(checks)
}

function transferMoney (source, destination, amount) {
  if(destination === "bank") {
    players.setData(source, 'money', players.getData(source, 'money') + amount)
    setBank(bank - amount)
  }
}

function mp (player, target, message, originator) {
  let credit = players.getData(originator, "mp-credit") || -1
  if(credit >= 0) {
    if(credit === 0) {
      players.setData(originator, "mp-credit", 0)
      return []
    }
    credit--
  }
  players.setData(originator, "mp-credit", credit)

  log.messagesAdd(player, target, message)
  let actions = []
  let playerHacks = players.getData(player, "hacks")
  let targetHacks = players.getData(target, "hacks")
  let messageUser = player
  if(playerHacks && playerHacks.mp && playerHacks.mp.usurpators && playerHacks.mp.usurpators.length > 0) {
    messageUser = playerHacks.mp.usurpators[0].name
  }


  if(targetHacks && targetHacks.mp && targetHacks.mp.jamHash && targetHacks.mp.jamHash.length > 0) {
    message = message.replace(/[AEIOUYaeéèioöôuùy]/g, function() {
      return '#'
      // return message.charAt(Math.trunc(message.length * Math.random()))
    })
  }

  if(targetHacks && targetHacks.mp && targetHacks.mp.jamLeet && targetHacks.mp.jamLeet.length > 0) {
    message = message.replace(/[Eeéèëê]/g, () => '3')
      .replace(/[Ii]/g, () => '1')
      .replace(/[Aa]/g, () => '4')
      .replace(/[Ooö]/g, () => '0')
      .replace(/[UuùüÜ]/g, () => '(_)')
  }

  if(targetHacks && targetHacks.mp && targetHacks.mp.jamSmear && targetHacks.mp.jamSmear.length > 0) {
    message.replace(/(.)/g, v => {
      if (v===' ') {
        return''
      }
      let w = v + '~'
      for(let i = 0 ; i < 1 + Math.trunc(10 * Math.random()); i++) {
        w += v
      }
      return w
    })
  }

  if(targetHacks && targetHacks.mp && targetHacks.mp.jamMirror && targetHacks.mp.jamMirror.length > 0) {
    message = message.replace(/[^\s]{4,}/g, v => v.split('').reverse().reduce((a,v) => a + v, ''))
  }

  if(targetHacks && targetHacks.mp && targetHacks.mp.jamMix && targetHacks.mp.jamMix.length > 0) {
    message = message.replace(/[^\s]{1,4}\s/g, str => shuffle(str.split('')).reduce((a, v) => a + v, ''))
  }

  const faun = ['vache', 'cafard', 'chien', 'chat', 'ours', 'fourmi', 'pangolin', 'éléphant', 'ornythorinque']
  if(targetHacks && targetHacks.mp && targetHacks.mp.jamFaun && targetHacks.mp.jamFaun.length > 0) {
    message = message.replace(/[^\s]{4,}/g, () => randomElement(faun))
  }

  if(targetHacks && targetHacks.mp && targetHacks.mp.spies) {
    targetHacks.mp.spies.forEach(spy => actions.push({user:messageUser, target:spy.name, message:'=>' + target + '[' + message + ']'}))
  }
  actions.push({user:messageUser, target, message})
  return actions
}
