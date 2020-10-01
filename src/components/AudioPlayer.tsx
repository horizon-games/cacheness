import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { getGroupConfig } from '../groupConfigs'
import { Howl } from 'howler'
import { AudioSeeker } from './AudioSeeker'
import { observer } from 'mobx-react-lite'

export const AudioPlayer = observer(() => {
  const groupConfig = getGroupConfig('audio')!
  const { store } = groupConfig
  const { requests } = store
  const [trackIndex, setTrackIndex] = useState(0)
  const [howl, setHowl] = useState<Howl | undefined>(undefined)

  useEffect(() => {
    if (howl) {
      howl.stop()
      howl.unload()
    }

    const h = new Howl({ src: requests[trackIndex].url, html5: true })

    h.once('load', () => {
      h.play()
    })

    h.once('end', handleNextTrack)

    setHowl(h)

    return () => {
      if (h) {
        h.stop()
        h.unload()
      }
    }
  }, [trackIndex])

  const handleNextTrack = () => {
    if (trackIndex < requests.length - 1) {
      setTrackIndex(trackIndex + 1)
    } else {
      setTrackIndex(0)
    }
  }

  const handlePrevTrack = () => {
    if (trackIndex > 0) {
      setTrackIndex(trackIndex - 1)
    } else {
      setTrackIndex(requests.length - 1)
    }
  }

  const trackMeta = groupConfig.getMetadata!(requests[trackIndex].url) as {
    title: string
    by: string
  }

  return (
    <Container>
      <Track>
        <Title>{trackMeta.title}</Title>
        <By>{trackMeta.by}</By>
      </Track>
      <PrevButton onClick={handlePrevTrack}>
        <PrevIcon />
      </PrevButton>
      <NextButton onClick={handleNextTrack}>
        <NextIcon />
      </NextButton>
      <AudioSeeker howl={howl} />
    </Container>
  )
})

const formatTime = (duration: number) => {
  const minutes = Math.floor(duration / 60)
  const seconds = Math.round(duration - minutes * 60)
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
}

const Container = styled.div``

const Track = styled.div`
  text-align: center;
`

const Title = styled.div`
  color: orange;
  margin-bottom: 4px;
`

const By = styled.div`
  color: #888;
  font-size: 12px;
  margin-bottom: 8px;
`

const Button = styled.a`
  cursor: pointer;
  position: absolute;
  color: white;
  bottom: 0px;
  padding: 8px;
  margin: 7px 10px;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
`

const PrevButton = styled(Button)`
  left: 0;
`

const NextButton = styled(Button)`
  right: 0;
`

const Icon = styled.img`
  display: block;
`

const NextIcon = styled(Icon)``
NextIcon.defaultProps = { src: 'next.svg' }

const PrevIcon = styled(Icon)``
PrevIcon.defaultProps = { src: 'prev.svg' }
