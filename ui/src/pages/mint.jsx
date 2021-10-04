/* eslint-disable no-unused-vars */
import * as React from 'react'
import {
  ChiknText,
  Section,
  StackCol,
  StackRow,
  StyleDaChikn
} from '../components/Common'
import { ConnectWalletButton } from '../components/ConnectWalletButton'
import Layout from '../components/Layout'
import { Alert, Button, Card, Col, Row, Spinner, Table } from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid'
import styled from 'styled-components'
import siteConfig from '../../site-config'
import {
  useGetContractQuery,
  useGetWalletTokensQuery,
  useGetWalletBalanceQuery,
  useMintTokenMutation,
  useGetSupplyQuery
} from '../components/Connect'
import ChickenCard from '../components/ChickenCard'
import { navigate } from 'gatsby-link'
import TransactionProgress from '../components/TransactionProgressToast'

const isBrowser = typeof window !== 'undefined'

const IndexPage = () => {
  const getSupplyQuery = useGetSupplyQuery()
  const useWalletBalance = useGetWalletBalanceQuery()
  const useContract = useGetContractQuery()
  const useWalletTokens = useGetWalletTokensQuery()
  const useMintToken = useMintTokenMutation()

  const { contractDetail = {} } = useContract.isSuccess ? useContract.data : {}
  const { tokens = [] } = useWalletTokens.isSuccess ? useWalletTokens.data : {}
  const { balance = '-' } = useWalletBalance.isSuccess
    ? useWalletBalance.data
    : {}

  console.log('token', tokens, balance)
  const mintToken = () => {
    const tokenURI = `https://chickenrun.io/${uuidv4()}`
    useMintToken.mutate(tokenURI)
  }

  return (
    <Layout>
      {/* Display transaction Toasterd */}
      <TransactionProgress />

      <Alert variant="warning" className="text-center">
        <h1>N.B. This page will merge with home</h1>
      </Alert>
      <h1>Mint</h1>

      <Section className="bg-light">
        <h3>
          <ChiknText /> Minted:{' '}
          {getSupplyQuery.isLoading && <Spinner animation="border" />}
          {getSupplyQuery.isSuccess &&
            `${getSupplyQuery.data.minted} / ${getSupplyQuery.data.total}`}
          {getSupplyQuery.isError && '-'}
        </h3>
      </Section>

      <Section className="border">
        <StackCol className="gap-3">
          {!useContract.isSuccess
            ? (
              <span>
              Please connect your wallet, to mint a <ChiknText />.
              </span>
            )
            : (
              <span>
              Click the button below, to mint your <ChiknText />.
              </span>
            )}
          <Button
            type="button"
            size="lg"
            variant="outline-primary"
            disabled={!useContract.isSuccess}
            onClick={() => mintToken()}
          >
            Mint my {siteConfig.nftName}!
          </Button>
          {/* <div>Number of tokens you currently own: {tokenOwnByUser}</div> */}
        </StackCol>

        {/* <form onSubmit={mintToken}> */}
        {/* </form> */}
        {/* <div>
          {tokens.map((t, inx) => {
            return <div key={inx}>Token: {JSON.stringify(t)}</div>
          })}
        </div> */}
        {/* {ownerTokenList.map((t, inx) => {
            return <div key={inx}>Token: {t}</div>
          })} */}
      </Section>

      {/* NOTE don't show wallet until it's connected */}
      {useContract.isSuccess && (
        <>
          <h1>Wallet</h1>

          <Section className="border">
            {tokens.length === 0 && <h5>No token in your wallet</h5>}
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
          </Section>
        </>
      )}
    </Layout>
  )
}

export default IndexPage
