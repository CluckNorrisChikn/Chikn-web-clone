import React from 'react'
import Img from 'gatsby-image'
import { StaticQuery, graphql } from 'gatsby'
import { StackCol } from './Common'
import { ParallaxProvider, ParallaxBanner } from 'react-scroll-parallax'

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
                        alt="Chicken banner"
                      />
                    ),
                    amount: 0.23
                  },
                  {
                    children: (
                      <Img
                        fluid={data.layer2.childImageSharp.fluid}
                        objectFit="cover"
                        alt="Chicken banner"
                      />
                    ),
                    amount: 0.15
                  },
                  {
                    children: (
                      <Img
                        fluid={data.layer1.childImageSharp.fluid}
                        objectFit="cover"
                        alt="Chicken banner"
                      />
                    ),
                    amount: 0.01
                  },
                  {
                    children: (
                      <Img
                        fluid={data.layer0.childImageSharp.fluid}
                        objectFit="cover"
                        alt="Chicken banner"
                      />
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
