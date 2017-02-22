const $ = require('jquery')
const moment = require('moment')
const io = require('socket.io-client')
const _ = require('lodash')


require('moment/locale/fr')
moment.locale('fr')

var socket = io()
var playerOptions = []
var playerName = 'anonymous'
socket.emit('coucou')
socket.on('bisous', () => {
  console.log('bisous')
})

socket.on('game-reset', () => {
  $('#self').html('')
  $('#checkResult').html('')
  $('#mpResult').html('')
  $('#start').show()
  $.get('/logout')
    .then(
    () => {
      enableLogin()
      $('#logout').hide()
    }
  )
})

function highlightShared(secret) {
  if(secret.isShared) {
    return '*>'+secret.secret
  } else {
    return secret.secret
  }
}
function updateInfos () {
  socket.emit('game-get-data', ['player', playerName], self => {
    var selfSecrets = ''
    var allSecrets = ''
    if(self.secrets && self.allSecrets && self.team) {
      self.secrets.forEach(secret => {
        selfSecrets += '<div>' + highlightShared(secret) + '</div>'
      })
      self.allSecrets.forEach(secret => {
        allSecrets += '<div>' + highlightShared(secret) + '</div>'
      })
      $('#self').html('<h2>TEAM</h2>'
        + '<div>' + self.team + '</div>'
        + '<h2>SECRETS</h2>'
        + selfSecrets
        + '<h2>FLUX</h2>'
        + allSecrets
      )
    }
  })
}

function updateChecks () {
  socket.emit('game-get-history', 'card', history => {
    if(history) {
      history.forEach(item=>addCheck(item.name, item.card + 1, item.data))
    }
  })
}

function updateMps () {
  socket.emit('game-get-history', 'mp', history => {
    if(history) {
      console.log(history)
      history.forEach(item=>addMp(item.target, item.message, item.isEcho))
    }
  })
}

function addCheck(name, index, result) {
  var out = name + '[' + index + '] => '+ result.secret
  $('#checkResult').prepend('<div>'+out+'</div>')
}

function addMp(player, message, isEcho) {
  if(isEcho) {
    $('#mpResult').prepend('<div>'
    + $('<b>').text("=>" + player + ': ').html()
    + $('<span>').text(message).html()
    + '</div>')
  } else {
    $('#mpResult').prepend('<div>'
    + $('<b>').text(player + ': ').html()
    + $('<span>').text(message).html()
    + '</div>')
  }
}

socket.on('game-start', () => {
  $('#start').hide()
  updateInfos()
})

$('#coucou').on('submit', function (e) {
  e.preventDefault()
  socket.emit('coucou')
})

function hideAll () {
  $('#self').hide()
  $('#check').hide()
  $('#mp').hide()
  $('#game').hide()
}
$('#nav-self').on('click', function (e) {
  e.preventDefault()
  hideAll()
  $('#self').show()
})

$('#nav-mp').on('click', function (e) {
  e.preventDefault()
  $('#nav-mp').html('MESSAGES')
  hideAll()
  $('#mp').show()
})

$('#nav-check').on('click', function (e) {
  e.preventDefault()
  hideAll()
  $('#check').show()
})

$('#nav-game').on('click', function (e) {
  e.preventDefault()
  hideAll()
  $('#game').show()
})


// ACK
/* socket.emit('sum', 2, 3, (result) => {
  console.log('2+3 = %s', result)
})*/





