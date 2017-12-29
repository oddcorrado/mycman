'use strict'
const $ = require('jquery')
const menu = require('./menu')

let socket = null

const setSocket = (socketIn) => {
  socket = socketIn
  socket.on('powerup-update', () => updatePowerups()) // TODO
}

$('#nav-powerup').on('click', function (e) {
  e.preventDefault()
  $('#powerup').html('<h3>POWERUPS</h3>')
  if(!menu.isLeftMenuActive()) { return }
  menu.hideAll()
  updatePowerups()
  $('#powerup').show()
})

const updatePowerups = () => {
  socket.emit('powerup-get-all', (powerups) => {
    console.log(powerups)
    $('#powerup').html('<h3>POWERUPS</h3>')
    powerups.forEach(powerup => addPowerup(powerup))
  })
}

const addPowerup = (powerup) => {
  let html = '<div class="powerup-card">'
  html += '<div class="clearfix">'
  html += '<div class="powerup-card-value">' + powerup.name + '</div>'
  html += '<div class="powerup-card-value">TOUS LES ' + powerup.cooldown + ' TOURS</div>'
  html += '<div class="powerup-card-value">READY:' + powerup.available + '</div>'
  html += '<div id="powerup-' + powerup.name + '"class="powerup-card-use">UTILISER</div>'
  html += '</div>'
  html += '<div class="powerup-card-help">' + powerup.help + '</div>'
  html += '</div>'
  $('#powerup').append(html)

  $('#powerup-' + powerup.name).on('click', () => {
    console.log('use powerup ' + powerup.name)
    socket.emit('powerup-use', powerup.name, (result) => {
      console.log(result)
      updatePowerups()
    })
  })
}

module.exports = {
  setSocket
}
