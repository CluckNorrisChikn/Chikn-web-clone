/* eslint-disable no-unused-vars */
import * as React from 'react'
import { Button, Col, FormControl, InputGroup, Row, Spinner, Alert } from 'react-bootstrap'
import styled from 'styled-components'
import siteConfig from '../../../site-config'
import { ChiknText, fmtCurrency, fmtNumber, Section, StackCol, StyleDaChikn } from '../Common'
import {
  getErrorMessage,
  useGBMintTokenMutation,
  useGetSupplyQuery,
  usePublicMintTokenMutation,
  useWeb3Contract
} from '../Connect'
import TransactionProgress from '../TransactionProgressToast'
import AvaxSvg from '../../images/avalanche-avax-logo.svg'
import { Link } from 'gatsby'

const AvaxLogoImage = styled((props) => <img src={AvaxSvg} {...props} />)`
  width: 30px;
  height: 30px;
  margin-left: 5px;
`

const IndexPage = ({ type = 'public' }) => {
  // hooks
  const { library, contract, account, active } = useWeb3Contract()

  // react-query
  const usePublicMintToken = usePublicMintTokenMutation()
  const useGBMintToken = useGBMintTokenMutation()
  const getSupplyQuery = useGetSupplyQuery()
  const {
    data: {
      minted,
      gbminted,
      publicMintLimit, // e.g. 10,000
      gbMintLimit, // e.g. 900
      publicMintFeex1,
      publicMintOpen,
      gbMintOpen
    } = {}
  } = getSupplyQuery

  // local properties
  const isGBMint = type === 'gb'
  const maxAllocation = isGBMint ? gbMintLimit : publicMintLimit
  const remainingChikn = isGBMint ? gbMintLimit - gbminted : publicMintLimit - minted
  const priceLookup = React.useCallback(
    (count) => {
      console.debug(`checking prices for ${count} chikn`, {
        publicMintFeex1
      })
      if (isGBMint) return 0
      return publicMintFeex1
    },
    [isGBMint, publicMintFeex1]
  )
  const priceConfig = isGBMint ? siteConfig.gbMint : siteConfig.publicMint
  const isMintOpen = (isGBMint ? gbMintOpen : publicMintOpen) && remainingChikn > 0

  // TODO Sam - can we show more information in the notifcication? (current only txid)
  // TODO Sam - do we have options for the 2x and 3x buyer options? (validation: what happens if only <2 is left?)
  // @nick the contract covers that, so dont worry
  const mintToken = () => {
    if (isGBMint) {
      useGBMintToken.mutate()
    } else {
      usePublicMintToken.mutate({ countOfChickens, totalPrice })
    }
  }

  const [countOfChickens, setCountOfChickens] = React.useState(1)
  const [price, setPrice] = React.useState(fmtCurrency(priceLookup(1)))
  const [totalPrice, setTotalPrice] = React.useState(fmtCurrency(priceLookup(1)))

  React.useEffect(() => {
    const price = priceLookup(countOfChickens)
    setPrice(fmtCurrency(price))
    setTotalPrice(fmtCurrency(price * countOfChickens))
  }, [countOfChickens, priceLookup])

  const canGoLower = (count) => parseInt(count) > 1
  const canGoHigher = (count) => parseInt(count) < priceConfig.maxPerMint

  const onChangeCountOfChickens = (val) => {
    let tmp = parseInt(val)
    if (!isNaN(tmp) || val === '') {
      if (val === '') {
        setCountOfChickens('')
        setPrice('-')
        setTotalPrice('-')
        return
      } else if (tmp > priceConfig.maxPerMint) tmp = priceConfig.maxPerMint
      else if (tmp < 1) tmp = 1
      setCountOfChickens(tmp)
      const price = priceLookup(tmp)
      console.debug('setting total price', { tmp, price })
      setPrice(fmtCurrency(price))
      setTotalPrice(fmtCurrency(price * tmp))
    }
  }

  return (
    <>
      {/* notifications */}
      <TransactionProgress />

      <Section className="border bg-white">
        <StackCol className="gap-3 align-items-center">
          {/* spinner */}
          {getSupplyQuery.isLoading && <Spinner size="lg" animation="border" />}

          {/* mint closed */}
          {!getSupplyQuery.isLoading && !isMintOpen && (
            <>
              <h3>{priceConfig.title_closed}</h3>
              <div>
                To buy <ChiknText />, please check the <Link to="/market">Market</Link>.
              </div>
            </>
          )}

          {/* mint open */}
          {!getSupplyQuery.isLoading && isMintOpen && (
            <>
              <h3>{priceConfig.title_open}</h3>
              <div>
                {fmtNumber(remainingChikn)} <ChiknText /> remaining.
              </div>
              {isGBMint && <div>Requires 900 $GB tokens in Wallet</div>}
              <div>
                Select how many <ChiknText /> you want to mint:
              </div>
              <InputGroup size="lg" className="mb-3 w-md-200px">
                <Button
                  variant="outline-secondary"
                  aria-label="Increase count of chickens by 1."
                  disabled={!canGoLower(countOfChickens)}
                  onClick={(e) => onChangeCountOfChickens(parseInt(countOfChickens) - 1)}
                >
                  &minus;
                </Button>
                <FormControl
                  type="number"
                  pattern="[0-9]{1,2}"
                  inputMode="numeric"
                  className="text-center"
                  aria-label="Choose number of Chickens."
                  value={countOfChickens}
                  onChange={(e) => onChangeCountOfChickens(e.target.value)}
                />
                <Button
                  variant="outline-secondary"
                  aria-label="Lower count of chickens by 1."
                  disabled={!canGoHigher(countOfChickens)}
                  onClick={(e) => onChangeCountOfChickens(parseInt(countOfChickens) + 1)}
                >
                  &#43;
                </Button>
              </InputGroup>
              <h3 className="mb-0 pb-0">
                Total: {totalPrice} <AvaxLogoImage /> <small>(+gas)</small>
              </h3>
              <small className="text-muted mb-3">
                ({price}/{siteConfig.nftName})
              </small>
              <Button
                type="button"
                size="lg"
                variant={'outline-primary'}
                disabled={!active || usePublicMintToken.isLoading || useGBMintToken.isLoading}
                onClick={() => mintToken()}
                className={'w-100 mb-3 w-md-300px'}
              >
                {usePublicMintToken.isLoading || useGBMintToken.isLoading
                  ? (
                    <Spinner animation="border" />
                  )
                  : (
                    <span>Mint Now</span>
                  )}
              </Button>

              {/* errors */}
              {usePublicMintToken.isError && (
                <Alert variant={'danger'}>{getErrorMessage(usePublicMintToken.error)}</Alert>
              )}
              {useGBMintToken.isError && <Alert variant={'danger'}>{getErrorMessage(useGBMintToken.error)}</Alert>}
              <small className="text-muted">
                Max {priceConfig.maxPerMint} per mint.
                <br />
                View your minted <ChiknText /> in your <Link to="/wallet">Wallet</Link>.
              </small>
            </>
          )}

          {process.env.NODE_ENV !== 'production' && (
            <>
              <pre>
                state=
                {JSON.stringify(
                  {
                    countOfChickens,
                    price,
                    totalPrice,
                    gbMintOpen,
                    publicMintOpen
                  },
                  null,
                  2
                )}
              </pre>
              <pre>
                data=
                {JSON.stringify(
                  {
                    type,
                    isGBMint,
                    isMintOpen,
                    maxAllocation,
                    remainingChikn,
                    priceConfig
                  },
                  null,
                  2
                )}
              </pre>
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
