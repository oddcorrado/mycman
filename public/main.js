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
const utils = require('./utils')
const startup = require('./startup')
const scanNotification = require('./scanNotification')
const texts = require('./texts')
const uuidv1 = require('uuid/v1')



// TODO bg color for revelation
console.log(game)
game.init(updateInfos, login.startLogin)
const translate = require('./translate')
translate.translate()

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
startup.setSocket(socket)
game.setSocket(socket)
powerup.setSocket(socket)
socket.on('players', ids => updatePlayers(ids))
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
socket.on('scan', scanner => scanNotification.notify(scanner))

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
      let role = self.team === 'Elu' ? 'Elu' : 'Adepte'
      let team = self.team === 'Elu' ? '???' : self.team
      if(self.team.match(/solo/)) {
        role = self.team
        team = 'Aucune'
      }
      let teamText = `<div>${translate.translateText('Rôle')} ${translate.translateText(role)}</div>
      <div>${translate.translateText('Equipe')} ${translate.translateText(team)}</div>`
      $('#self-info').html(`
        <h2>${translate.translateText('VOTRE PERSONNAGE')}</h2>
        <div class="self-name animated fadeInLeft">${translate.translateText(playerName)}</div>
        <img class="self-image-player animated fadeInLeft" class="mp-recipient-image" src="${utils.getPlayerImg(playerName)}" />
        <div class="self-team animated fadeInRight">${translate.translateText(teamText)}</div>
        <img class="self-image-team animated fadeInRight" src="/img/${self.team}.png" />
        <div class="self-text animated fadeInDown">${texts.intro[self.team] ? translate.translateText(texts.intro[self.team]) : ''}</div>
       `
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
    let text = hint.text
    if(text.slice(0, 1) === "!") {
      text = hint.text.slice(1)
      if(Math.random() < glitchRatio) {
        let index = Math.trunc(Math.random() * text.length)
        text = text.slice(0, index) + text.slice(index, index + 1).toUpperCase() + text.slice (index + 1)
      }
    }
    let id = hint.id ? hint.id + ' : ' : ''
    hintsHtml +=
     `<div class="self-hint-separator"><div class="self-hint">${id}${translate.translateSub(text)}</div></div>`
  })

//  $('#self-hints').html(hintsHtml)
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
      revelations.forEach(item => addRevelation(item.name, item.card, item.secret))
    }
  })
}

function updatePlayers (ids) {
  players = ids.filter(id => id.type === 'user').map(v => v.name)

  objects = ids
  dashboard.update(players, hints, checks, revelations)
  users = players.map(name=>({name}))
  playerOptions = ''
  players.forEach(p => playerOptions+= '<option value="' + p + '">' + p + '</option>' )
  $('#check-name').html(playerOptions)
  $('#secret-share-name').html(playerOptions)

  let checkHtml = players.reduce((a,p) =>  a + `
    <div class="check-filter" id="check-filter-${skipSpaces(p)}">
      <img class="check-filter-image" src="/img/pawns/${utils.getImgName(p)}.jpg">
    </div>`, '')
  checkHtml += `
    <div class="check-filter" id="check-filter-all">
      <img class="check-filter-image" src="/img/AllPlayers.png">
    </div>`
  $('#check-filter').html(checkHtml)
  players.forEach(p => {
    $(`#check-filter-${skipSpaces(p)}`).on('click', () => {
      $(`.revelation-card`).hide()
      $(`.revelation-card-${skipSpaces(p)}`).show()
      $(`.check-filter`).removeClass('check-filter-selected')
      $(`#check-filter-${skipSpaces(p)}`).addClass('check-filter-selected')
    })
  })
  $(`#check-filter-all`).on('click', () => {
    $(`.revelation-card`).show()
    $(`.check-filter`).removeClass('check-filter-selected')
    $(`#check-filter-all`).addClass('check-filter-selected')
  })

  mp.newPlayers(players, playerName)
  startup.newPlayers(players, playerName)
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
      let r = hint.text.match(hasRegex)
      if(r) {
        let team = r[1]
        let secret = r[2]
        teamHints.push({team, secret})
      }
    })
  }
  let team = teamHints.reduce((a,v) => (!a && v.secret === result.secret.secret) ? v.team : a, null)
  let teamHtml = team ? ('<img class="icon" src="/img/' + team + '.png" />') : ''

  let hasNotRegex = /^les élus n'ont pas (.*)/i
  let chosenHints = []
  if(hints) {
    hints.forEach(hint => {
      let r = hint.text.match(hasNotRegex)
      if(r) {
        chosenHints.push(r[1])
      }
    })
  }
  let isChosen = chosenHints.reduce((a,v) => (!a && v === result.secret.secret) ? true : a, false)
