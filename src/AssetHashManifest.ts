export interface AssetsManifestTree {
  radix: number
  dicts: {
    dirs: string[]
    exts: string[]
    segments: string[]
    filenames: string[]
  }
  encoded: { [dirext: string]: { [filename: string]: string } }
}

class AssetHashManifest {
  private _hashFinder: (path: string) => string

  constructor(private _prefix: string, data: AssetsManifestTree) {
    this._hashFinder = this._makeCompressedHashFinder(data)
  }

  getFullUrl(url: string) {
    return `${this._prefix}/${this._hashFinder(url)}/${url}`
  }

  private _makeCompressedHashFinder(data: AssetsManifestTree) {
    const { radix, dicts, encoded } = data
    const { dirs, exts, segments, filenames } = dicts

    const radixEncode = (intCode: number) => intCode.toString(radix)

    const splitPath = (path: string) => {
      const dirOffset = path.lastIndexOf('/')
      const extOffset = path.indexOf('.')
      const dir = path.substring(0, dirOffset).replace(/^\//, '')
      const ext = path.substring(extOffset + 1)
      const filename = path.substring(dirOffset + 1, extOffset)

      return [dir, filename, ext]
    }

    const getKey = (collection: string[], item: string) => {
      return radixEncode(collection.indexOf(item))
    }

    return (path: string) => {
      const [dir, filename, ext] = splitPath(path)

      const encodedDir = getKey(dirs, dir)
      const encodedExt = getKey(exts, ext)
      const encodedFilename = getKey(
        filenames,
        filename
          .split('-')
          .map(x => getKey(segments, x))
          .join('-')
      )

      const root = encoded[`${encodedDir}/${encodedExt}`]

      if (root && root[encodedFilename]) {
        return root[encodedFilename]
      } else {
        console.error(
          `Could not find asset in tree for ${path}: ${encodedDir}/${encodedExt}: ${encodedFilename}`
        )
        return 'hash-not-found'
      }
    }
  }
}

export default AssetHashManifest
