import { navigate } from 'gatsby-link'
import * as React from 'react'
import {
  Accordion,
  Button,
  Card,
  Col,
  Form,
  Pagination,
  Row,
  Spinner,
  ToggleButton,
  ToggleButtonGroup,
  Container,
} from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import { BiFilter } from 'react-icons/bi'
import { FaSync } from 'react-icons/fa'
import { useQueryClient } from 'react-query'
import { AvaxPill, ChickenCardMarketplaceSummary, ChickenCardShimmerx4, RarityBadge } from '../components/ChickenCard'
import { Section, StackRow } from '../components/Common'
import { KEYS, useAPIMarketStat, useTotalHoldersQuery } from '../components/Connect'
import Layout from '../components/Layout'
import metadata from '../components/traits/metadata.json'
import { stringArraysNotEqual } from '../components/utils/utils'

const TraitsSelector = ({ id = null, parentValues = [], options = [], updateParent = () => {} }) => {
  const ref = React.useRef()
  const [values, setValues] = React.useState([])

  // apply updates from parent...
  React.useEffect(() => {
    if (stringArraysNotEqual(parentValues, values)) {
      console.debug('parent values changed', { parentValues, values })
      if (parentValues.length === 0) {
        ref.current.clear()
      }
      setValues(parentValues)
    }
  }, [parentValues, values])

  if (options[0] === '') {
    options[0] = 'None'
  }

  return (
    <>
      <Typeahead
        multiple
        id={id}
        selected={values}
        onChange={(selected) => {
          setValues(selected)
          updateParent(selected)
          if (selected.length > 0) ref.current.toggleMenu(true)
        }}
        onBlur={() => ref.current.toggleMenu(false)}
        clearButton={true}
        options={options}
        ref={ref}
        placeholder="Choose a property..."
      />

      {/* debug */}
      {process.env.NODE_ENV !== 'production' && <pre>values={JSON.stringify(values)}</pre>}
    </>
  )
}

const isUndefOrEmpty = (o) => typeof o === 'undefined' || o.length === 0

