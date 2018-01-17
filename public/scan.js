const $ = require('jquery')
const menu = require('./menu')

let renderer = null
let objects = null
let doScan = false
let scans = []
let lastScanId = null

let ARThreeOnLoad = function() {
  ARController.getUserMediaThreeScene({
    maxARVideoSize: 320,
    cameraParam: 'Data/camera_para-iPhone 5 rear 640x480 1.0m.dat',
    onSuccess: function (arScene, arController) {
      cameraSetup (arController)

      var tick = function () {
        if(doScan) {
          var cnt = arController.getMarkerNum()
          let founds = []
          for (var i = 0; i < cnt; i++) {
            let id = arController.getMarker(i).idMatrix
            if(id !== -1 && id !== undefined) {
              founds.push(arController.getMarker(i).idMatrix)
            }
          }

          if(founds.length > 0) {
            scans = founds
          }
          if(scans.length >= 1) {
            if(scans.length === 1) {
              $('#scan-feedback').html('Objet détecté : ' + scans[0])
            } else {
              $('#scan-feedback').html('Trop d\'objets détectés : ' + scans.reduce((a,v) => a + ' ' + v , ' '))
            }
          } else {
            $('#scan-feedback').html('Aucun objet détecté')
          }
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
  scans = []
  doScan = true
  $('#scan-modal').show()
})

const newObjects = (objectsIn) => {
  objects = objectsIn
}

const scan = ({allowCancel, message, filter}) => {
  // if(!menu.isLeftMenuActive()) { return }
  // menu.hideAll()
  scans = []
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
      if(scans[0] !== null && scans[0] !== undefined) {
        if(!filter || objects[scans[0]].type === filter) {
          doScan = false
          $('#scan-modal').hide()
          resolve(scans[0])
        }
      }
    })
  })
}



module.exports = {
  newObjects,
  scan
}
