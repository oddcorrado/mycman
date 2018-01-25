const $ = require('jquery')
const moment = require('moment')
const io = require('socket.io-client')
const _ = require('lodash')
const mp = require('./mp')
const hack = require('./hack')
const vote = require('./vote')
const hint = require('./hint')
const menu = require('./menu')
const game = require('./game')
const help = require('./help')
const login = require('./login')
const powerup = require('./powerup')
const dashboard = require('./dashboard')
const scan = require('./scan')

// TODO bg color for revelation
game.init(updateInfos, login.startLogin)

require('moment/locale/fr')
moment.locale('fr')


let socket = io()
let playerOptions = []
let playerName = 'anonymous'
let hacks = []
let users = []
let selfInfos = {}
let glitchRatio = 0.2
let secretShareName = null
let secretShareIndex = null
let secretShareText = null
let hints = null
let players = []
let checks = []
let revelations = null
let objects = []

// ##################################
// IO SOCKET CALLBACKS
// ##################################
mp.setSocket(socket)
game.setSocket(socket)
powerup.setSocket(socket)
socket.on('players', updatePlayers)
socket.on('vote-start', (users) => voteStart(users))
socket.on('vote-stop', log => voteStop(log))
socket.on('vote-select', voteSelect)
socket.on('vote-tick', voteTick)
socket.on('phase-tick', phaseTick)
socket.on('revelation-update', () => {updateRevelations(); updateChecks()})
socket.on('hint-update', hintsIn => updateHints(hintsIn))
socket.on('hack-start', (type, target) => hackStart(type, target))
socket.on('hack-stop', (type, target) => hackStop(type, target))
socket.on('check', (checkee) => check(checkee))
socket.on('secret-share-rx',  (name, index, text) => addCheck(name, index, {secret:{secret:text}}))

/* socket.on('game-reset', () => {
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
  updateInfos()
}) */

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