const Market = ({ location = {} }) => {
  const { filterState = {} } = typeof location.state !== 'undefined' && location.state !== null ? location.state : {}
  // react-state
  const {
    filterSalesStatus: filteredSale = 'for_sale',
    sortSalesBy: saleSorted = 'token',
    filters: filtered = {},
    pageNumber: pagedSelected = 0,
  } = filterState
  const scrollToTopRef = React.useRef()
  console.log('Filter back ', filterState)
  // react-query
  const queryClient = useQueryClient()
  const [filterSalesStatus, setFilterSalesStatus] = React.useState(filteredSale)
  const [sortSalesBy, setSortSalesBy] = React.useState(saleSorted)
  const showForSale = filterSalesStatus === 'for_sale'
  const [filters, setFilters] = React.useState(filtered)
  const apiMarketStatQuery = useAPIMarketStat(showForSale)
  const { data: marketData = {} } = apiMarketStatQuery
  const { isLoading: holderLoading, data: holders = {} } = useTotalHoldersQuery()

  console.log('we are the filters', filters)

  const [pageNumber, setInternalPageNumber] = React.useState(pagedSelected)

  // use this to manipulate the incoming nones ('') into the typeahead value ('None')
  const noneCheck = (trait) => {
    return trait === '' ? 'None' : trait?.toLowerCase()
  }

  // responsible for applying client side filtering/sorting to the returned dataset.
  const chikns = React.useMemo(() => {
    // filter by the selected properties... 'background,body,head,neck,torso,feet,tail,trim' - added # traits, rarity
    if (marketData && marketData.chikn) {
      // if filters or sort changes, set the page back to the first page i.e. 0 (or pagedSelected if navigating back)
      const isInitialPageLoad = filteredSale === filterSalesStatus && saleSorted === sortSalesBy && filtered === filters
      setInternalPageNumber(isInitialPageLoad ? pagedSelected : 0)
      return marketData.chikn
        .filter((t) => {
          return (
            (((sortSalesBy === 'lowestLastSale' || sortSalesBy === 'highestLastSale') && t.previousPrice > 0) ||
              (sortSalesBy !== 'lowestLastSale' && sortSalesBy !== 'highestLastSale')) &&
            (isUndefOrEmpty(filters.background) || ~filters.background.indexOf(t.background?.toLowerCase())) &&
            (isUndefOrEmpty(filters.body) || ~filters.body.indexOf(t.body?.toLowerCase())) &&
            (isUndefOrEmpty(filters.head) || ~filters.head.indexOf(noneCheck(t.head))) &&
            (isUndefOrEmpty(filters.neck) || ~filters.neck.indexOf(noneCheck(t.neck))) &&
            (isUndefOrEmpty(filters.torso) || ~filters.torso.indexOf(noneCheck(t.torso))) &&
            (isUndefOrEmpty(filters.feet) || ~filters.feet.indexOf(noneCheck(t.feet))) &&
            (isUndefOrEmpty(filters.tail) || ~filters.tail.indexOf(noneCheck(t.tail))) &&
            (isUndefOrEmpty(filters.trim) || ~filters.trim.indexOf(noneCheck(t.trim))) &&
            (isUndefOrEmpty(filters.rarity) || ~filters.rarity.indexOf(t.rarity?.toLowerCase())) &&
            (isUndefOrEmpty(filters._numOfTraits) || ~filters._numOfTraits.indexOf(t._numOfTraits.toString()))
          )
        })
        .sort((a, b) => {
          const aPrice = parseFloat(a.salePrice)
          const bPrice = parseFloat(b.salePrice)
          const aPreviousPrice = parseFloat(a.previousPrice)
          const bPreviousPrice = parseFloat(b.previousPrice)
          const aRarityRank = a.rank === '?' ? 0 : parseInt(a.rank)
          const bRarityRank = b.rank === '?' ? 0 : parseInt(b.rank)
          // sort rank
          if (sortSalesBy === 'lowestRank') {
            if (aRarityRank > bRarityRank) return 1
            if (aRarityRank < bRarityRank) return -1
            return 0
          } else if (sortSalesBy === 'highestRank') {
            if (aRarityRank > bRarityRank) return -1
            if (aRarityRank < bRarityRank) return 1
            return 0
          }
          // sort sale
          if (sortSalesBy === 'token') {
            // sort by token id
            if (a.token > b.token) return 1
            if (a.token < b.token) return -1
            return 0
          } else if (sortSalesBy === 'lowest') {
            // sort by lowest
            if (aPrice > bPrice) return 1
            if (aPrice < bPrice) return -1
            return 0
          } else if (sortSalesBy === 'lowestLastSale') {
            if (aPreviousPrice > bPreviousPrice) return 1
            if (aPreviousPrice < bPreviousPrice) return -1
            return 0
          } else if (sortSalesBy === 'highestLastSale') {
            if (aPreviousPrice > bPreviousPrice) return -1
            if (aPreviousPrice < bPreviousPrice) return 1
            return 0
          } else {
            // sort by highest price
            if (aPrice > bPrice) return -1
            if (aPrice < bPrice) return 1
            return 0
          }
        })
      // .map((t) => t.token)
    } else {
      return []
    }
  }, [
    marketData,
    filters.background,
    filters.body,
    filters.feet,
    filters.head,
    filters.neck,
    filters.tail,
    filters.torso,
    filters.trim,
    filters._numOfTraits,
    filters.rarity,
    sortSalesBy,
  ])

  // handles all the pagination!
  const PAGE_SIZE = 16
  const maxPageNumber = React.useMemo(() => {
    const total = chikns.length
    const remainder = total % PAGE_SIZE
    const maxPage = parseInt(total / PAGE_SIZE) + (remainder > 0 ? 0 : -1)
    return maxPage
  }, [chikns])

  // fix for when filters change the max page number...
  React.useEffect(() => {
    // check for -1 due to chikn may need to be reload from server which cause the maxPage to be -1
    if (maxPageNumber !== -1) {
      if (pageNumber > maxPageNumber) setInternalPageNumber(0)
    }
  }, [pageNumber, maxPageNumber])

  React.useEffect(() => {
    setSortSalesBy(saleSorted)
  }, [filterSalesStatus, saleSorted])

  //  set the page number (handles validation logic)
  const setPage = React.useCallback(
    (page, jumpToTop = false) => {
      if (page < 0) setInternalPageNumber(0)
      else if (page > maxPageNumber) setInternalPageNumber(maxPageNumber)
      else setInternalPageNumber(page)
      // only jump to top if coming from bottom...
      if (jumpToTop) scrollToTopRef.current.scrollIntoView()
    },
    [maxPageNumber]
  )

  const PaginationComponent = ({ pageNum, maxPageNum }) => {
    const disabledStart = pageNum === 0
    const disabledEnd = pageNum === maxPageNum
    return (
      <Pagination className="flex-wrap">
        <Pagination.First disabled={disabledStart} onClick={() => setPage(0, true)} />
        <Pagination.Item className="hide" disabled={pageNum - 100 < 0} onClick={() => setPage(pageNum - 100, true)}>
          -100
        </Pagination.Item>
        <Pagination.Item className="hide" disabled={pageNum - 50 < 0} onClick={() => setPage(pageNum - 50, true)}>
          -50
        </Pagination.Item>
        <Pagination.Item className="hide" disabled={pageNum - 25 < 0} onClick={() => setPage(pageNum - 25, true)}>
          -25
        </Pagination.Item>
        <Pagination.Prev disabled={disabledStart} onClick={() => setPage(pageNum - 1, true)} />
        <Pagination.Next disabled={disabledEnd} onClick={() => setPage(pageNum + 1, true)} />

        <Pagination.Item
          className="hide"
          disabled={pageNum + 25 > maxPageNum}
          onClick={() => setPage(pageNum + 25, true)}
        >
          +25
        </Pagination.Item>
        <Pagination.Item
          className="hide"
          disabled={pageNum + 50 > maxPageNum}
          onClick={() => setPage(pageNum + 50, true)}
        >
          +50
        </Pagination.Item>
        <Pagination.Item
          className="hide"
          disabled={pageNum + 100 > maxPageNum}
          onClick={() => setPage(pageNum + 100, true)}
        >
          +100
        </Pagination.Item>
        <Pagination.Last disabled={disabledEnd} onClick={() => setPage(999999, true)} />
      </Pagination>
    )
  }

  const FloorCalculation = (rarity) => {
    return marketData.chikn
      .filter((t) => {
        return t.rarity === rarity && !isUndefOrEmpty(t.salePrice)
      })
      .sort((a, b) => {
        const bPrice = parseFloat(b.salePrice)
        const aPrice = parseFloat(a.salePrice)
        if (aPrice > bPrice) return 1
        if (aPrice < bPrice) return -1
        return 0
      })[0].salePrice
  }

  return (
    <Layout pageName="Market">
      {/* ANCHOR header */}
      <StackRow className="justify-content-between">
        <h1>Market</h1>
        <div>
          <Button
            title="Refresh"
            variant="light"
            onClick={() => {
              queryClient.invalidateQueries(KEYS.MARKET())
              queryClient.invalidateQueries(KEYS.APIMARKET())
              queryClient.invalidateQueries(KEYS.ALLTOKEN())
              queryClient.invalidateQueries(KEYS.CONTRACT_TOKEN())
            }}
          >
            <FaSync />
          </Button>
        </div>
      </StackRow>

      {/* ANCHOR floor price */}
      <StackRow className="justify-content-around">
        <Card>
          <Card.Body>
            <StackRow>
              <div
                style={{
                  width: '120px',
                  padding: '0px 10px',
                  borderRight: '1px solid rgba(0, 0, 0, 0.125)',
                }}
                className="d-flex flex-column align-items-center"
              >
                <div>
                  {apiMarketStatQuery.isLoading ? (
                    <Spinner variant="primary" animation="border" size="sm" />
                  ) : (
                    marketData?.mintedCount?.toLocaleString()
                  )}
                </div>
                <div>Items</div>
              </div>
              <div
                style={{
                  width: '120px',
                  padding: '0px 10px',
                  borderRight: '1px solid rgba(0, 0, 0, 0.125)',
                }}
                className="d-flex flex-column align-items-center"
              >
                <div>
                  {holderLoading ? (
                    <Spinner variant="primary" animation="border" size="sm" />
                  ) : (
                    holders.data?.pagination?.total_count?.toLocaleString()
                  )}
                </div>
                <div>Owners</div>
              </div>
              <div style={{ width: '120px', padding: '0px 10px' }} className="d-flex flex-column align-items-center">
                <div>
                  <span>
                    {apiMarketStatQuery.isLoading ? (
                      <Spinner variant="primary" animation="border" size="sm" />
                    ) : (
                      <AvaxPill>{marketData.floorPrice}</AvaxPill>
                    )}
                  </span>
                </div>
                <div>
                  Floor<span className="d-none d-md-inline"> price</span>
                </div>
              </div>
            </StackRow>
          </Card.Body>
        </Card>
      </StackRow>

      {/* RARITY FLOOR PRICES */}
      <StackRow className="justify-content-around">
        <Card>
          <Card.Body>
            <Card.Title className="text-center pb-2">Rarity Floor Prices</Card.Title>
            <StackRow className="flex-wrap justify-content-center">
              {Object.keys(metadata.rarity).map((rarity, i) => {
                return (
                  <div
                    key={i}
                    style={{ width: '120px', padding: '10px 10px' }}
                    className="d-flex flex-column align-items-center"
                  >
                    <div className="pb-2">
                      <RarityBadge
                        rarity={rarity}
                        size={'sm'}
                        onClick={() => {
                          setFilters((ps) => ({
                            ...ps,
                            rarity: [rarity],
                          }))
                          setSortSalesBy('lowestLastSale')
                        }}
                      />
                    </div>
                    <div>
                      <span>
                        {apiMarketStatQuery.isLoading ? (
                          <Spinner variant="primary" animation="border" size="sm" />
                        ) : (
                          <AvaxPill>{FloorCalculation(rarity)}</AvaxPill>
                        )}
                      </span>
                    </div>
                  </div>
                )
              })}
            </StackRow>
          </Card.Body>
        </Card>
      </StackRow>

      <Container className="justify-content-center text-center py-0 px-0">
        <Card style={{ border: 'transparent' }}>
          <Card.Body>
            {/* sales */}
            <h5>Sales</h5>
            <Row className="my-3 justify-content-center">
              <Col xs={12} sm={12} md={6} lg={4} className="px-0">
                <ToggleButtonGroup
                  name="filterSalesStatus"
                  defaultValue="show_all"
                  value={filterSalesStatus}
                  onChange={setFilterSalesStatus}
                  type="radio"
                  className="w-100 button-group-mobile"
                >
                  <ToggleButton className="w-md-50" variant="outline-primary" id="for_sale" value="for_sale">
                    For Sale
                  </ToggleButton>
                  <ToggleButton className="w-md-50" variant="outline-primary" id="show_all" value="show_all">
                    Show All
                  </ToggleButton>
                </ToggleButtonGroup>
              </Col>
            </Row>
            {/* Sort for Sale */}
            <h5>Sort by</h5>
            <Row className="my-3 justify-content-center">
              <Col xs={12} sm={12} md={12} lg={12} className="px-0">
                <ToggleButtonGroup
                  name="sortBy"
                  defaultValue="token"
                  value={sortSalesBy}
                  onChange={setSortSalesBy}
                  type="radio"
                  className="w-100 button-group-mobile"
                >
                  <ToggleButton
                    variant="outline-primary"
                    id="lowest"
                    value="lowest"
                    disabled={filterSalesStatus !== 'for_sale'}
                  >
                    Lowest price
                  </ToggleButton>
                  <ToggleButton
                    variant="outline-primary"
                    id="highest"
                    value="highest"
                    disabled={filterSalesStatus !== 'for_sale'}
                  >
                    Highest price
                  </ToggleButton>

                  <ToggleButton
                    variant="outline-primary"
                    id="lowestLastSale"
                    value="lowestLastSale"
                    disabled={filterSalesStatus !== 'for_sale'}
                  >
                    Lowest last sold price
                  </ToggleButton>
                  <ToggleButton
                    variant="outline-primary"
                    id="highestLastSale"
                    value="highestLastSale"
                    disabled={filterSalesStatus !== 'for_sale'}
                  >
                    Highest last sold price
                  </ToggleButton>

                  <ToggleButton variant="outline-primary" id="lowestRank" value="lowestRank">
                    Highest rank
                  </ToggleButton>
                  <ToggleButton variant="outline-primary" id="highestRank" value="highestRank">
                    Lowest rank
                  </ToggleButton>
                  <ToggleButton variant="outline-primary" id="token" value="token">
                    Chikn #
                  </ToggleButton>
                </ToggleButtonGroup>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>

      {/* ANCHOR filters */}
      <Accordion ref={scrollToTopRef}>
        <Accordion.Item eventKey="0">
          <Accordion.Header className="gap-3">
            <div className="d-flex flex-row align-items-center gap-2">
              <BiFilter className="fs-4" />
              <span>Filters</span>
            </div>
          </Accordion.Header>
          <Accordion.Body className="p-4">
            {/* properties */}
            <h5>Properties</h5>
            <Row>
              {Object.entries(metadata)
                .filter(([layer]) => !layer.startsWith('_total'))
                .map(([layer, traits]) => (
                  /* stringArraysNotEqual(selections, "array of selected traits") */
                  <Col xs={12} sm={12} md={6} lg={6} key={layer}>
                    <Form.Group>
                      <Form.Label className="mt-2 mb-1 text-capitalize">
                        {layer === '_numOfTraits' ? '# traits' : layer}
                      </Form.Label>
                      <TraitsSelector
                        id={layer}
                        options={Object.keys(traits)}
                        updateParent={(selections) => {
                          if (stringArraysNotEqual(selections, filters[layer])) {
                            console.log('selections', selections)

                            setFilters((ps) => ({
                              ...ps,
                              [layer]: selections,
                            }))
                          }
                        }}
                        parentValues={filters[layer]}
                      />
                    </Form.Group>
                  </Col>
                ))}
            </Row>
            {/* clear button */}
            <Row>
              <Col xs={12} className="d-flex flex-row justify-content-center pt-4">
                <Button variant="outline-primary" onClick={() => setFilters({})} className="px-5">
                  Clear Filters
                </Button>
              </Col>
            </Row>
            {process.env.NODE_ENV !== 'production' && <pre>filters={JSON.stringify(filters, null, 2)}</pre>}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* ANCHOR search results */}
      <Section className="border bg-white" center={true}>
        {/* no data */}
        {chikns.length === 0 && apiMarketStatQuery.isSuccess && <h5>No chikns available.</h5>}

        {/* for sale and loading */}
        {apiMarketStatQuery.isLoading && <ChickenCardShimmerx4 />}

        {/* success */}
        {chikns.length > 0 && apiMarketStatQuery.isSuccess && (
          <>
            <div className="d-flex flex-column align-items-center mb-5">
              <h5>
                Page {(pageNumber + 1).toLocaleString()} of {(maxPageNumber + 1).toLocaleString()} (
                {chikns.length.toLocaleString()})
              </h5>
              <PaginationComponent pageNum={pageNumber} maxPageNum={maxPageNumber} />
            </div>
            <Row className="gy-3 gx-3">
              {chikns.slice(pageNumber * PAGE_SIZE, (pageNumber + 1) * PAGE_SIZE).map((chikn) => (
                <Col key={chikn.token} sm={6} md={4} lg={3}>
                  <ChickenCardMarketplaceSummary
                    tokenId={chikn.token}
                    backLink={'/market'}
                    backLabel={'Back to Market'}
                    filterState={{
                      filterSalesStatus: filterSalesStatus,
                      sortSalesBy: sortSalesBy,
                      filters: filters,
                      pageNumber: pageNumber,
                    }}
                    rank={chikn.rank}
                    forSale={chikn.forSale}
                    currentOwner={chikn.owner}
                    price={chikn.salePrice}
                    previousPrice={chikn.previousPrice}
                  />
                </Col>
              ))}
            </Row>
            <div className="d-flex flex-column align-items-center mt-5">
              <h5>
                Page {(pageNumber + 1).toLocaleString()} of {(maxPageNumber + 1).toLocaleString()}
              </h5>
              <PaginationComponent pageNum={pageNumber} maxPageNum={maxPageNumber} />
            </div>
          </>
        )}
      </Section>
    </Layout>
  )
}

export default Market
