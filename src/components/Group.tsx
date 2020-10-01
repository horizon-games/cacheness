import React from 'react'
import styled from '@emotion/styled'
import { Indicator } from './Indicator'
import { uiStore } from '../stores/UIStore'
import { ProgressBar } from './ProgressBar'
import { getGroupConfig, GroupId } from '../groupConfigs'

import { AudioPlayer } from './AudioPlayer'
import { ImagePlayer } from './ImagePlayer'
import { GLTexturePlayer } from './GLTexturePlayer'
import { observer } from 'mobx-react-lite'
import { reaction } from 'mobx'

interface GroupProps {
  id: GroupId
  title: string
  description?: any
}

console.log('reaction')
reaction(
  () => uiStore.current,
  (a, b) => {
    console.log('reacted', a, b)
  }
)

export const Group = observer((props: GroupProps) => {
  const { id, title, description } = props

  console.log('rerender', uiStore.current)

  const isPlaying = uiStore.current === id
  const groupConfig = getGroupConfig(id)!
  const {
    requests,
    completedRequests,
    cachedProgress,
    newProgress
  } = groupConfig.store

  return (
    <Container isPlaying={isPlaying}>
      <Header>
        <Title>
          {title}{' '}
          <FileCount>
            <span>{completedRequests.length}</span>
            {completedRequests.length !== requests.length && (
              <>/{requests.length}</>
            )}
          </FileCount>
        </Title>
        <Description>{description}</Description>
        <Indicator group={id} isPlaying={isPlaying} />
      </Header>
      <ProgressContainer>
        <ProgressBar
          cachedProgress={cachedProgress}
          newProgress={newProgress}
        />
      </ProgressContainer>

      {isPlaying && getGroupPlayer(id)}
    </Container>
  )
})

const getGroupPlayer = (groupId: GroupId) => {
  const component = (() => {
    switch (groupId) {
      case 'audio':
        return <AudioPlayer />

      case 'image':
        return <ImagePlayer />

      case 'texture':
        return <GLTexturePlayer />

      default:
        return null
    }
  })()

  return (
    <PlayerContainer>
      <PlayerInnerContainer>{component}</PlayerInnerContainer>
    </PlayerContainer>
  )
}

const Container = styled.div<{ isPlaying: boolean }>`
  position: relative;
  border-radius: 9px;

  ${props =>
    props.isPlaying &&
    `
      background: linear-gradient(180deg, #121315 0%, #1a1c1f 100%);
      box-shadow: inset 0px 1px 1px rgba(0, 0, 0, 0.15),
        inset 0px -1px 1px rgba(240, 244, 249, 0.15);
  `}
`

const Header = styled.div`
  height: 64px;
  position: relative;
  padding: 16px;
`

const ProgressContainer = styled.div`
  padding: 0 16px 16px;
`

const Title = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
  color: #bcbaba;
  margin-right: 64px;
  overflow: hidden;
  white-space: nowrap;
  margin-bottom: 4px;
`

const Description = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 15px;
  color: #707070;
  padding-right: 40px;
`

const FileCount = styled.span`
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  line-height: 15px;
  color: #ef7c00;

  height: 14px;
  border-radius: 16px;
  background-color: black;
  display: inline-block;
  padding: 1px 4px;
  min-width: 24px;
  text-align: center;

  > span {
    font-size: 11px;
    color: orange;
  }
`

const PlayerContainer = styled.div`
  padding: 0 4px 5px;
`

const PlayerInnerContainer = styled.div`
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border-bottom-left-radius: 9px;
  border-bottom-right-radius: 9px;
  padding: 12px;
  position: relative;
  background-color: black;
`
