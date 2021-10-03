import * as React from 'react'
import { Alert, Card } from 'react-bootstrap'
import { ChiknText, Stack, StackCol, StackRow } from './Common'
import { useGetTokenQuery, useGetUserWalletAddressQuery } from './Connect'
import styled from 'styled-components'
import AvaxSvg from '../images/avalanche-avax-logo.svg'

const AvaxLogo = styled((props) => <img src={AvaxSvg} {...props} />)`
  width: 15px;
  height: 15px;
  margin-left: 5px;
  position: relative;
  top: -1px;
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

const GreyPill = styled(({ className = '', ...props }) => (
  <span
    className={`${className} px-3 bg-light text-dark rounded-pill`}
    {...props}
  />
))``

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
  const getUserWalletAddressQuery = useGetUserWalletAddressQuery()
  const { data: { user: { address: myAddress = '-' } = {} } = {} } =
    getUserWalletAddressQuery
  return (
    <GreyPill>{address === myAddress ? 'You' : shortAccount(address)}</GreyPill>
  )
}

const ChickenCard = ({ tokenId, size = 'lg', onClick = null }) => {
  const getTokenQuery = useGetTokenQuery(tokenId)
  const { data: { properties = {}, details = {} } = {} } = getTokenQuery

  return (
    <>
      {getTokenQuery.isLoading && (
        <ChiknCard>
          <Image className="shimmer" />
          <Card.Body>
            <h3 className="shimmer w-50">&nbsp;</h3>
            <label className="shimmer w-75 mb-1">&nbsp;</label>
            <label className="shimmer w-75 mb-1">&nbsp;</label>
            <label className="shimmer w-75 mb-1">&nbsp;</label>
          </Card.Body>
        </ChiknCard>
      )}
      {getTokenQuery.isError && (
        <Alert variant="danger">
          {getTokenQuery.error.response
            ? getTokenQuery.error.response.data.message
            : getTokenQuery.error.message}
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
                <h5>
                  <ChiknText /> #{tokenId}
                </h5>
                <div>
                  <GreyPill className="py-2 px-3">Not for sale</GreyPill>
                </div>
              </Stack>

              {size !== 'sm' && (
                <>
                  <h5 className="mt-4 mb-3" visible={false}>
                    Properties
                  </h5>
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
                    <dd>previousOwner</dd>
                    <dt>
                      <RenderAddress address={details.previousOwner} />
                    </dt>
                    <dd>price</dd>
                    <dt>
                      <GreyPill>
                        {details.price.toLocaleString()}
                        <AvaxLogo />
                      </GreyPill>
                    </dt>
                    {/* <dd>Transfers</dd>
                <dt>{details.numberOfTransfers}</dt> */}
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
