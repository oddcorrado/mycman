'use strict'
console.log('hey sw', importScripts)
importScripts('./sw-toolbox.js')
console.log('hey sw2', toolbox)
toolbox.precache(['index.html', 'styles.css', 'artoolkit.api.js', 'artoolkit.debug.js', 'artoolkit.min.js', 'artoolkit.three.js'])
console.log('hey sw3')
toolbox.router.get('/img/*', toolbox.networkFirst, {networkTimeoutSeconds: 5})
console.log('hey sw44')
// toolbox.router.get('/*', toolbox.networkFirst, {networkTimeoutSeconds: 5})
