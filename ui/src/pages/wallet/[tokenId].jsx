import * as React from 'react'
import { ChiknText } from '../../components/Common'
import Layout from '../../components/Layout'
import ChickenCard from '../../components/ChickenCard'
import siteConfig from '../../../site-config'

const Page = ({ tokenId }) => {
  return (
    <Layout pageName={`${siteConfig.nftName} #${tokenId}`}>
      <h1>
        <ChiknText /> #{tokenId}
      </h1>

      <ChickenCard tokenId={tokenId} />
    </Layout>
  )
}

export default Page
