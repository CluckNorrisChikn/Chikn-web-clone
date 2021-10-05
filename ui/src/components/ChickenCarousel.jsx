import * as React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import PageVisibility from 'react-page-visibility'
import Ticker from 'react-ticker'
import Img from 'gatsby-image'
import styled from 'styled-components'

const ChickenImage = styled(Img)`
  width: 200px;
  height: 200px;
  margin-right: 15px;
  margin-bottom: 15px;
  border-radius: 15px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
  &.gatsby-image-wrapper {
    display: block !important;
  }
`

const ChickenCarousel = () => {
  const [pageIsVisible, setPageIsVisible] = React.useState(true)
  const data = useStaticQuery(graphql`
    {
      allFile(
        filter: {
          extension: { regex: "/(jpg)/" }
          relativeDirectory: { eq: "carousel" }
        }
      ) {
        edges {
          node {
            childImageSharp {
              fixed(width: 200, height: 200, quality: 100) {
                ...GatsbyImageSharpFixed
              }
            }
            base
          }
        }
      }
    }
  `)
  return (
    <>
      <PageVisibility onChange={(isVisible) => setPageIsVisible(isVisible)}>
        {pageIsVisible && (
          <Ticker>
            {({ index }) => (
              <ChickenImage
                fixed={
                  data.allFile.edges[index % data.allFile.edges.length].node
                    .childImageSharp.fixed
                }
              />
            )}
          </Ticker>
        )}
      </PageVisibility>
    </>
  )
}

export default ChickenCarousel
