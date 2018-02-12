'use strict'
const $ = require('jquery')

let leftMenuActive = true
let activeModals = []

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
  // $('#powerup').hide()
}

const isLeftMenuActive = (v) => {
  if (v !== null && v !== undefined) {
    leftMenuActive = v
  }

  return leftMenuActive
}

const checkLayout = () => {
  if (activeModals.length > 0) {
    $(activeModals[activeModals.length - 1]).show()
    $('#layout').hide()
  } else {
    $('#layout').show()
  }
}

const modalShow = (modal) => {
  // hide everything
  activeModals.forEach(modal => $(modal).hide())

  // push this modal to top
  let index = activeModals.findIndex(v => v === modal)
  if (index >= 0) {
    activeModals.splice(index, 1)
  }
  activeModals.push(modal)

  checkLayout()
}

const modalHide = (modal) => {
  // hide everything
  activeModals.forEach(modal => $(modal).hide())

  // remove modal from list
  let index = activeModals.findIndex(v => v === modal)
  if (index >= 0) {
    activeModals.splice(index, 1)
  }

  checkLayout()
}

const modalHideAll = () => {
  activeModals.forEach(modal => $(modal).hide())
  activeModals = []
  checkLayout()
}

module.exports = {
  test,
  hideAll,
  isLeftMenuActive,
  modalShow,
  modalHide,
  modalHideAll
}
