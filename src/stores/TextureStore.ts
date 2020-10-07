import { makeAutoObservable } from 'mobx'
import {
  GLTextureFormat,
  GL_TEXTURE_FORMATS,
  GL_TEXTURE_FORMATS_EXTS,
  assetManifest
} from '../constants'
import cardLib from '../data/card-lib.json'
import { prepareGroup } from './GroupStore'
import { RequestStore } from './RequestStore'

export class TextureStore {
  format: GLTextureFormat | undefined = undefined
  paths: string[] = []

  constructor() {
    makeAutoObservable(this)
  }

  prepare(requestStore: RequestStore) {
    this.format = getSupportedGlTextureFormat()

    if (this.format) {
      const formatExt = GL_TEXTURE_FORMATS_EXTS[this.format]

      this.paths = cardLib.cards.reduce<string[]>((acc, card) => {
        if (acc.length < 16) {
          acc.push(
            assetManifest.getFullUrl(
              `game/cards/art-full/${
                card.type === 'unit' ? 'units' : 'spells'
              }/${card.asset}.png.${formatExt}`
            )
          )
        }
        return acc
      }, [])

      prepareGroup(requestStore, 'texture', this.paths)
    }
  }
}

const getSupportedGlTextureFormat = (): GLTextureFormat | undefined => {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl')

  if (gl) {
    const extensions = gl.getSupportedExtensions()

    if (extensions) {
      const textureExtensions = extensions.filter(ext =>
        ext.includes('WEBGL_compressed_texture')
      )

      if (textureExtensions.length) {
        return GL_TEXTURE_FORMATS.find(format =>
          textureExtensions[0].includes(format)
        )
      }
    }
  }

  return
}
