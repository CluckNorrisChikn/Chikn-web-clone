import * as React from 'react'
import { Button, Card, Jumbotron } from 'react-bootstrap'
import { ConnectWalletButton } from '../components/ConnectWalletButton'
import Layout from '../components/Layout'

const IndexPage = () => {
  return (
    <Layout>
      <h1>Mint</h1>

      <Jumbotron className="p-5 bg-light bg-gradient rounded-3 text-center">
        <h3>Chickens Remaining: 8000 / 8000</h3>
      </Jumbotron>

      <Card className="mt-5 text-center">
        <Card.Body>
          <p>You will need to connect your wallet before claiming an NFT.</p>
          <ConnectWalletButton />
        </Card.Body>
      </Card>
    </Layout>
  )
}

export default IndexPage
