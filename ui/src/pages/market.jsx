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
  ToggleButtonGroup
} from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import { BiFilter } from 'react-icons/bi'
import { FaSync } from 'react-icons/fa'
import { useQueryClient } from 'react-query'
import {
  AvaxPill,
  ChickenCardMarketplaceSummary,
  ChickenCardShimmerx4,
  ConnectWalletPromptText
} from '../components/ChickenCard'
import { Section, StackRow } from '../components/Common'
import {
  KEYS,
  useGetAllSalesTokenQuery,
  useGetStatQuery,
  useGetSupplyQuery,
  useTotalHoldersQuery,
  useWeb3Contract
} from '../components/Connect'
import Layout from '../components/Layout'
import traitsdata from '../components/traits/combinations.json'
import metadata from '../components/traits/metadata.json'
import { stringArraysNotEqual } from '../components/utils/utils'

const TraitsSelector = ({
  id = null,
  parentValues = [],
  options = [],
  updateParent = () => {}
}) => {
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

  return (
    <>
      <Typeahead
        multiple
        id={id}
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
      {process.env.NODE_ENV !== 'production' && (
        <pre>values={JSON.stringify(values)}</pre>
      )}
    </>
  )
}

const isUndefOrEmpty = (o) => typeof o === 'undefined' || o.length === 0

