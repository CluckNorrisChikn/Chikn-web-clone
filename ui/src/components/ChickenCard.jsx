import * as React from 'react'
import {
  Alert,
  Card,
  Button,
  Spinner,
  Row,
  Col,
  Modal,
  Form,
  ToggleButtonGroup,
  ToggleButton,
  ButtonGroup,
  Badge
} from 'react-bootstrap'
import Accordion from 'react-bootstrap/Accordion'
import {
  ChiknText,
  fmtCurrency,
  LinkButton,
  RefreshButton,
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
  useGetWeb3TokenDetail,
  useWeb3Contract,
  getErrorMessage,
  KEYS,
  useGetSupplyQuery
} from './Connect'
import styled from 'styled-components'
import AvaxSvg from '../images/avalanche-avax-logo.svg'
import siteConfig from '../../site-config'
import EditListingModal from './modals/EditListingModal'
import { useQueryClient } from 'react-query'
import ChickenUnrevealedImage from '../images/chicken_unrevealed.jpg'
import metadata from '../components/traits/metadata.json'

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

const AvaxLogo = styled(({ logoSize = '15px', ...props }) => (
  <img src={AvaxSvg} logosize={logoSize} {...props} />
))`
  width: ${(props) => props.logosize || '15px'};
  height: ${(props) => props.logosize || '15px'};
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

export const GreyPill = ({ className = '', ...props }) => (
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

export const AvaxPill = ({
  className = '',
  children = undefined,
  logoSize,
  ...props
}) => (
  <span
    className={`${className} px-3 bg-light text-dark rounded-pill text-nowrap`}
    {...props}
  >
    {typeof children === 'string' && children.length > 15
      ? `${children.substring(0, 15)}…`
      : children}
    <AvaxLogo logoSize={logoSize} />
  </span>
)

export const ConnectWalletPrompt = () => <GreyPill>Connect wallet</GreyPill>
export const ConnectWalletPromptText = () => (
  <i className="text-muted">Connect wallet to view</i>
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
  isOwner = false,
  owner = ''
}) => {
  const sizeClass = size === 'lg' ? 'py-2 px-3' : 'py-0 px-0'
  if (owner === '') {
    return <GreyPill className={`${sizeClass}`}>Connect wallet</GreyPill>
  } else if (owner === MINTED_FROM_ADDRESS) {
    return <GreenPill className={`${sizeClass}`}>Unminted</GreenPill>
  } else if (isOwner) {
    return <BluePill className={`${sizeClass}`}>Already owned</BluePill>
  } else if (forSale === true) {
    return <GreenPill className={`${sizeClass}`}>For sale</GreenPill>
  } else if (forSale === false) {
    return <GreyPill className={`${sizeClass}`}>Not for sale</GreyPill>
  } else {
    return <GreyPill className={`${sizeClass}`}>-</GreyPill>
  }
}

const ShowHistory = ({ tokenId = '' }) => {
  const { active, contract } = useWeb3Contract()
  const getWeb3TokenDetail = useGetWeb3TokenDetail(contract, active, tokenId)
  const { data: details = DETAILS_BLANK } = getWeb3TokenDetail
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
          <SaleStatus
            size="sm"
            forSale={details.forSale}
            owner={details.currentOwner}
          />
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
  const { deactivate } = useWeb3Contract()
  return (
    <Alert variant="danger" className="mt-4">
      {getErrorMessage(error, deactivate)}
    </Alert>
  )
}

export const ChickenCardMarketplaceSummary = ({
  tokenId = '',
  onClick = null
}) => {
  const { contract, active, account } = useWeb3Contract()
  const getTokenQuery = useGetTokenQuery(tokenId)
  const { data: { minted } = {} } = useGetSupplyQuery()
  const isRevealed = tokenId <= minted
  const { data: { properties = {} } = {} } = getTokenQuery
  const getWeb3TokenDetail = useGetWeb3TokenDetail(contract, active, tokenId)
  const { data: details = DETAILS_BLANK } = getWeb3TokenDetail
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
            <CardImage
              src={isRevealed ? properties.image : ChickenUnrevealedImage}
            />
            <Card.Body>
              <StackCol className="gap-2 justify-content-between">
                <h6 className="p-0 mb-0">
                  <ChiknText /> #{tokenId}
                </h6>
                <small className="text-muted">
                  Rank: {properties.rank.toLocaleString()}
                </small>
                <SaleStatus
                  size="sm"
                  forSale={details.forSale}
                  isOwner={isOwner}
                  owner={details.currentOwner}
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
  const { data: { properties = {} } = {} } = getTokenQuery

  // use the token detail from web3 for real time data
  const { active, contract } = useWeb3Contract()
  const getWeb3TokenDetail = useGetWeb3TokenDetail(contract, active, tokenId)
  const { data: { forSale = false, currentOwner } = {} } = getWeb3TokenDetail
  const { data: { minted } = {} } = useGetSupplyQuery()
  const isRevealed = tokenId <= minted
  return (
    <>
      {getTokenQuery.isLoading && <ChickenCardShimmer />}
      {getTokenQuery.isError && <ShowError error={getTokenQuery.error} />}
      {getTokenQuery.isSuccess && (
        <>
          <ChiknCard onClick={onClick}>
            <CardImage
              src={isRevealed ? properties.image : ChickenUnrevealedImage}
            />
            <Card.Body>
              <StackCol className="justify-content-between gap-2">
                <h6 className="mb-0">
                  <ChiknText /> #{tokenId}
                </h6>
                <small className="text-muted">
                  Rank: {properties.rank.toLocaleString()}
                </small>
                <SaleStatus size="sm" forSale={forSale} owner={currentOwner} />
              </StackCol>
            </Card.Body>
          </ChiknCard>
        </>
      )}
    </>
  )
}

const MINTED_FROM_ADDRESS = '0x0000000000000000000000000000000000000000'

export const ChickenCardRecentActivitySummary = ({
  tokenId = '',
  from = '',
  to = '',
  onClick = null
}) => {
  /** @type {{ data: { details: Details }}} */
  const getTokenQuery = useGetTokenQuery(tokenId)
  const { data: { properties = {}, details = DETAILS_BLANK } = {} } =
    getTokenQuery
  const { data: { minted } = {} } = useGetSupplyQuery()
  const isRevealed = tokenId <= minted
  return (
    <>
      {getTokenQuery.isLoading && <ChickenCardShimmer />}
      {getTokenQuery.isError && <ShowError error={getTokenQuery.error} />}
      {getTokenQuery.isSuccess && (
        <>
          <ChiknCard onClick={onClick}>
            <CardImage
              src={isRevealed ? properties.image : ChickenUnrevealedImage}
            />
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

const Property = (props) => {
  const {
    layer = 'None',
    trait = 'None',
    percentage = 0,
    className = '',
    ...otherProps
  } = props

  // NOTE head = x4
  const percent = layer === 'head' ? percentage * 3 : percentage

  const background =
    percent <= 0.0009 // unique (red)
      ? 'primary'
      : percent <= 0.0128 // legendary (orange)
        ? 'warning'
        : percent <= 0.0394 // epic (green)
          ? 'success'
          : percent <= 0.2558 // uncommon (blue)
            ? 'info'
            : 'secondary' // common (grey)

  return (
    <div
      className={`${className} px-3 py-2 rounded-3 text-nowrap border text-dark text-capitalize d-flex flex-row justify-content-between align-items-center`}
      {...otherProps}
    >
      <span>
        <b>{layer}</b>: {trait}
      </span>
      <Badge bg={background} className="px-3 py-2">
        {(percent * 100).toFixed(2)}%
      </Badge>
    </div>
  )
}

const MenuButton = styled(Button)`
  min-width: 200px !important;
  padding-left: 30px !important;
  padding-right: 30px !important;
