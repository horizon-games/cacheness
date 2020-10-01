import React from 'react'
import styled from '@emotion/styled'
import { uiStore } from '../stores/UIStore'
import { observer } from 'mobx-react-lite'

interface IndicatorProps {
  group: string
  isPlaying: boolean
  onPlay?: () => void
}

export const Indicator = observer((props: IndicatorProps) => {
  const { isPlaying, group, onPlay } = props

  return (
    <OuterContainer isPlaying={isPlaying}>
      <InnerContainer
        isPlaying={isPlaying}
        onClick={() => {
          uiStore.toggle(group)
          console.log('HEY', group)

          if (uiStore.current === group) {
            if (onPlay) {
              onPlay()
            }
          }
        }}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </InnerContainer>
    </OuterContainer>
  )
})

const OuterContainer = styled.div<{ isPlaying: boolean }>`
  position: absolute;
  right: 16px;
  top: 16px;
  padding: 2px;
  width: 33px;
  height: 33px;
  border-radius: 16px;

  ${props =>
    props.isPlaying
      ? `
          background: linear-gradient(134.96deg, #f43b00 15.32%, #de5203 85.61%);
          box-shadow: -4px -4px 16px rgba(240, 245, 249, 0.15), 4px 4px 16px rgba(0, 0, 0, 0.9);
        `
      : `
          background: linear-gradient(135deg, rgba(22, 22, 25, 0.25) 15.32%, rgba(55, 58, 62, 0.26) 84.68%);
          box-shadow: -4px -4px 16px rgba(240, 245, 249, 0.1), 4px 4px 16px rgba(0, 0, 0, 0.7);
        `}
`

const InnerContainer = styled.a<{ isPlaying: boolean }>`
  width: 29px;
  height: 29px;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  ${props =>
    props.isPlaying
      ? `background: linear-gradient(318.62deg, #ec6401 17.83%, #d62903 86.21%);`
      : `
          background: linear-gradient(318.62deg, #151618 17.83%, #393C40 86.21%);
          box-shadow: inset 1px 1px 1px rgba(217, 219, 223, 0.05);
          
          &:hover {
            background: rgba(0, 0, 0, 0.5);
          }
    `}
`

const Icon = styled.img`
  user-select: none;
`

const PlayIcon = styled(Icon)``
PlayIcon.defaultProps = { src: 'play.svg' }

const PauseIcon = styled(Icon)``
PauseIcon.defaultProps = { src: 'pause.svg' }
