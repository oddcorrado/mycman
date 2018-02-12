'use strict'
const $ = require('jquery')
const menu = require('./menu')
const skipSpaces = require('./skipSpaces')
const scan = require('./scan')
const game = require('./game')
const utils = require('./utils')

let socket = null
let players = null
let playerName = null
let objects = []

const setSocket = (socketIn) => {
  socket = socketIn
  socket.on('powerup-update', (powerups) => updatePowerups(powerups)) // TODO
}

$('#nav-self').on('click', function (e) {
  e.preventDefault()
  $('#powerup').html('<h3>POWERUPS</h3>')
  if(!menu.isLeftMenuActive()) { return }
  // menu.hideAll()
  socket.emit('powerup-get-all', (powerups) => updatePowerups(powerups))
  // $('#powerup').show()
})

const updatePowerups = (powerups) => {
  console.log(powerups)
  $('#powerup').html('<h3>POWERUPS</h3>')
  powerups.forEach(powerup => addPowerup(powerup))
}

const addPowerup = (powerup) => {
  let html = '<div class="powerup-card">'
  html += '<div class="clearfix">'
  html += '<div class="powerup-card-icon"><img src="/img/secrets/' + skipSpaces(powerup.name) + '.png" /></div>'
  html += '<div class="powerup-card-value">' + powerup.name + '</div>'

  html += '<div class="powerup-card-value">TOUS LES ' + powerup.cooldownPeriod + ' TOURS</div>'
  if( powerup.available) {
    html += '<div class="powerup-card-value">UTILISABLE</div>'
  } else {
    html += '<div class="powerup-card-value">NON REVELE</div>'
  }

  if(powerup.available) {
    if(powerup.cooldown <= 0) {
      html += '<div id="powerup-' + skipSpaces(powerup.name) + '"class="powerup-card-use">UTILISER</div>'
    } else {
      html += '<div class="powerup-card-use">ACTIVABLE DANS ' + powerup.cooldown + ' TOURS</div>'
    }
  }

  if(powerup.inUse) {
    html += '<div class="powerup-card-value">ACTIF</div>'
  }

  if(powerup.targetMax > 0) {
    if(powerup.inUse) {
      html += '<div class="powerup-card-value">CIBLE ' + powerup.targets[0] + '</div>'
    } else {
      if(!(game.getOptions().doScan > 0)) {
        html += '<select id="powerup-target-' + skipSpaces(powerup.name) + '">'
        if(powerup.targetNoSelf) {
          html += players.filter(v => v !== playerName).reduce((a, v) => a + '<option value="' + v + '">' + v + '</option>', '')
        } else {
          html += players.reduce((a, v) => a + '<option value="' + v + '">' + v + '</option>', '')
        }
        html += '<select>'
      }
    }
  }


  html += '</div>'
  html += '<div class="powerup-card-help">' + powerup.help + '</div>'
  html += '</div>'
  $('#powerup').append(html)

  if(powerup.available && powerup.cooldown <= 0) {
    $('#powerup-' + skipSpaces(powerup.name)).on('click', () => {
      if(!(game.getOptions().doScan > 0)) {
        socket.emit('powerup-use', powerup.name, $('#powerup-target-' + skipSpaces(powerup.name)).val(), (result) => {
          console.log(result)
          processResult(result)
          socket.emit('powerup-get-all', (powerups) => updatePowerups(powerups))
        })
      } else {
        scan.scan({allowCancel:false, message:'Scannez un personnage', filter:'user'})
        .then(id => {
          let name = objects[id].name
          socket.emit('powerup-use', powerup.name, name, (result) => {
            console.log(result)
            processResult(result)
            socket.emit('powerup-get-all', (powerups) => updatePowerups(powerups))
          })
        })
      }
    })
  }
}

const processResult = (result) => {
  if (result) {
    menu.modalShow('#spy-modal')
    let data = result.reduce((a, msg) => a +
      `<div class="outro-message">
        <img class="outro-message-from" src="${utils.getPlayerImg(msg.from)}"" />
        <img class="outro-message-to" src="${utils.getPlayerImg(msg.to)}"" />
        <span class="outro-message-text">${msg.message}</span>
      </div>`, '')
    $('#spy-content').html(data)
  }
}

$('#spy-ok').on('click', function () {
  menu.modalHide('#spy-modal')
})

const newPlayers = (playersIn, playerNameIn) => {
  players = playersIn
  playerName = playerNameIn
}

const newObjects = (objectsIn) => {
  objects = objectsIn
}

module.exports = {
  setSocket,
  newPlayers,
  newObjects,
}
