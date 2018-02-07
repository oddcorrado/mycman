'use strict'

const playersDb = require ('./players')

let secrets = null
let voteLog = {}

const start = (gameSecrets) => {
  secrets = gameSecrets.concat()
  secrets.sort((a,b) => a.pos - b.pos)
}

const getAll = (player) => {
  let secrets = playersDb.getData(player, "secrets") || []
  let output = []
  secrets.forEach(secret => {
    let data = secret.secret
    if(secret.isRevealed) {
      output.push({
        name:data.secret,
        help:data.help,
        cooldown:data.cooldown,
        targets:data.targets,
        targetMax:data.targetMax,
        targetNoSelf:data.targetNoSelf,
        inUse:data.inUse,
        available: true, // secret.isRevealed,
        cooldownPeriod:data.cooldownPeriod,
      })
    }
  })
  return output
}

const activate = (player, name, target) => {
  let secrets = playersDb.getData(player, "secrets") || []

  let secret = secrets.find(s => s.secret.secret === name)
  secret.secret.cooldown = secret.secret.cooldownPeriod + 1
  secret.secret.inUse = true
  secret.secret.targets = [target]

  if(secret.secret.lifecycleActivate) {
    secret.secret.lifecycleActivate({player})
  }
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
  })
}

const voteStart = () => {
  voteLog = {debug:''}
  secrets.filter(v => v.inUse).forEach(secret => {
    if(secret.votePower) {
      let result = secret.voteStart({vlog: voteLog})
      voteLog = result.log
    }
  })
  /* voteLog.debug += targets.reduce((a, v) => a + v.voter + '>' + v.target + ':' + (v.power || 1) + ' - ', '')
  voteLog.debug += '\n' */
}

const votePower = (targets) => {
  voteLog = {debug:'', uses:[]}
  secrets.filter(v => v.inUse).forEach(secret => {
    if(secret.votePower) {
      let result = secret.votePower({votes:targets, log: voteLog.debug})
      targets = result.votes
      voteLog.debug = result.log
      voteLog.uses.push({secret:secret.secret, log:secret.log})
    }
  })
  voteLog.debug += targets.reduce((a, v) => a + v.voter + '>' + v.target + ':' + (v.power || 1) + ' - ', '')
  voteLog.debug += '\n'
}

const voteDecide = (counts, decisions) => {
  voteLog.debug += counts.reduce((a, v) => a + v.name + ':' + v.count + '-' , '')
  voteLog.debug += '\n'
  secrets.filter(v => v.inUse)
  .forEach(secret => {
    if(secret.voteDecide) {
      let result = secret.voteDecide({counts, decisions, log: voteLog})
      decisions = result.decisions
      counts = result.counts
      voteLog.debug = result.log
      voteLog.uses.push({secret:secret.secret, log:secret.log})
    }
  })
  voteLog.debug += decisions.reduce((a, v) => a + (v.isRevealed ? v.name + '-' : '') , '')
  voteLog.decisions = decisions.filter(v => v.isRevealed).map(v => v.name)
  console.log(voteLog)
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
  voteStart,
  voteDecide,
  getVoteLog
}
