const $ = require('jquery')
const moment = require('moment')
const io = require('socket.io-client')

require('moment/locale/fr')
moment.locale('fr')




var socket = io()
var playerOptions = []
var playerName = "anonymous"
socket.emit('coucou')
socket.on('bisous', () => {
  console.log('bisous')
})

socket.on('game-start', () => {
  $('#start').hide()
})

$('#coucou').on('submit', function (e) {
  e.preventDefault()
  socket.emit('coucou')
})

// ACK
/* socket.emit('sum', 2, 3, (result) => {
  console.log('2+3 = %s', result)
})*/




var $messages = $('ul#messages')

//socket.on('add-card', addCard)
//socket.on('remove-card', removeCard)
socket.on('players', updatePlayers)
socket.on('mp', logMp)

// Test login
$.get('/login')
  .then(
  o => {playerName = o.user; enableCards(o.user)},
  () => enableLogin()
)

function enableLogin () {
  $('#login').show()
  $('#chatbox').hide()
  $('#login input[name=author]').focus()
  $('#login').on('submit', function (e) {
    e.preventDefault()
    $.post('/login', {
      user: this.elements.author.value
    }).then(() => document.location.reload())
  })
}

function enableCards (username) {
  $('#logout').show()
  $('#logout').on('submit', function (e) {
    e.preventDefault()
    $.get('/logout')
      .then(
      () => {
        enableLogin()
        $('#logout').hide()
      }
    )
  })
  $('#start').show()
  $('#start').on('submit', function (e) {
    e.preventDefault()
    socket.emit('game-start')
    $.get('/start')
      .then(
      () => {
        $('#start').hide()
      }
    )
  })
  $('#checkSubmit').on('submit', function (e) {
    e.preventDefault()
    //socket.emit('game-start')
    socket.emit('card-check', playerName, $('#checkName').val(), $('#checkIndex').val(), (result) => {
      var out = $('#checkName').val() + " " + $('#checkIndex').val()
      if(result) {
        out += " INFO"
      } else {
        out += " INTOX"
      }
      $('#checkResult').prepend('<div>'+out+'</div>')
    })
  })
  $('#mpSubmit').on('submit', function (e) {
    e.preventDefault()
    //socket.emit('game-start')
    socket.emit('mp', playerName, $('#mpName').val(), $('#mpMessage').val())
  })
  $('#dashboard').show()
  $('#login').hide()
  /*$('#chatbox .username').text(username)
  $('#chatbox input[name=text]').focus()

  $('#chatbox').on('submit', function (e) {
    e.preventDefault()
    socket.emit('add', this.elements.text.value, message => {
      addMessage(message)
      this.elements.text.value = ''
      this.elements.text.focus()
    })
  })*/

  // $.get('/messages?limit=10').then(onMessages)
  //socket.emit('list', 0, 10, onMessages)
}

/* function onMessages (messages) {
  messages.forEach(addMessage)
}*/

/*function addCard (card) {
  $('ul#cards').prepend('<li id="card'+card.id+'">'
    + $('<strong>').text(card.player + ">>").html()
    + $('<span>').text(card.text).html()
    + playerOptions
  + '</li>')
  $('#card'+card.id).on("change", ()=>{
    //console.log(card.player, card.id, $('#card'+card.id+' option:selected').text())
    socket.emit('card-exchange', $('#card'+card.id+' option:selected').text(), card.id)
  })
}

function removeCard (card) {
  $('#card'+card.id).detach()
}*/


function updatePlayers (players) {
  playerOptions = '<option value="none">none</option>'
  players.forEach(p => playerOptions+= '<option value="' + p + '">' + p + '</option>' )
  $('#checkName').html(playerOptions)
  $('#mpName').html(playerOptions)
}

function logMp (player, message) {
  $('#mpResult').prepend('<div>'
  + $('<b>').text(player + ": ").html()
  + $('<span>').text(message).html()
  + '</div>')
}
