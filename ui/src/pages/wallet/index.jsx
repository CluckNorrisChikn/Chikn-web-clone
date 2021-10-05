/* eslint-disable no-unused-vars */
import * as React from 'react'

import { FaSync } from 'react-icons/fa'
import {
  ChiknText,
  Section,
  StackCol,
  StackRow,
  StyleDaChikn
} from '../../components/Common'
import { ConnectWalletButton } from '../../components/ConnectWalletButton'
import Layout from '../../components/Layout'
import { Alert, Button, Card, Col, Row, Spinner, Table } from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid'
import styled from 'styled-components'
import siteConfig from '../../../site-config'
import {
  KEYS,
  useGetContractQuery,
  useGetWalletTokensQuery,
  useWeb3Contract
} from '../../components/Connect'
import ChickenCard from '../../components/ChickenCard'
import { navigate } from 'gatsby-link'
import { useQueryClient } from 'react-query'

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
        {active && useWalletTokens.isFetching && <Spinner animation="border" />}
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

        {/* debug */}
        {process.env.NODE_ENV !== 'production' && (
          <>
            <pre>active={JSON.stringify(active, null, 2)}</pre>
            <pre>
              useWalletTokens={JSON.stringify(useWalletTokens, null, 2)}
            </pre>
          </>
        )}
      </Section>
    </Layout>
  )
}

export default IndexPage
