'use strict'
const $ = require('jquery')
const menu = require('./menu')
const mp = require('./mp')

let socket = null
let updateInfos = null
let enableLogin = null
let gameOptions = {doScan:1} // TODO fixme get gameoptions on login...
let gameOptionsSetKey = null

const setSocket = (socketIn) => {
  socket = socketIn

  socket.on('game-reset', () => {
    $('#self').html('')
    $('#check-result').html('')
    $('#revelationResult').html('')
    $('#mp-result').html('')
    $('#start').show()
    $('#gameboard').hide()
    $.get('/logout')
      .then(
      () => {
        enableLogin()
        $('#logout').hide()
      }
    )
  })

  socket.on('game-start', () => {
    $('#start').hide()
    mp.creditUpdate()
    updateInfos()
  })

  $('#reset').on('click', function (e) {
    e.preventDefault()
    socket.emit('game-reset')
  })

  $('#start').show()
  $('#start').on('click', function (e) {
    e.preventDefault()
    socket.emit('game-start')
  })

  $('#start-decision').on('click', function (e) {
    e.preventDefault()
    socket.emit('decision-start')
  })

  $('#start-vote').on('click', function (e) {
    e.preventDefault()
    socket.emit('vote-start')
  })

  $('#startAuction').on('click', function (e) {
    e.preventDefault()
    socket.emit('auction-start')
  })

  $('#status').on('submit', function (e) {
    e.preventDefault()
    $('#status-result').html('')
    socket.emit('players-status', (result) => {
      var out = ''
      Object.keys(result).forEach(k => {
        out += '<div>['+k+']=>'+result[k]+'secs</div>'
      })
      $('#status-result').html(out)
    })
  })

  $('#game-options-get').on('click', function (e) {
    e.preventDefault()
    $('#game-options-result').html('')
    socket.emit('game-options-get', (result) => {
      var out = ''
      let options = ''
      gameOptions = Object.assign({}, result)

      Object.keys(result).forEach(k => {
        out += '<div>['+k+']=>'+result[k]+'</div>'
        options += '<option value="' + k + '">' + k + '</option>'
      })
      $('#game-options-result').html(out)
      $('#game-options-set-key').html(options)
    })
  })

  $('#game-options-set').on('click', function (e) {
    e.preventDefault()
    $("#game-options-set-modal").show()
  })

  $('#game-options-set-cancel').on('click', function (e) {
    e.preventDefault()
    $("#game-options-set-modal").hide()
  })

  $('#game-options-set-submit').on('click', function (e) {
    e.preventDefault()
    let value = Number($('#game-options-set-value').val())
    if(gameOptionsSetKey && Number(value)) {
      gameOptions[gameOptionsSetKey] = value
      socket.emit('game-options-set', gameOptions)
    }
    // TODO cleanup
    if(!(gameOptions.doScan > 0)) {
      $('#check-direct').show()
    } else {
      $('#check-direct').hide()
    }
    $("#game-options-set-modal").hide()
  })

  $('#game-options-set-key').on('change', function (e) {
    e.preventDefault()
    gameOptionsSetKey = $(this).val()
    $('#game-options-set-value').val(gameOptions[gameOptionsSetKey])
  })

  socket.on('gameOver', data => gameOver(data))
}

const init = (updateInfosIn, enableLoginIn) => {
  updateInfos = updateInfosIn
  enableLogin = enableLoginIn
}

$('#nav-game').on('click', function (e) {
  e.preventDefault()
  if(!menu.isLeftMenuActive()) { return }
  menu.hideAll()
  $('#game').show()
})


// ############################
// GAMEOVER
// ############################
function gameOver(data) {
  $('#gameover').show()
  $('#gameover-winner').html('<h3>' + 'Les ' + data.winnerTeams + 's ont gagné</h3>')
  data.winners.forEach(name => $('#gameover-winner').append('<div>' + name + ' a gagné' + '</div>'))
  $('#gameover-messages').html('')
  data.messages.forEach(message => $('#gameover-messages')
    .append('<div>' + message.from + '=>' + message.to + ':' + message.message + '</div>'))
  $('#gameover-votes').html('')
  data.votes.forEach(vote => $('#gameover-votes')
    .append('<div>' + vote.name + '=>' + vote.voted + ':' + vote.count + '</div>'))
}

const getOptions = () => {
  return gameOptions
}

const setOptions = (options) => {
  gameOptions = Object.assign({}, options)
  let out = ''

  Object.keys(gameOptions).forEach(k => {
    out += '<div>['+k+']=>'+gameOptions[k]+'</div>'
    options += '<option value="' + k + '">' + k + '</option>'
  })
  $('#game-options-result').html(out)
  $('#game-options-set-key').html(options)
}

module.exports = {
  getOptions,
  setSocket,
  setOptions,
  init
}
