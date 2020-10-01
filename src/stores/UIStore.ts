import { makeAutoObservable } from 'mobx'

class UIStore {
  ready: boolean = false
  current: string | undefined = undefined
  online: boolean = true
  glTextureFormat: string = ''

  constructor() {
    makeAutoObservable(this)
  }

  play(group: string) {
    this.current = group
  }

  pause() {
    this.current = undefined
  }

  toggle(group: string) {
    if (group !== this.current) {
      this.play(group)
    } else {
      this.pause()
    }
  }

  setOnline(value: boolean) {
    this.online = value

    if (!this.ready) {
      this.ready = true
    }
  }

  setGLTextureFormat(value: string) {
    this.glTextureFormat = value
  }
}

export const uiStore = new UIStore()
