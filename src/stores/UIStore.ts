import { observable } from 'micro-observables'

class UIStore {
  current = observable<string | undefined>(undefined)
  online = observable<boolean>(true)
  glTextureFormat = observable<string>('')

  play(group: string) {
    this.current.set(group)
  }

  pause() {
    this.current.set(undefined)
  }

  toggle(group: string) {
    if (group !== this.current.get()) {
      this.play(group)
    } else {
      this.pause()
    }
  }

  setOnline(value: boolean) {
    this.online.set(value)
  }

  setGLTextureFormat(value: string) {
    this.glTextureFormat.set(value)
  }
}

export const uiStore = new UIStore()
