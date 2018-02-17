'use strict'
const $ = require('jquery')
const utils = require('./utils')
const menu = require('./menu')
const uuidv1 = require('uuid/v1')

let players = []
let socket = null

const newPlayers = (playersIn) => {
  players = playersIn

  $('#startup-players').html(`
    <h1>JOUEURS EN LIGNE</h1>
    `)

  players.forEach(p => {
    $('#startup-players').append(`
      <div class="startup-player-container animated bounceInUp">
        <div><img class="startup-player-image" src="${utils.getPlayerImg(p)}" /></div>
        <div class="startup-player-name">${p} </div>
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

  if(playersIn.length < 4) {
    $('#startup-start').hide()
  } else {
    $('#startup-start').show()
  }
}

const setSocket = (socketIn) => {
  socket = socketIn
}

module.exports = {
  newPlayers,
  setSocket
}
