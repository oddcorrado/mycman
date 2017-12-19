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
var mpSelected = null
var user2color = {}
var isLeftMenuActive = true

//socket.on('add-card', addCard)
//socket.on('remove-card', removeCard)
socket.on('players', updatePlayers)
socket.on('mp', logMp)
socket.on('vote-start', (users, user2color) => voteStart(users,user2color))
//socket.on('vote-move', voteMove)
socket.on('vote-stop', voteStop)
socket.on('vote-select', voteSelect)
socket.on('vote-tick', voteTick)
socket.on('phase-tick', phaseTick)
socket.on('revelation-update', updateRevelations)
socket.on('hint-update', hints => updateHints(hints))
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

function skipSpaces(s) {
  return s.replace(/ /g, '_')
}

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
    if(self.secrets && self.knowledges && self.team) {
      self.secrets.forEach(secret => {
        selfSecrets += '<div class="self-secret">' + highlightShared(secret.secret) + '</div>'
      })
      $('#self').html('<div class="self-team">' + self.team + '</div>'
        + '<h3>INDICES</h2>'
        + '<div id="self-hints">' + '</div>'
        + '<h3>SECRETS</h2>'
        + selfSecrets
      )
      updateHints(self.knowledges)
    }
  })
}

function updateHints (hints) {
  let hintsHtml = ''
  hints.forEach(hint => {
    hintsHtml += '<div class="self-hint">' + hint + '</div>'
  })

  $('#self-hints').html(hintsHtml)
  $('#check-hints').html(hintsHtml)
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
    + '<div class="revelation-card-secret">' + result.secret.secret + '</div>'
    +'</div>')
}

function addMp(player, message, isEcho) {
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
  if(!isLeftMenuActive) { return }
  hideAll()
  $('#self').show()
})

$('#nav-mp').on('click', function (e) {
  e.preventDefault()
  $('#nav-mp').html('MPS')
  if(!isLeftMenuActive) { return }
  hideAll()
  $('#mp').show()
})

$('#nav-check').on('click', function (e) {
  e.preventDefault()
  if(!isLeftMenuActive) { return }
  hideAll()
  $('#check').show()
})

$('#nav-game').on('click', function (e) {
  e.preventDefault()
  if(!isLeftMenuActive) { return }
  hideAll()
  $('#game').show()
})

$('#nav-hack').on('click', function (e) {
  e.preventDefault()
  if(!isLeftMenuActive) { return }
  hideAll()
  $('#hack').show()
})

$('#mp-message-text').on('focus', function() {
  $('#mp-recipients').hide()
})

$('#mp-message-text').on('blur', function() {
  $('#mp-recipients').show()
})

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
    socket.emit('game-get-data', ['card', $('#checkName').val(), Number($('#checkIndex').val()) - 1], (result) => {
      addCheck(result.checkee, result.index + 1, result)
      if (result.doHide) {
        $('#menuLink').show()
        $('#checkSubmit').hide()
        isLeftMenuActive = true
      }
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
    $('#phase-tick').show()
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
}

function mpHideAll() {
  users.forEach(u => $('#mp-result-' + skipSpaces(u.name)).hide())
  $('.pure-menu-selected').removeClass('pure-menu-selected')
}

function updatePlayers (players) {
  users = players.map(name=>({name}))
  playerOptions = ''
  players.forEach(p => playerOptions+= '<option value="' + p + '">' + p + '</option>' )
  $('#checkName').html(playerOptions)
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
    if(!isLeftMenuActive) { return }
    mpHideAll()
    hideAll()
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
    if(!isLeftMenuActive) { return }
    mpHideAll()
    hideAll()
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
  $('#hack-jam-name').html(playerOptions)
  $('#hack-spy-name').html(playerOptions)
  $('#hack-usurp-name').html(playerOptions)
}

function logMp (player, message) {
  $('#mp-select-' + skipSpaces(player)).html('*> '+player)
  $('#mp-recipient-' + skipSpaces(player)).addClass('mp-recipient-unread')
  addMp(player, message, false)
}

function voteStart (users, user2colorIn) {
  $('#menuLink').hide()
  $('#phase-tick').hide()
  user2color = user2colorIn
  $('#vote-buttons').html('')
  var h = ''
  users.forEach((u)=>{
    h += '<div class="vote-button" data-player="' + u +'"'
    h += ' id="vote-button-' + u + '"'
    h += ' style="float:left;width:50%;height:50px;color:black;background-color:' + user2color[u] + '">'
    h += '<div style="text-align:center">' + u + '</div>'
    h += '<div style="text-align:center" id="vote-count-' + skipSpaces(u) + '">' + 0 + '</div>'
    h += '</div>'
  })

  $('#vote-buttons').html(h)
  $('.vote-button').on('click', function() {
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
      $('#vote-count-' + skipSpaces(vote.name)).html('<' + vote.count + '>')
    } else {
      $('#vote-count-' + skipSpaces(vote.name)).html(vote.count)
    }
  })
}

function voteStop () {
  isLeftMenuActive = false
  // $('#vote-quit').show()
  hideAll()
  $('#check').show()
  $('#phase-tick').show()
  $('#dashboard').show()
  $('#vote').hide()
}

function voteTick (timeLeft) {
  $('#vote-tick').html(Math.trunc(timeLeft/1000))
}

function phaseTick (timeLeft) {
  let ratio = 2 * ((timeLeft/10) % 100)
  ratio = Math.min(ratio * 2, 400 - ratio * 2)
  if(timeLeft < 10000) {
    $('body').css("background-color", "rgb(" + ratio + ",0," + ratio +")")
  }
  $('#phase-tick').html(Math.trunc(timeLeft/1000))
}

function updateHacks() {
  let translate = {jammers:'JAM',spies:'SPY',usurpators:'USURP'}
  var hackList = hacks.reduce((acc, cur) => acc += '<div>' + translate[cur.type] + ":" + cur.target + '</div>', '')
  $('#hack-list').html(hackList)
}

function hackStart(type, target) {
  hacks.push({type, target})
  updateHacks()
}

function hackStop(type, target) {
  _.remove(hacks, function(item) {
    return item.type === type && item.target === target ? true : false
  })
  updateHacks()
}

function check() {
  $('#checkSubmit').show()
  //$('#checkName').html(name)
  //checkee = name
  // checkee = $('#checkName').val()
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
