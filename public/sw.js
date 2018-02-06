'use strict'
console.log('hey sw', importScripts)
importScripts('./sw-toolbox.js')
console.log('hey sw2', toolbox)
toolbox.precache(['index.html', 'styles.css'])
console.log('hey sw3')
toolbox.router.get('/img/*', toolbox.cacheFirst)
console.log('hey sw4')
// toolbox.router.get('/*', toolbox.networkFirst, {networkTimeoutSeconds: 5})
