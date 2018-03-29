'use strict'
const $ = require('jquery')
const menu = require('./menu')
const mp = require('./mp')
const utils = require('./utils')
const scan = require('./scan')
const translate = require('./translate')

let socket = null
let updateInfos = null
let enableLogin = null
let gameOptions = {doScan:1} // TODO fixme get gameoptions on login...
let gameOptionsSetKey = null
let clickCnt = 0

const setSocket = (socketIn) => {
  socket = socketIn

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
    translate.setLanguage(gameOptions.lg)
  })


  socket.on('game-reset', () => {
    $('#self').html('')
    $('#check-result').html('')
    $('#revelationResult').html('')
    $('#mp-result').html('')
    $('#start').show()
    $('#gameboard').hide()
    scan.reset()
    menu.modalHideAll()
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
    menu.modalHideAll()
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

  $('#pause').on('click', function (e) {
    e.preventDefault()
    socket.emit('game-pause')
  })

  $('#start-decision').on('click', function (e) {
    e.preventDefault()
    socket.emit('decision-start')
  })

  $('#start-vote').on('click', function (e) {
    e.preventDefault()
    socket.emit('vote-start')
  })

  $('#nav-speedup').on('click', function (e) {
    e.preventDefault()
    socket.emit('vote-start')
    $('#nav-speedup').hide()
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
      translate.setLanguage(gameOptions.lg)
    })
  })

  $('#game-options-set').on('click', function (e) {
    e.preventDefault()
    menu.modalShow('#game-options-set-modal')
  })

  $('#game-options-set-cancel').on('click', function (e) {
    e.preventDefault()
    menu.modalHide('#game-options-set-modal')
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
    menu.modalHide('#game-options-set-modal')
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

$('#phase-tick').on('click', function (e) {
  e.preventDefault()
  if(!menu.isLeftMenuActive()) { return }
  clickCnt++
  if(clickCnt > 2) {
    menu.hideAll()
    $('#game').show()
    clickCnt = 0
  }
})


// ############################
// GAMEOVER
// ############################
function gameOver(data) {
  menu.modalShow('#outro-modal')

  $('#outro-winners').html(`<div><h1>Les ${translate.translateText(data.winnerTeams)}(s) ${translate.translateText('ont gagné')}</h1><div>`)
  data.winners.forEach(name => $('#outro-winners').append(
    `<img class="outro-winner-image" src="${utils.getPlayerImg(name)}"" />`
  ))

  data.scores.forEach(score => $('#outro-scores').append(`
    <div><h1>${score.team}</h1></div>
    <div><h3>${translate.translateText('secrets élus révélés:')} ${score.chosen}</h3></div>
    <div><h3>${translate.translateText('secrets révélés au total:')} ${score.total}</h3></div>
    `
  ))

  $('#outro-messages').html('<div><h1>Messages</h1><div>')
  data.messages.forEach(message =>
     $('#outro-messages').append(`
        <div class="outro-message">
          <img class="outro-message-from" src="${utils.getPlayerImg(message.from)}"" />
          <img class="outro-message-to" src="${utils.getPlayerImg(message.to)}"" />
          <span class="outro-message-text">${message.message}</span>
        </div>`))

  /* $('#outro-votes').html('')
  data.votes.forEach(vote => $('#outro-votes')
    .append('<div>' + vote.name + '=>' + vote.voted + ':' + vote.count + '</div>')) */

  $('#outro-ok').on('click', function () {
    menu.modalHide('#outro-modal')
    $.get('/logout')
      .then(() => document.location.reload())
  })
}

const getOptions = () => {
  return gameOptions
}

const setOptions = (options) => {
  gameOptions = Object.assign({}, options)
  let out = ''

  // TODO dirty - use redux state in the future
  if(options.doScan > 0) {
    $('#login-name-input').hide()
  } else {
    $('#login-name-input').show()
  }
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
