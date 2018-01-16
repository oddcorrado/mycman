const $ = require('jquery')
const menu = require('./menu')

let renderer = null
let players = null
let doScan = false
let founds = []

let ARThreeOnLoad = function() {
  ARController.getUserMediaThreeScene({
    maxARVideoSize: 320,
    cameraParam: 'Data/camera_para-iPhone 5 rear 640x480 1.0m.dat',
    onSuccess: function (arScene, arController) {
      cameraSetup (arController)

      // arController.addEventListener('getMarker', function(ev) {
      //  console.log(ev)
      // })


      var tick = function () {
        if(doScan) {
          var cnt = arController.getMarkerNum()
          if(cnt > 0) {
            founds = []
          }
          for (var i=0; i < cnt; i++) {
            let id = arController.getMarker(i).idMatrix
            if(id !== -1 && id !== undefined) {
              founds.push(arController.getMarker(i).idMatrix)
            }
          }
          if(founds.length >= 1) {
            if(founds.length === 1) {
              $('#scan-feedback').html('Objet détecté : ' + founds[0])
            } else {
              $('#scan-feedback').html('Trop d\'objets détectés : ' + founds.reduce((a,v) => a + ' ' + v , ' '))
            }
          } else {
            $('#scan-feedback').html('Aucun objet détecté')
          }
          // console.log(founds)
          arScene.process()
          arScene.renderOn(renderer)
          requestAnimationFrame(tick)
        } else {
          setTimeout(tick, 500)
        }
      }
      tick()
    }
  })
  delete window.ARThreeOnLoad;
}

if (window.ARController && ARController.getUserMediaThreeScene) {
  ARThreeOnLoad()
}

function cameraSetup (arController) {
  document.body.className = arController.orientation
  arController.setPatternDetectionMode(artoolkit.AR_TEMPLATE_MATCHING_MONO_AND_MATRIX)
  renderer = new THREE.WebGLRenderer({antialias: true})
  if (arController.orientation === 'portrait') {
    var w = (window.innerWidth / arController.videoHeight) * arController.videoWidth
    var h = window.innerWidth
    renderer.setSize(w, h)
    renderer.domElement.style.paddingBottom = (w-h) + 'px'
  } else {
    if (/Android|mobile|iPad|iPhone/i.test(navigator.userAgent)) {
      renderer.setSize(window.innerWidth, (window.innerWidth / arController.videoWidth) * arController.videoHeight)
    } else {
      renderer.setSize(arController.videoWidth, arController.videoHeight)
      document.body.className += ' desktop'
    }
  }
  // document.body.insertBefore(renderer.domElement, document.body.firstChild)
  $('#scan-view').replaceWith(renderer.domElement)
}

$('#nav-scan').on('click', function (e) {
  e.preventDefault()
  if(!menu.isLeftMenuActive()) { return }
  menu.hideAll()
  founds = []
  doScan = true
  $('#scan-modal').show()
})

const newPlayers = (playersIn) => {
  players = playersIn
}

const scan = ({allowCancel, message}) => {
  if(!menu.isLeftMenuActive()) { return }
  menu.hideAll()
  founds = []
  doScan = true
  $('#scan-modal').show()

  if(allowCancel) {
    $('#scan-cancel').show()
  } else {
    $('#scan-cancel').hide()
  }

  $('#scan-message').html(message ? message : '')

  return new Promise((resolve) => {
    $('#scan-cancel').on('click', function (e) {
      e.preventDefault()
      doScan = false
      $('#scan-modal').hide()
      resolve(null)
    })

    $('#scan-ok').on('click', function (e) {
      e.preventDefault()
      if(founds[0]) {
        doScan = false
        $('#scan-modal').hide()
        resolve(founds[0])
      }
    })
  })
}

module.exports = {
  newPlayers,
  scan
}
