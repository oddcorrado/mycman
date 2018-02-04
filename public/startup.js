'use strict'
const $ = require('jquery')
const utils = require('./utils')
const menu = require('./menu')

let players = []
let socket = null

const newPlayers = (playersIn) => {
  players = playersIn

  $('#startup-players').html(`
    <h1>JOUEURS EN LIGNE</h1>
    `)

  players.forEach(p => {
    $('#startup-players').append(`
      <div class="startup-player-container">
        <img class="startup-player-image" src="${utils.getPlayerImg(p)}" />
        <span class="startup-player-name">${p} est en ligne</span>
      </div>`)
  })

  $('#startup-start').show()
  $('#startup-start').on('click', function () {
    socket.emit('game-start')
    menu.modalHide('#startup-modal')
  })

  $('#startup-reset').show()
  $('#startup-reset').on('click', function () {
    socket.emit('game-reset')
    menu.modalHide('#startup-modal')
  })

  $('#startup-skip').show()
  $('#startup-skip').on('click', function () {
    menu.modalHide('#startup-modal')
  })
}

const setSocket = (socketIn) => {
  socket = socketIn
}

module.exports = {
  newPlayers,
  setSocket
}