//   let chosenHtml = isChosen ? ('<div class="revelation-card-important">NON ELU</div>') : ''
  let chosenHtml = isChosen ? ('<img class="icon" src="/img/NotChosen.png" />') : ''

  $('#check-result').prepend(`
    <div class="revelation-card revelation-card-${skipSpaces(name)} animated fadeInUp" style="border-color:${getColor(name)}">
      <img class="revelation-card-image-player" class="mp-recipient-image" src="/img/pawns/${utils.getImgName(name)}.jpg" />
      <div class="clearfix">
        <div class="revelation-card-index">${index}</div>
        <div class="revelation-card-name">${translate.translateText(name)}</div>
        <div class="revelation-card-short">${result.secret.short}</div>
        ${teamHtml}
        ${chosenHtml}
        <div class="revelation-card-secret">${translate.translateText(result.secret.secret)}</div>
        <img class="revelation-card-image-secret" class="mp-recipient-image" src="${utils.getSecretImg(result.secret.secret)}" />
      </div>
    </div>`)
}

function cleanRevelations() {
  $('#revelationResult').html('')
}

function addRevelation(name, index, result) {
  let hasRegex = /^les (.*) ont (.*)/i
  let teamHints = []
  if(hints) {
    hints.forEach(hint => {
      let r = hint.text.match(hasRegex)
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
      let r = hint.text.match(hasNotRegex)
      if(r) {
        chosenHints.push(r[1])
      }
    })
  }
  let isChosen = chosenHints.reduce((a,v) => (!a && v === result.secret.secret) ? true : a, false)
  // let chosenHtml = isChosen ? ('<div class="revelation-card-important">NON ELU</div>') : ''
  let chosenHtml = isChosen ? ('<img class="icon" src="/img/NotChosen.png" />') : ''

  $('#revelationResult').prepend(`
    <div class="revelation-card revelation-card-${skipSpaces(name)} animated fadeInUp" style="border-color:${getColor(name)}">
      <img class="revelation-card-image-player" class="mp-recipient-image" src="/img/pawns/${utils.getImgName(name)}.jpg" />
      <div class="clearfix">
        <div class="revelation-card-index">${index}</div>
        <div class="revelation-card-name">${translate.translateText(name)}</div>
        <div class="revelation-card-short">${translate.translateText(result.secret.short)}</div>
        ${teamHtml}
        ${chosenHtml}
        <div class="revelation-card-secret">${translate.translateText(result.secret.secret)}</div>
        <img class="revelation-card-image-secret" class="mp-recipient-image" src="${utils.getSecretImg(result.secret.secret)}" />
      </div>
    </div>`)

/*   $('#revelationResult').prepend('<div class="revelation-card">'
    + '<div class="clearfix">'
      + '<div class="revelation-card-index">' + index + '</div>'
      + '<div class="revelation-card-name">' + name + '</div>'
      + teamHtml
      + chosenHtml
      + '<div class="revelation-card-name">' + result.secret.secret + '</div>'
      + '<div class="revelation-card-icon" style="background-image:url(/img/secrets/' + skipSpaces(result.secret.secret) + '.png)"></div>'
    + '</div>'
    +'</div>') */
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
$.get('/options')
  .then(o => game.setOptions(o))
  .then(() => $.get('/login'))
  .then(
    o => {
      playerName = o.user
      setupNavigation(o.user)
      updateInfos()
      updateChecks()
      updateRevelations()
      mp.update(playerName)
      updatePendings()
      updatePlayers(o.ids)
      powerup.check()
      if(o.gameStatus.state === 'idle') {
        menu.modalShow('#startup-modal')
      }
      if(o.gameStatus.state === 'vote') {
        menu.modalShow('#vote-modal')
        voteStart()
      }
    }, () => login.startLogin()
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

  $('#hint-button').on('click', function (e) {
    e.preventDefault()

    if(!(game.getOptions().doScan > 0)) {
      $('#hint-direct').show()
      socket.emit('game-get-data', ['hint', Number($('#hint-index').val())], (result) => {
        if(!result) {
          return
        }
        /* if (result.doHide) {
          $('#menuLink').show()
          $('#check-submit').hide()
          menu.isLeftMenuActive(true)
        } */
        updateInfos()
        updateChecks()
        updateRevelations()
      })
    }
    else {
      scan.scan({allowCancel:false, message:'Scannez un indice', filter:'hint'})
      .then(id => {
        let index = objects[id].card - 1
        socket.emit('game-get-data', ['hint', index], (result) => {
          if(!result) {
            return
          }
          /* if (result.doHide) {
            $('#menuLink').show()
            $('#check-submit').hide()
            menu.isLeftMenuActive(true)
          } */
          updateInfos()
          updateChecks()
          updateRevelations()
        })
      })
    }
  })

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
    menu.modalHide('#vote-modal')
  })

  $("#secret-share-cancel").on('click', e => {
    e.preventDefault()
    $("#secret-share").hide()
  })

  $("#secret-share-submit").on('click', e => {
    e.preventDefault()
    $("#secret-share").hide()
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
    menu.modalHide('#vote-result-modal')
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

function voteStart () {
  $('#menuLink').hide()
  $('#phase-tick').hide()
  $('#vote-buttons').html('')
  var h = ''
  players.forEach((u)=>{
    h += '<div class="vote-button animated flipInX" data-player="' + u +'"'
    h += ' id="vote-button-' + u + '"'
    h += ' style="background-color:' + getColor(u) + '">'
    h += '<div class="vote-count" id="vote-count-' + skipSpaces(u) + '">' + 0 + '</div>'
    h += '<img class="vote-image-player" id="vote-image-' + skipSpaces(u) + '" class="mp-recipient-image" src="/img/pawns/'
            + utils.getImgName(u) + '.jpg" />'
    h += `<div class="vote-name">${translate.translateText(u)}</div>`
    h += '</div>'
  })

  $('#vote-buttons').html(h)
  $('.vote-button').on('click', function() {
    $(this).removeClass("animated").removeClass("tada").removeClass("flipInX")
    $(this).addClass("animated tada")
    setTimeout(() => $(this).removeClass("animated tada"), 1000)
    socket.emit('vote-select', $(this).data("player"))
  })
  $('#gameboard').hide()
  menu.modalShow('#vote-modal')
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
    $('#vote-count-' + skipSpaces(vote.name)).html(vote.count)
    $('#vote-image-' + skipSpaces(vote.name)).removeClass('vote-image-player-selected')
    if(vote.name === myVote) {
      $('#vote-image-' + skipSpaces(vote.name)).addClass('vote-image-player-selected')
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
  $('#nav-speedup').show()
  menu.modalHide('#vote-modal')
  menu.modalShow('#vote-result-modal')
  let htmlLog = ''
  let delay = 0
  let ids = []
  // let htmlLog = log.debug.split('\n').reduce((a, v) => a + '<div class="self-secret">' + v + '</div>', '')
  if(log.powerupLog.uses.length === 0) {
    htmlLog += `<div class="vote-result-card">${translate.translateText('pas de powerup ce tour')}</div>`
  } else {
    htmlLog += log.powerupLog.uses.reduce((a, v) => {
      let id = uuidv1()
      ids.push(id)
      return a + `<div id="${id}" class="vote-result-card" style="display:none;">
            <div class="vote-result-uses-text">${translate.translateText(v.log)}</div>
            <img class="vote-result-uses-image" src="${utils.getSecretImg(v.secret)}" />
          </div>`
    } , '')
  }
  if(log.gameLog.revelations.length === 0) {
    htmlLog += `<div class="vote-result-card">${translate.translateText('personne n\'est révélé')}</div>`
  } else {
    htmlLog += log.gameLog.revelations.reduce((a, v) => {
      let id = uuidv1()
      ids.push(id)
      return a + `<div id="${id}" class="vote-result-card" style="display:none;">
            <div class="vote-result-revealed-text">
              ${translate.translateText(v.name)} ${translate.translateText('a été révélé avec')} ${translate.translateText(v.secret)}
            </div>
            <img class="vote-result-revealed-image-player" src="${utils.getPlayerImg(v.name)}" />
            <img class="vote-result-revealed-image-secret" src="${utils.getSecretImg(v.secret)}" />
          </div>`
    } , '')
  }
  ids.forEach((id, i) => {
    setTimeout(() => {
      $(`#${id}`).show()
      $(`#${id}`).addClass('animated bounceInUp flash')
    }, i * 1500)
  })
  $('#vote-result-log').html(htmlLog)
  mp.creditUpdate()
  powerup.check()
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
