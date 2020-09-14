import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { Howl } from 'howler'

export interface SeekerProps {
  howl: Howl | undefined
}

export const AudioSeeker = (props: SeekerProps) => {
  const { howl } = props
  const [position, setPosition] = useState(0)
  const duration = howl ? howl.duration() : 0

  useEffect(() => {
    setPosition(0)

    const interval = setInterval(() => {
      if (howl) {
        setPosition(howl.seek() as any)
      }
    }, 500)

    return () => {
      clearInterval(interval)
    }
  }, [howl])

  const handleSeek = (ev: React.MouseEvent) => {
    if (howl) {
      const {
        left,
        width
      } = (ev.target as HTMLDivElement).getBoundingClientRect()
      const ratio = (ev.clientX - left) / width
      const position = ratio * duration

      howl.seek(position)
      setPosition(position)
    }
  }

  return (
    <Container>
      <Time style={{ textAlign: 'right' }}>{formatTime(position)}</Time>
      <ProgressBarContainer onClick={handleSeek}>
        <ProgressBarBackground>
          <ProgressBarInner
            style={{ width: `${(position / duration || 0) * 100}%` }}
          />
        </ProgressBarBackground>
      </ProgressBarContainer>

      <Time>{formatTime(duration)}</Time>
    </Container>
  )
}

const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor((timeInSeconds || 0) / 60)
  const seconds = Math.round((timeInSeconds || 0) - minutes * 60)
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ProgressBarContainer = styled.div`
  width: 50%;
  margin: 0 8px;
  padding: 4px 0;
  cursor: pointer;
`

const ProgressBarBackground = styled.div`
  height: 5px;
  border-radius: 9px;
  background-color: #333;
  overflow: hidden;
`
const ProgressBarInner = styled.div`
  height: 5px;
  background-color: #ccc;
  pointer-events: none;

  //transition: width 100ms linear;
`

const Time = styled.div`
  font-size: 11px;
  color: #ccc;
  width: 25%;
`
