import * as React from 'react'
import { Alert, Card, Button, Spinner, Row, Col } from 'react-bootstrap'
import Accordion from 'react-bootstrap/Accordion'
import {
  ChiknText,
  fmtCurrency,
  Section,
  SocialShareLinkButton,
  Stack,
  StackCol,
  StackDynamic,
  StackRow
} from './Common'
import {
  useGetTokenQuery,
  useBuyTokenMutation,
  useWeb3Contract,
  getErrorMessage
} from './Connect'
import styled from 'styled-components'
import AvaxSvg from '../images/avalanche-avax-logo.svg'
import siteConfig from '../../site-config'

/**
 * @typedef {Object} Details
 * @property {string} tokenId // "8",
 * @property {string} mintedBy // "0x20e63CB166a90c22a7afC5623AEE59d8D8988Ec5",
 * @property {string} currentOwner // "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC",
 * @property {boolean} forSale // false,
 * @property {string} perchHeight // "1",
 * @property {number} price // 2.399,
 * @property {number} previousPrice // 2.399,
 * @property {number} numberOfTransfers // 1
 */

/** @type {Details} */
const DETAILS_BLANK = {}

const AvaxLogo = styled((props) => <img src={AvaxSvg} {...props} />)`
  width: ${(props) => props.logoSize || '15px'};
  height: ${(props) => props.logoSize || '15px'};
  margin-left: 5px;
  position: relative;
  top: -2px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.columns || 'auto auto'};
  column-gap: ${(props) => props.columnGap || '10px'};
  row-gap: ${(props) => props.rowGap || '10px'};
`

const Properties = styled.dl`
  font-size: 1rem;
  display: grid;
  grid-template-columns: ${(props) =>
    props.fixed ? '120px auto' : 'auto auto'};
  column-gap: 10px;
  row-gap: 5px;
  margin-bottom: 0px;
  text-transform: capitalize;
  dd {
    margin-bottom: 0px;
    text-align: ${(props) => props.termAlign || 'left'};
  }
  dt {
    font-weight: normal;
    text-align: ${(props) => props.definitionAlign || 'left'};
  }
`

const ChiknCard = styled(({ className = '', onClick = null, ...props }) => (
  <Card
    className={`${className} ${onClick !== null ? 'clickable' : ''}`}
    onClick={onClick}
    {...props}
  />
))`
  max-width: 500px;
  &.clickable {
    transition: all 0.1s ease-in-out;
    cursor: pointer;
  }
  &.clickable:hover {
    transform: scale(1.05);
  }
`

const CardImage = styled((props) => <Card.Img variant="top" {...props} />)`
  max-width: 500px;
  max-height: 500px;
`

const GreyPill = ({ className = '', ...props }) => (
  <span
    className={`${className} px-3 bg-light text-muted border rounded-pill text-nowrap`}
    {...props}
  />
)

const GreenPill = ({ className = '', ...props }) => (
  <span
    className={`${className} px-3 bg-success text-white rounded-pill text-nowrap`}
    {...props}
  />
)

const BluePill = ({ className = '', ...props }) => (
  <span
    className={`${className} px-3 bg-light border text-dark rounded-pill text-nowrap`}
    {...props}
  />
)

