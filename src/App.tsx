import React, { useState } from 'react'
import { Pane } from './components/Pane'
import { Global, css } from '@emotion/core'
import { Group } from './components/Group'
import { requestStore } from './stores/RequestStore'
import { useObservable } from 'micro-observables'
import styled from '@emotion/styled'
import { groupConfigs, prefetchAssets } from './groupConfigs'
import { Button } from './components/Button'
import { CACHE_NAME, MessageType } from './constants'
import { uiStore } from './stores/UIStore'

const App = () => {
  const isOnline = useObservable(uiStore.online)
  const pendingRequestCount = useObservable(
    requestStore.pendingRequests.transform(x => x.length)
  )
  const newRequestCount = useObservable(
    requestStore.newRequests.transform(x => x.length)
  )
  const cachedRequestCount = useObservable(
    requestStore.cachedRequests.transform(x => x.length)
  )

  const handleToggleOnline = () => {
    const value = !isOnline

    navigator.serviceWorker.controller?.postMessage({
      type: MessageType.Online,
      value
    })
    uiStore.setOnline(value)
  }

  const handlePrefetch = () => {
    prefetchAssets()
  }

  const handlePurgeCache = async () => {
    if (window.confirm('Are you sure?')) {
      await caches.delete(CACHE_NAME)

      requestStore.reset()
      groupConfigs.forEach(groupConfig => groupConfig.store.reset())
    }
  }

  return (
    <div className="App">
      <Global
        styles={css`
          html,
          body {
            background-color: #26282b;
            padding: 0;
            margin: 0;
            font-family: 'Kumbh Sans', sans-serif;
          }

          * {
            box-sizing: border-box;
          }

          *:focus {
            outline: none;
          }
        `}
      />
      <Pane>
        <Heading>Cacheness</Heading>

        <ButtonContainer>
          <OnlineButton onClick={handleToggleOnline}>
            <OnlineIndicator online={isOnline} />
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </OnlineButton>
          <PrefetchButton
            className={isOnline && pendingRequestCount > 0 ? '' : 'disabled'}
            onClick={handlePrefetch}
          >
            <span>Prefetch</span>
          </PrefetchButton>

          <PurgeButton onClick={handlePurgeCache}>
            <span>Purge</span>
          </PurgeButton>
        </ButtonContainer>

        <StatContainer>
          <Stat>
            Pending: <span>{pendingRequestCount}</span>
          </Stat>
          <Stat>
            <NewStatLegend />
            New: <span>{newRequestCount}</span>
          </Stat>
          <Stat>
            <CachedStatLegend />
            Cached: <span>{cachedRequestCount}</span>
          </Stat>
        </StatContainer>

        {groupConfigs.map(group => (
          <Group
            key={group.id}
            id={group.id}
            title={group.title}
            description={group.description}
          />
        ))}
      </Pane>

      <What>
        <WhatHeading>What?</WhatHeading>
        <WhatDescription>
          Cacheness is a simple application that tests service worker cache
          effectiveness.
        </WhatDescription>
      </What>
    </div>
  )
}

const Heading = styled.h1`
  text-align: center;
  color: #eee;
  font-family: 'Leckerli One', cursive;
  text-shadow: 0 2px 1px rgba(0, 0, 0, 0.5), 0 0 36px rgba(0, 0, 0, 0.7);
  font-size: 2.5rem;
  margin: 0;
  padding: 0;
  margin-bottom: 36px;
  height: 54px;
`

const ButtonContainer = styled.div`
  padding: 16px 0;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
`

const PrefetchButton = styled(Button)`
  margin-right: 10px;

  &.disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  span {
    margin-top: 2px;
  }
`

const PurgeButton = styled(Button)`
  span {
    margin-top: 2px;
  }
`

const OnlineButton = styled(Button)`
  width: 90px;
  margin-right: 10px;

  span {
    margin-top: 2px;
  }
`

const OnlineIndicator = styled.div<{ online: boolean }>`
  display: block;
  height: 13px;
  width: 13px;
  border-radius: 7px;
  margin-right: 5px;
  border: 2px solid #111;

  background: ${props =>
    props.online
      ? `linear-gradient(179deg, #ec6401 17.83%, #d62903 86.21%);`
      : `black`};
`

const StatContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: 9px;
  background: linear-gradient(180deg, #121315 0%, #1a1c1f 100%);
  box-shadow: inset 0px 1px 1px rgba(0, 0, 0, 0.15),
    inset 0px -1px 1px rgba(240, 244, 249, 0.15);
`

const Stat = styled.div`
  color: #888;
  flex: 1;
  font-size: 13px;
  display: flex;

  > span {
    margin-left: 4px;
    color: #ccc;
  }
`

const StatLegend = styled.div`
  width: 11px;
  height: 11px;
  margin-right: 5px;
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
`

const NewStatLegend = styled(StatLegend)`
  background: linear-gradient(179deg, #848484 17.83%, #393939 86.21%);
`

const CachedStatLegend = styled(StatLegend)`
  background: linear-gradient(179deg, #ec6401 17.83%, #d62903 86.21%);
`

const What = styled.div`
  width: 340px;
  margin: 16px;
  padding: 16px;
`

const WhatHeading = styled.h2`
  text-align: center;
  color: #eee;
  font-family: 'Leckerli One', cursive;
  text-shadow: 0 2px 1px rgba(0, 0, 0, 0.5), 0 0 36px rgba(0, 0, 0, 0.7);
  font-size: 1.8rem;
  margin: 0;
  padding: 0;
  margin-bottom: 16px;
  height: 48px;
`

const WhatDescription = styled.p`
  color: #888;
  text-align: center;
  line-height: 20px;
`

export default App
