/* eslint-disable no-unused-vars */
import { navigate } from 'gatsby-link'
import * as React from 'react'
import { Alert, Button, Col, Row, Pagination } from 'react-bootstrap'
import { FaSync } from 'react-icons/fa'
import { useQueryClient } from 'react-query'
import {
  ChickenCardShimmerx4,
  ChickenCardWalletSummary,
} from '../components/ChickenCard'
import { ChiknText, Section, StackRow } from '../components/Common'
import {
  getErrorMessage,
  KEYS,
  useGetWalletTokensQuery,
  useWeb3Contract,
} from '../components/Connect'
import Layout from '../components/Layout'

const IndexPage = () => {
  const queryClient = useQueryClient()
  const { contract, account, active, deactivate } = useWeb3Contract()
  const useWalletTokens = useGetWalletTokensQuery(contract, account, active)

  const scrollToTopRef = React.useRef()

  const { data: tokens = [] } = useWalletTokens

  // handles all the pagination!
  const PAGE_SIZE = 16
  const [pageNumber, setInternalPageNumber] = React.useState(0)
  const maxPageNumber = React.useMemo(() => {
    const total = tokens.length
    const remainder = total % PAGE_SIZE
    const maxPage = parseInt(total / PAGE_SIZE) + (remainder > 0 ? 0 : -1)
    return maxPage
  }, [tokens])

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
      <StackRow className="justify-content-between">
        <h1 ref={scrollToTopRef}>Wallet</h1>
        <div>
          <Button
            title="Refresh"
            variant="light"
            disabled={!active}
            onClick={() => queryClient.invalidateQueries(KEYS.WALLET_TOKEN())}
          >
            <FaSync />
          </Button>
        </div>
      </StackRow>
      <Section className="border bg-white">
        {/* wallet disconnected */}
        {!active && (
          <span>
            Please connect your wallet, to view your <ChiknText />.
          </span>
        )}

        {/* wallet loading */}
        {active && useWalletTokens.isFetching && <ChickenCardShimmerx4 />}

        {/* wallet error */}
        {active && !useWalletTokens.isFetching && useWalletTokens.isError && (
          <Alert variant="danger">
            {getErrorMessage(useWalletTokens.error, deactivate)}
          </Alert>
        )}

        {/* wallet loaded - no tokens */}
        {active &&
          !useWalletTokens.isFetching &&
          useWalletTokens.isSuccess &&
          tokens.length === 0 && <h5>No tokens found in your wallet.</h5>}

        {/* wallet loaded - no tokens */}
        {active &&
          !useWalletTokens.isFetching &&
          useWalletTokens.isSuccess &&
          tokens.length > 0 && (
          <>
            <h5>You own {tokens.length.toLocaleString()} chikn</h5>
            <Row className="gy-3 gx-3 mt-4">
              {tokens
                .slice(pageNumber * PAGE_SIZE, (pageNumber + 1) * PAGE_SIZE)
                .sort((a, b) => a - b)
                .map((tokenId) => (
                  <Col key={tokenId} sm={6} md={4} lg={3}>
                    <ChickenCardWalletSummary
                      tokenId={tokenId}
                      backLink={'/wallet'}
                      backLabel={'Back to Wallet'}
                    />
                  </Col>
                ))}
            </Row>
          </>
        )}
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
      </Section>
    </Layout>
  )
}

export default IndexPage
