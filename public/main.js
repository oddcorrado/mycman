const $ = require('jquery')
const moment = require('moment')
const io = require('socket.io-client')
const _ = require('lodash')


require('moment/locale/fr')
moment.locale('fr')


var socket = io()
var playerOptions = []
var playerName = 'anonymous'
var hacks = []
var users = []
var checkee = ''
var mpSelected = null

//socket.on('add-card', addCard)
//socket.on('remove-card', removeCard)
socket.on('players', updatePlayers)
socket.on('players-bank', updateBank)
socket.on('player-money', updatePlayerMoney)
socket.on('mp', logMp)
socket.on('decision-start', decisionStart)
socket.on('decision-move', decisionMove)
socket.on('decision-stop', decisionStop)
socket.on('decision-tick', decisionTick)
socket.on('vote-start', (users, user2color) => voteStart(users,user2color))
//socket.on('vote-move', voteMove)
socket.on('vote-stop', voteStop)
socket.on('vote-select', voteSelect)
socket.on('vote-tick', voteTick)
socket.on('revelation-update', updateRevelations)
socket.on('auction-start', (users, user2color) => auctionStart(users,user2color))
socket.on('auction-tick', auctionTick)
socket.on('auction-bid', auctionBid)
socket.on('auction-stop', auctionStop)
socket.on('gameOver', data => gameOver(data))
socket.on('hack-start', (type, target) => hackStart(type, target))
socket.on('hack-stop', (type, target) => hackStop(type, target))
socket.on('check', (checkee) => check(checkee))

socket.on('game-reset', () => {
  $('#self').html('')
  $('#checkResult').html('')
  $('#revelationResult').html('')
  $('#mp-result').html('')
  $('#start').show()
  $('#dashboard').hide()
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
  updateInfos()
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
    updatePlayerMoney(self.money)
    updateBank(self.bank)
    var selfSecrets = ''
    // var allSecrets = ''
    var selfKnowledges = ''
    if(self.secrets && self.knowledges && self.team) {
      self.secrets.forEach(secret => {
        selfSecrets += '<div class="self-secret">' + highlightShared(secret.secret) + '</div>'
      })
      self.knowledges.forEach(hint => {
        selfKnowledges += '<div class="self-hint">' + hint + '</div>'
      })
      $('#self').html('<div class="self-team">' + self.team + '</div>'
        + '<h3>INDICES</h2>'
        + selfKnowledges
        + '<h3>SECRETS</h2>'
        + selfSecrets
      )
    }
  })
}

function updatePendings() {
  socket.emit('game-get-pendings')
}

function updateChecks () {
  socket.emit('game-get-history', 'card', history => {
    if(history) {
      history.forEach(item=>addCheck(item.name, item.card + 1, item.data))
    }
  })
}

function updateRevelations () {
  cleanRevelations()
  socket.emit('game-get-revelations', revelations => {
    if(revelations) {
      revelations.forEach(item=>addRevelation(item.name, item.card, item.secret))
    }
  })
}

function updateMps () {
  socket.emit('game-get-history', 'mp', history => {
    if(history) {
      history.forEach(item=>addMp(item.target, item.message, item.isEcho))
    }
  })
}

function addCheck(name, index, result) {
  $('#checkResult').prepend('<div class="check-card">'
    + '<div class="clearfix">'
      + '<div class="check-card-index">' + index + '</div>'
      + '<div class="check-card-name">' + name + '</div>'
    + '</div>'
    + '<div class="check-card-secret">' + result.secret.secret + '</div>'
    +'</div>')
}

function cleanRevelations() {
  $('#revelationResult').html('')
}

function addRevelation(name, index, result) {
  $('#revelationResult').prepend('<div class="revelation-card">'
    + '<div class="clearfix">'
      + '<div class="revelation-card-index">' + index + '</div>'
      + '<div class="revelation-card-name">' + name + '</div>'
    + '</div>'
    + '<div class="revelation-card-secret">' + result.secret + '</div>'
    +'</div>')
}

function addMp(player, message, isEcho) {
  if(isEcho) {
    $('#mp-result-' + player).append('<div class="message-card-self clearfix">'
    + $('<span>').text(message).html()
    + '</div>')
  } else {
    $('#mp-result-' + player).append('<div class="clearfix"><div class="message-card-other">'
    + $('<span>').text(message).html()
    + '</div></div>')
  }
}



$('#coucou').on('submit', function (e) {
  e.preventDefault()
  socket.emit('coucou')
})

