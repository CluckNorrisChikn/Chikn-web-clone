/* eslint-disable no-unused-vars */
import * as React from 'react'
import { Button, Col, Row, Spinner } from 'react-bootstrap'
import styled from 'styled-components'
import siteConfig from '../../../site-config'
import {
  ChiknText,
  fmtCurrency,
  fmtNumber,
  Section,
  StackCol,
  StyleDaChikn
} from '../Common'
import {
  useGetSupplyQuery,
  useMintTokenMutation,
  useWeb3Contract
} from '../Connect'
import TransactionProgress from '../TransactionProgressToast'
import AvaxSvg from '../../images/avalanche-avax-logo.svg'
import { Link } from 'gatsby'

const AvaxLogoImage = styled((props) => <img src={AvaxSvg} {...props} />)`
  width: 20px;
  height: 20px;
  margin-left: 10px;
`

const IndexPage = () => {
  const { library, contract, account, active } = useWeb3Contract()

  const getSupplyQuery = useGetSupplyQuery()
  const { data: { minted, total } = {} } = getSupplyQuery
  const remainingChikn = total - minted
  // const useWalletBalance = useGetWalletBalanceQuery(library, account, active)

  const useMintToken = useMintTokenMutation(contract, active)

  // TODO Sam - Do we want to show the user's balance? (Sam raised -> security?)
  // const { balance = '-' } = useWalletBalance.isSuccess
  //   ? useWalletBalance.data
  //   : {}

  // TODO Sam - can we show validation failed notifcation? (e.g. when user rejects transaction)
  // TODO Sam - can we show more information in the notifcication? (current only txid)
  // TODO Sam - do we have options for the 2x and 3x buyer options? (validation: what happens if only <2 is left?)
  const mintToken = () => {
    // TODO Sam - is this URL still correct/required? Can we remove it?
    const tokenURI = `${siteConfig.url}/api/contract/tokens/1`
    useMintToken.mutate(tokenURI)
  }

  return (
    <>
      {/* notifications */}
      <TransactionProgress />

      <Section className="border">
        <StackCol className="gap-3">
          {remainingChikn <= 0 && (
            <>
              <h3>Minting now closed.</h3>
              <div>
                To buy <ChiknText />, please check the{' '}
                <Link to="/market">Market</Link>.
              </div>
            </>
          )}
          {remainingChikn > 0 && (
            <>
              <h3>Minting now open!</h3>
              <div>
                {fmtNumber(remainingChikn)} <ChiknText /> remaining.
              </div>
              <div>Choose from three options:</div>
              <Row sm={1} md={3} className="mb-3 text-center">
                {siteConfig.pricing.map(
                  ({
                    label,
                    price,
                    description,
                    requiredRemaining = 1,
                    highlight = false
                  }) => {
                    return (
                      <Col
                        key={label}
                        className={
                          requiredRemaining > remainingChikn ? 'opacity-50' : ''
                        }
                      >
                        <div
                          className={`card mb-4 rounded-3 shadow-sm ${
                            highlight ? 'border-primary' : ''
                          }`}
                        >
                          <div
                            className={`card-header py-3 ${
                              highlight
                                ? 'bg-primary text-white border-primary'
                                : ''
                            }`}
                          >
                            <h4 className="my-0 fw-normal">{label}</h4>
                          </div>
                          <div className="card-body">
                            <h1 className="card-title pricing-card-title">
                              {fmtCurrency(price)}
                              <AvaxLogoImage />
                            </h1>
                            <ul className="list-unstyled mt-3 mb-4">
                              <li className="px-md-5">
                                <StyleDaChikn>{description}</StyleDaChikn>
                              </li>
                            </ul>
                            <Button
                              type="button"
                              size="lg"
                              variant={
                                highlight ? 'primary' : 'outline-primary'
                              }
                              disabled={
                                !active ||
                                requiredRemaining > remainingChikn ||
                                useMintToken.isLoading
                              }
                              onClick={() => mintToken()}
                              className={'w-100'}
                            >
                              {useMintToken.isLoading
                                ? (
                                  <Spinner animation="border" />
                                )
                                : (
                                  <span>Mint {label}</span>
                                )}
                            </Button>
                          </div>
                        </div>
                      </Col>
                    )
                  }
                )}
              </Row>
              <small className="text-muted">
                Limited to 50 <ChiknText /> per Wallet.
                <br />
                View your minted <ChiknText /> in your{' '}
                <Link to="/wallet">Wallet</Link>.
              </small>
            </>
          )}
        </StackCol>
      </Section>
    </>
  )
}

// {/* ? ( ) : (
//     <>
//       <div>
//         Wallet balance - {fmtCurrency(balance)}
//         <AvaxLogoImage />
//       </div>
//       <span>
//         Click the button below, to mint your <ChiknText />.
//       </span>
//     </>
//     )} */}
// {/* <div>Number of tokens you currently own: {tokenOwnByUser}</div> */}
// {/* <form onSubmit={mintToken}> */}
// {/* </form> */}
// {/* <div>
//     {tokens.map((t, inx) => {
//       return <div key={inx}>Token: {JSON.stringify(t)}</div>
//     })}
//   </div> */}
// {/* {ownerTokenList.map((t, inx) => {
//       return <div key={inx}>Token: {t}</div>
//     })} */}

export default IndexPage
