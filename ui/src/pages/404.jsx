import * as React from 'react'
import Layout from '../components/Layout'
import Img from 'gatsby-image'
import { StaticQuery, graphql } from 'gatsby'

const NotFoundPage = () => {
  return (
    <Layout className="align-items-center">
      <h1>Ce n&apos;est pas un poulet!</h1>
      <div className="text-muted mb-5">Page not found</div>
      <StaticQuery
        query={graphql`
          query {
            file(relativePath: { eq: "chicken_404.jpg" }) {
              childImageSharp {
                # Specify the image processing specifications right in the query.
                # Makes it trivial to update as your page's design changes.
                fixed(width: 500) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
          }
        `}
        render={(data) => <Img fixed={data.file.childImageSharp.fixed} />}
      />
    </Layout>
  )
}

export default NotFoundPage
