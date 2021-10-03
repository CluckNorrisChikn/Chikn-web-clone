/* eslint-disable no-unused-vars */
import * as React from 'react'
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
  useGetContractQuery,
  useGetWalletTokensQuery
} from '../../components/Connect'
import ChickenCard from '../../components/ChickenCard'
import { navigate } from 'gatsby-link'

const IndexPage = () => {
  const useContract = useGetContractQuery()
  const useWalletTokens = useGetWalletTokensQuery()

  const { data: { tokens = [] } = {} } = useWalletTokens

  return (
    <Layout>
      <h1>Wallet</h1>
      <Section className="border">
        {!useContract.isSuccess && (
          <span>
            Please connect your wallet, to view your <ChiknText />.
          </span>
        )}
        {useWalletTokens.isLoading && <Spinner animation="border" />}
        {useWalletTokens.isError && (
          <Alert variant="danger">{useWalletTokens.error?.message}</Alert>
        )}
        {useWalletTokens.isSuccess && tokens.length === 0 && (
          <h5>No token in your wallet</h5>
        )}
        {useWalletTokens.isSuccess && tokens.length > 0 && (
          <Row>
            {tokens
              .map((t) => parseInt(t.tokenId))
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
          <pre>{JSON.stringify(useWalletTokens, null, 2)}</pre>
        )}
      </Section>
    </Layout>
  )
}

export default IndexPage
