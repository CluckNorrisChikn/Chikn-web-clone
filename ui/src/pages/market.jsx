import * as React from 'react'
import Layout from '../components/Layout'
import { Alert, Button, Col, Row } from 'react-bootstrap'
import { FaSync } from 'react-icons/fa'
import { Section, ChiknText, EggText, isProd, StackRow } from '../components/Common'
import {
  KEYS,
  useGetAllTokensForSaleQuery,
  useWeb3Contract
} from '../components/Connect'
import ChickenCard, { ChickenCardShimmer } from '../components/ChickenCard'
import { useQueryClient } from 'react-query'
import { navigate } from 'gatsby-link'

const Market = () => {
  const queryClient = useQueryClient()
  const { contract, account, active } = useWeb3Contract()
  const useWalletTokens = useGetAllTokensForSaleQuery(contract, account, active)
  const { data: tokens = [] } = useWalletTokens
  console.log('tokens', tokens)
  return (
    <Layout pageName="Wallet">
      <StackRow className="justify-content-between">
        <h1>Market</h1>
        <div>
          <Button
            title="Refresh"
            variant="light"
            disabled={!active}
            onClick={() => queryClient.invalidateQueries(KEYS.MARKET())}
          >
            <FaSync />
          </Button>
        </div>
      </StackRow>
      <Section className="border bg-white">
        {!active && (
          <span>
            Please connect your wallet, to view your <ChiknText />.
          </span>
        )}
        {active && useWalletTokens.isFetching && (
          <Row className="gy-3 gx-3">
            <Col sm={6} md={4} lg={3}>
              <ChickenCardShimmer />
            </Col>
            <Col sm={6} md={4} lg={3}>
              <ChickenCardShimmer />
            </Col>
            <Col sm={6} md={4} lg={3}>
              <ChickenCardShimmer />
            </Col>
            <Col sm={6} md={4} lg={3}>
              <ChickenCardShimmer />
            </Col>
          </Row>
        )}
        {active && !useWalletTokens.isFetching && useWalletTokens.isError && (
          <Alert variant="danger">{useWalletTokens.error?.message}</Alert>
        )}
        {active &&
          !useWalletTokens.isFetching &&
          useWalletTokens.isSuccess &&
          tokens.length === 0 && <h5>No tokens available.</h5>}
        {active &&
          !useWalletTokens.isFetching &&
          useWalletTokens.isSuccess &&
          tokens.length > 0 && (
          <Row className="gy-3 gx-3">
            {tokens
              .sort((a, b) => a.tokenId - b.tokenId)
              .map((token) => (
                <Col key={token.tokenId} sm={6} md={4} lg={3}>
                  <ChickenCard
                    tokenId={token.tokenId}
                    size="lg"
                    marketPlace
                  />
                </Col>
              ))}
          </Row>
        )}
      </Section>
    </Layout>
  )
}

export default Market
