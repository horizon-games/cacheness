import { makeAutoObservable } from 'mobx'
import { prepareGroup } from './GroupStore'
import { RequestStore } from './RequestStore'
import cardLib from '../data/card-lib.json'
import { assetManifest } from '../constants'

export class ImageStore {
  paths: string[] = []

  constructor() {
    makeAutoObservable(this)
  }

  prepare(requestStore: RequestStore) {
    this.paths = cardLib.cards.reduce<string[]>((acc, card) => {
      if (acc.length < 16) {
        acc.push(
          assetManifest.getFullUrl(
            `game/cards/art-full/${card.type === 'unit' ? 'units' : 'spells'}/${
              card.asset
            }.png`
          )
        )
      }
      return acc
    }, [])

    prepareGroup(requestStore, 'image', this.paths)
  }
}
