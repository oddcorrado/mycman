'use strict'

const playersDb = require ('./players')

let secrets = null

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
  console.log("power vote power")
  secrets.filter(v => v.inUse).forEach(secret => {
    if(secret.votePower) {
      targets = secret.votePower(targets)
    }
  })
}

module.exports = {
  start,
  activate,
  getAll,
  update,
  votePower
}
