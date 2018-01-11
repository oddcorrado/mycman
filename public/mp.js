'use strict'
const $ = require('jquery')
const menu = require('./menu')

let socket = null

let credit = 0

const setSocket = (socketIn) => {
  socket = socketIn
  creditUpdate()
  $('#mp-message-send').html('MP:' + credit)
}

const creditUpdate = () => {
  socket.emit('mp-get-credit', creditIn => {
    credit = creditIn
    creditUiUpdate(credit)
  })
}
const creditUiUpdate = (credit) => {
  if(credit >= 0 || credit !== 'null') {
    if(credit === 0) {
      $('#mp-message-send').hide()
      $('#mp-message-text').hide()
      $('#mp-message-send-no').show()
    } else {
      $('#mp-message-send').show()
      $('#mp-message-text').show()
      $('#mp-message-send-no').hide()
      $('#mp-message-send').html('MP:' + credit)
    }
  } else {
    $('#mp-message-send').html('MP')
  }
}

$('#nav-mp').on('click', function (e) {
  e.preventDefault()
  $('#nav-mp').html('MPS')
  if(!menu.isLeftMenuActive()) { return }
  menu.hideAll()
  $('#mp').show()
})

let playerName = null
let mpSelected = null
let players = null

const skipSpaces = (s) => {
  return s.replace(/ /g, '_')
}

const logMp = (player, message) => {
  $('#mp-select-' + skipSpaces(player)).html('*> '+player)
  $('#mp-recipient-' + skipSpaces(player)).addClass('mp-recipient-unread')
  addMp(player, message, false)
}

const updateMps = () =>{
  socket.emit('game-get-history', 'mp', history => {
    if(history) {
      history.forEach(item=>addMp(item.target, item.message, item.isEcho))
    }
  })
}

const addMp = (player, message, isEcho) => {
  if(isEcho) {
    $('#mp-result-' + skipSpaces(player)).append('<div class="clearfix"><div class="message-card-self">'
    + $('<span>').text(message).html()
    + '</div></div>')
  } else {
    $('#mp-result-' + skipSpaces(player)).append('<div class="clearfix"><div class="message-card-other">'
    + $('<span>').text(message).html()
    + '</div></div>')
  }
}

const update = (playerNameIn) => {
  playerName = playerNameIn
  socket.on('mp', logMp)

  $('#mp-message-send').on('click', function (e) {
    e.preventDefault()
    if(mpSelected !== null &&  $('#mp-message-text').val() !== '') {
      socket.emit('mp', playerName, mpSelected, $('#mp-message-text').val(), (target, message, credit) => {
        creditUiUpdate(credit)
        addMp(target, message, true)
      })
      $('#mp-message-text').val('')
    }
  })

  $('#mp-message-text').on('focus', function() {
    $('#mp-recipients').hide()
  })

  $('#mp-message-text').on('blur', function() {
    $('#mp-recipients').show()
  })

  updateMps()
}

const mpHideAll = () => {
  players.forEach(u => $('#mp-result-' + skipSpaces(u)).hide())
  $('.pure-menu-selected').removeClass('pure-menu-selected')
}

const newPlayers = (playersIn, playerOptions) => {
  players = playersIn

  players.forEach(p => {
    if($('#mp-result-' + skipSpaces(p)).length === 0) {
      $('#mp-result').append('<div class="mp-player" id="mp-result-' + skipSpaces(p) + '"></div>')
    }
  })

  $(".mp-messenger").remove()
  players.forEach(p => {
    if(p !== playerName) {
      $('#menu-list').append( // FIXME
          '<li class="pure-menu-item mp-messenger" id="mp-select-' + skipSpaces(p) + '">' + '\> ' + p + '</li>')
    }
  })

  $("#mp-recipients").html('')
  players.forEach(p => {
    if(p !== playerName) { // FIXME
      $('#mp-recipients').append(
      '<div class="mp-recipient" id="mp-recipient-' + skipSpaces(p) + '">' + p.slice(0,2) + '</div>')
    }
  })

  players.forEach(p => $('#mp-select-' + skipSpaces(p)).on('click', function (e) {
    e.preventDefault()
    if(!menu.isLeftMenuActive()) { return }
    mpHideAll()
    menu.hideAll()
    $('#mp').show()
    $('#mp-result-' + skipSpaces(p)).show()
    mpSelected = p
    $('.mp-recipient').removeClass('mp-recipient-selected')
    $('#mp-recipient-' + skipSpaces(p)).addClass('mp-recipient-selected')
    $('#mp-select-' + skipSpaces(p)).addClass('pure-menu-selected')
    $('#mp-select-'+ skipSpaces(p)).html('> '+ p)
    $('html').scrollTop(document.getElementById("mp").scrollHeight)
    $('#mp-recipient-' + skipSpaces(p)).removeClass('mp-recipient-unread')
  }))

  players.forEach(p => $('#mp-recipient-' + skipSpaces(p)).on('click', function (e) {
    e.preventDefault()
    if(!menu.isLeftMenuActive()) { return }
    mpHideAll()
    menu.hideAll()
    $('#mp').show()
    $('#mp-result-' + skipSpaces(p)).show()
    mpSelected = p
    $('.mp-recipient').removeClass('mp-recipient-selected')
    $('#mp-recipient-' + skipSpaces(p)).addClass('mp-recipient-selected')
    $('#mp-select-' + skipSpaces(p)).addClass('pure-menu-selected')
    $('#mp-select-'+ skipSpaces(p)).html('> '+ p)
    $('html').scrollTop(document.getElementById("mp").scrollHeight)
    $('#mp-recipient-' + skipSpaces(p)).removeClass('mp-recipient-unread')
  }))

  if(mpSelected === null) {
    mpHideAll()
  }

  $('#mpName').html(playerOptions)
}

module.exports = {
  setSocket,
  newPlayers,
  update,
  creditUpdate
}
