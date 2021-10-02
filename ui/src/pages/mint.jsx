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
import { Alert, Button, Card, Spinner, Table } from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid'
import styled from 'styled-components'
import siteConfig from '../../site-config'
import {
  useGetContractMaxSupplyQuery,
  useGetContractCurrentSupplyQuery,
  useGetContractQuery,
  useGetWalletTokensQuer,
  useGetWalletTokensQuery,
  useGetWalletBalanceQuery,
  useMintTokenMutation
} from '../components/Connect'

const ChickenCard = styled(({ className = '', ...props }) => (
  <Card className={`${className} rounded-3 shadow`} {...props} />
))`
  max-width: 300px;
`

const isBrowser = typeof window !== 'undefined'

const IndexPage = () => {
  const useTotalSupply = useGetContractMaxSupplyQuery()
  const useCurrentSupply = useGetContractCurrentSupplyQuery()
  const useWalletBalance = useGetWalletBalanceQuery()
  const useContract = useGetContractQuery()
  const useWalletTokens = useGetWalletTokensQuery()
  const useMintToken = useMintTokenMutation()

  const { contractDetail = {} } = useContract.isSuccess ? useContract.data : {}
  const { tokens = [] } = useWalletTokens.isSuccess ? useWalletTokens.data : {}
  const { balance = '-' } = useWalletBalance.isSuccess ? useWalletBalance.data : {}

  console.log('token', tokens, balance)
  const mintToken = () => {
    const tokenURI = `https://chickenrun.io/${uuidv4()}`
    useMintToken.mutate(tokenURI)
  }

  return (
    <Layout>
      <h1>Mint</h1>

      <Section className="bg-light">
        <h3>
          <ChiknText /> Minted: {useCurrentSupply.isSuccess ? useCurrentSupply.data.currentSupply : '-'} / {useTotalSupply.isSuccess ? useTotalSupply.data.totalSupply : '-'}
        </h3>
      </Section>

      <Section className="border">
        <StackCol className="gap-3">
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

      <h3>
        {contractDetail.name} w({contractDetail.symbol} {contractDetail.address})
      </h3>

      <h5>
          Current wallet balance: {balance}
      </h5>

      <Section className="border">
        <StackRow>
          {tokens.length === 0 && <h5>No token in your wallet</h5>}
          {tokens.map((token, i) => {
            return (
              <ChickenCard key={i}>
                <Card.Img
                  variant="top"
                  src={'/images/3fe19ff5-469c-4f90-b760-477b852d2617.png'}
                />
                <Card.Body>
                  <Card.Title>#{token.tokenId}</Card.Title>

                  <h5>Traits (TBD)</h5>
                  <Table>
                    <tr>
                      <th>For Sale</th>
                      <td>{token.forSale ? 'Yes' : 'No'}</td>
                    </tr>
                    <tr>
                      <th>Last Sale Price</th>
                      <td>
                        {(
                          parseInt(token.price) / 1000000000000000000
                        ).toLocaleString()}{' '}
                          AVAX
                      </td>
                    </tr>
                    {/* <tr>
                        <th>Current Owner</th>
                        <td>$11</td>
                      </tr> */}
                    <tr>
                      <th>Number of Sales</th>
                      <td>
                        {parseInt(token.numberOfTransfers).toLocaleString()}
                      </td>
                    </tr>
                  </Table>

                </Card.Body>
              </ChickenCard>
            )
          })}
        </StackRow>
      </Section>

    </Layout>
  )
}

export default IndexPage
