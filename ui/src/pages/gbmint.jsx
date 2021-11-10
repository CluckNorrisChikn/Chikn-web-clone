/* eslint-disable no-unused-vars */
import * as React from 'react'
// import TransactionProgress from '../components/TransactionProgressToast'
import siteConfig from '../../site-config'
import { useGetSupplyQuery, useWeb3Contract } from '../components/Connect'
import Layout from '../components/Layout'
import MintYourOwnWalletConnectedv2 from '../components/sections/MintYourOwnWalletConnectedSectionv2'
import MintYourOwnWalletNotConnected from '../components/sections/MintYourOwnWalletNotConnectedSection'
import TotalMintedSection from '../components/sections/TotalMintedSection'

const IndexPage = () => {
  const { active } = useWeb3Contract()
  const { gbMintLimit } = useGetSupplyQuery()

  return (
    <Layout pageName="Mint">
      {/* Display transaction Toasterd */}
      {/* <TransactionProgress intialOnShow={false} /> */}

      <TotalMintedSection type="gb" />

      {/* wallet not connected... */}
      {!active && <MintYourOwnWalletNotConnected type="gb" />}

      {/* wallet connected... */}
      {active && <MintYourOwnWalletConnectedv2 type="gb" />}
    </Layout>
  )
}

export default IndexPage
