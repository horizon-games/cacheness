import React from 'react'
import styled from '@emotion/styled'
import { Indicator } from './Indicator'
import { ProgressBar } from './ProgressBar'
import { AudioPlayer } from './AudioPlayer'
import { ImagePlayer } from './ImagePlayer'
import { TexturePlayer } from './TexturePlayer'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { useStore } from '../stores'
import { GroupType } from '../constants'
import {
  RequestItem,
  RequestStatus,
  RequestStore
} from '../stores/RequestStore'

interface GroupProps {
  group: GroupType
  title: string
  description?: any
}

export const Group = observer(({ group, title, description }: GroupProps) => {
  const { groupStore, requestStore } = useStore()
  const isPlaying = groupStore.current === group

  const filteredRequestStore = useLocalObservable(() => ({
    get requests() {
      return requestStore.requests.filter(x => x.group === group)
    },

    get pendingRequests() {
      return requestStore.pendingRequests.filter(x => x.group === group)
    },

    get completedRequests() {
      return requestStore.completedRequests.filter(x => x.group === group)
    },

    get cachedProgress() {
      return (
        this.requests.filter(x => x.status === RequestStatus.Cached).length /
          this.requests.length || 0
      )
    },

    get newProgress() {
      return (
        this.requests.filter(x => x.status === RequestStatus.New).length /
          this.requests.length || 0
      )
    }
  }))

  const {
    requests,
    completedRequests,
    newProgress,
    cachedProgress
  } = filteredRequestStore

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
        <Indicator group={group} isPlaying={isPlaying} />
      </Header>
      <ProgressContainer>
        <ProgressBar
          cachedProgress={cachedProgress}
          newProgress={newProgress}
        />
      </ProgressContainer>

      {isPlaying && getGroupPlayer(group, requests)}
    </Container>
  )
})

const getGroupPlayer = (group: GroupType, requests: RequestItem[]) => {
  const component = (() => {
    switch (group) {
      case 'audio':
        return <AudioPlayer requests={requests} />

      case 'image':
        return <ImagePlayer requests={requests} />

      case 'texture':
        return <TexturePlayer requests={requests} />

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