const Market = () => {
  // react-state
  const scrollToTopRef = React.useRef()

  // react-query
  const queryClient = useQueryClient()
  const { active } = useWeb3Contract()
  const getAllSalesTokenQuery = useGetAllSalesTokenQuery()
  const { data: forSaleTokens = [] } = getAllSalesTokenQuery
  const [filterSalesStatus, setFilterSalesStatus] = React.useState('show_all')
  const showForSale = filterSalesStatus === 'for_sale'
  const [filters, setFilters] = React.useState({})
  const { isLoading: statLoading, data: statPrice = {} } = useGetStatQuery()
  const { isLoading: holderLoading, data: holders = {} } =
    useTotalHoldersQuery()

  const getSupplyQuery = useGetSupplyQuery()
  const { data: { minted } = {} } = getSupplyQuery

  // todo pagination?
  const chikns = React.useMemo(() => {
    let array = traitsdata

    // create new map of ONLY tokens that are for sale...
    if (showForSale && forSaleTokens.length > 0) {
      array = forSaleTokens.map((token) => traitsdata[token - 1])
    }

    // only allow filtering on minted chickens...
    if (minted) {
      array = array.filter(({ token }) => token <= minted)
    }

    // filter by the selected properties... 'background,body,head,neck,torso,feet,tail,trim'
    return array
      .filter((t) => {
        return (
          (isUndefOrEmpty(filters.background) ||
            ~filters.background.indexOf(t.background?.toLowerCase())) &&
          (isUndefOrEmpty(filters.body) ||
            ~filters.body.indexOf(t.body?.toLowerCase())) &&
          (isUndefOrEmpty(filters.head) ||
            ~filters.head.indexOf(t.head?.toLowerCase())) &&
          (isUndefOrEmpty(filters.neck) ||
            ~filters.neck.indexOf(t.neck?.toLowerCase())) &&
          (isUndefOrEmpty(filters.torso) ||
            ~filters.torso.indexOf(t.torso?.toLowerCase())) &&
          (isUndefOrEmpty(filters.feet) ||
            ~filters.feet.indexOf(t.feet?.toLowerCase())) &&
          (isUndefOrEmpty(filters.tail) ||
            ~filters.tail.indexOf(t.tail?.toLowerCase())) &&
          (isUndefOrEmpty(filters.trim) ||
            ~filters.trim.indexOf(t.trim?.toLowerCase()))
        )
      })
      .map((t) => t.token)
  }, [
    minted,
    showForSale,
    filters.background,
    filters.body,
    filters.feet,
    filters.head,
    filters.neck,
    filters.tail,
    filters.torso,
    filters.trim,
    forSaleTokens
  ])

  // handles all the pagination!
  const PAGE_SIZE = 16
  const [pageNumber, setInternalPageNumber] = React.useState(0)
  const maxPageNumber = React.useMemo(() => {
    const total = chikns.length
    const remainder = total % PAGE_SIZE
    const maxPage = parseInt(total / PAGE_SIZE) + (remainder > 0 ? 0 : -1)
    return maxPage
  }, [chikns])

  // fix for when filters change the max page number...
  React.useEffect(() => {
    if (pageNumber > maxPageNumber) setInternalPageNumber(0)
  }, [pageNumber, maxPageNumber])

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

  return (
    <Layout pageName="Wallet">
      {/* ANCHOR header */}
      <StackRow className="justify-content-between">
        <h1>Market</h1>
        <div>
          <Button
            title="Refresh"
            variant="light"
            disabled={!active}
            onClick={() => {
              queryClient.invalidateQueries(KEYS.MARKET())
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
                  borderRight: '1px solid rgba(0, 0, 0, 0.125)'
                }}
                className="d-flex flex-column align-items-center"
              >
                <div>
                  {statLoading
                    ? (
                      <Spinner variant="primary" animation="border" size="sm" />
                    )
                    : (
                      statPrice.items
                    )}
                </div>
                <div>Items</div>
              </div>
              <div
                style={{
                  width: '120px',
                  padding: '0px 10px',
                  borderRight: '1px solid rgba(0, 0, 0, 0.125)'
                }}
                className="d-flex flex-column align-items-center"
              >
                <div>
                  {holderLoading
                    ? (
                      <Spinner variant="primary" animation="border" size="sm" />
                    )
                    : (
                      holders.data.pagination.total_count.toLocaleString()
                    )}
                </div>
                <div>Owners</div>
              </div>
              <div
                style={{ width: '120px', padding: '0px 10px' }}
                className="d-flex flex-column align-items-center"
              >
                <div>
                  <span>
                    {statLoading
                      ? (
                        <Spinner variant="primary" animation="border" size="sm" />
                      )
                      : (
                        <AvaxPill>{statPrice.floor}</AvaxPill>
                      )}
                  </span>
                </div>
                <div>Floor price</div>
              </div>
            </StackRow>
          </Card.Body>
        </Card>
      </StackRow>

      {/* ANCHOR wallet not connected */}
      {!active && (
        <Section className="border bg-white" center={true}>
          <span>Please connect your wallet, to view the market.</span>
        </Section>
      )}

      {/* ANCHOR filters */}
      {active && (
        <Accordion ref={scrollToTopRef}>
          <Accordion.Item eventKey="0">
            <Accordion.Header className="gap-3">
              <div className="d-flex flex-row align-items-center gap-2">
                <BiFilter className="fs-4" />
                <span>Filters</span>
              </div>
            </Accordion.Header>
            <Accordion.Body className="p-4">
              {/* sales */}
              <h5>Sales</h5>
              <Row className="my-3">
                <Col xs={12} sm={12} md={6} lg={4}>
                  {!active && <ConnectWalletPromptText />}
                  {active && (
                    <ToggleButtonGroup
                      name="filterSalesStatus"
                      defaultValue="show_all"
                      value={filterSalesStatus}
                      onChange={setFilterSalesStatus}
                      type="radio"
                      className="w-100"
                    >
                      <ToggleButton
                        className="w-50"
                        variant="outline-primary"
                        id="show_all"
                        value="show_all"
                      >
                        Show All
                      </ToggleButton>
                      <ToggleButton
                        className="w-50"
                        variant="outline-primary"
                        id="for_sale"
                        value="for_sale"
                      >
                        For Sale
                      </ToggleButton>
                    </ToggleButtonGroup>
                  )}
                </Col>
              </Row>
              {/* properties */}
              <h5>Properties</h5>
              <Row>
                {Object.entries(metadata).map(([layer, traits]) => (
                  <Col xs={12} sm={12} md={6} lg={4} key={layer}>
                    <Form.Group>
                      <Form.Label className="mt-2 mb-1 text-capitalize">
                        {layer}
                      </Form.Label>
                      <TraitsSelector
                        id={layer}
                        options={traits}
                        updateParent={(selections) => {
                          if (
                            stringArraysNotEqual(selections, filters[layer])
                          ) {
                            setFilters((ps) => ({ ...ps, [layer]: selections }))
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
                <Col
                  xs={12}
                  className="d-flex flex-row justify-content-center pt-4"
                >
                  <Button
                    variant="outline-primary"
                    onClick={() => setFilters({})}
                    className="px-5"
                  >
                    Clear Filters
                  </Button>
                </Col>
              </Row>
              {process.env.NODE_ENV !== 'production' && (
                <pre>filters={JSON.stringify(filters, null, 2)}</pre>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      )}

      {/* ANCHOR search results */}
      {active && (
        <Section className="border bg-white" center={true}>
          {/* no data */}
          {chikns.length === 0 && <h5>No chikns available.</h5>}

          {/* for sale and loading */}
          {((showForSale && getAllSalesTokenQuery.isLoading) ||
            getSupplyQuery.isLoading) && <ChickenCardShimmerx4 />}

          {/* success */}
          {chikns.length > 0 &&
            (!showForSale || getAllSalesTokenQuery.isSuccess) &&
            getSupplyQuery.isSuccess && (
            <>
              <div className="d-flex flex-column align-items-center mb-5">
                <h5>
                    Page {(pageNumber + 1).toLocaleString()} of{' '}
                  {(maxPageNumber + 1).toLocaleString()}
                </h5>
                <Pagination>
                  <Pagination.First
                    disabled={pageNumber === 0}
                    onClick={() => setPage(0)}
                  />
                  <Pagination.Prev
                    disabled={pageNumber === 0}
                    onClick={() => setPage(pageNumber - 1)}
                  />
                  <Pagination.Next
                    disabled={pageNumber === maxPageNumber}
                    onClick={() => setPage(pageNumber + 1)}
                  />
                  <Pagination.Last
                    disabled={pageNumber === maxPageNumber}
                    onClick={() => setPage(999999)}
                  />
                </Pagination>
              </div>
              <Row className="gy-3 gx-3">
                {chikns
                  .slice(pageNumber * PAGE_SIZE, (pageNumber + 1) * PAGE_SIZE)
                  .map((token) => (
                    <Col key={token} sm={6} md={4} lg={3}>
                      <ChickenCardMarketplaceSummary
                        tokenId={token}
                        onClick={() =>
                          navigate(`/chikn/${token}`, {
                            state: {
                              backLink: '/market',
                              backLabel: 'Back to Market'
                            }
                          })
                        }
                      />
                    </Col>
                  ))}
              </Row>
              <div className="d-flex flex-column align-items-center mt-5">
                <h5>
                    Page {(pageNumber + 1).toLocaleString()} of{' '}
                  {(maxPageNumber + 1).toLocaleString()}
                </h5>
                <Pagination>
                  <Pagination.First
                    disabled={pageNumber === 0}
                    onClick={() => setPage(0, true)}
                  />
                  <Pagination.Prev
                    disabled={pageNumber === 0}
                    onClick={() => setPage(pageNumber - 1, true)}
                  />
                  <Pagination.Next
                    disabled={pageNumber === maxPageNumber}
                    onClick={() => setPage(pageNumber + 1, true)}
                  />
                  <Pagination.Last
                    disabled={pageNumber === maxPageNumber}
                    onClick={() => setPage(999999, true)}
                  />
                </Pagination>
              </div>
            </>
          )}
        </Section>
      )}
    </Layout>
  )
}

export default Market
