const $ = require('jquery')
const moment = require('moment')
const io = require('socket.io-client')
const _ = require('lodash')

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
socket.on('decision-start', decisionStart)
socket.on('decision-move', decisionMove)
socket.on('decision-stop', decisionStop)
socket.on('decision-tick', decisionTick)

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
    socket.emit('game-get-data', ['player', playerName], self => {
      console.log(self)
      var selfSecrets = ''
      self.secrets.forEach(secret => {
        selfSecrets += '<div>' + secret + '</div>'
        console.log(secret, selfSecrets)
      })

      $('#dashboard-self').html(
        '<div>' + self.team + '</div>'
        + selfSecrets
        //+ self.secrets.forEach(secret => $('<div>').text(secret))
        //+ $('<div>').text(self.team).html()
//        + self.secrets.forEach(secret => $('<div>').text(secret).html())
      )
    })
    /*$.get('/start')
      .then(
      () => {
        $('#start').hide()
      }
    )*/
  })
  $('#startDecision').on('submit', function (e) {
    e.preventDefault()
    socket.emit('decision-start')
  })
  $('#checkSubmit').on('submit', function (e) {
    e.preventDefault()
    //socket.emit('game-start')
    socket.emit('game-get-data', ['card', $('#checkName').val(), Number($('#checkIndex').val()) - 1], (result) => {
      var out = $('#checkName').val() + "[" + $('#checkIndex').val() + "]=>"+ result
      console.log(out)
      $('#checkResult').prepend('<div>'+out+'</div>')
    })
  })
  $('#mpSubmit').on('submit', function (e) {
    e.preventDefault()
    //socket.emit('game-start')
    socket.emit('mp', playerName, $('#mpName').val(), $('#mpMessage').val())
  })
  $('#decision-quit').on('submit', function (e) {
    e.preventDefault()
    $('#dashboard').show()
    $('#decision').hide()
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
  playerOptions = '' //'<option value="none">'+playerName+'</option>'
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

var users = []

draw()

function draw () {
  var canvas = document.getElementById("canvas")
  var ctx = canvas.getContext("2d")
  ctx.fillStyle = "white"
  ctx.fillRect (0, 0, 300, 400)
  ctx.fillStyle = "grey"
  ctx.fillRect (0, 0, 300, 50)

  ctx.globalAlpha = 0.5
  for(var i=0; i < users.length; i++) {
    ctx.fillStyle = users[i].color
    ctx.fillRect (0, 50 + i * 50, 300, 50)
  }
  ctx.globalAlpha = 1
  users.forEach( u => {
    ctx.fillStyle = u.color
    ctx.fillRect (u.x-15, u.y-45, 30, 30)
  })
  setTimeout(draw, 50)
}

function decisionStart () {
  console.log(users)
  var el = document.getElementsByTagName("canvas")[0]
  el.addEventListener("touchmove", touchMove, false)
  el.addEventListener("mousemove", mouseMove, false)
  $('#dashboard').hide()
  $('#decision').show()
  $('#decision-quit').hide()
}

function decisionStop () {
  var el = document.getElementsByTagName("canvas")[0]
  el.removeEventListener("touchmove", touchMove)
  el.removeEventListener("touchmove", mouseMove)
  $('#decision-quit').show()
}

function decisionQuit () {
  $('#dashboard').show()
  $('#decision').hide()
}

function decisionTick (timeLeft) {
  $('#decision-tick').html(timeLeft/1000)
}

function touchMove (evt) {
  evt.preventDefault()
  var touches = evt.changedTouches

  if(touches[0]) {
    socket.emit('decision-move', touches[0].clientX, touches[0].clientY)
  }
}

function mouseMove (evt) {
  evt.preventDefault()
  socket.emit('decision-move', evt.clientX, evt.clientY)

}

function decisionMove (x, y, color) {
  var u = _.find(users, {color})
  if(!u) {
    u = {x, y, color}
    users.push(u)
  } else {
    u.x = x
    u.y = y
  }
}

draw(150, 150)
