import 'micro-observables/batchingForReactDom'
import React from 'react'
import { render } from 'react-dom'
import * as serviceWorker from './serviceWorker'
import App from './App'

import { initGroups } from './groupConfigs'
import { RequestItem, requestStore } from './stores/RequestStore'
import { uiStore } from './stores/UIStore'
import { MessageType } from './constants'

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()

const serviceWorkerReady = async () => {
  navigator.serviceWorker.addEventListener('message', ev => {
    const { data } = ev
    const type: MessageType = data.type

    switch (type) {
      case MessageType.Online: {
        const { value } = ev.data
        console.log('online', value)
        uiStore.setOnline(value)
        break
      }

      case MessageType.Request: {
        const { url, status } = data as RequestItem
        console.log('request', url, status)
        requestStore.updateRequest(url, status)
        break
      }
    }
  })

  await navigator.serviceWorker.ready

  console.info('Service Worker Ready!')

  navigator.serviceWorker.controller?.postMessage({
    type: MessageType.Online
  })

  initGroups()

  // Render application
  render(<App />, document.getElementById('root'))
}

serviceWorkerReady()
