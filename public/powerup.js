'use strict'
const $ = require('jquery')
const menu = require('./menu')

let socket = null

const setSocket = (socketIn) => {
  socket = socketIn
  socket.on('powerup-update', (powerups) => updatePowerups(powerups)) // TODO
}

$('#nav-powerup').on('click', function (e) {
  e.preventDefault()
  $('#powerup').html('<h3>POWERUPS</h3>')
  if(!menu.isLeftMenuActive()) { return }
  menu.hideAll()
  socket.emit('powerup-get-all', (powerups) => updatePowerups(powerups))
  $('#powerup').show()
})

const updatePowerups = (powerups) => {
  console.log(powerups)
  $('#powerup').html('<h3>POWERUPS</h3>')
  powerups.forEach(powerup => addPowerup(powerup))
}

const addPowerup = (powerup) => {
  let html = '<div class="powerup-card">'
  html += '<div class="clearfix">'
  html += '<div class="powerup-card-value">' + powerup.name + '</div>'

  html += '<div class="powerup-card-value">TOUS LES ' + powerup.cooldownPeriod + ' TOURS</div>'
  if( powerup.available) {
    html += '<div class="powerup-card-value">UTILISABLE</div>'
  } else {
    html += '<div class="powerup-card-value">NON REVELE</div>'
  }

  if(powerup.available) {
    if(powerup.cooldown <= 0) {
      html += '<div id="powerup-' + powerup.name + '"class="powerup-card-use">UTILISER</div>'
    } else {
      html += '<div class="powerup-card-use">ACTIVABLE DANS ' + powerup.cooldown + ' TOURS</div>'
    }
  }

  html += '</div>'
  html += '<div class="powerup-card-help">' + powerup.help + '</div>'
  html += '</div>'
  $('#powerup').append(html)

  if(powerup.available && powerup.cooldown <= 0) {
    $('#powerup-' + powerup.name).on('click', () => {
      socket.emit('powerup-use', powerup.name, (result) => {
        console.log(result)
        //updatePowerups()
      })
    })
  }

}

module.exports = {
  setSocket
}
