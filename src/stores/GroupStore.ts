import { makeAutoObservable } from 'mobx'
import { CACHE_NAME, GroupType } from '../constants'
import { RequestStatus, RequestStore } from './RequestStore'

export class GroupStore {
  current: GroupType | undefined = undefined

  constructor() {
    makeAutoObservable(this)
  }

  play(group: GroupType) {
    this.current = group
  }

  pause() {
    this.current = undefined
  }

  toggle(group: GroupType) {
    if (group !== this.current) {
      this.play(group)
    } else {
      this.pause()
    }
  }
}

export const prepareGroup = async (
  requestStore: RequestStore,
  group: GroupType,
  assetPaths: string[]
) => {
  console.log(`Group:${group} added`)

  assetPaths.forEach(url => {
    if (requestStore.requests.some(x => x.url === url)) {
      return
    }

    // Global request store
    requestStore.addRequest(group, url)
  })

  // Check if assets exist in cache
  if (await caches.has(CACHE_NAME)) {
    const cache = await caches.open(CACHE_NAME)
    const keys = await cache.keys()

    assetPaths.forEach(url => {
      if (keys.some(request => request.url === url)) {
        requestStore.updateRequest(url, RequestStatus.Cached)
      }
    })
  }
}
