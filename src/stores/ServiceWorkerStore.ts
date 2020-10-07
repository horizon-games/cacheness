import { makeAutoObservable } from 'mobx'
import { MessageType } from '../constants'
import { RequestItem, RequestStore } from './RequestStore'

export class ServiceWorkerStore {
  isOnline: boolean = true

  constructor() {
    makeAutoObservable(this)
  }

  async prepare(requestStore: RequestStore) {
    navigator.serviceWorker.addEventListener('message', ev => {
      const { data } = ev
      const type: MessageType = data.type

      switch (type) {
        case MessageType.Online: {
          const { value } = ev.data
          this.toggleOnline(value)
          break
        }

        case MessageType.Request: {
          const { url, status } = data as RequestItem
          requestStore.updateRequest(url, status)
          break
        }
      }
    })

    await navigator.serviceWorker.ready

    console.info('Service Worker Ready!')

    // Query service worker for online status
    navigator.serviceWorker.controller?.postMessage({
      type: MessageType.Online
    })
  }

  toggleOnline(value: boolean) {
    this.isOnline = value
  }
}
