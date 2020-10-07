import { makeAutoObservable } from 'mobx'
import { assetManifest } from '../constants'
import { prepareGroup } from './GroupStore'
import { RequestStore } from './RequestStore'

export class AudioStore {
  paths: string[] = []
  constructor() {
    makeAutoObservable(this)
  }

  prepare(requestStore: RequestStore) {
    this.paths = [
      `game/audio/music/SkyWeaverTheme.mp3`,
      `game/audio/music/SkyWeaverBattle1.mp3`,
      `game/audio/music/SkyWeaverBattle2.mp3`,
      `game/audio/music/SkyWeaverBattle3.mp3`,
      `game/audio/music/SkyWeaverBattle4.mp3`,
      `game/audio/music/SkyWeaverBattle5.mp3`
    ].map(url => assetManifest.getFullUrl(url))

    prepareGroup(requestStore, 'audio', this.paths)
  }
}
