import React from 'react'
import styled from '@emotion/styled'
import Slider from 'react-slick'
import { getGroupConfig } from '../groupConfigs'
import { useObservable } from 'micro-observables'

export const ImagePlayer = () => {
  const groupConfig = getGroupConfig('image')!
  const { store } = groupConfig

  const requests = useObservable(store.requests)

  return (
    <Container>
      <Slider lazyLoad="ondemand">
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
      z-index: 2;
      border: none;
      background-color: black;
      color: white;
      bottom: 0;
      padding: 8px 10px;
      cursor: pointer;

      font-size: 11px;

      &.slick-prev {
        left: 0;
        font-size: 0;

        border-top-right-radius: 8px;

        &::after {
          content: 'Prev';
          display: block;
          font-size: 11px;
        }
      }

      &.slick-next {
        right: 0;
        border-top-left-radius: 8px;
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
