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
import RecentActivitySection from '../components/sections/RecentActivitySection'
// import TransactionProgress from '../components/TransactionProgressToast'
import siteConfig from '../../site-config'

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
      {/* <TransactionProgress intialOnShow={false} /> */}

      <TotalMintedSection />

      {/* wallet not connected... */}
      {!active && <MintYourOwnWalletNotConnected />}

      {/* wallet connected... */}
      {active && (
        <MintYourOwnWalletConnectedv2 priceConfig={siteConfig.publicMint} />
      )}

      {/* <RecentActivitySection /> */}
    </Layout>
  )
}

export default IndexPage