const AvaxPill = ({
  className = '',
  children = undefined,
  logoSize,
  ...props
}) => (
  <span
    className={`${className} px-3 bg-light text-dark rounded-pill text-nowrap`}
    {...props}
  >
    {children}
    <AvaxLogo logoSize={logoSize} />
  </span>
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

const RenderOwnedByAddress = ({ address, ...props }) => {
  const { account } = useWeb3Contract()
  return (
    <Property {...props}>
      Owned by{' '}
      {address === account ? 'You' : address ? shortAccount(address) : '-'}
    </Property>
  )
}

const ChickenCardShimmer = () => {
  return (
    <ChiknCard>
      <CardImage className="shimmer" />
      <Card.Body>
        <h3 className="shimmer w-50">&nbsp;</h3>
        <label className="shimmer w-75 mb-1">&nbsp;</label>
        <label className="shimmer w-75 mb-1">&nbsp;</label>
        <label className="shimmer w-75 mb-1">&nbsp;</label>
      </Card.Body>
    </ChiknCard>
  )
}

export const ChickenCardShimmerx4 = () => {
  return (
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
  )
}

export const SaleStatus = ({
  size = 'lg',
  forSale = false,
  isOwner = false
}) => {
  const sizeClass = size === 'lg' ? 'py-2 px-3' : 'py-0 px-0'
  if (isOwner) {
    return <BluePill className={`${sizeClass}`}>Already owned</BluePill>
  } else if (forSale) {
    return <GreenPill className={`${sizeClass}`}>For sale</GreenPill>
  } else {
    return <GreyPill className={`${sizeClass}`}>Not for sale</GreyPill>
  }
}

const ShowHistory = ({ tokenId = '' }) => {
  const getTokenQuery = useGetTokenQuery(tokenId)
  const { data: { details = {} } = {} } = getTokenQuery
  return (
    <>
      <Properties fixed>
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
          <AvaxPill>{fmtCurrency(details.previousPrice)}</AvaxPill>
        </dt>
        <dd>Transfers</dd>
        <dt>{details.numberOfTransfers}</dt>
        <dd>Sale Status</dd>
        <dt>
          <SaleStatus size="sm" forSale={details.forSale} />
        </dt>
        <dd>listing price</dd>
        <dt>
          <AvaxPill>
            {details.forSale ? fmtCurrency(details.price) : '-'}
          </AvaxPill>
        </dt>
      </Properties>
    </>
  )
}

const ShowError = ({ error = {} }) => {
  return (
    <Alert variant="danger" className="mt-4">
      {getErrorMessage(error)}
    </Alert>
  )
}

export const ChickenCardMarketplaceSummary = ({
  tokenId = '',
  onClick = null
}) => {
  const { account } = useWeb3Contract()
  const getTokenQuery = useGetTokenQuery(tokenId)
  const { data: { properties = {}, details = {} } = {} } = getTokenQuery

  const isOwner = details.currentOwner === account
  const showForSale =
    details.forSale === true && details.currentOwner !== account

  return (
    <>
      {getTokenQuery.isLoading && <ChickenCardShimmer />}
      {getTokenQuery.isError && <ShowError error={getTokenQuery.error} />}
      {getTokenQuery.isSuccess && (
        <>
          <ChiknCard onClick={onClick}>
            <CardImage src={properties.image} />
            <Card.Body>
              <StackCol className="gap-2 justify-content-between">
                <h6 className="p-0">
                  <ChiknText /> #{tokenId}
                </h6>
                <SaleStatus
                  size="sm"
                  forSale={details.forSale}
                  isOwner={isOwner}
                />
                {showForSale && (
                  <Properties definitionAlign="right">
                    <dd>price</dd>
                    <dt>
                      <AvaxPill>{fmtCurrency(details.price)}</AvaxPill>
                    </dt>
                    <dd>last price</dd>
                    <dt>
                      <AvaxPill>{fmtCurrency(details.previousPrice)}</AvaxPill>
                    </dt>
                  </Properties>
                )}
              </StackCol>
            </Card.Body>
          </ChiknCard>
        </>
      )}
    </>
  )
}

export const ChickenCardWalletSummary = ({ tokenId = '', onClick = null }) => {
  const getTokenQuery = useGetTokenQuery(tokenId)
  const { data: { properties = {}, details = {} } = {} } = getTokenQuery
  return (
    <>
      {getTokenQuery.isLoading && <ChickenCardShimmer />}
      {getTokenQuery.isError && <ShowError error={getTokenQuery.error} />}
      {getTokenQuery.isSuccess && (
        <>
          <ChiknCard onClick={onClick}>
            <CardImage src={properties.image} />
            <Card.Body>
              <StackCol className="justify-content-between">
                <h6>
                  <ChiknText /> #{tokenId}
                </h6>
                <SaleStatus size="sm" forSale={details.forSale} />
              </StackCol>
            </Card.Body>
          </ChiknCard>
        </>
      )}
    </>
  )
}

export const ChickenCardRecentActivitySummary = ({
  tokenId = '',
  from = '',
  to = '',
  onClick = null
}) => {
  const MINTED_FROM_ADDRESS = '0x0000000000000000000000000000000000000000'
  /** @type {{ data: { details: Details }}} */
  const getTokenQuery = useGetTokenQuery(tokenId)
  const { data: { properties = {}, details = DETAILS_BLANK } = {} } =
    getTokenQuery
  return (
    <>
      {getTokenQuery.isLoading && <ChickenCardShimmer />}
      {getTokenQuery.isError && <ShowError error={getTokenQuery.error} />}
      {getTokenQuery.isSuccess && (
        <>
          <ChiknCard onClick={onClick}>
            <CardImage src={properties.image} />
            <Card.Body>
              <StackCol className="gap-2">
                <h6>
                  <ChiknText /> #{tokenId}
                </h6>
                {/* TODO what about listed forsale events... do they come through? */}
                {from === MINTED_FROM_ADDRESS
                  ? (
                    <GreyPill>Minted</GreyPill>
                  )
                  : (
                    <>
                      <GreenPill>Sold</GreenPill>
                      <Properties definitionAlign="right">
                        <dd>price</dd>
                        <dt>
                          <AvaxPill>{fmtCurrency(details.price)}</AvaxPill>
                        </dt>
                      </Properties>
                    </>
                  )}
              </StackCol>
            </Card.Body>
          </ChiknCard>
        </>
      )}
    </>
  )
}

const ChickenImage = styled.img`
  width: 100%;
  border-radius: 15px;
`

const Property = styled(({ className = 'bg-light text-dark', ...props }) => (
  <small
    className={`${className} px-3 border rounded-3 text-nowrap text-capitalize`}
    {...props}
  />
))`
  // background: purple;
`

const MenuButton = styled(Button)`
  min-width: 200px !important;
  padding-left: 30px !important;
  padding-right: 30px !important;
`

/**
 * Displays the marketplace card.
 */
// const MarketPlaceSummary = ({ tokenId = '' }) => {
//   const getTokenQuery = useGetTokenQuery(tokenId)
//   const { data: { details = {} } = {} } = getTokenQuery
//   const { contract, active, account } = useWeb3Contract()
//   // const useBuyToken = useBuyTokenMutation(contract, active)

//   // const buyNow = () => {
//   //   useBuyToken.mutate({ tokenId, salePrice: details.price })
//   // }
//   // const showForSale =
//   //   details.forSale === true && details.currentOwner !== account
//   return (
//     <>
//       <h6 className="p-0">
//         <ChiknText /> #{tokenId}
//       </h6>
//       <SaleStatus size="sm" forSale={details.forSale} />
//       {showForSale && (
//         <Properties>
//           <dd>listing price</dd>
//           <dt>
//             <AvaxPill>{fmtCurrency(details.price)}</AvaxPill>
//           </dt>
//           <dd>last price</dd>
//           <dt>
//             <AvaxPill>{fmtCurrency(details.previousPrice)}</AvaxPill>
//           </dt>
//         </Properties>
//       )}
//       {/* {showForSale
//         ? (
//           <Button
//             className="rounded-pill py-1"
//             variant="outline-primary"
//             disabled={useBuyToken.isLoading}
//             onClick={() => buyNow()}
//           >
//             {useBuyToken.isLoading
//               ? (
//                 <Spinner size="sm" animation="border" />
//               )
//               : (
//                 'Purchase'
//               )}
//           </Button>
//         )
//         : (
//           <SaleStatus forSale={details.forSale} />
//         )} */}
//     </>
//   )
// }

export const ChickenCardOwnerDetails = ({ tokenId = '' }) => {
  const { active, account } = useWeb3Contract()
  /** @type {{ data: { details: Details }}} */
  const getTokenQuery = useGetTokenQuery(tokenId)
  const { data: { properties = {}, details = DETAILS_BLANK } = {} } =
    getTokenQuery
  const isOwner = details.currentOwner === account
  const isForSale = details.forSale
  return (
    <>
      {getTokenQuery.isLoading && <ChickenCardShimmer />}
      {getTokenQuery.isError && <ShowError error={getTokenQuery.error} />}
      {getTokenQuery.isSuccess && (
        <Section className="bg-white border" center={false}>
          <StackDynamic className="gap-5 flex-grow-1">
            <div>
              <ChickenImage src={properties.image} />
            </div>
            <StackCol className="w-exact60pc gap-4">
              <StackRow className="justify-content-between">
                {/* title */}
                <h5>
                  <ChiknText /> #{tokenId}
                </h5>

                {/* social */}
                <SocialShareLinkButton
                  title={`${siteConfig.nftName} #${tokenId}`}
                  text={siteConfig.description}
                  url={window.location.toString()}
                />
              </StackRow>

              {/* actions */}
              <StackDynamic className="gap-1 flex-wrap">
                {!isOwner && !isForSale && (
                  <SaleStatus forSale={details.forSale} />
                )}
                {!active && isForSale && (
                  <GreyPill className="py-2 border">
                    Connect wallet to buy
                  </GreyPill>
                )}
                {active && !isOwner && isForSale && (
                  <MenuButton disabled>Purchase</MenuButton>
                )}
                {isOwner && !isForSale && (
                  <MenuButton disabled>Sell</MenuButton>
                )}
                {isOwner && isForSale && (
                  <MenuButton disabled>Lower price</MenuButton>
                )}
                {isOwner && isForSale && (
                  <MenuButton disabled>Cancel listing</MenuButton>
                )}
              </StackDynamic>

              {/* price */}
              {isForSale && (
                <div>
                  <AvaxPill className="fs-4" logoSize="22px">
                    {fmtCurrency(details.price)}
                  </AvaxPill>
                </div>
              )}

              {/* blurb */}
              <i className="text-dark">
                10,000 <b>chikn</b> have flown the coop in search of owners!
                These are no ordinary <b>chikn</b>. Some are dapper, some are
                degen, others are made of the rarest materials known to
                chikn-kind - but one thing&apos;s for sure - ALL <b>chikn</b>{' '}
                lay <b>$egg</b>.
              </i>

              <Accordion defaultActiveKey="0" flush>
                {/* attributes */}
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Attributes</Accordion.Header>
                  <Accordion.Body>
                    <StackRow className="gap-1 flex-wrap">
                      {'background,chicken,headwear,mouth,eyewear,neck,arms,tail,feet'
                        .split(',')
                        .map((p) => {
                          return (
                            <Property key={p}>
                              {p} : {properties[p]}
                            </Property>
                          )
                        })}
                    </StackRow>
                  </Accordion.Body>
                </Accordion.Item>
                {/* history */}
                <Accordion.Item eventKey="1">
                  <Accordion.Header>History</Accordion.Header>
                  <Accordion.Body>
                    <ShowHistory tokenId={tokenId} />
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </StackCol>
          </StackDynamic>
        </Section>
      )}
    </>
  )
}
