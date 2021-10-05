import React from 'react'
import Img from 'gatsby-image'
import { StaticQuery, graphql } from 'gatsby'
import { StackCol } from './Common'

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
          desktopImage: file(relativePath: { eq: "banner_all.jpg" }) {
            childImageSharp {
              # Specify the image processing specifications right in the query.
              # Makes it trivial to update as your page's design changes.
              fluid(maxWidth: 1600, quality: 100) {
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
          <Img
            className="d-none d-lg-inline-block"
            fluid={data.desktopImage.childImageSharp.fluid}
            objectFit="contain"
            alt="Chicken banner"
          />
        </>
      )}
    />
  )
}

// export default ({ data }) => {
//   // Set up the array of image data and `media` keys.
//   // You can have as many entries as you'd like.
//   const sources = [
//     data.mobileImage.childImageSharp.fluid,
//     {
//       ...data.desktopImage.childImageSharp.fluid,
//       media: `(min-width: 768px)`,
//     },
//   ]

//   return (
//     <div>
//       <h1>Hello art-directed gatsby-image</h1>
//       <Img fluid={sources} />
//     </div>
//   )
// }
