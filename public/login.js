'use strict'

const $ = require('jquery')
const scan = require('./scan')
const game = require('./game')
const id2Username = [
  'Baron Belier',
  'Frère Faucon',
  'Lord Loris',
  'Sir Souris',
  'Capitaine Corbeau',
  'Colonel Cat',
  'Professeur Poulpe',
  'Shah Thon',
  'Sultan Sanglier',
  'Marshal Mustang'
]

let userName = null
let userId = null

const startLogin = () => {
  getName()
}

const getName = () => {
  $('#login').show()
  $('#login-name').show()
  $('#chatbox').hide()
  $('#login input[name=author]').focus()
  $('#login-name-button').on('click', function (e) {
    e.preventDefault()
    console.log($('#login-name-input').val())
    userName = $('#login-name-input').val().slice(0,30)
    if(userName) {
      $('#login-name').hide()
      if(game.getOptions().doScan > 0 || userName === 'SCAN') {
        getId()
      } else {
        $('#login-name').hide()
        $.post('/login', {
          user: userName,
          id: id2Username.findIndex(v => v === userName) * 4
        }).then(() => document.location.reload())
      }
    }
  })
}

const getId = () => {
  scan.scan({allowScan:false, message:'Scannez votre personnage', filter:'user'})
  .then((id) => {
    userId = id
    userName = id2Username[Math.trunc(id / 4)]
    console.log('got id', userName, userId)
    $('#login-name').hide()
    $.post('/login', {
      user: userName,
      id: userId
    }).then(() => document.location.reload())
  })
}

module.exports = {
  startLogin
}
