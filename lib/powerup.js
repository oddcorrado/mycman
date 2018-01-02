'use strict'

const playersDb = require ('./players')

let secrets = null
let voteLog = ''

const start = (gameSecrets) => {
  secrets = gameSecrets.concat()
  secrets.sort((a,b) => a.pos - b.pos)
}

const getAll = (player) => {
  let secrets = playersDb.getData(player, "secrets") || []
  let output = []
  secrets.forEach(secret => {
    let data = secret.secret
    output.push({
      name:data.secret,
      help:data.help,
      cooldown:data.cooldown,
      targets:data.targets,
      targetMsx:data.targetMax,
      inUse:data.inUse,
      available: true, // secret.isRevealed,
      cooldownPeriod:data.cooldownPeriod,
    })
  })
  return output
}

const activate = (player, name, target) => {
  let secrets = playersDb.getData(player, "secrets") || []

  let secret = secrets.find(s => s.secret.secret === name)
  console.log('activate', player, name, target, secret)
  secret.secret.cooldown = secret.secret.cooldownPeriod
  secret.secret.inUse = true
  secret.secret.targets = [target]
}

const update = () => {
  let players = playersDb.listPlayerNames()
//  voteLog = ''
  players.forEach(name => {
    let secrets = playersDb.getData(name, "secrets") || []
    secrets.forEach(secret => {
      secret.secret.cooldown = Math.max(0, secret.secret.cooldown - 1)
      secret.secret.inUse = false
    })
    console.log(name, secrets)
  })
}

const votePower = (targets) => {
  voteLog = ''
  secrets.filter(v => v.inUse).forEach(secret => {
    if(secret.votePower) {
      let result = secret.votePower({votes:targets, log: voteLog})
      targets = result.votes
      voteLog = result.log
    }
  })
  voteLog += targets.reduce((a, v) => a + v.target + ':' + (v.power || 1) + ' - ', '')
}

const voteDecide = (votes, decisions) => {
  voteLog = ''
  secrets.filter(v => v.inUse).forEach(secret => {
    if(secret.voteDecide) {
      let result = secret.voteDecide({votes, decisions, log: voteLog})
      decisions = result.decisions
      votes = result.votes
      voteLog = result.log
    }
  })
  voteLog += votes.reduce((a, v) => a + v.target + ':' + (v.power || 1) + ' - ', '')
}

const getVoteLog = () => {
  return voteLog
}

module.exports = {
  start,
  activate,
  getAll,
  update,
  votePower,
  /* voteStart, */
  voteDecide,
  getVoteLog
}
