import * as React from 'react'
import { Container } from 'react-bootstrap'
import styled from 'styled-components'

export const Section = ({ className = '', ...props }) => (
  <Container
    className={`p-3 p-md-5 text-center rounded-3 ${className}`}
    {...props}
  />
)

export const StackCol = ({ className = '', ...props }) => (
  <div className={`d-flex flex-column ${className}`} {...props} />
)
export const StackRow = ({ className = '', ...props }) => (
  <div className={`d-flex flex-row ${className}`} {...props} />
)

export const RainbowText1 = styled((props) => <span {...props} />)`
  background: linear-gradient(135deg, #6699ff 0%, #ff3366 100%);
  color: #b664b0;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-box-decoration-break: clone;
`
export const RainbowText2 = styled((props) => <span {...props} />)`
  background: linear-gradient(135deg, magenta 0%, yellow 100%);
  color: #b664b0;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-box-decoration-break: clone;
`

export const ChiknText = styled.span`
  background: linear-gradient(135deg, red 0%, purple 100%);
  color: #b664b0;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-box-decoration-break: clone;
`
export const FeedText = styled.span`
  // background: linear-gradient(135deg, DarkSlateGray 0%, darkgreen 100%);
  background: linear-gradient(135deg, Gold 0%, GoldenRod 50%, green 100%);
  color: #b664b0;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-box-decoration-break: clone;
`
export const EggText = styled.span`
  background: linear-gradient(135deg, darkblue 0%, blue 50%, magenta 100%);
  color: #b664b0;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-box-decoration-break: clone;
`
