import * as React from 'react'
import siteConfig from '../../../site-config'
import { ChickenCardDetails } from '../../components/ChickenCard'
import { ChiknText } from '../../components/Common'
import Layout from '../../components/Layout'
import TransactionProgress from '../../components/TransactionProgressToast'

const Page = ({ tokenId }) => {
  return (
    <Layout pageName={`${siteConfig.nftName} #${tokenId}`}>
      <TransactionProgress intialOnShow={false} />
      <h1>
        <ChiknText /> #{tokenId}
      </h1>
      <ChickenCardDetails tokenId={tokenId} />
    </Layout>
  )
}

export default Page
