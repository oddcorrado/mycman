'use strict'
const $ = require('jquery')

let leftMenuActive = true

$('.pure-menu-item').on('click', function() {
  $('.pure-menu-selected').removeClass('pure-menu-selected')
  $(this).addClass('pure-menu-selected')
})

const test = () => {
  console.log('test works')
}

const hideAll = () => {
  $('#self').hide()
  $('#check').hide()
  $('#mp').hide()
  $('#game').hide()
  $('#hack').hide()
}

const isLeftMenuActive = (v) => {
  if (v !== null && v !== undefined) {
    leftMenuActive = v
  }

  return leftMenuActive
}
module.exports = {
  test,
  hideAll,
  isLeftMenuActive
}
