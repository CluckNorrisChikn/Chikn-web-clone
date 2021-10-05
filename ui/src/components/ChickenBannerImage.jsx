import React from 'react'
import Img from 'gatsby-image'
import { StaticQuery, graphql } from 'gatsby'

export default function Image() {
  return (
    <StaticQuery
      query={graphql`
        query {
          file: file(relativePath: { eq: "banner_all.jpg" }) {
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
        <Img fluid={data.file.childImageSharp.fluid} alt="Chicken banner" />
      )}
    />
  )
}
