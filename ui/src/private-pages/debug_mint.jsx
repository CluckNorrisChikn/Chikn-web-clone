/* eslint-disable no-unused-vars */
import * as React from 'react'
import { Alert } from 'react-bootstrap'
import { useGetSupplyQuery, useWeb3Contract } from '../components/Connect'
import Layout from '../components/Layout'
import CountdownSection from '../components/sections/CountdownSection'
import MintYourOwnWalletConnected from '../components/sections/MintYourOwnWalletConnectedSection'
import MintYourOwnWalletConnectedv2 from '../components/sections/MintYourOwnWalletConnectedSectionv2'
import MintYourOwnWalletNotConnected from '../components/sections/MintYourOwnWalletNotConnectedSection'
import TotalMintedSection from '../components/sections/TotalMintedSection'
import TransactionProgress from '../components/TransactionProgressToast'
import RecentActivitySection from '../components/sections/RecentActivitySection'
import siteConfig from '../../site-config'

// TODO Remove pre GO-LIVE
const IndexPage = () => {
  const { active, address, contract } = useWeb3Contract()

  const getSupplyQuery = useGetSupplyQuery()

  return (
    <Layout pageName="Mint">
      {/* show supply */}
      <pre>{JSON.stringify(getSupplyQuery, null, 2)}</pre>
      {/* Display transaction Toasterd */}
      {/* <TransactionProgress intialOnShow={false} /> */}

      <TotalMintedSection />

      {/* when not active... */}
      <MintYourOwnWalletNotConnected />

      {/* when active... */}
      {/* <MintYourOwnWalletConnected /> */}

      <MintYourOwnWalletConnectedv2 priceConfig={siteConfig.publicMint} />

      <RecentActivitySection />

      {/* <CountdownSection /> */}

      <Alert variant="warning" className="text-center">
        <h1>N.B. This page is for testing only.</h1>
      </Alert>
    </Layout>
  )
}

export default IndexPage
