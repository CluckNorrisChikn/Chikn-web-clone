import { Link } from 'gatsby'
import * as React from 'react'
import siteConfig from '../../../site-config'
import { ChickenCardDetails } from '../../components/ChickenCard'
import { ChiknText } from '../../components/Common'
import Layout from '../../components/Layout'
import TransactionProgress from '../../components/TransactionProgressToast'

const Page = ({ tokenId, location = {} }) => {
  const { backLink, backLabel } =
    typeof location.state !== 'undefined' && location.state !== null
      ? location.state
      : {}
  return (
    <Layout pageName={`${siteConfig.nftName} #${tokenId}`}>
      <TransactionProgress intialOnShow={false} />
      {backLink && (
        <div>
          <Link to={backLink} className="btn btn-primary px-5">
            &laquo;&nbsp;{backLabel || 'Go back'}
          </Link>
        </div>
      )}
      <h1>
        <ChiknText /> #{tokenId}
      </h1>
      <ChickenCardDetails tokenId={tokenId} />
    </Layout>
  )
}

export default Page
