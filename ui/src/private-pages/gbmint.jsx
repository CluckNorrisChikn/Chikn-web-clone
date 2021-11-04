/* eslint-disable no-unused-vars */
import * as React from 'react'
import { Alert } from 'react-bootstrap'
import { useWeb3Contract } from '../components/Connect'
import Layout from '../components/Layout'
import CountdownSection from '../components/sections/CountdownSection'
import MintYourOwnWalletConnected from '../components/sections/MintYourOwnWalletConnectedSection'
import MintYourOwnWalletConnectedv2 from '../components/sections/MintYourOwnWalletConnectedSectionv2'
import MintYourOwnWalletNotConnected from '../components/sections/MintYourOwnWalletNotConnectedSection'
import TotalMintedSection from '../components/sections/TotalMintedSection'
// import TransactionProgress from '../components/TransactionProgressToast'
import siteConfig from '../../site-config'

const IndexPage = () => {
  const { active } = useWeb3Contract()

  return (
    <Layout pageName="Mint">
      {/* Display transaction Toasterd */}
      {/* <TransactionProgress intialOnShow={false} /> */}

      <TotalMintedSection />

      {/* wallet not connected... */}
      {!active && <MintYourOwnWalletNotConnected />}

      {/* wallet connected... */}
      {active && (
        <MintYourOwnWalletConnectedv2 priceConfig={siteConfig.gbMint} />
      )}
    </Layout>
  )
}

export default IndexPage
