import React from 'react'
import Img from 'gatsby-image'
import { StaticQuery, graphql } from 'gatsby'

export default function Image() {
  return (
    <StaticQuery
      query={graphql`
        query {
          file(relativePath: { eq: "chicken-head.png" }) {
            childImageSharp {
              # Specify the image processing specifications right in the query.
              # Makes it trivial to update as your page's design changes.
              fixed(width: 170, height: 270) {
                ...GatsbyImageSharpFixed
              }
            }
          }
        }
      `}
      render={(data) => <Img fixed={data.file.childImageSharp.fixed} />}
    />
  )
}
