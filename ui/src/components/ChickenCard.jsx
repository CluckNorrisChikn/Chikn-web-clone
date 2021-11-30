import * as React from 'react'
import { Alert, Button, ButtonGroup, Card, Col, Row, Spinner } from 'react-bootstrap'
import Accordion from 'react-bootstrap/Accordion'
import { Link } from 'gatsby'
import { useQueryClient } from 'react-query'
import styled from 'styled-components'
import siteConfig from '../../site-config'
import metadata from '../components/traits/metadata.json'
import AvaxSvg from '../images/avalanche-avax-logo.svg'
import ChickenUnrevealedImage from '../images/chicken_unrevealed.jpg'
import {
  ChiknText,
  fmtCurrency,
  LinkButton,
  RefreshButton,
  Section,
  SocialShareLinkButton,
  StackCol,
  StackDynamic,
  StackRow,
} from './Common'
import {
  getErrorMessage,
  getTokenLocally,
  KEYS,
  useBuyTokenMutation,
  useGetTokenQuery,
  useGetWeb3TokenDetail,
  useWeb3Contract,
} from './Connect'
import EditListingModal from './modals/EditListingModal'
import HelmetMeta from './HelmetMeta'

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

// trigger build 2

/** @type {Details} */
const DETAILS_BLANK = {}

const AvaxLogo = styled(({ logoSize = '15px', ...props }) => <img src={AvaxSvg} logosize={logoSize} {...props} />)`
  width: ${(props) => props.logosize || '15px'};
  height: ${(props) => props.logosize || '15px'};
  margin-left: 5px;
  position: relative;
  top: -2px;
`

const Properties = styled.dl`
  font-size: 1rem;
  display: grid;
  grid-template-columns: ${(props) => (props.fixed ? '120px auto' : 'auto auto')};
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

const ChiknCard = styled(({ className = '', loading = false, ...props }) => (
  <Card className={`${className} ${loading ? '' : 'clickable'}`} {...props} />
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
  <span className={`${className} px-3 bg-light text-muted border rounded-pill text-nowrap`} {...props} />
)

const GreenPill = ({ className = '', ...props }) => (
  <span className={`${className} px-3 bg-success text-white rounded-pill text-nowrap`} {...props} />
)

const BluePill = ({ className = '', ...props }) => (
  <span className={`${className} px-3 bg-light border text-dark rounded-pill text-nowrap`} {...props} />
)

export const AvaxPill = ({ className = '', children = undefined, logoSize, ...props }) => (
  <span className={`${className} px-3 bg-light text-dark rounded-pill text-nowrap`} {...props}>
    {typeof children === 'string' && children.length > 11 ? `${children.substring(0, 11)}…` : children}
    <AvaxLogo logoSize={logoSize} />
  </span>
)

export const ConnectWalletPrompt = () => <GreyPill>Connect wallet</GreyPill>
export const ConnectWalletPromptText = () => <i className="text-muted">Connect wallet to view</i>

const shortAccount = (acct) => {
  const firstHalf = acct.substring(0, 4)
  const lastHalf = acct.substring(38)
  return `${firstHalf}...${lastHalf}`
}

const RenderAddress = ({ address }) => {
  const { account } = useWeb3Contract()
  return (
    <GreyPill>
      {typeof account === 'undefined' ? '-' : address === account ? 'You' : address ? shortAccount(address) : '-'}
    </GreyPill>
  )
}

const ChickenCardShimmer = () => {
  return (
    <ChiknCard loading={true}>
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

export const SaleStatus = ({ size = 'lg', forSale = false, isOwner = false, owner = '' }) => {
  const sizeClass = size === 'lg' ? 'py-2 px-3' : 'py-0 px-0'
  if (owner === '') {
    // return <GreyPill className={`${sizeClass}`}>Connect wallet</GreyPill>
    // the back end call which does not have owner so assume its not for sale
    return <GreyPill className={`${sizeClass}`}>Not for sale</GreyPill>
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
          <AvaxPill>{details.previousPrice ? fmtCurrency(details.previousPrice) : '-'}</AvaxPill>
        </dt>
        <dd>Transfers</dd>
        <dt>{details.numberOfTransfers ? details.numberOfTransfers : '-'}</dt>
        <dd>Sale Status</dd>
        <dt>
          <SaleStatus size="sm" forSale={details.forSale} owner={details.currentOwner} />
        </dt>
        <dd>listing price</dd>
        <dt>
          <AvaxPill>{details.forSale ? fmtCurrency(details.price) : '-'}</AvaxPill>
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

export const RarityBadge = styled(({ className = '', ...props }) => (
  <div className={`${className} ${props.rarity} d-inline-block text-capitalize rounded-pill fs-7`} {...props}>
    {props.rarity}
  </div>
))`
  ${(props) => (props.size === 'sm' ? 'font-size: 1rem;' : '')}
  padding: 4px 16px;
  cursor: pointer;
  &.common {
    color: var(--rarity-common-dark);
    background: var(--rarity-common-light);
  }
  &.nice {
    color: var(--rarity-nice-dark);
    background: var(--rarity-nice-light);
  }
  &.rare {
    color: var(--rarity-rare-dark);
    background: var(--rarity-rare-light);
  }
  &.elite {
    color: var(--rarity-elite-dark);
    background: var(--rarity-elite-light);
  }
  &.legendary {
    color: var(--rarity-legendary-dark);
    background: var(--rarity-legendary-light);
  }
  &.unique {
    color: var(--rarity-unique-dark);
    background: var(--rarity-unique-light);
  }
