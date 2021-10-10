import { navigate } from 'gatsby-link'
import * as React from 'react'
import { Alert, Col, Row } from 'react-bootstrap'
import ChickenCard, {
  ChickenCardShimmer,
  ChickenCardShimmerx4
} from '../ChickenCard'
import { Section, StackCol } from '../Common'
import { getErrorMessage, useGetRecentActivityQuery } from '../Connect'

const MINTED_FROM_ADDRESS = '0x0000000000000000000000000000000000000000'

const Component = () => {
  const getRecentActivityQuery = useGetRecentActivityQuery()
  const { data: tokens = [] } = getRecentActivityQuery
  return (
    <Section className="border bg-white">
      <StackCol className="gap-3">
        <h3>Recent Activity</h3>

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
                  <ChickenCard
                    tokenId={tokenId}
                    size="sm"
                    onClick={() => navigate(`/wallet/${tokenId}`)}
                    status={from === MINTED_FROM_ADDRESS ? 'Minted' : 'Sold'}
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
