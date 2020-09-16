import React from 'react'
import styled from '@emotion/styled'
import Slider from 'react-slick'
import { getGroupConfig } from '../groupConfigs'
import { useObservable } from 'micro-observables'
import { Button } from './Button'

export const ImagePlayer = () => {
  const groupConfig = getGroupConfig('image')!
  const { store } = groupConfig

  const requests = useObservable(store.requests)

  return (
    <Container>
      <Slider
        lazyLoad="ondemand"
        nextArrow={<Button>Next</Button>}
        prevArrow={<Button>Prev</Button>}
      >
        {requests.map((request, idx) => (
          <Image key={idx} src={request.url} />
        ))}
      </Slider>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  height: 280px;
  color: white;
  overflow: hidden;

  .slick-slider {
    .slick-slide {
      height: 280px;

      > div {
        height: 100%;
      }
    }

    .slick-arrow {
      position: absolute;
      bottom: 0;
      margin: 16px;
      z-index: 2;

      &.slick-prev {
        left: 0;
      }

      &.slick-next {
        right: 0;
      }
    }
  }
`

const Image = styled.div<{ src: string }>`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.src});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`