`

/**
 * Chicken Details page - this is where all actions happen, your view will change based on sell state, and ownership, and marketplace view.
 * @param {*} param0
 * @returns
 */
export const ChickenCardDetails = ({ tokenId = '' }) => {
  const queryClient = useQueryClient()
  const { active, account, contract } = useWeb3Contract()
  /** @type {{ data: { details: Details }}} */
  const getTokenQuery = useGetTokenQuery(tokenId)
  const { data: { properties = {} } = {} } = getTokenQuery
  const { data: { minted } = {} } = useGetSupplyQuery()
  const isRevealed = tokenId <= minted
  const getWeb3TokenDetail = useGetWeb3TokenDetail(contract, active, tokenId)
  const { data: details = DETAILS_BLANK } = getWeb3TokenDetail
  const isOwner = details.currentOwner === account
  const isForSale = details.forSale

  const [showModal, setShowModal] = React.useState(false)

  const useBuyToken = useBuyTokenMutation(contract, active)

  const buyToken = () => {
    useBuyToken.mutate({ tokenId, salePrice: details.price })
  }

  const refreshPage = () => {
    queryClient.invalidateQueries(KEYS.CONTRACT_TOKEN(tokenId))
    queryClient.invalidateQueries(KEYS.TOKEN(tokenId))
  }

  return (
    <>
      {/* modal */}
      <EditListingModal
        showModal={showModal}
        setShowModal={() => setShowModal(false)}
        tokenId={tokenId}
        enableListing={isForSale}
        listingPrice={details.price}
      />

      {getTokenQuery.isLoading && <ChickenCardShimmer />}
      {getTokenQuery.isError && <ShowError error={getTokenQuery.error} />}
      {getTokenQuery.isSuccess && (
        <Section className="bg-white border" center={false}>
          <StackDynamic className="gap-5 flex-grow-1">
            <div>
              <ChickenImage
                src={isRevealed ? properties.image : ChickenUnrevealedImage}
              />
            </div>
            <StackCol className="w-exact60pc gap-4">
              <StackRow className="justify-content-between">
                {/* title */}
                <h5>
                  <ChiknText /> #{tokenId}
                </h5>

                {/* social */}
                <ButtonGroup>
                  {isRevealed && (
                    <SocialShareLinkButton
                      title={`${siteConfig.nftName} #${tokenId}`}
                      text={siteConfig.description}
                      url={window.location.toString()}
                    />
                  )}
                  {isRevealed && (
                    <LinkButton
                      href={properties.image}
                      tooltip="Download image"
                    />
                  )}
                  <RefreshButton onClick={refreshPage} />
                </ButtonGroup>
              </StackRow>

              {/* Rank */}
              <div className="text-muted">
                Rank: {properties.rank.toLocaleString()}
              </div>

              {/* actions */}
              <StackDynamic className="gap-1 flex-wrap">
                {active && ( // !isOwner && !isForSale &&
                  <SaleStatus
                    forSale={details.forSale}
                    owner={details.currentOwner}
                  />
                )}
                {!active && (
                  <GreyPill className="py-2 border">
                    Connect wallet to buy
                  </GreyPill>
                )}
                {active && !isOwner && isForSale && (
                  <MenuButton
                    onClick={buyToken}
                    disabled={useBuyToken.isLoading}
                  >
                    {useBuyToken.isLoading
                      ? (
                        <Spinner size="sm" animation="border" />
                      )
                      : (
                        'Purchase'
                      )}
                  </MenuButton> // purchase
                )}
                {active && isOwner && !isForSale && (
                  <MenuButton onClick={() => setShowModal(true)}>
                    Sell
                  </MenuButton> // modify listing
                )}
                {isOwner && isForSale && (
                  <MenuButton onClick={() => setShowModal(true)}>
                    Change listing
                  </MenuButton> // modify listing
                )}
              </StackDynamic>

              {/* Error from purchase */}
              {useBuyToken.isError && (
                <Alert variant="danger" className="mt-4">
                  {useBuyToken.error.message}
                </Alert>
              )}
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

              {isRevealed && (
                <Accordion defaultActiveKey="0" flush>
                  {/* attributes */}
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Attributes</Accordion.Header>
                    <Accordion.Body>
                      <StackCol className="gap-1 flex-wrap">
                        {'background,body,head,neck,torso,feet,tail,trim'
                          .split(',')
                          .map((p) => (
                            <>
                              <Property
                                key={p}
                                layer={p}
                                trait={properties[p] || 'None'}
                                percentage={
                                  metadata[p][properties[p]] / metadata._total
                                }
                              />
                            </>
                          ))}
                      </StackCol>
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
              )}
            </StackCol>
          </StackDynamic>
        </Section>
      )}
    </>
  )
}
