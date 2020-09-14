import React, { ReactNode } from 'react'
import styled from '@emotion/styled'

interface ButtonProps {
  onClick: () => void
  children: ReactNode
  className?: string
}

export const Button = (props: ButtonProps) => {
  const { onClick, children, className } = props

  return (
    <OuterContainer className={className}>
      <InnerContainer onClick={onClick}>{children}</InnerContainer>
    </OuterContainer>
  )
}

const OuterContainer = styled.div`
  padding: 2px;
  height: 33px;
  border-radius: 16px;
  display: inline-block;
  user-select: none;

  background: linear-gradient(
    135deg,
    rgba(22, 22, 25, 0.25) 15.32%,
    rgba(55, 58, 62, 0.26) 84.68%
  );
  box-shadow: -4px -4px 16px rgba(240, 245, 249, 0.1),
    4px 4px 16px rgba(0, 0, 0, 0.7);

  &.primary {
    background: linear-gradient(134.96deg, #f43b00 15.32%, #de5203 85.61%);
    box-shadow: -4px -4px 16px rgba(240, 245, 249, 0.15),
      4px 4px 16px rgba(0, 0, 0, 0.9);
  }
`

const InnerContainer = styled.a`
  height: 29px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #ccc;
  text-transform: uppercase;
  font-size: 10px;
  padding: 0 10px;
  line-height: 33px;
  font-weight: bold;
  user-select: none;

  background: linear-gradient(318.62deg, #151618 17.83%, #393c40 86.21%);
  box-shadow: inset 1px 1px 1px rgba(217, 219, 223, 0.05);

  &:hover {
    background: rgba(0, 0, 0, 0.5);
  }

  &.primary {
    background: linear-gradient(318.62deg, #ec6401 17.83%, #d62903 86.21%);
  }
`