`

export const RarityColour = styled(({ className = '', ...props }) => (
  <div className={`${className} ${props.rarity} d-inline-block text-capitalize rounded-pill fs-7`} {...props}>
    {props.children}
  </div>
))`
  ${(props) => (props.size === 'sm' ? 'font-size: 1rem;' : '')}
  padding: 4px 16px;
  &.common {
    color: var(--rarity-common-dark);
    background: var(--rarity-common-light);
  }
  &.nice {
    color: var(--rarity-nice-dark);
    background: var(--rarity-nice-light);
  }
  &.rare {
    color: var(--rarity-rare-dark);
    background: var(--rarity-rare-light);
  }
  &.elite {
    color: var(--rarity-elite-dark);
    background: var(--rarity-elite-light);
  }
  &.legendary {
    color: var(--rarity-legendary-dark);
    background: var(--rarity-legendary-light);
  }
  &.unique {
    color: var(--rarity-unique-dark);
    background: var(--rarity-unique-light);
  }
`

export const ChickenCardMarketplaceSummary = ({ tokenId = '', onClick = null, ...props }) => {
  const { account } = useWeb3Contract()
  const getTokenQuery = useGetTokenQuery(tokenId)
  const isRevealed = getTokenQuery.isSuccess
  const { data: { properties = {} } = {} } = getTokenQuery
  // const getWeb3TokenDetail = useGetWeb3TokenDetail(contract, active, tokenId)
  // const { data: details = DETAILS_BLANK } = getWeb3TokenDetail
  const isOwner = props.currentOwner === account
  const showForSale = props.forSale === true && props.currentOwner !== account

  return (
    <>
      {getTokenQuery.isLoading && <ChickenCardShimmer />}
      {getTokenQuery.isError && <ShowError error={getTokenQuery.error} />}
      {getTokenQuery.isSuccess && (
        <>
          <ChiknCard>
            <CardImage src={isRevealed ? properties.thumbnail : ChickenUnrevealedImage} />
            <Card.Body>
              <StackCol className="gap-2 justify-content-between">
                <h6 className="p-0 mb-0">
                  <ChiknText /> #{tokenId}
                </h6>
                <small className="text-muted">Rank: {properties.rank}</small>
                <div>
                  <RarityBadge rarity={properties.rarity} size="sm" />
                </div>
                <SaleStatus size="sm" forSale={props.forSale} isOwner={isOwner} owner={props.currentOwner} />
                {showForSale && (
                  <Properties definitionAlign="right">
                    <dd>price</dd>
                    <dt>
                      <AvaxPill>{fmtCurrency(props.price)}</AvaxPill>
                    </dt>
                    <dd>last price</dd>
                    <dt>
                      <AvaxPill>{fmtCurrency(props.previousPrice)}</AvaxPill>
                    </dt>
                  </Properties>
                )}
              </StackCol>
            </Card.Body>
            <Link
              className={'stretched-link'}
              to={`/chikn/${tokenId}`}
              state={{
                backLink: '/market',
                backLabel: 'Back to Market',
                filterState: props.filterState,
              }}
            ></Link>
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
  const isRevealed = getTokenQuery.isSuccess
  return (
    <>
      {getTokenQuery.isLoading && <ChickenCardShimmer />}
      {getTokenQuery.isError && <ShowError error={getTokenQuery.error} />}
      {getTokenQuery.isSuccess && (
        <>
          <ChiknCard>
            <CardImage src={isRevealed ? properties.thumbnail : ChickenUnrevealedImage} />
            <Card.Body>
              <StackCol className="justify-content-between gap-2">
                <h6 className="mb-0">
                  <ChiknText /> #{tokenId}
                </h6>
                <small className="text-muted">Rank: {properties.rank}</small>
                <div>
                  <RarityBadge rarity={properties.rarity} size="sm" />
                </div>
                <SaleStatus size="sm" forSale={forSale} owner={currentOwner} />
              </StackCol>
            </Card.Body>
            <Link
              className={'stretched-link'}
              to={`/chikn/${tokenId}`}
              state={{
                backLink: '/market',
                backLabel: 'Back to Market',
              }}
            ></Link>
          </ChiknCard>
        </>
      )}
    </>
  )
}

const MINTED_FROM_ADDRESS = '0x0000000000000000000000000000000000000000'

export const ChickenCardRecentActivitySummary = ({ tokenId = '', from = '', to = '', onClick = null }) => {
  /** @type {{ data: { details: Details }}} */
  const getTokenQuery = useGetTokenQuery(tokenId)
  const { data: { properties = {}, details = DETAILS_BLANK } = {} } = getTokenQuery
  const isRevealed = getTokenQuery.isSuccess
  return (
    <>
      {getTokenQuery.isLoading && <ChickenCardShimmer />}
      {getTokenQuery.isError && <ShowError error={getTokenQuery.error} />}
      {getTokenQuery.isSuccess && (
        <>
          <ChiknCard>
            <CardImage src={isRevealed ? properties.image : ChickenUnrevealedImage} />
            <Card.Body>
              <StackCol className="gap-2">
                <h6>
                  <ChiknText /> #{tokenId}
                </h6>
                {/* TODO what about listed forsale events... do they come through? */}
                {from === MINTED_FROM_ADDRESS ? (
                  <GreyPill>Minted</GreyPill>
                ) : (
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
  const { layer, trait, score, percentile, rarity, className = '', ...otherProps } = props

  return (
    <div
      // eslint-disable-next-line max-len
      className={`${className} px-3 py-2 rounded-3 text-nowrap text-dark text-capitalize justify-content-between align-items-center`}
      {...otherProps}
    >
      <div className=" w-100 d-flex flex-row justify-content-between align-items-center">
        <span>
          <b>{layer}</b>: {trait}
        </span>
        <RarityColour style={{ textTransform: 'capitalize' }} rarity={rarity}>
          <span>
            <b>+ {score.toFixed(2)}</b>
          </span>
        </RarityColour>
      </div>
      <div className=" w-100 py-1 pt-3">
        <ColouredProgressBar percentile={percentile} rarity={rarity} />
      </div>
    </div>
  )
}

const ColouredProgressBar = styled(({ className = '', percentile, rarity, ...props }) => {
  const width = `${percentile}%`
  return (
    <div className="progress">
      <div
        className={`progress-bar ${className} ${rarity}`}
        role="progressbar"
        style={{ width: width, borderTopRightRadius: '15px', borderBottomRightRadius: '15px' }}
        aria-valuenow="50"
        aria-valuemin="0"
        aria-valuemax="100"
        {...props}
      ></div>
    </div>
  )
})`
  &.common {
    background: var(--rarity-common-dark);
  }
  &.nice {
    background: var(--rarity-nice-dark);
  }
  &.rare {
    background: var(--rarity-rare-dark);
  }
  &.elite {
    background: var(--rarity-elite-dark);
  }
  &.legendary {
    background: var(--rarity-legendary-dark);
  }
  &.unique {
    background: var(--rarity-unique-dark);
  }
