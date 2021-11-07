import { navigate } from 'gatsby-link'
import * as React from 'react'
import { Accordion, Alert, Button, Col, Form, Row } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import { FaSync } from 'react-icons/fa'
import { useQueryClient } from 'react-query'
import {
  ChickenCardMarketplaceSummary,
  ChickenCardShimmerx4
} from '../components/ChickenCard'
import { ChiknText, Section, StackRow } from '../components/Common'
import {
  getErrorMessage,
  KEYS,
  useGetAllTokensForSaleQuery,
  useWeb3Contract
} from '../components/Connect'
import Layout from '../components/Layout'
import metadata from '../components/traits/metadata.json'
import traitsdata from '../components/traits/traits.json'
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
  const { contract, account, active } = useWeb3Contract()
  const useWalletTokens = useGetAllTokensForSaleQuery(contract, account, active)
  const { data: tokens = [] } = useWalletTokens
  const [filters, setFilters] = React.useState({})

  // todo pagination?
  const chikns = React.useMemo(() => {
    return traitsdata
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
            ~filters.trims.indexOf(t.trim?.toLowerCase()))
        )
      })
      .slice(0, 20)
      .map((t) => t.token)
  }, [filters])

  return (
    <Layout pageName="Wallet">
      <StackRow className="justify-content-between">
        <h1>Market</h1>
        <div>
          <Button
            title="Refresh"
            variant="light"
            disabled={!active}
            onClick={() => queryClient.invalidateQueries(KEYS.MARKET())}
          >
            <FaSync />
          </Button>
        </div>
      </StackRow>

      {/* filters */}
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Filters</Accordion.Header>
          <Accordion.Body className="p-4">
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
                        if (stringArraysNotEqual(selections, filters[layer])) {
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

      <Section className="border bg-white" center={true}>
        {/* no wallet */}
        {!active && (
          <span>
            Please connect your wallet, to view market <ChiknText />.
          </span>
        )}
        {/* loading */}
        {active && useWalletTokens.isFetching && <ChickenCardShimmerx4 />}

        {/* wallet connected - error */}
        {active && !useWalletTokens.isFetching && useWalletTokens.isError && (
          <Alert variant="danger">
            {getErrorMessage(useWalletTokens.error)}
          </Alert>
        )}

        {/* wallet connected - no data */}
        {active &&
          !useWalletTokens.isFetching &&
          useWalletTokens.isSuccess &&
          tokens.length === 0 && <h5>No chikns available.</h5>}

        {/* wallet connected - data */}
        {active &&
          !useWalletTokens.isFetching &&
          useWalletTokens.isSuccess &&
          tokens.length > 0 && (
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
    </Layout>
  )
}

export default Market
