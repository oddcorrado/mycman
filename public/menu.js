'use strict'
const $ = require('jquery')

let leftMenuActive = true
let layoutBlockers = []

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
  $('#help').hide()
  $('#dashboard').hide()
  $('#powerup').hide()
}

const isLeftMenuActive = (v) => {
  if (v !== null && v !== undefined) {
    leftMenuActive = v
  }

  return leftMenuActive
}

const checkLayout = () => {
  if(layoutBlockers.length > 0) {
    $('#layout').hide()
  } else {
    $('#layout').show()
  }
}

const blockLayout = (blocker) => {
  if(!layoutBlockers.find(v => v === blocker)) {
    layoutBlockers.push(blocker)
  }
  checkLayout()
}

const freeLayout = (blocker) => {
  let index = layoutBlockers.findIndex(v => v === blocker)
  if(index >= 0) {
    layoutBlockers.splice(index, 1)
  }
  checkLayout()
}

module.exports = {
  test,
  hideAll,
  isLeftMenuActive,
  blockLayout,
  freeLayout
}
