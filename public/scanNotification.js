'use strict'
const $ = require('jquery')
const utils = require('./utils')

const notify = (scanner) => {
  $('#scan-notification').removeClass('bounceOutUp').addClass("bounceInDown")
  $('#scan-notification').show()
  $('#scan-notification-image-container').html(`
    <img class="scan-notification-image animated infinite tada" src="${utils.getPlayerImg(scanner)}" />
    `)
  setTimeout(() => $('#scan-notification').removeClass("bounceInDown").addClass('bounceOutUp'), 2500)
}

module.exports = {
  notify
}
