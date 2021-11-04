import { navigate } from 'gatsby-link'
import * as React from 'react'
import { Alert, Col, Row } from 'react-bootstrap'
import {
  ChickenCardRecentActivitySummary,
  ChickenCardShimmerx4
} from '../ChickenCard'
import { Section, StackCol } from '../Common'
import {
  getErrorMessage,
  useGetRecentActivityQuery,
  useWeb3Contract
} from '../Connect'

const Component = () => {
  const { active, contract } = useWeb3Contract()
  const getRecentActivityQuery = useGetRecentActivityQuery({ active, contract })
  const { data: tokens = [] } = getRecentActivityQuery
  return (
    <Section className="border bg-white">
      <StackCol className="gap-3">
        <h3>Recent Activity</h3>

        {!active && <div>Please connect your wallet to view.</div>}

        {/* loader */}
        {getRecentActivityQuery.isLoading && <ChickenCardShimmerx4 />}

        {/* error */}
        {getRecentActivityQuery.isError && (
          <Alert variant="danger">
            {getErrorMessage(getRecentActivityQuery.error)}
          </Alert>
        )}

        {/* success */}
        {getRecentActivityQuery.isSuccess && (
          <Row className="gy-3 gx-3">
            {tokens.slice(0, 4).map(({ from, to, tokenId }) => {
              return (
                <Col key={tokenId} sm={6} md={4} lg={3}>
                  <ChickenCardRecentActivitySummary
                    tokenId={tokenId}
                    from={from}
                    to={to}
                    onClick={() => navigate(`/chikn/${tokenId}`)}
                  />
                </Col>
              )
            })}
          </Row>
        )}
      </StackCol>
    </Section>
  )
}

export default Component
