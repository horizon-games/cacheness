const CACHE_PREFIX = '@skyweaver/game'
const CACHE_VERSION = 'v1'
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VERSION}`

const MessageType = {
  Online: 'Online',
  Request: 'Request'
}

const state = {
  online: true
}

const staticAssets = []

self.addEventListener('install', async event => {
  self.skipWaiting() // Activate worker immediately

  const cache = await caches.open(CACHE_NAME)
  //cache.addAll(staticAssets)
})

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim()) // Become available to all pages

  // Delete unused caches after updated service worker activates
  // event.waitUntil(
  //   caches.keys().then(cacheNames => {
  //     return Promise.all(
  //       cacheNames
  //         .filter(cacheName => {
  //           cacheName !== CACHE_NAME && cacheName.startsWith(CACHE_PREFIX)
  //         })
  //         .map(cacheName => {
  //           return caches.delete(cacheName)
  //         })
  //     )
  //   })
  // )
})

self.addEventListener('message', event => {
  const { type, value } = event.data

  switch (type) {
    case MessageType.Online: {
      if (typeof value === 'undefined') {
        messageClients({ type: MessageType.Online, value: state.online })
      } else {
        state.online = value
      }
      break
    }
  }
})

self.addEventListener('fetch', event => {
  const { url, destination } = event.request
  const range = event.request.headers.get('range')

  if (range) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache
          .match(event.request, {
            //ignoreSearch: true,
            //ignoreMethod: true
            ignoreVary: true
          })
          .then(response => {
            if (response) {
              messageClients({
                type: MessageType.Request,
                url,
                destination,
                status: 2
              })

              return response.arrayBuffer()
            } else {
              return fetch(event.request, {
                headers: {},
                mode: 'cors',
                credentials: 'omit'
              }).then(response => {
                if (shouldCache(event.request)) {
                  messageClients({
                    type: MessageType.Request,
                    url,
                    destination,
                    status: 1
                  })
                  cache.put(event.request, response.clone())
                }

                return response.arrayBuffer()
              })
            }
          })
          .then(arrayBuffer => {
            const bytes = /^bytes\=(\d+)\-(\d+)?$/g.exec(
              event.request.headers.get('range')
            )

            if (bytes) {
              const start = Number(bytes[1])
              const end = Number(bytes[2]) || arrayBuffer.byteLength - 1

              return new Response(arrayBuffer.slice(start, end + 1), {
                status: 206,
                statusText: 'Partial Content',
                headers: [
                  [
                    'Content-Range',
                    `bytes ${start}-${end}/${arrayBuffer.byteLength}`
                  ]
                ]
              })
            } else {
              return new Response(null, {
                status: 416,
                statusText: 'Range Not Satisfiable',
                headers: [['Content-Range', `*/${arrayBuffer.byteLength}`]]
              })
            }
          })
      })
    )
  } else {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache
          .match(event.request, {
            //ignoreSearch: true,
            //ignoreMethod: true
            ignoreVary: true
          })
          .then(response => {
            if (response) {
              messageClients({
                type: MessageType.Request,
                url,
                destination,
                status: 2
              })
              return response
            } else if (state.online || !shouldCache(event.request)) {
              return fetch(event.request).then(response => {
                if (shouldCache(event.request)) {
                  messageClients({
                    type: MessageType.Request,
                    url,
                    destination,
                    status: 1
                  })
                  cache.put(event.request, response.clone())
                }
                return response
              })
            } else {
              return new Response(null, { status: 404 })
            }
          })
      })
    )
  }
})

const shouldCache = request => {
  return request.url.startsWith('https://assets.skyweaver.net/')
}

const messageClients = data => {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage(data)
    })
  })
}
