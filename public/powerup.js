'use strict'
const $ = require('jquery')
const menu = require('./menu')
const skipSpaces = require('./skipSpaces')
const scan = require('./scan')
const game = require('./game')
const utils = require('./utils')
const translate = require('./translate')

let socket = null
let players = null
let playerName = null
let objects = []
let isAnyPowerUpAvailable = false

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

const check = () => {
  socket.emit('powerup-get-all', (powerups) => updatePowerups(powerups))
}

const updatePowerups = (powerups) => {
  console.log(powerups)
  $('#powerup').html('<h3>POWERUPS</h3>')
  isAnyPowerUpAvailable = false
  powerups.forEach(powerup => addPowerup(powerup))
  if(isAnyPowerUpAvailable) {
    $('#nav-self-notification').show()
  } else {
    $('#nav-self-notification').hide()
  }
}

const addPowerup = (powerup) => {
  let html = `
    <div class="powerup-card">
      <div class="clearfix animated fadeInLeft">
          <img class="powerup-card-icon" src="${utils.getSecretImg(powerup.name)}" />
        <div class="powerup-card-value">${translate.translateText(powerup.name)}</div>
        `
      //   <div class="powerup-card-value">TOUS LES ${powerup.cooldownPeriod} TOURS</div>

  /* if( powerup.available) {
    html += '<div class="powerup-card-value">UTILISABLE</div>'
  } else {
    html += '<div class="powerup-card-value">NON REVELE</div>'
  } */

  if(powerup.available) {
    if(powerup.cooldown <= 0) {
      isAnyPowerUpAvailable = true
      html += `
        <div id="powerup-${skipSpaces(powerup.name)}" class="powerup-card-use general-button">
          ${translate.translateText('UTILISER')}
        </div>`
    } else {
      html += `<div class="powerup-card-used general-button">${powerup.cooldown} ${translate.translateText('tours')}</div>`
    }
  }

  /* if(powerup.inUse) {
    html += '<div class="powerup-card-value">ACTIF</div>'
  } */

/*   if(powerup.targetMax > 0) {
    if(powerup.inUse) {
      html += '<div class="powerup-card-value">CIBLE ' + powerup.targets[0] + '</div>'
    }
  } */


  html += '</div>'
  html += `<div class="powerup-card-help animated fadeInRight">${translate.translateText(powerup.help)}</div>`
  if(powerup.targetMax > 0) {
    if(!powerup.inUse) {
      if(!(game.getOptions().doScan > 0)) {
        html += '<select class="animated fadeInRight" id="powerup-target-' + skipSpaces(powerup.name) + '">'
        if(powerup.targetNoSelf) {
          html += players.filter(v => v !== playerName).reduce((a, v) => a + '<option value="' + v + '">' + translate.translateText(v) + '</option>', '')
        } else {
          html += players.reduce((a, v) => a + '<option value="' + v + '">' + translate.translateText(v) + '</option>', '')
        }
        html += '<select>'
      }
    }
  }

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
  check,
  setSocket,
  newPlayers,
  newObjects,
}
