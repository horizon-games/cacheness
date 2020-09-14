import React from 'react'
import styled from '@emotion/styled'

interface ProgressBarProps {
  value: number
}

export const ProgressBar = (props: ProgressBarProps) => {
  const { value } = props

  return (
    <Container>
      <Progress style={{ width: `${value * 100}%` }} />
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

const Progress = styled.div`
  height: 9px;
  border-radius: 6px;
  background: linear-gradient(179deg, #ec6401 17.83%, #d62903 86.21%);
  transition: width 100ms linear;
`
