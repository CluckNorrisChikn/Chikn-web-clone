/* eslint-disable no-unused-vars */
import * as React from 'react'
import { Alert } from 'react-bootstrap'
import { useWeb3Contract } from '../components/Connect'
import Layout from '../components/Layout'
import MintYourOwnWalletConnected from '../components/sections/MintYourOwnWalletConnectedSection'
import MintYourOwnWalletNotConnected from '../components/sections/MintYourOwnWalletNotConnectedSection'
import TotalMintedSection from '../components/sections/TotalMintedSection'
import TransactionProgress from '../components/TransactionProgressToast'

// TODO Remove pre GO-LIVE
const IndexPage = () => {
  const { active } = useWeb3Contract()

  return (
    <Layout>
      {/* Display transaction Toasterd */}
      <TransactionProgress intialOnShow={false} />

      <TotalMintedSection />

      {/* when not active... */}
      <MintYourOwnWalletNotConnected />

      {/* when active... */}
      <MintYourOwnWalletConnected />

      <Alert variant="warning" className="text-center">
        <h1>N.B. This page is for testing only.</h1>
      </Alert>
    </Layout>
  )
}

export default IndexPage
