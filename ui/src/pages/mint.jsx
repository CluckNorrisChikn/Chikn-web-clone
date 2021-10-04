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
  useGetSupplyQuery,
  useWeb3Contract
} from '../components/Connect'
import ChickenCard from '../components/ChickenCard'
import { navigate } from 'gatsby-link'
import TransactionProgress from '../components/TransactionProgressToast'

const isBrowser = typeof window !== 'undefined'

const IndexPage = () => {
  const { library, contract, account, active } = useWeb3Contract()
  const getSupplyQuery = useGetSupplyQuery()
  const useWalletBalance = useGetWalletBalanceQuery(library, account, active)

  const useMintToken = useMintTokenMutation(contract, active)

  const { balance = '-' } = useWalletBalance.isSuccess
    ? useWalletBalance.data
    : {}

  const mintToken = () => {
    const tokenURI = `https://chickenrun.io/${uuidv4()}`
    useMintToken.mutate(tokenURI)
  }

  return (
    <Layout>
      {/* Display transaction Toasterd */}
      <TransactionProgress intialOnShow={false} />

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
          {!contract
            ? (
              <span>
              Please connect your wallet, to mint a <ChiknText />.
              </span>
            )
            : (
              <>
                <div>Wallet balance - ${balance}</div>
                <span>
              Click the button below, to mint your <ChiknText />.
                </span>
              </>
            )}
          <Button
            type="button"
            size="lg"
            variant="outline-primary"
            disabled={!contract || useMintToken.isLoading}
            onClick={() => mintToken()}
          >
            {useMintToken.isLoading ? <Spinner animation="border" /> : <span>Mint my {siteConfig.nftName}!</span>}
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

      <Alert variant="warning" className="text-center">
        <h1>N.B. This page will merge with home</h1>
      </Alert>

    </Layout>
  )
}

export default IndexPage
