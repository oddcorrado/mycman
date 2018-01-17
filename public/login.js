'use strict'

const $ = require('jquery')
const scan = require('./scan')

let userName = null
let userId = null
let doScan = true

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
      if(doScan) {
        getId()
      } else {
        $('#login-name').hide()
        $.post('/login', {
          user: userName,
          id: 4
        }).then(() => document.location.reload())
      }
    }
  })
}

const getId = () => {
  scan.scan({allowScan:false, message:'Scannez votre personnage'})
  .then((id) => {
    userId = id
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
