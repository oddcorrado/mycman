'use strict'
const $ = require('jquery')
const menu = require('./menu')

const update = (playersIn, hintsIn, checks, revelations) => {
  let players = playersIn || []
  let teamHints = []
  let chosenHints = []
  checks = checks || []
  revelations = revelations || []

  players = players.map(player => ({name:player, secrets: [], positives: [], negatives: [], chosen: true}))

  checks.forEach(check => {
    let player = players.find(p => check.name === p.name)
    if(player) {
      if(!player.secrets.find(s => s === check.secret.secret.secret)) {
        if(!check.secret.isRevealed) {
          player.secrets.push(check.secret.secret.secret)
        }
      }
    }
  })

  revelations.forEach(revelation => {
    let player = players.find(p => revelation.name === p.name)
    if(player) {
      if(!player.secrets.find(s => s === revelation.secret.secret.secret)) {
        player.secrets.push(revelation.secret.secret.secret)
      }
    }
  })

  // console.log('players' , players)
  let hasRegex = /^les (.*) ont (.*)/i
  if(hintsIn) {
    hintsIn.forEach(hint => {
      let r = hint.text.match(hasRegex)
      if(r) {
        let team = r[1]
        let secret = r[2]
        teamHints.push({team, secret})
      }
    })
  }

  let hasNotRegex = /^les élus n'ont pas (.*)/i
  if(hintsIn) {
    hintsIn.forEach(hint => {
      let r = hint.text.match(hasNotRegex)
      if(r) {
        chosenHints.push(r[1])
      }
    })
  }

  players.forEach(player => {
    teamHints.forEach(hint => {
      if(player.secrets.find(secret => secret === hint.secret)) {
        player.positives.push(hint.team)
      } else {
        let negative = player.negatives.find(n => n.team === hint.team)
        if(negative) {
          negative.count++
        } else {
          player.negatives.push({team:hint.team, count:1})
        }
      }
    })
  })

  players.forEach(player => {
    chosenHints.forEach(hint => {
      if(player.secrets.find(secret => secret === hint)) {
        player.chosen = false
      }
    })
  })


  $('#dashboard').html('<h3>DASHBOARD</h3>')
  players.forEach(player => {
    let html = '<div class="dashboard-card">'
    html += '<div class="clearfix">'
    html += '<div class="dashboard-card-name">' + player.name + '</div>'
    if(player.chosen) {
      html += '<div class="dashboard-card-normal">ELU?</div>'
    } else {
      html += '<div class="dashboard-card-emphasize">NON ELU</div>'
    }
    if(player.positives.length > 0) {
      html += '<div class="dashboard-card-emphasize">' + player.positives[0] + '</div>'
    }
    if(player.positives.length <= 0) {
      player.negatives.forEach(negative => {
        html += '<div class="dashboard-card-normal">' + negative.count + ' non ' + negative.team + '</div>'
      })
    }

    html += '</div>'
    html += '</div>'
    $('#dashboard').append(html)
  })
}

$('#nav-dashboard').on('click', function (e) {
  e.preventDefault()
  if(!menu.isLeftMenuActive()) { return }
  menu.hideAll()
  $('#dashboard').show()
})

module.exports = {
  update
}
