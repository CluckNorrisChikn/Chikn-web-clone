import React from 'react'
import Img from 'gatsby-image'
import { StaticQuery, graphql } from 'gatsby'

export default function Image(props) {
  return (
    <StaticQuery
      query={graphql`
        query {
          file(relativePath: { eq: "Wooden-Sign-Hanging.png" }) {
            childImageSharp {
              # Specify the image processing specifications right in the query.
              # Makes it trivial to update as your page's design changes.
              fluid(maxWidth: 800, quality: 96) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      `}
      render={(data) => (
        <Img fluid={data.file.childImageSharp.fluid} {...props} />
      )}
    />
  )
}
