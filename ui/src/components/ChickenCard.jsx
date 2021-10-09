import * as React from 'react'
import { Alert, Card, Button, Spinner } from 'react-bootstrap'
import { ChiknText, fmtCurrency, Stack } from './Common'
import {
  useGetTokenQuery,
  useBuyTokenMutation,
  useWeb3Contract,
  getErrorMessage
} from './Connect'
import styled from 'styled-components'
import AvaxSvg from '../images/avalanche-avax-logo.svg'

const AvaxLogo = styled((props) => <img src={AvaxSvg} {...props} />)`
  width: 15px;
  height: 15px;
  margin-left: 5px;
  position: relative;
  top: -2px;
`

const Properties = styled.dl`
  font-size: 1rem;
  display: grid;
  grid-template-columns: 120px auto;
  column-gap: 10px;
  row-gap: 5px;
  margin-bottom: 0px;
  text-transform: capitalize;
  dd {
    margin-bottom: 0px;
  }
  dt {
    font-weight: normal;
  }
`

const ChiknCard = styled(Card)`
  max-width: 500px;
  &.clickable {
    transition: all 0.1s ease-in-out;
    cursor: pointer;
  }
  &.clickable:hover {
    transform: scale(1.05);
  }
`

const Image = styled((props) => <Card.Img variant="top" {...props} />)`
  max-width: 500px;
  max-height: 500px;
`

const GreyPill = ({ className = '', ...props }) => (
  <span
    className={`${className} px-3 bg-light text-dark rounded-pill text-nowrap`}
    {...props}
  />
)

const GreenPill = ({ className = '', ...props }) => (
  <span
    className={`${className} px-3 bg-success text-white rounded-pill text-nowrap`}
    {...props}
  />
)

const shortAccount = (acct) => {
  const firstHalf = acct.substring(0, 4)
  const lastHalf = acct.substring(38)
  return `${firstHalf}...${lastHalf}`
}

const PropertyColour = ({ children }) => {
  const pv = children.toLowerCase()
  if (pv === 'none') return <span className="text-black-50">{children}</span>
  else return <span>{children}</span>
}

const RenderAddress = ({ address }) => {
  const { account } = useWeb3Contract()
  return (
    <GreyPill>
      {address === account ? 'You' : address ? shortAccount(address) : '-'}
    </GreyPill>
  )
}

export const ChickenCardShimmer = () => {
  return (
    <ChiknCard>
      <Image className="shimmer" />
      <Card.Body>
        <h3 className="shimmer w-50">&nbsp;</h3>
        <label className="shimmer w-75 mb-1">&nbsp;</label>
        <label className="shimmer w-75 mb-1">&nbsp;</label>
        <label className="shimmer w-75 mb-1">&nbsp;</label>
      </Card.Body>
    </ChiknCard>
  )
}

export const SaleStatus = ({ size = 'lg', forSale = false }) => {
  const sizeClass = size === 'lg' ? 'py-2 px-3' : 'py-0 px-0'
  if (forSale) {
    return <GreenPill className={sizeClass}>For sale</GreenPill>
  } else {
    return <GreyPill className={sizeClass}>Not for sale</GreyPill>
  }
}

/**
 * Displays the marketplace card.
 */
const MarketPlaceContent = ({ details, tokenId }) => {
  const { contract, active, account } = useWeb3Contract()
  const useBuyToken = useBuyTokenMutation(contract, active)

  const buyNow = () => {
    useBuyToken.mutate({ tokenId, salePrice: details.price })
  }
  const showForSale =
    details.forSale === true && details.currentOwner !== account
  return (
    <>
      <h6 className="p-0">
        <ChiknText /> #{tokenId}
      </h6>
      {showForSale && (
        <Properties>
          <dd>listing price</dd>
          <dt>
            <GreyPill>
              {fmtCurrency(details.price)}
              <AvaxLogo />
            </GreyPill>
          </dt>
          <dd>last price</dd>
          <dt>
            <GreyPill>
              {fmtCurrency(details.previousPrice)}
              <AvaxLogo />
            </GreyPill>
          </dt>
        </Properties>
      )}
      {showForSale
        ? (
          <Button
            className="rounded-pill py-1"
            variant="outline-primary"
            disabled={useBuyToken.isLoading}
            onClick={() => buyNow()}
          >
            {useBuyToken.isLoading
              ? (
                <Spinner size="sm" animation="border" />
              )
              : (
                'Purchase'
              )}
          </Button>
        )
        : (
          <SaleStatus forSale={details.forSale} />
        )}
    </>
  )
}

const ChickenCard = ({
  tokenId,
  size = 'lg',
  onClick = null,
  marketPlace = false
}) => {
  const getTokenQuery = useGetTokenQuery(tokenId)
  const { data: { properties = {}, details = {} } = {} } = getTokenQuery

  return (
    <>
      {getTokenQuery.isLoading && <ChickenCardShimmer />}
      {getTokenQuery.isError && (
        <Alert variant="danger" className="mt-4">
          {getErrorMessage(getTokenQuery.error)}
        </Alert>
      )}
      {getTokenQuery.isSuccess && (
        <>
          <ChiknCard
            className={onClick !== null ? 'clickable' : ''}
            onClick={onClick}
          >
            <Image src={properties.image} />
            <Card.Body>
              <Stack
                direction={size === 'sm' ? 'col' : 'row'}
                className="justify-content-between"
              >
                {marketPlace
                  ? (
                    <MarketPlaceContent details={details} tokenId={tokenId} />
                  )
                  : (
                    <>
                      <h6>
                        <ChiknText /> #{tokenId}
                      </h6>
                      <SaleStatus forSale={details.forSale} />
                    </>
                  )}
              </Stack>

              {size !== 'sm' && (
                <>
                  <h5 className="mt-4 mb-3">Properties</h5>
                  <Properties>
                    {'background,chicken,headwear,mouth,eyewear,neck,arms,tail,feet'
                      .split(',')
                      .map((property) => {
                        return (
                          <>
                            <dd>{property}</dd>
                            <dt>
                              <PropertyColour>
                                {properties[property]}
                              </PropertyColour>
                            </dt>
                          </>
                        )
                      })}
                  </Properties>

                  <h5 className="mt-4 mb-3">History</h5>
                  <Properties>
                    <dd>mintedBy</dd>
                    <dt>
                      <RenderAddress address={details.mintedBy} />
                    </dt>
                    <dd>currentOwner</dd>
                    <dt>
                      <RenderAddress address={details.currentOwner} />
                    </dt>
                    <dd>last price</dd>
                    <dt>
                      <GreyPill>
                        {fmtCurrency(details.previousPrice)}
                        <AvaxLogo />
                      </GreyPill>
                    </dt>
                    <dd>Transfers</dd>
                    <dt>{details.numberOfTransfers}</dt>
                    <dd>Sale Status</dd>
                    <dt>
                      <SaleStatus size="sm" forSale={details.forSale} />
                    </dt>
                    <dd>listing price</dd>
                    <dt>
                      <GreyPill>
                        {details.forSale ? fmtCurrency(details.price) : '-'}
                        <AvaxLogo />
                      </GreyPill>
                    </dt>
                  </Properties>
                </>
              )}
            </Card.Body>
          </ChiknCard>
        </>
      )}
    </>
  )
}

export default ChickenCard
