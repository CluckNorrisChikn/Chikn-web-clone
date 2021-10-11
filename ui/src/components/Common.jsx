import * as React from 'react'
import { Button, Container } from 'react-bootstrap'
import styled from 'styled-components'
import siteConfig from '../../site-config'
import ChickenIconSrc from '../images/Chikn_Logo_Wordmark.svg'

import { FaDiscord, FaTwitter, FaShareAlt } from 'react-icons/fa'

// formatters

export const isProd = process.env.NODE_ENV === 'production'

export const fmtNumber = (o) => parseFloat(o).toLocaleString()

export const fmtCurrency = (o) =>
  parseFloat(o).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 5
  })

export const Section = ({ className = '', center = true, ...props }) => (
  <Container
    className={`p-3 p-md-5 ${
      center ? 'text-center' : ''
    } rounded-3 ${className}`}
    {...props}
  />
)

export const Stack = ({ className = '', direction = 'row', ...props }) => (
  <div
    className={`d-flex flex-${
      direction === 'row' ? 'row' : 'column'
    } ${className}`}
    {...props}
  />
)
export const StackDynamic = ({ className = '', ...props }) => (
  <div className={`d-flex gap-2 stack-dynamic ${className}`} {...props} />
)

export const StackCol = ({ className = '', ...props }) => (
  <div className={`d-flex flex-column ${className}`} {...props} />
)
export const StackRow = ({ className = '', ...props }) => (
  <div className={`d-flex flex-row ${className}`} {...props} />
)

export const StyleDaChikn = ({ children = '' }) => {
  const split = children.split(new RegExp(`(${siteConfig.nftName})`))
  split.forEach((s, i) => {
    if (s === siteConfig.nftName) split[i] = <ChiknText key={i} />
  })
  return split
}

/**
 * An <A> link, thats styled as a button.
 */
export const AButton = ({ className = '', ...props }) => (
  <a
    className={`btn ${className}`}
    target="_blank"
    rel="noopener noreferrer"
    {...props}
  />
)

export const SocialTwitterButton = () => {
  return (
    <AButton
      className="fs-5 btn-lg btn-outline-dark"
      href={siteConfig.links.twitter}
    >
      <FaTwitter />
    </AButton>
  )
}

export const SocialDiscordButton = () => {
  return (
    <AButton
      className="fs-5 btn-lg btn-outline-dark"
      href={siteConfig.links.discord}
    >
      <FaDiscord />
    </AButton>
  )
}

export const ChickenIcon = styled((props) => (
  <img src={ChickenIconSrc} {...props} />
))`
  // width: ${(props) => props.size || '6rem'};
  height: ${(props) => props.size || '2.5rem'};
  margin: 10px 0px;
`

export const SocialShareLinkButton = ({
  className = '',
  title = '',
  text = '',
  url = '',
  ...props
}) => {
  return (
    <Button
      variant="outline-dark"
      className={`${className}`}
      {...props}
      onClick={() => {
        // TODO add images to share
        if (navigator.share) {
          navigator.share({
            title,
            text,
            url
          })
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(url)
        } else {
          console.error('No way to share links!')
        }
      }}
    >
      <FaShareAlt />
    </Button>
  )
}

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

export const ChiknText = styled((props) => (
  <span {...props}>{siteConfig.nftName}</span>
))`
  // background: linear-gradient(135deg, #df3f3d 0%, purple 100%);
  // color: #b664b0;
  // background-clip: text;
  // -webkit-background-clip: text;
  // -webkit-text-fill-color: transparent;
  // -webkit-box-decoration-break: clone;
`
export const FeedText = styled.span`
  // background: linear-gradient(135deg, DarkSlateGray 0%, darkgreen 100%);
  background: linear-gradient(135deg, orange 0%, gold 100%);
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
