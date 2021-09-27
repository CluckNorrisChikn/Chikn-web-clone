import * as React from 'react'
import { Section } from '../components/Common'
import { ConnectWalletButton } from '../components/ConnectWalletButton'
import Layout from '../components/Layout'

const IndexPage = () => {
  return (
    <Layout>
      <h1>Mint</h1>

      <Section className="bg-light">
        <h3>Chickens Remaining: 8000 / 8000</h3>
      </Section>

      <Section className="border">
        <p>You will need to connect your wallet before claiming an NFT.</p>
        <ConnectWalletButton />
      </Section>
    </Layout>
  )
}

export default IndexPage