function hideAll () {
  $('#self').hide()
  $('#check').hide()
  $('#mp').hide()
  $('#game').hide()
  $('#hack').hide()
}

$('.pure-menu-item').on('click', function() {
  $('.pure-menu-selected').removeClass('pure-menu-selected')
  $(this).addClass('pure-menu-selected')
})

$('#nav-self').on('click', function (e) {
  e.preventDefault()
  hideAll()
  $('#self').show()
})

$('#nav-mp').on('click', function (e) {
  e.preventDefault()
  $('#nav-mp').html('MPS')
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

$('#nav-hack').on('click', function (e) {
  e.preventDefault()
  hideAll()
  $('#hack').show()
})


// ACK
/* socket.emit('sum', 2, 3, (result) => {
  console.log('2+3 = %s', result)
})*/





// Test login
$.get('/login')
  .then(
  o => {
    playerName = o.user
    enableCards(o.user)
    updateInfos()
    updateChecks()
    updateRevelations()
    updateMps()
    updatePendings()
  },
  () => enableLogin()
)

function enableLogin () {
  $('#login').show()
  $('#chatbox').hide()
  $('#login input[name=author]').focus()
  $('#login').on('click', function (e) {
    e.preventDefault()
    $.post('/login', {
      user: this.elements.author.value.slice(0,30)
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
  $('#reset').on('click', function (e) {
    e.preventDefault()
    socket.emit('game-reset')
  })
  $('#start').show()
  $('#start').on('click', function (e) {
    e.preventDefault()
    socket.emit('game-start')

    /*$.get('/start')
      .then(
      () => {
        $('#start').hide()
      }
    )*/
  })
  $('#startDecision').on('click', function (e) {
    e.preventDefault()
    socket.emit('decision-start')
  })
  $('#startVote').on('click', function (e) {
    e.preventDefault()
    socket.emit('vote-start')
  })
  $('#startAuction').on('click', function (e) {
    e.preventDefault()
    socket.emit('auction-start')
  })
  $('#check-button').on('click', function (e) {
    e.preventDefault()
    //socket.emit('game-start')
    /* checkee = $('#checkName').val() */
    console.log('checking', checkee)
    socket.emit('game-get-data', ['card', $('#checkName').val(), Number($('#checkIndex').val()) - 1], (result) => {
      addCheck(result.checkee, result.index + 1, result)
      if (result.doHide) {
        $('#checkSubmit').hide()
      }

      /* var out = $('#checkName').val() + '[' + $('#checkIndex').val() + ']=>'+ result
      $('#checkResult').prepend('<div>'+out+'</div>') */
    })
  })
  $('#hack-jam-submit').on('submit', function (e) {
    e.preventDefault()
    //socket.emit('game-start')
    socket.emit('game-action', ['hack-jam', $('#hack-jam-name').val()], (result) => {
      console.log(result)
    })
  })
  $('#hack-spy-submit').on('submit', function (e) {
    e.preventDefault()
    //socket.emit('game-start')
    socket.emit('game-action', ['hack-spy', $('#hack-spy-name').val()], (result) => {
      console.log(result)
    })
  })
  $('#hack-usurp-submit').on('submit', function (e) {
    e.preventDefault()
    //socket.emit('game-start')
    socket.emit('game-action', ['hack-usurp', $('#hack-usurp-name').val()], (result) => {
      console.log(result)
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
  $('#mp-message-send').on('click', function (e) {
    e.preventDefault()
    //socket.emit('game-start')
    if(mpSelected !== null &&  $('#mp-message-text').val() !== '') {
      socket.emit('mp', playerName, mpSelected, $('#mp-message-text').val(), (target, message) => {
        addMp(target, message, true)})
      $('#mp-message-text').val('')
    }
  })

  $('#decision-quit').on('submit', function (e) {
    e.preventDefault()
    $('#dashboard').show()
    $('#decision').hide()
  })

  $('#vote-quit').on('submit', function (e) {
    e.preventDefault()
    $('#dashboard').show()
    $('#vote').hide()
  })

  $('#auction-quit').on('submit', function (e) {
    e.preventDefault()
    $('#dashboard').show()
    $('#auction').hide()
  })

  $('#money').on('click', e => {
    e.preventDefault()
    socket.emit('player-money-transfer', 'bank', -1)
  })

  $('#bank').on('click', e => {
    e.preventDefault()
    socket.emit('player-money-transfer', 'bank', 1)
  })

  $('#dashboard').show()
  $('#login').hide()

  //heartbit()
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

function mpHideAll() {
  users.forEach(u => $('#mp-result-' + u.name).hide())
  $('.pure-menu-selected').removeClass('pure-menu-selected')
}

function updatePlayers (players) {
  users = players.map(name=>({name}))
  playerOptions = ''
  players.forEach(p => playerOptions+= '<option value="' + p + '">' + p + '</option>' )
  $('#checkName').html(playerOptions)
  players.forEach(p => {
    if($('#mp-result-' + p).length === 0) {
      $('#mp-result').append('<div class="mp-player" id="mp-result-' + p + '"></div>')
    }
  })
  players.forEach(p => {
    if($('#mp-select-' + p).length === 0) {
      $('#menu-list').append(
        '<li class="pure-menu-item" id="mp-select-' + p + '">' + '\> ' + p + '</li>')
    }
  })
  players.forEach(p => $('#mp-select-' + p).on('click', function (e) {
    e.preventDefault()
    mpHideAll()
    hideAll()
    $('#mp').show()
    $('#mp-result-' + p).show()
    mpSelected = p
    $('#mp-select-' + p).addClass('pure-menu-selected')
    $('#mp-select-'+ p ).html('> '+ p)
    $('html').scrollTop(document.getElementById("mp").scrollHeight)
  }))
  if(mpSelected === null) {
    mpHideAll()
  }

  //$('#checkName').html('')
  $('#mpName').html(playerOptions)
  $('#hack-jam-name').html(playerOptions)
  $('#hack-spy-name').html(playerOptions)
  $('#hack-usurp-name').html(playerOptions)
}

function logMp (player, message) {
  $('#mp-select-'+player).html('*> '+player)
  addMp(player, message, false)
}

//var users = []

drawDecisions()
function drawDecisions () {
  var decisionCanvas = document.getElementById('decisionCanvas')
  var ctx = decisionCanvas.getContext('2d')
  ctx.fillStyle = 'white'
  ctx.fillRect (0, 0, 300, 400)

  /* ctx.fillStyle = 'grey'
  ctx.fillRect (0, 0, 300, 50)
  ctx.fillStyle = "white"
  ctx.font = "30px Arial"
  ctx.fillText("BANQUE",10,40)


  ctx.fillStyle = 'grey'
  ctx.fillRect (0, 350, 300, 50)
  ctx.fillStyle = "white"
  ctx.font = "30px Arial"
  ctx.fillText("REVELATIONS",10,390) */


  for(var i=0; i < users.length; i++) {
    ctx.globalAlpha = 0.5
    ctx.fillStyle = users[i].color
    ctx.fillRect (0, /* 50 + */ i * 50, 300, 50)
    ctx.globalAlpha = 1
    ctx.fillStyle = "white"
    ctx.font = "30px Arial"
    ctx.fillText(users[i].name,10, /* 80 + */ 30 + i * 50)

  }
  ctx.globalAlpha = 1
  users.forEach( u => {
    ctx.fillStyle = u.color
    ctx.fillRect (u.x-15, u.y-45, 30, 30)
  })
  setTimeout(drawDecisions, 50)
}

drawVote ()
function drawVote () {
  var voteCanvas = document.getElementById('voteCanvas')
  var ctx = voteCanvas.getContext('2d')
  ctx.fillStyle = 'white'
  ctx.fillRect (0, 0, 300, 400)

  for(var i=0; i < users.length; i++) {
    ctx.globalAlpha = 0.5
    ctx.fillStyle = users[i].color
    ctx.fillRect (0, i * 50, 300, 50)
    ctx.globalAlpha = 1
    ctx.fillStyle = "white"
    ctx.font = "30px Arial"
    ctx.fillText(users[i].name,10, 30 + i * 50)

  }
  ctx.globalAlpha = 1
  users.forEach( u => {
    ctx.fillStyle = u.color
    ctx.fillRect (u.x-15, u.y-45, 30, 30)
  })
  setTimeout(drawVote, 50)
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

function auctionBid (auctionsIn) {
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

function decisionMove (x, y, name, color) {
  var u = _.find(users, {name})
  if(!u) {
    u = {x, y, name:name, color}
    users.push(u)
  } else {
    u.color = color
    u.x = x
    u.y = y
  }
}

function decisionTick (timeLeft) {
  $('#decision-tick').html(timeLeft/1000)
}

function voteStart (users, user2colorIn) {
  user2color = user2colorIn
  $('#vote-buttons').html('')
  var h = ''
  users.forEach((u)=>{
    h += '<div class="vote-button" data-player="' + u +'"'
    h += ' id="vote-button-' + u + '"'
    h += ' style="float:left;width:50%;height:50px;background-color:' + user2color[u] + '">'
    h += '<div style="text-align:center">' + u + '</div>'
    h += '<div style="text-align:center" id="vote-count-' + u + '">' + 0 + '</div>'
    h += '</div>'
  })

  $('#vote-buttons').html(h)
  $('.vote-button').on('click', function() {
    console.log(playerName, $(this).data("player"))
    socket.emit('vote-select', $(this).data("player"))
  })
  $('#dashboard').hide()
  $('#vote').show()
  $('#vote-quit').hide()
}

function voteCount(votes) {
  var counts = users.map(user => {
    var count = votes.reduce((a,v) => v.target === user.name ? a + 1 : a, 0)
    return {name:user.name, count}
  })
  return counts
}

function voteSelect (votes) {
  let myVote = (votes.find(vote => vote.voter === playerName) || {}).target
  voteCount(votes).forEach(vote => {
    if(vote.name === myVote) {
      $('#vote-count-' + vote.name).html('<' + vote.count + '>')
    } else {
      $('#vote-count-' + vote.name).html(vote.count)
    }
  })
}

function voteStop () {
  $('#vote-quit').show()
}

function voteTick (timeLeft) {
  $('#vote-tick').html(timeLeft/1000)
}

/* function voteStart () {
  var el = document.getElementById('voteCanvas')
  el.addEventListener('touchmove', voteTouchMove, false)
  el.addEventListener('mousemove', voteMouseMove, false)
  $('#dashboard').hide()
  $('#vote').show()
  $('#vote-quit').hide()
}

function voteStop () {
  var el = document.getElementById('voteCanvas')
  el.removeEventListener('touchmove', voteTouchMove)
  el.removeEventListener('touchmove', voteMouseMove)
  $('#vote-quit').show()
}

function voteMove (x, y, name, color) {
  var u = _.find(users, {name})
  if(!u) {
    u = {x, y, name:name, color}
    users.push(u)
  } else {
    u.color = color
    u.x = x
    u.y = y
  }
}



function voteTouchMove (evt) {
  evt.preventDefault()
  var touches = evt.changedTouches

  if(touches[0]) {
    socket.emit('vote-move', touches[0].clientX, touches[0].clientY)
  }
}

function voteMouseMove (evt) {
  evt.preventDefault()
  socket.emit('vote-move', evt.clientX, evt.clientY)
} */

/* function decisionQuit () {
  $('#dashboard').show()
  $('#decision').hide()
}*/


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

function updatePlayerMoney(money) {
  money = money || 'press start'
  $('#money').html('ARGENT:' + money)
}

function updateBank(money) {
  $('#bank').html('BANQUE:' + money)
}

function updateHacks() {
  let translate = {jammers:'JAM',spies:'SPY',usurpators:'USURP'}
  console.log(hacks)
  var hackList = hacks.reduce((acc, cur) => acc += '<div>' + translate[cur.type] + ":" + cur.target + '</div>', '')
  $('#hack-list').html(hackList)
}

function hackStart(type, target) {
  console.log('hack-start', type, target)
  hacks.push({type, target})
  updateHacks()
}

function hackStop(type, target) {
  console.log('hack-stop', type, target)
  _.remove(hacks, function(item) {
    return item.type === type && item.target === target ? true : false
  })
  updateHacks()
}

function check() {
  $('#checkSubmit').show()
  //$('#checkName').html(name)
  //checkee = name
  checkee = $('#checkName').val()
}

function gameOver(data) {
  $('#gameOver').show()
  $('#gameOver-winner').html('<h3>' + 'Les ' + data.winnerTeams + 's ont gagné</h3>')
  data.winners.forEach(name => $('#gameOver-winner').append('<div>' + name + ' a gagné' + '</div>'))
  $('#gameOver-messages').html('')
  data.messages.forEach(message => $('#gameOver-messages')
    .append('<div>' + message.from + '=>' + message.to + ':' + message.message + '</div>'))
  $('#gameOver-votes').html('')
  data.votes.forEach(vote => $('#gameOver-votes')
    .append('<div>' + vote.name + '=>' + vote.voted + ':' + vote.count + '</div>'))
}
//drawDecisions(150, 150)
