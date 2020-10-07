import React, { createContext, ReactNode, useContext } from 'react'
import { AudioStore } from './AudioStore'
import { TextureStore } from './TextureStore'
import { ImageStore } from './ImageStore'
import { RequestStore } from './RequestStore'
import { ServiceWorkerStore } from './ServiceWorkerStore'
import { GroupStore } from './GroupStore'

class RootStore {
  groupStore = new GroupStore()
  requestStore = new RequestStore()
  serviceWorkerStore = new ServiceWorkerStore()
  audioStore = new AudioStore()
  imageStore = new ImageStore()
  textureStore = new TextureStore()

  constructor() {
    this.prepare()
  }

  async prepare() {
    await this.serviceWorkerStore.prepare(this.requestStore)

    this.audioStore.prepare(this.requestStore)
    this.imageStore.prepare(this.requestStore)
    this.textureStore.prepare(this.requestStore)
  }
}

export const StoreContext = createContext<RootStore | null>(null)

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const store = new RootStore()
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export const useStore = () => {
  const store = useContext(StoreContext)

  if (!store) {
    throw new Error('StoreProvider must set a store')
  }

  return store
}