`

const MenuButton = styled(Button)`
  min-width: 200px !important;
  padding-left: 30px !important;
  padding-right: 30px !important;
`

const calculateScore = (properties) => {
  let totalScore = 0
  ;['background', 'body', 'head', 'neck', 'torso', 'feet', 'tail', 'trim', '_numOfTraits'].forEach((t) => {
    const trait = metadata[t][properties[t] || '']
    totalScore = totalScore + trait.score
  })
  return totalScore.toFixed(2)
}

/**
 * Chicken Details page - this is where all actions happen, your view will change based on sell state, and ownership, and marketplace view.
 * @param {*} param0
 * @returns
 */
export const ChickenCardDetails = ({ tokenId = '' }) => {
  const queryClient = useQueryClient()
  const { active, account, contract } = useWeb3Contract()
  /** @type {{ data: { details: Details }}} */
  const properties = getTokenLocally(tokenId)
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

  const socialTitle = `chikn #${tokenId}`

  const socialDescription = `Rank: ${properties.rank} - ${properties.rarity.toUpperCase()} - Check out my chikn!`

  return (
    <>
      {/* meta */}
      <HelmetMeta
        title={socialTitle}
        description={socialDescription}
        imageUrl={properties.image}
        imageHeightPx={1000}
        imageWidthPx={1000}
      />

      {/* modal */}
      <EditListingModal
        showModal={showModal}
        setShowModal={() => setShowModal(false)}
        tokenId={tokenId}
        enableListing={isForSale}
        listingPrice={details.price}
      />

      <Section className="bg-white border" center={false}>
        <StackDynamic className="gap-5 flex-grow-1">
          <div>
            <div>
              <ChickenImage src={properties.image} />
            </div>
            <StackCol className="pt-3 gap-4">
              {/* social */}
              <ButtonGroup>
                <SocialShareLinkButton
                  title={socialTitle}
                  text={socialDescription}
                  url={typeof window !== 'undefined' ? window.location.toString() : ''}
                />
                <LinkButton href={properties.image} tooltip="Download image" />
                <RefreshButton onClick={refreshPage} />
              </ButtonGroup>

              <StackCol className="d-flex justify-content-center text-center gap-3">
                {/* Rank & score */}
                <StackRow className="gap-3 d-flex justify-content-center">
                  <div className="">
                    Rank: <b>{properties.rank}</b>
                  </div>
                  <div className="">
                    Score: <b>{calculateScore(properties)}</b>
                  </div>
                </StackRow>
                <div>
                  <RarityBadge rarity={properties.rarity} />
                </div>

                {/* actions */}
                <StackDynamic className="gap-1 flex-wrap justify-content-center">
                  {active && ( // !isOwner && !isForSale &&
                    <SaleStatus forSale={details.forSale} owner={details.currentOwner} />
                  )}
                  {!active && <GreyPill className="py-2 border">Connect wallet to buy</GreyPill>}
                  {active && !isOwner && isForSale && (
                    <MenuButton onClick={buyToken} disabled={useBuyToken.isLoading}>
                      {useBuyToken.isLoading ? <Spinner size="sm" animation="border" /> : 'Purchase'}
                    </MenuButton> // purchase
                  )}
                  {active && isOwner && !isForSale && (
                    <MenuButton onClick={() => setShowModal(true)}>Sell</MenuButton> // modify listing
                  )}
                  {isOwner && isForSale && (
                    <MenuButton onClick={() => setShowModal(true)}>Change listing</MenuButton> // modify listing
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
              </StackCol>
            </StackCol>
          </div>

          <StackCol className="w-exact60pc gap-4">
            <Accordion defaultActiveKey="0" flush>
              {/* attributes */}
              <Accordion.Item eventKey="0">
                <Accordion.Header>Attributes</Accordion.Header>
                <Accordion.Body>
                  <StackCol className="gap-1 flex-wrap">
                    {['background', 'body', 'head', 'neck', 'torso', 'feet', 'tail', 'trim', '_numOfTraits'].map(
                      (t, idx) => {
                        const trait = metadata[t][properties[t] || '']
                        const traitType = t === '_numOfTraits' ? '# traits' : t
                        return (
                          <Property
                            key={idx}
                            layer={traitType}
                            trait={properties[t] || 'None'}
                            rarity={trait.rarity}
                            score={trait.score}
                            percentile={trait.percentile}
                          />
                        )
                      }
                    )}
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
          </StackCol>
        </StackDynamic>
      </Section>
    </>
  )
}
