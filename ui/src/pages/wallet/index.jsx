/* eslint-disable no-unused-vars */
import { navigate } from 'gatsby-link'
import * as React from 'react'
import { Alert, Button, Col, Row } from 'react-bootstrap'
import { FaSync } from 'react-icons/fa'
import { useQueryClient } from 'react-query'
import ChickenCard, { ChickenCardShimmer } from '../../components/ChickenCard'
import { ChiknText, isProd, Section, StackRow } from '../../components/Common'
import {
  KEYS,
  useGetWalletTokensQuery,
  useWeb3Contract
} from '../../components/Connect'
import Layout from '../../components/Layout'

const IndexPage = () => {
  const queryClient = useQueryClient()
  const { contract, account, active } = useWeb3Contract()
  const useWalletTokens = useGetWalletTokensQuery(contract, account, active)

  const { data: tokens = [] } = useWalletTokens

  return (
    <Layout>
      <StackRow className="justify-content-between">
        <h1>Wallet</h1>
        <div>
          <Button
            title="Refresh"
            variant="light"
            disabled={!active}
            onClick={() => queryClient.invalidateQueries(KEYS.WALLET_TOKEN())}
          >
            <FaSync />
          </Button>
        </div>
      </StackRow>
      <Section className="border">
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
          tokens.length === 0 && <h5>No tokens found in your wallet.</h5>}
        {active &&
          !useWalletTokens.isFetching &&
          useWalletTokens.isSuccess &&
          tokens.length > 0 && (
          <Row className="gy-3 gx-3">
            {tokens
              .sort((a, b) => a - b)
              .map((tokenId) => (
                <Col key={tokenId} sm={6} md={4} lg={3}>
                  <ChickenCard
                    tokenId={tokenId}
                    size="sm"
                    onClick={() => navigate(`/wallet/${tokenId}`)}
                  />
                </Col>
              ))}
          </Row>
        )}
      </Section>
    </Layout>
  )
}

export default IndexPage
