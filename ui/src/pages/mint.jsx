/* eslint-disable no-unused-vars */
import * as React from 'react'
import { Alert } from 'react-bootstrap'
import { useWeb3Contract } from '../components/Connect'
import Layout from '../components/Layout'
import MintYourOwnWalletConnected from '../components/sections/MintYourOwnWalletConnectedSection'
import MintYourOwnWalletConnectedv2 from '../components/sections/MintYourOwnWalletConnectedSectionv2'
import MintYourOwnWalletNotConnected from '../components/sections/MintYourOwnWalletNotConnectedSection'
import TotalMintedSection from '../components/sections/TotalMintedSection'
import TransactionProgress from '../components/TransactionProgressToast'
import RecentActivitySection from '../components/sections/RecentActivitySection'

// TODO Remove pre GO-LIVE
const IndexPage = () => {
  const { active, address, contract } = useWeb3Contract()

  const test = async () => {
    const gbaddress = await contract.GB_erc20_contract()
    const supply = await contract.maxSupply()
    const currentMint = await contract.totalSupply()
    console.log('Gb address', gbaddress)
    console.log(' supplt', supply)
    console.log('current mint', currentMint)
  }
  if (active) {
    test()
  }

  return (
    <Layout pageName="Mint">
      {/* Display transaction Toasterd */}
      <TransactionProgress intialOnShow={false} />

      <TotalMintedSection />

      {/* when not active... */}
      <MintYourOwnWalletNotConnected />

      {/* when active... */}
      <MintYourOwnWalletConnected />

      <MintYourOwnWalletConnectedv2 />

      <RecentActivitySection />

      <Alert variant="warning" className="text-center">
        <h1>N.B. This page is for testing only.</h1>
      </Alert>
    </Layout>
  )
}

export default IndexPage
