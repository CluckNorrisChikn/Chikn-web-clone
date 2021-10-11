import * as React from 'react'
import ChickenBannerImage from '../components/ChickenBannerImage'
import Layout from '../components/Layout'

const IndexPage = () => {
  return (
    <Layout
      pageName="Home"
      constrainWidth={false}
      padTop={false}
      className="gap-8"
    >
      {/* banner */}
      <ChickenBannerImage />
    </Layout>
  )
}

export default IndexPage
