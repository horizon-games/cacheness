import { ImageLoader, FileLoader } from 'three'

export const xhrFetch = (url: string) =>
  new Promise((resolve, reject) => {
    var request = new XMLHttpRequest()
    request.open('GET', url)
    request.responseType = 'blob'

    request.onload = function () {
      if (request.status === 200) {
        resolve(request.response)
      } else {
        reject(
          new Error(
            "Image didn't load successfully; error code:" + request.statusText
          )
        )
      }
    }

    request.onerror = function () {
      reject(new Error('There was a network error.'))
    }

    request.send()
  })

export const imageFetch = (url: string) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.src = url
    image.onload = resolve
  })

const imageLoader = new ImageLoader()
export const imageLoaderFetch = (url: string) => {
  imageLoader.load(
    url,
    // onLoad callback
    function (image) {},
    // onProgress callback currently not supported
    undefined,

    // onError callback
    function () {
      console.error('An error happened.')
    }
  )
}

const fileLoader = new FileLoader()
export const fileLoaderFetch = (url: string) => {
  fileLoader.load(
    url,
    // onLoad callback
    function (data) {},
    // onProgress callback
    undefined,
    // onError callback
    function (err) {
      console.error('An error happened')
    }
  )
}
