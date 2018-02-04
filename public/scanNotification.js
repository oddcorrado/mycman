'use strict'
const $ = require('jquery')
const utils = require('./utils')

const notify = (scanner) => {
  $('#scan-notification').show()
  $('#scan-notification-image-container').html(`
    <img class="scan-notification-image" src="${utils.getPlayerImg(scanner)}" />
    `)
  setTimeout(() => $('#scan-notification').hide(), 3000)
}

module.exports = {
  notify
}
