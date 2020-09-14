import AssetHashManifest from './AssetHashManifest'
import assetManifest from './data/asset-manifest.json'
import cardLib from './data/card-lib.json'
import {
  RequestStore,
  RequestItem,
  RequestStatus,
  requestStore
} from './stores/RequestStore'
import { CACHE_NAME } from './constants'

const manifestData = new AssetHashManifest(
  'https://assets.skyweaver.net',
  assetManifest
)

const gameMusic = [
  {
    url: `game/audio/music/SkyWeaverTheme.mp3`,
    title: 'SkyWeaver Theme',
    by: 'Russel Shaw'
  },
  {
    url: `game/audio/music/SkyWeaverBattle1.mp3`,
    title: 'Ready',
    by: 'Winifred Phillips'
  },
  {
    url: `game/audio/music/SkyWeaverBattle2.mp3`,
    title: 'Momentum',
    by: 'Starchild'
  },
  {
    url: `game/audio/music/SkyWeaverBattle3.mp3`,
    title: 'Sky Control',
    by: 'Erik Hughes'
  },
  {
    url: `game/audio/music/SkyWeaverBattle4.mp3`,
    title: 'Feel',
    by: 'Starchild'
  },
  {
    url: `game/audio/music/SkyWeaverBattle5.mp3`,
    title: 'Energy',
    by: 'Alberto Jossue'
  }
]

export type GroupId = 'image' | 'texture' | 'audio'

export interface GroupConfig {
  id: GroupId
  title: string
  description: string
  ext: string[]
  store: RequestStore
  getAssetPaths: () => string[]
  getMetadata?: (url: string) => any
}

export const groupConfigs: GroupConfig[] = [
  {
    id: 'audio',
    title: 'Audio',
    description: 'Music, speech and soundFX',
    ext: ['mp3', 'ogg', 'm4a', 'ac3'],
    store: new RequestStore(),
    getAssetPaths: () => {
      return [
        `game/audio/music/SkyWeaverTheme.mp3`,
        `game/audio/music/SkyWeaverBattle1.mp3`,
        `game/audio/music/SkyWeaverBattle2.mp3`,
        `game/audio/music/SkyWeaverBattle3.mp3`,
        `game/audio/music/SkyWeaverBattle4.mp3`,
        `game/audio/music/SkyWeaverBattle5.mp3`
      ].map(url => manifestData.getFullUrl(url))
    },
    getMetadata: (url: string) => {
      return gameMusic.find(x => url.includes(x.url))!
    }
  },
  {
    id: 'image',
    title: 'Images',
    description: 'Standard web images',
    ext: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
    store: new RequestStore(),
    getAssetPaths: () =>
      cardLib.cards.reduce<string[]>((acc, card) => {
        if (acc.length < 16) {
          acc.push(
            manifestData.getFullUrl(
              `game/cards/art-full/${
                card.type === 'unit' ? 'units' : 'spells'
              }/${card.asset}.png`
            )
          )
        }
        return acc
      }, [])
  },
  {
    id: 'texture',
    title: 'Textures',
    description: 'Compressed GL textures',
    ext: ['ktx'],
    store: new RequestStore(),
    getAssetPaths: () => {
      // Detect supported gl texture
      const exts = [
        'astc.COMPRESSED_ASTC_8x8_KHR.ktx',
        'pvrtc.COMPRESSED_PVRTC1_2.ktx',
        's3tc.COMPRESSED_S3TC_DXT_EXT.ktx'
      ]
      return []
    }
  }
]

export const getGroupConfig = (groupId: GroupId) =>
  groupConfigs.find(x => x.id === groupId)

export const groupIds = groupConfigs.map(x => x.id)

export const initGroup = async (groupId: GroupId) => {
  const groupConfig = getGroupConfig(groupId)!
  const assetPaths = groupConfig.getAssetPaths()
  const { store } = groupConfig

  navigator.serviceWorker.addEventListener('message', ev => {
    const { command } = ev.data
    if (command === 'request') {
      const { url, status } = ev.data as RequestItem

      if (assetPaths.includes(url)) {
        store.updateRequest(url, status)
      }
    }
  })

  assetPaths.forEach(url => {
    groupConfig.store.addRequest(url)

    // Global request store
    requestStore.addRequest(url)
  })

  // Check if assets exist in cache
  if (await caches.has(CACHE_NAME)) {
    const cache = await caches.open(CACHE_NAME)

    store.requests.get().forEach(request => {
      return cache
        .match(request.url, {
          //ignoreSearch: true,
          //ignoreMethod: true
          ignoreVary: true
        })
        .then(response => {
          if (response) {
            store.updateRequest(request.url, RequestStatus.Cached)
            // Global request store
            requestStore.updateRequest(request.url, RequestStatus.Cached)
          }
        })
    })
  }
}

export const initGroups = () => {
  groupConfigs.forEach(x => initGroup(x.id))
}

export const loadGroupAssets = (groupId: GroupId) => {
  const groupConfig = getGroupConfig(groupId)!
  const { store } = groupConfig

  store.requests.get().forEach(request => {
    fetch(request.url)
  })
}
