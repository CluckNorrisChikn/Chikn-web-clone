import { navigate } from 'gatsby-link'
import * as React from 'react'
import {
  Accordion,
  Alert,
  Button,
  ButtonGroup,
  Col,
  Form,
  Row,
  ToggleButton,
  ToggleButtonGroup
} from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import { FaSync } from 'react-icons/fa'
import { useQueryClient } from 'react-query'
import {
  ChickenCardMarketplaceSummary,
  ChickenCardShimmerx4,
  ConnectWalletPrompt,
  ConnectWalletPromptText
} from '../components/ChickenCard'
import { ChiknText, Section, StackRow } from '../components/Common'
import {
  getErrorMessage,
  KEYS,
  useGetAllSalesToken,
  useGetAllTokensForSaleQuery,
  useGetSupplyQuery,
  useWeb3Contract
} from '../components/Connect'
import Layout from '../components/Layout'
import metadata from '../components/traits/metadata.json'
import traitsdata from '../components/traits/combinations.json'
import { stringArraysNotEqual } from '../components/utils/utils'

const TraitsSelector = ({
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
        id="properties"
        onChange={(selected) => {
          setValues(selected)
          updateParent(selected)
          if (selected.length > 0) ref.current.toggleMenu(true)
        }}
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
  const queryClient = useQueryClient()
  const { active } = useWeb3Contract()
  const { data: forSaleTokens = [] } = useGetAllSalesToken()
  const [filterSalesStatus, setFilterSalesStatus] = React.useState('for_sale')
  const [filters, setFilters] = React.useState({})
  const { data: { minted } = {} } = useGetSupplyQuery()

  // todo pagination?
  const chikns = React.useMemo(() => {
    let array = traitsdata

    // create new map of ONLY tokens that are for sale...
    if (filterSalesStatus === 'for_sale') {
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
      .slice(0, 20)
      .map((t) => t.token)
  }, [
    minted,
    filterSalesStatus,
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

  return (
    <Layout pageName="Wallet">
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

      {/* wallet not connected */}
      {!active && (
        <Section className="border bg-white" center={true}>
          <span>Please connect your wallet, to view the market.</span>
        </Section>
      )}

      {/* filters */}
      {active && (
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Filters</Accordion.Header>
            <Accordion.Body className="p-4">
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
              <h5>Properties</h5>
              <Row>
                {Object.entries(metadata).map(([layer, traits]) => (
                  <Col xs={12} sm={12} md={6} lg={4} key={layer}>
                    <Form.Group>
                      <Form.Label className="mt-2 mb-1 text-capitalize">
                        {layer}
                      </Form.Label>
                      <TraitsSelector
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

      {/* search results */}
      {active && (
        <Section className="border bg-white" center={true}>
          {/* no data */}
          {chikns.length === 0 && <h5>No chikns available.</h5>}

          {/* success */}
          {chikns.length > 0 && (
            <Row className="gy-3 gx-3">
              {chikns.map((token) => (
                <Col key={token} sm={6} md={4} lg={3}>
                  <ChickenCardMarketplaceSummary
                    tokenId={token}
                    onClick={() => navigate(`/chikn/${token}`)}
                  />
                </Col>
              ))}
            </Row>
          )}
        </Section>
      )}
    </Layout>
  )
}

export default Market