//socket.on('add-card', addCard)
//socket.on('remove-card', removeCard)
socket.on('players', updatePlayers)
socket.on('mp', logMp)
socket.on('decision-start', decisionStart)
socket.on('decision-move', decisionMove)
socket.on('decision-stop', decisionStop)
socket.on('decision-tick', decisionTick)
socket.on('auction-start', (users, user2color) => auctionStart(users,user2color))
socket.on('auction-tick', auctionTick)
socket.on('auction-bid', auctionBid)
socket.on('auction-stop', auctionStop)
// Test login
$.get('/login')
  .then(
  o => {
    playerName = o.user
    enableCards(o.user)
    updateInfos()
    updateChecks()
    updateMps()
  },
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

function enableCards () {
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
  $('#reset').on('submit', function (e) {
    e.preventDefault()
    socket.emit('game-reset')
  })
  $('#start').show()
  $('#start').on('submit', function (e) {
    e.preventDefault()
    socket.emit('game-start')

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
  $('#startAuction').on('submit', function (e) {
    e.preventDefault()
    socket.emit('auction-start')
  })
  $('#checkSubmit').on('submit', function (e) {
    e.preventDefault()
    //socket.emit('game-start')
    socket.emit('game-get-data', ['card', $('#checkName').val(), Number($('#checkIndex').val()) - 1], (result) => {
      addCheck($('#checkName').val(), $('#checkIndex').val(), result)
      /* var out = $('#checkName').val() + '[' + $('#checkIndex').val() + ']=>'+ result
      $('#checkResult').prepend('<div>'+out+'</div>') */
    })
  })
  $('#dbSubmit').on('submit', function (e) {
    e.preventDefault()
    //socket.emit('game-start')
    socket.emit('game-get-data', ['word', $('#dbWord').val()], (result) => {
      var out = result
      $('#dbResult').prepend('<div>'+out+'</div>')
    })
  })
  $('#status').on('submit', function (e) {
    e.preventDefault()
    $('#statusResult').html('')
    socket.emit('players-status', (result) => {
      var out = ''
      Object.keys(result).forEach(k => {
        out += '<div>['+k+']=>'+result[k]+'secs</div>'
      })
      $('#statusResult').html(out)
    })
  })
  $('#mpSubmit').on('submit', function (e) {
    e.preventDefault()
    //socket.emit('game-start')
    socket.emit('mp', playerName, $('#mpName').val(), $('#mpMessage').val(), (target, message) => {
      addMp(target, message, true)
    })
  })
  $('#decision-quit').on('submit', function (e) {
    e.preventDefault()
    $('#dashboard').show()
    $('#decision').hide()
  })


  $('#dashboard').show()
  $('#login').hide()

  heartbit()
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

function heartbit() {
  socket.emit('players-heartbit')
  setTimeout(heartbit, 1000)
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
  $('#nav-mp').html('*MESSAGES*')
  addMp(player, message, false)
}

var users = []

drawDecisions()
function drawDecisions () {
  var decisionCanvas = document.getElementById('decisionCanvas')
  var ctx = decisionCanvas.getContext('2d')
  ctx.fillStyle = 'white'
  ctx.fillRect (0, 0, 300, 400)

  ctx.fillStyle = 'grey'
  ctx.fillRect (0, 0, 300, 50)
  ctx.fillStyle = "white"
  ctx.font = "30px Arial"
  ctx.fillText("BANQUE",10,40)


  ctx.fillStyle = 'grey'
  ctx.fillRect (0, 350, 300, 50)
  ctx.fillStyle = "white"
  ctx.font = "30px Arial"
  ctx.fillText("REVELATIONS",10,390)


  for(var i=0; i < users.length; i++) {
    ctx.globalAlpha = 0.5
    ctx.fillStyle = users[i].color
    ctx.fillRect (0, 50 + i * 50, 300, 50)
    ctx.globalAlpha = 1
    ctx.fillStyle = "white"
    ctx.font = "30px Arial"
    ctx.fillText(users[i].name,10, 80 + i * 50)

  }
  ctx.globalAlpha = 1
  users.forEach( u => {
    ctx.fillStyle = u.color
    ctx.fillRect (u.x-15, u.y-45, 30, 30)
  })
  setTimeout(drawDecisions, 50)
}

var auctions = []
var user2color = {}
drawAuctions()
function drawAuctions () {
  let w = 50
  let yo = 20
  var decisionCanvas = document.getElementById('auctionCanvas')
  var ctx = decisionCanvas.getContext('2d')
  ctx.fillStyle = 'white'
  ctx.fillRect (0, 0, 300, 400)

  auctions.forEach((bids, i) => {
    var cost = _.find(bids.bids, {player:playerName}).value
    console.log(bids.player, cost)
    ctx.fillStyle = user2color[bids.player]
    ctx.fillRect (i * w, yo , w, bids.value * 5)
    ctx.fillStyle = "black"
    ctx.font = "15px Arial"
    ctx.fillText(cost+"/"+bids.value, 15 + i * w, 15)
    ctx.save()
    ctx.translate(15 + i * w, 30)
    ctx.rotate(Math.PI/2)
    ctx.font = "25px Arial"
    ctx.fillText(bids.player, 0, 0)
    ctx.restore()
    //console.log(bids)
  })

  /* for(var i=0; i < auctions.length; i++) {
    ctx.globalAlpha = 0.5
    ctx.fillStyle = users[i].color
    ctx.fillRect (0, 50 + i * 50, 300, 50)
    ctx.globalAlpha = 1
    ctx.fillStyle = "white"
    ctx.font = "30px Arial"
    ctx.fillText(users[i].name,10, 80 + i * 50)

  }
  ctx.globalAlpha = 1
  users.forEach( u => {
    ctx.fillStyle = u.color
    ctx.fillRect (u.x-15, u.y-45, 30, 30)
  }) */
  setTimeout(drawAuctions, 50)
}

function auctionStart (users, user2colorIn) {
  user2color = user2colorIn
  $('#auction-buttons').html('')
  var h = ''
  users.forEach((u)=>{
    h += '<div class="auction-bid" data-player="' + u + '"style="float:left;width:50%;height:50px;background-color:' + user2color[u] + '">' + u +'</div>'
  })

  $('#auction-buttons').html(h)
  $('.auction-bid').on('click', function() {
    socket.emit('auction-bid', playerName, $(this).data("player"))
  })
  $('#dashboard').hide()
  $('#auction').show()
  $('#auction-quit').hide()
}

function auctionStop () {
  $('#auction-quit').show()
}

/* function decisionQuit () {
  $('#dashboard').show()
  $('#decision').hide()
}*/

function auctionBid (auctionsIn, user2color) {
  auctions = auctionsIn
}

function auctionTick (timeLeft) {
  $('#auction-tick').html(timeLeft/1000)
}

function decisionStart () {
  var el = document.getElementById('decisionCanvas')
  el.addEventListener('touchmove', touchMove, false)
  el.addEventListener('mousemove', mouseMove, false)
  $('#dashboard').hide()
  $('#decision').show()
  $('#decision-quit').hide()
}

function decisionStop () {
  var el = document.getElementById('decisionCanvas')
  el.removeEventListener('touchmove', touchMove)
  el.removeEventListener('touchmove', mouseMove)
  $('#decision-quit').show()
}

/* function decisionQuit () {
  $('#dashboard').show()
  $('#decision').hide()
}*/

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

function decisionMove (x, y, name, color) {
  var u = _.find(users, {name})
  if(!u) {
    u = {x, y, name:name, color}
    users.push(u)
  } else {
    u.x = x
    u.y = y
  }
}

//drawDecisions(150, 150)
