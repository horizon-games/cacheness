import 'micro-observables/batchingForReactDom'
import React from 'react'
import { render } from 'react-dom'
import * as serviceWorker from './serviceWorker'
import App from './App'

import { loadGroupAssets, initGroups, initGroup } from './groupConfigs'
import { RequestItem, requestStore } from './stores/RequestStore'
import { uiStore } from './stores/UIStore'

render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()

const serviceWorkerReady = async () => {
  await navigator.serviceWorker.ready

  console.info('Service Worker Ready!')

  navigator.serviceWorker.controller?.postMessage({
    command: 'online',
    value: localStorage.getItem('online') === 'true'
  })

  // Update global requestStore
  navigator.serviceWorker.addEventListener('message', ev => {
    const { command } = ev.data

    switch (command) {
      case 'online': {
        const { value } = ev.data
        console.log(value)
        uiStore.setOnline(value)
        break
      }

      case 'request': {
        const { url, status } = ev.data as RequestItem
        requestStore.updateRequest(url, status)
        break
      }
    }
  })

  //initGroup('audio')
  initGroups()

  //loadGroupAssets('audio')
  //loadGroupAssets('image')
}

serviceWorkerReady()
