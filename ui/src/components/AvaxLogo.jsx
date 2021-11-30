import React from 'react'
import AvalancheLogoSvg from '../images/avalanche-avax-logo-trans.svg'
import styled from 'styled-components'

export const AvaxLogo = styled((props) => <img src={AvalancheLogoSvg} {...props} />)`
  width: ${(props) => props.size || '3rem'};
`
