const players = require('./players')
const _ = require('lodash')

function activateHack(target, source, type, isTarget) {
  // console.log(target, source, type, isTarget, cost, duration)
  /*if(players.getData(source, "money") < cost) {
    return false
  }*/
/*  if(players.getData(source, "actions") <= 0) {
    return false
  } */
  let player = isTarget ? target : source
  let hacks = players.getData(player, "hacks") || {}
  hacks.mp = hacks.mp || {}
  hacks.mp[type] = hacks.mp[type] || []
  let hack = {origin:source, name:isTarget ? source : target, left: 180000}
  hacks.mp[type].push(hack)
  players.setData(player, "hacks", hacks)
//  players.setData(source, "money", players.getData(source, "money") - cost)
//  players.setData(source, "actions", players.getData(source, "actions") - cost)
//  players.getSocket(source).emit('hack-start', type, target)
  let check = function() {
    console.log("checking", hack)
    if(hack.left <= 0) {
      //setBank(bank + cost)
      let index = _.findIndex(hacks.mp[type], {origin:source})
      if(index >= 0) {
        _.pullAt(hacks.mp[type], [index])
      }
      // players.getSocket(source).emit('hack-stop', type, target)
    } else {
      hack.left -= 1000
      setTimeout(check, 1000)
    }
  }
  check()
  return true
}

function action (keys, playerName) {
  switch(keys[0]) {
  case "hack-jam": {
    return activateHack(keys[1], playerName, "jammers", true, 5, 60000)
  }
  case "hack-jamLeet": {
    return activateHack(keys[1], playerName, "jamLeet", true, 5, 60000)
  }
  case "hack-spy": {
    return activateHack(keys[1], playerName, "spies", true, 5, 60000)
  }
  case "hack-usurp": {
    return activateHack(keys[1], playerName, "usurpators", false, 3, 60000)
  }
  }
}

module.exports = {
  action
}
