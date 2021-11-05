/* eslint-disable no-unused-vars */
import * as React from 'react'
import { useWeb3Contract } from '../components/Connect'
import Layout from '../components/Layout'
import MintYourOwnWalletConnectedv2 from '../components/sections/MintYourOwnWalletConnectedSectionv2'
import MintYourOwnWalletNotConnected from '../components/sections/MintYourOwnWalletNotConnectedSection'
import TotalMintedSection from '../components/sections/TotalMintedSection'

// TODO Remove pre GO-LIVE
const IndexPage = () => {
  const { active } = useWeb3Contract()

  return (
    <Layout pageName="Mint">
      {/* Display transaction Toasterd */}
      {/* <TransactionProgress intialOnShow={false} /> */}

      <TotalMintedSection type="public" />

      {/* wallet not connected... */}
      {!active && <MintYourOwnWalletNotConnected type="public" />}

      {/* wallet connected... */}
      {active && <MintYourOwnWalletConnectedv2 type="public" />}

      {/* <RecentActivitySection /> */}
    </Layout>
  )
}

export default IndexPage
