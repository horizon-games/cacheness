import React from 'react'
import styled from '@emotion/styled'

interface ProgressBarProps {
  newProgress: number
  cachedProgress: number
}

export const ProgressBar = (props: ProgressBarProps) => {
  const { newProgress, cachedProgress } = props

  const cachedProgressStyles =
    cachedProgress > 0 && newProgress > 0
      ? {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          borderRight: '1px solid #d62903'
        }
      : {}

  const newProgressStyles =
    cachedProgress > 0
      ? {
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderLeft: '1px solid #393939'
        }
      : {}

  return (
    <Container>
      <InnerContainer>
        <CachedProgress
          style={{
            width: `${cachedProgress * 100}%`,
            ...cachedProgressStyles
          }}
        />

        <NewProgress
          style={{
            width: `${newProgress * 100}%`,
            left: `${cachedProgress * 100}%`,
            ...newProgressStyles
          }}
        />
      </InnerContainer>
    </Container>
  )
}

const Container = styled.div`
  padding: 2px;
  background: linear-gradient(180deg, #020305 0%, #1a1c1f 100%);
  box-shadow: inset 0px 1px 1px rgba(0, 0, 0, 0.15),
    inset 0px -1px 1px rgba(240, 244, 249, 0.15);
  height: 14px;
  border-radius: 6px;
`

const InnerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const Progress = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 9px;
  border-radius: 6px;
`

const CachedProgress = styled(Progress)`
  background: linear-gradient(179deg, #ec6401 17.83%, #d62903 86.21%);
  transition: width 100ms linear;
`

const NewProgress = styled(Progress)`
  background: linear-gradient(179deg, #848484 17.83%, #393939 86.21%);
  transition: width 100ms linear;
`
