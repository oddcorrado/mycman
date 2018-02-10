const $ = require('jquery')
const menu = require('./menu')

let renderer = null
let objects = [
  {type:'user', name:' '}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''},
  {type:'user', name:' '}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''},
  {type:'user', name:' '}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''},
  {type:'user', name:' '}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''},
  {type:'user', name:' '}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''},
  {type:'user', name:' '}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''},
  {type:'user', name:' '}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''},
  {type:'user', name:' '}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''},
  {type:'user', name:' '}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''},
  {type:'user', name:' '}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''},
  {type:'user', name:' '}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''},
  {type:'user', name:' '}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''},
  {type:'user', name:' '}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''},
  {type:'user', name:' '}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''},
  {type:'user', name:' '}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''},
  {type:'user', name:' '}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''},
  {type:'user', name:' '}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''},
  {type:'user', name:' '}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''},
  {type:'user', name:' '}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''},
  {type:'user', name:' '}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''},
  {type:'user', name:' '}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''},
  {type:'user', name:' '}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''},
  {type:'user', name:' '}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''},
  {type:'user', name:' '}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''},
  {type:'user', name:' '}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''},
  {type:'user', name:' '}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''},
  {type:'user', name:' '}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''},
  {type:'user', name:' '}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''},
  {type:'user', name:' '}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''},
  {type:'user', name:' '}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}, {type:'secret', name:' ', card:''}]
let doScan = false
let scans = null
let currentFilter = null

const reset = () => {
  objects = objects.map((v,i) => i % 4 === 0 ? {type:'user'} : {type:'secret'})
}

let ARThreeOnLoad = function() {
  navigator
  .mediaDevices
  .enumerateDevices()
  .then(devices => {
    let devs = devices.reduce((a, v) => a + '[' + v.label + ']', 'devs: ')
    console.log("devices", devs)
    $('#scan-devs').html(devs)
    let device = devices.find(element => element.label.match(/front/i) !== null) //element.label.indexOf('back') !== -1)
    console.log("device is ", device && device.deviceId)
    let videoParams = {deviceId: device ? {exact: device.deviceId} : undefined}

    cameraFound(videoParams)
  })
  .catch(err => alert(err.name + ": " + err.message))
  delete window.ARThreeOnLoad
}

let feedback = (id) => {
  if(!objects[id]) {
    return 'Object Inconnu'
  }
  if(!objects[id].type) {
    return 'Object Inconnu'
  }
  if(objects[id].type === 'user') {
    return 'Joueur ' + (objects[id].name || 'inconnu')
  }
  if(objects[id].type === 'secret') {
    return 'Secret ' + (objects[id].card || ' ') + ' ' + (objects[id].name || 'inconnu')
  }
}

let cameraFound = (videoParams) => {
  ARController.getUserMediaThreeScene({
    maxARVideoSize: 320,
    deviceId: videoParams.deviceId,
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
              let type = null
              if(scans[0] !== null && scans[0] !== undefined && objects && objects[scans[0]]) {
                type = objects[scans[0]].type
                $('#scan-feedback').html(feedback(scans[0]))
              } else {
                $('#scan-feedback').html('Objet détecté : ' + scans[0])
              }

              if(scans[0] !== null && scans[0] !== undefined && (!currentFilter || type === currentFilter) ) {
                if(!currentFilter) {
                  $('#scan-feedback').html(feedback(scans[0]))
                  $('#scan-ok').show()
                } else {
                  if(currentFilter === type) {
                    $('#scan-feedback').html(feedback(scans[0]))
                    $('#scan-ok').show()
                  } else {
                    $('#scan-feedback').html('Mauvais objet détecté : ' + feedback(scans[0]))
                    $('#scan-ok').hide()
                  }
                }
              } else {
                $('#scan-feedback').html('Mauvais objet détecté : ' + feedback(scans[0]))
                $('#scan-ok').hide()
              }
            } else {
              $('#scan-feedback').html('Trop d\'objets détectés : ' + scans.reduce((a,v) => a + ' ' + v , ' '))
              $('#scan-ok').hide()
            }
          } else {
            $('#scan-feedback').html('Aucun objet détecté')
            $('#scan-ok').hide()
          }
          arScene.process()
          arScene.renderOn(renderer)
          requestAnimationFrame(tick)
        } else {
          setTimeout(tick, 200)
        }
      }
      tick()
    }
  })
}


function cameraSetup (arController) {
  document.body.className = arController.orientation
  arController.setPatternDetectionMode(artoolkit.AR_TEMPLATE_MATCHING_MONO_AND_MATRIX)
  renderer = new THREE.WebGLRenderer({antialias: true})
  /* if (arController.orientation === 'portrait') */ {
    var w = 280
    var h = w * (arController.videoHeight / arController.videoWidth)
    renderer.setSize(w, h)
    // renderer.domElement.style.paddingBottom = (w-h) + 'px'
  } /* else {
    if (/Android|mobile|iPad|iPhone/i.test(navigator.userAgent)) {
      renderer.setSize(window.innerWidth, (window.innerWidth / arController.videoWidth) * arController.videoHeight)
    } else {
      renderer.setSize(arController.videoWidth, arController.videoHeight)
      document.body.className += ' desktop'
    }
  } */
  // document.body.insertBefore(renderer.domElement, document.body.firstChild)
  $('#scan-canvas').replaceWith(renderer.domElement)
}

$('#nav-scan').on('click', function (e) {
  e.preventDefault()
  if(!menu.isLeftMenuActive()) { return }
  menu.hideAll()
  scans = []
  doScan = true
  menu.showModal('#scan-modal')
})

const newObjects = (objectsIn) => {
  objects = objectsIn
}

const scan = ({allowCancel, message, filter}) => {
  currentFilter = filter
  scans = []
  doScan = true
  menu.modalShow('#scan-modal')

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
      menu.modalHide('#scan-modal')
      resolve(null)
    })

    $('#scan-ok').on('click', function (e) {
      e.preventDefault()
      if(scans[0] !== null && scans[0] !== undefined) {
        if(!currentFilter || objects[scans[0]].type === currentFilter) {
          doScan = false
          menu.modalHide('#scan-modal')
          resolve(scans[0])
        }
      }
    })
  })
}

if (window.ARController && ARController.getUserMediaThreeScene) {
  ARThreeOnLoad()
}

module.exports = {
  reset,
  newObjects,
  scan
}