// ##################################
// UPDATES FUNCTIONS
// ##################################
function updateInfos () {
  socket.emit('game-get-data', ['player', playerName], self => {
    var selfSecrets = ''
    if(self.secrets && self.knowledges && self.team) {
      selfInfos.secrets = self.secretStrings
      selfInfos.hints = self.knowledges
      selfInfos.team = self.team
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

function updateHints (hintsIn) {
  hints = hintsIn
  selfInfos.hints = hintsIn
  dashboard.update(players, hints, checks, revelations)
  let hintsHtml = ''
  if(!hints) {
    return
  }
  hints.forEach(hint => {
    if(hint.slice(0, 1) === "!") {
      hint = hint.slice(1)
      if(Math.random() < glitchRatio) {
        let index = Math.trunc(Math.random() * hint.length)
        hint = hint.slice(0, index) + hint.slice(index, index + 1).toUpperCase() + hint.slice (index + 1)
      }
    }
    hintsHtml += '<div class="self-hint">' + hint + '</div>'
  })

  $('#self-hints').html(hintsHtml)
  $('#check-hints').html(hintsHtml)
}

function updatePendings() {
  socket.emit('game-get-pendings')
}

function updateChecks () {
  cleanChecks()
  socket.emit('game-get-history', 'card', history => {
    if(history) {
      history.forEach(item=>addCheck(item.name, item.card + 1, item.data))
    }
  })
}

function updateRevelations () {
  cleanRevelations()
  socket.emit('game-get-revelations', revelationsIn => {
    if(revelationsIn) {
      revelations = revelationsIn
      dashboard.update(players, hints, checks, revelations)
      //revelations.sort((a, b) => a.name + a.card < b.name + b.card).forEach(item=>addRevelation(item.name, item.card, item.secret))
      revelations.forEach(item=>addRevelation(item.name, item.card, item.secret))
    }
  })
}

function updatePlayers (ids) {
  players = ids.filter(id => id.type === 'user').map(v => v.name)

  console.log(ids, players)
  objects = ids
  dashboard.update(players, hints, checks, revelations)
  users = players.map(name=>({name}))
  playerOptions = ''
  players.forEach(p => playerOptions+= '<option value="' + p + '">' + p + '</option>' )
  $('#check-name').html(playerOptions)
  $('#secret-share-name').html(playerOptions)

  mp.newPlayers(players, playerName)
  powerup.newPlayers(players, playerName)
  powerup.newObjects(objects)
  scan.newObjects(objects)

  $('#hack-jam-name').html(playerOptions)
  $('#hack-spy-name').html(playerOptions)
  $('#hack-usurp-name').html(playerOptions)
}

function cleanChecks() {
  $('#check-result').html('')
}

function addCheck(name, index, result) {
  // checks.push({name, card:index, secret:result})
  let hasRegex = /^les (.*) ont (.*)/i
  let teamHints = []
  if(hints) {
    hints.forEach(hint => {
      let r = hint.match(hasRegex)
      if(r) {
        let team = r[1]
        let secret = r[2]
        teamHints.push({team, secret})
      }
    })
  }
  let team = teamHints.reduce((a,v) => (!a && v.secret === result.secret.secret) ? v.team : a, null)
  // let teamHtml = team ? ('<div class="revelation-card-important">' + team + '</div>') : ''
  let teamHtml = team ? ('<img class="icon" src="/img/' + team + '.png" />') : ''

  let hasNotRegex = /^les élus n'ont pas (.*)/i
  let chosenHints = []
  if(hints) {
    hints.forEach(hint => {
      let r = hint.match(hasNotRegex)
      if(r) {
        chosenHints.push(r[1])
      }
    })
  }
  let isChosen = chosenHints.reduce((a,v) => (!a && v === result.secret.secret) ? true : a, false)
//   let chosenHtml = isChosen ? ('<div class="revelation-card-important">NON ELU</div>') : ''
  let chosenHtml = isChosen ? ('<img class="icon" src="/img/NotChosen.png" />') : ''

  $('#check-result').prepend('<div class="revelation-card">'
    + '<div class="clearfix">'
      + '<div class="revelation-card-index">' + index + '</div>'
      + '<div class="revelation-card-name">' + name + '</div>'
      + teamHtml
      + chosenHtml
      + '<div class="revelation-card-name">' + result.secret.secret + '</div>'
      + '<div class="revelation-card-icon"><img src="/img/secrets/' + skipSpaces(result.secret.secret) + '.png" /></div>'
    + '</div>'
    +'</div>')
}

function cleanRevelations() {
  $('#revelationResult').html('')
}

function addRevelation(name, index, result) {
  let hasRegex = /^les (.*) ont (.*)/i
  let teamHints = []
  if(hints) {
    hints.forEach(hint => {
      let r = hint.match(hasRegex)
      if(r) {
        let team = r[1]
        let secret = r[2]
        teamHints.push({team, secret})
      }
    })
  }
  let team = teamHints.reduce((a,v) => (!a && v.secret === result.secret.secret) ? v.team : a, null)
  // let teamHtml = team ? ('<div class="revelation-card-important">' + team + '</div>') : ''
  let teamHtml = team ? ('<img class="icon" src="/img/' + team + '.png" />') : ''

  let hasNotRegex = /^les élus n'ont pas (.*)/i
  let chosenHints = []
  if(hints) {
    hints.forEach(hint => {
      let r = hint.match(hasNotRegex)
      if(r) {
        chosenHints.push(r[1])
      }
    })
  }
  let isChosen = chosenHints.reduce((a,v) => (!a && v === result.secret.secret) ? true : a, false)
  // let chosenHtml = isChosen ? ('<div class="revelation-card-important">NON ELU</div>') : ''
  let chosenHtml = isChosen ? ('<img class="icon" src="/img/NotChosen.png" />') : ''

  $('#revelationResult').prepend('<div class="revelation-card">'
    + '<div class="clearfix">'
      + '<div class="revelation-card-index">' + index + '</div>'
      + '<div class="revelation-card-name">' + name + '</div>'
      + teamHtml
      + chosenHtml
      + '<div class="revelation-card-name">' + result.secret.secret + '</div>'
      + '<div class="revelation-card-icon"><img src="/img/secrets/' + skipSpaces(result.secret.secret) + '.png" /></div>'
    + '</div>'
    +'</div>')
}

// ##################################
// MENU NAVIGATION
// ##################################

$('#nav-self').on('click', function (e) {
  e.preventDefault()
  if(!menu.isLeftMenuActive()) { return }
  menu.hideAll()
  $('#self').show()
})

$('#nav-check').on('click', function (e) {
  e.preventDefault()
  if(!menu.isLeftMenuActive()) { return }
  menu.hideAll()
  $('#check').show()
})

$('#nav-hack').on('click', function (e) {
  e.preventDefault()
  if(!menu.isLeftMenuActive()) { return }
  menu.hideAll()
  $('#hack').show()
})

// ##################################
// LOGIN STUFF
// ##################################
$.get('/login')
  .then(
  o => {
    playerName = o.user
    setupNavigation(o.user)
    updateInfos()
    updateChecks()
    updateRevelations()
    mp.update(playerName)
    updatePendings()
  },
  () => login.startLogin()
)

/* function enableLogin () {
  $('#login').show()
  $('#chatbox').hide()
  $('#login input[name=author]').focus()
  $('#login').on('click', function (e) {
    e.preventDefault()
    $.post('/login', {
      user: this.elements.author.value.slice(0,30)
    }).then(() => document.location.reload())
  })
} */

// ##################################
// SETUP NAVIGATION
// ##################################
function setupNavigation () {
  $('#logout').show()
  $('#logout').on('submit', function (e) {
    e.preventDefault()
    $.get('/logout')
      .then(
      () => {
        login.startLogin()
        $('#logout').hide()
      }
    )
  })

  if(!(game.getOptions().doScan > 0)) {
    $('#check-direct').show()
  } else {
    $('#check-direct').hide()
  }

  $('#check-button').on('click', function (e) {
    e.preventDefault()

    if(!(game.getOptions().doScan > 0)) {
      $('#check-direct').show()
      socket.emit('game-get-data', ['card', $('#check-name').val(), Number($('#check-index').val()) - 1], (result) => {
        if (result.doHide) {
          $('#menuLink').show()
          $('#check-submit').hide()
          menu.isLeftMenuActive(true)
        }
        updateChecks()
      })
    }
    else {
      scan.scan({allowCancel:false, message:'Scannez un secret', filter:'secret'})
      .then(id => {
        let name = objects[id].name
        let index = objects[id].card - 1
        socket.emit('game-get-data', ['card', name, index], (result) => {
          if (result.doHide) {
            $('#menuLink').show()
            $('#check-submit').hide()
            menu.isLeftMenuActive(true)
          }
          updateChecks()
        })

      })
    }
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

  $('#decision-quit').on('submit', function (e) {
    e.preventDefault()
    $('#gameboard').show()
    $('#decision').hide()
  })

  $('#vote-quit').on('submit', function (e) {
    $('#phase-tick').show()
    e.preventDefault()
    $('#gameboard').show()
    $('#vote').hide()
  })

  $("#secret-share-cancel").on('click', e => {
    e.preventDefault()
    $("#secret-share").hide()
  })

  $("#secret-share-submit").on('click', e => {
    e.preventDefault()
    $("#secret-share").hide()
    console.log("share to", $('#secret-share-name').val() , secretShareName, secretShareIndex, secretShareText)
    socket.emit('secret-share', $('#secret-share-name').val(), secretShareName, secretShareIndex, secretShareText, (result) => {
      if(result === "success") {
        $("#secret-share").hide()
      }
    })
  })

  $('#auction-quit').on('submit', function (e) {
    e.preventDefault()
    $('#gameboard').show()
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

  $('#vote-result-ok').on('click', e => {
    e.preventDefault()
    $('#vote-result-modal').hide()
  })

  $('#gameboard').show()
  $('#login').hide()
}

// ############################
// VOTING STUFF
// ############################
function getColor(name) {
  return objects.find(o => o.name === name).data.color
}

function voteStart (users) {
  $('#menuLink').hide()
  $('#phase-tick').hide()
  $('#vote-buttons').html('')
  var h = ''
  users.forEach((u)=>{
    h += '<div class="vote-button" data-player="' + u +'"'
    h += ' id="vote-button-' + u + '"'
    h += ' style="float:left;width:50%;height:50px;color:black;background-color:' + getColor(u) + '">'
    h += '<div style="text-align:center">' + u + '</div>'
    h += '<div style="text-align:center" id="vote-count-' + skipSpaces(u) + '">' + 0 + '</div>'
    h += '</div>'
  })

  $('#vote-buttons').html(h)
  $('.vote-button').on('click', function() {
    socket.emit('vote-select', $(this).data("player"))
  })
  $('#gameboard').hide()
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

function voteStop (log) {
  menu.isLeftMenuActive(false)
  // $('#vote-quit').show()
  menu.hideAll()
  $('#check').show()
  $('#phase-tick').show()
  $('#gameboard').show()
  $('#vote').hide()
  $('#vote-result-modal').show()
  let htmlLog = log.split('\n').reduce((a, v) => a + '<div class="self-secret">' + v + '</div>', '')
  $('#vote-result-log').html(htmlLog)
  mp.creditUpdate()
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
  // updateHints(selfInfos.hints)
}

// ############################
// HACKING STUFF
// ############################
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
  $('#check-submit').show()
}
