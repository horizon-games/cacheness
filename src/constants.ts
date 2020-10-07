import AssetHashManifest from './AssetHashManifest'
import assetManifestJSON from './data/asset-manifest.json'

export const CACHE_PREFIX = '@skyweaver/game'
export const CACHE_VERSION = 'v1'
export const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VERSION}`

export type GroupType = 'image' | 'texture' | 'audio'

export enum MessageType {
  Request = 'Request',
  Online = 'Online'
}

export const GL_TEXTURE_FORMATS = ['astc', 'pvrtc', 's3tc'] as const

export type GLTextureFormat = typeof GL_TEXTURE_FORMATS[number]

export const GL_TEXTURE_FORMATS_EXTS: { [key in GLTextureFormat]: string } = {
  astc: 'astc.COMPRESSED_ASTC_8x8_KHR.ktx', // Android
  pvrtc: 'pvrtc.COMPRESSED_PVRTC1_2.ktx', // iOS
  s3tc: 's3tc.COMPRESSED_S3TC_DXT_EXT.ktx' // Desktop devices
} as const

export const assetManifest = new AssetHashManifest(
  'https://assets.skyweaver.net',
  assetManifestJSON
)
