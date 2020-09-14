import React, { useState } from 'react'
import { Pane } from './components/Pane'
import { Global, css } from '@emotion/core'
import { Group } from './components/Group'
import { ProgressBar } from './components/ProgressBar'
import { requestStore } from './stores/RequestStore'
import { useObservable } from 'micro-observables'
import styled from '@emotion/styled'
import { groupConfigs } from './groupConfigs'
import { Button } from './components/Button'

const App = () => {
  const progress = useObservable(requestStore.progress)

  const requests = useObservable(requestStore.requests)
  const pendingRequestCount = useObservable(
    requestStore.pendingRequests.transform(x => x.length)
  )
  const newRequestCount = useObservable(
    requestStore.newRequests.transform(x => x.length)
  )
  const cachedRequestCount = useObservable(
    requestStore.cachedRequests.transform(x => x.length)
  )

  const [isOnline, setOnline] = useState(
    localStorage.getItem('online') === 'true'
  )

  const handleToggleOnline = () => {
    const value = !isOnline

    navigator.serviceWorker.controller?.postMessage({
      command: 'online',
      value
    })
    localStorage.setItem('online', JSON.stringify(value))
    setOnline(value)
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
        </ButtonContainer>

        <StatContainer>
          <Stat>
            Pending: <span>{pendingRequestCount}</span>
          </Stat>
          <Stat>
            New: <span>{newRequestCount}</span>
          </Stat>
          <Stat>
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
`

const ButtonContainer = styled.div`
  padding: 16px 0;
`

const OnlineButton = styled(Button)`
  width: 90px;
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
`

const Stat = styled.div`
  color: #888;
  flex: 1;
  font-size: 0.9rem;

  > span {
    color: #ccc;
  }
`

export default App
