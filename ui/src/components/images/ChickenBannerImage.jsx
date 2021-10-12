import React from 'react'
import Img from 'gatsby-image'
import { StaticQuery, graphql } from 'gatsby'
import { StackCol } from '../Common'
import { ParallaxProvider, ParallaxBanner } from 'react-scroll-parallax'
import ChiknLogoSvg from '../../images/Chikn_Logo_Wordmark.svg'
import AvalancheLogoSvg from '../../images/avalanche-avax-logo-trans.svg'
import styled from 'styled-components'

const ChiknLogo = styled((props) => <img src={ChiknLogoSvg} {...props} />)`
  width: 18vw;
`
const AvaxLogo = styled((props) => <img src={AvalancheLogoSvg} {...props} />)`
  width: 4.5vw;
`

export default function Image() {
  return (
    <StaticQuery
      query={graphql`
        query {
          mobileImage: file(relativePath: { eq: "banner_all.jpg" }) {
            childImageSharp {
              fixed(height: 390, quality: 100) {
                ...GatsbyImageSharpFixed
              }
            }
          }
          layer0: file(relativePath: { eq: "banner/layer0.png" }) {
            childImageSharp {
              # Specify the image processing specifications right in the query.
              # Makes it trivial to update as your page's design changes.
              fluid(maxWidth: 1600, quality: 95) {
                ...GatsbyImageSharpFluid
              }
            }
          }
          layer1: file(relativePath: { eq: "banner/layer1.png" }) {
            childImageSharp {
              # Specify the image processing specifications right in the query.
              # Makes it trivial to update as your page's design changes.
              fluid(maxWidth: 1600, quality: 95) {
                ...GatsbyImageSharpFluid
              }
            }
          }
          layer2: file(relativePath: { eq: "banner/layer2.png" }) {
            childImageSharp {
              # Specify the image processing specifications right in the query.
              # Makes it trivial to update as your page's design changes.
              fluid(maxWidth: 1600, quality: 95) {
                ...GatsbyImageSharpFluid
              }
            }
          }
          layer3: file(relativePath: { eq: "banner/layer3.png" }) {
            childImageSharp {
              # Specify the image processing specifications right in the query.
              # Makes it trivial to update as your page's design changes.
              fluid(maxWidth: 1600, quality: 95) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      `}
      render={(data) => (
        <>
          {/* mobile */}
          <StackCol className="align-items-center overflow-hidden d-inline-block d-lg-none">
            <Img
              fixed={data.mobileImage.childImageSharp.fixed}
              objectFit="cover"
              objectPosition="50% 50%"
              alt="Chicken banner"
            />
          </StackCol>
          {/* desktop */}
          <div className="d-none d-lg-inline-block">
            <ParallaxProvider>
              <ParallaxBanner
                layers={[
                  {
                    children: (
                      <Img
                        fluid={data.layer3.childImageSharp.fluid}
                        objectFit="cover"
                        alt="mountainsky"
                      />
                    ),
                    amount: 0.23
                  },
                  {
                    children: (
                      <Img
                        fluid={data.layer2.childImageSharp.fluid}
                        objectFit="cover"
                        alt="backgrass"
                      />
                    ),
                    amount: 0.15
                  },
                  {
                    children: (
                      <Img
                        fluid={data.layer1.childImageSharp.fluid}
                        objectFit="cover"
                        alt="frontgrass"
                      />
                    ),
                    amount: 0.01
                  },
                  // {
                  //   children: (
                  //     <Img
                  //       fluid={data.layer0.childImageSharp.fluid}
                  //       objectFit="cover"
                  //       alt="logo"
                  //     />
                  //   ),
                  //   amount: 0
                  // },
                  {
                    children: (
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ height: '25vw' }}
                      >
                        <ChiknLogo />
                      </div>
                    ),
                    amount: 0
                  },
                  {
                    children: (
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ height: '39vw' }}
                      >
                        <AvaxLogo />
                      </div>
                    ),
                    amount: 0
                  }
                ]}
                style={{
                  height: '40vw'
                }}
              ></ParallaxBanner>
            </ParallaxProvider>
          </div>
        </>
      )}
    />
  )
}
