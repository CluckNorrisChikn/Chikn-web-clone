import * as React from 'react'
import { Spinner } from 'react-bootstrap'
import { ChiknText, fmtNumber, Section } from '../Common'
import { useGetSupplyQuery, useWeb3Contract } from '../Connect'

const Component = () => {
  const { active } = useWeb3Contract()
  const getSupplyQuery = useGetSupplyQuery()
  return (
    <Section className="bg-light">
      <h3>
        <ChiknText /> minted:{' '}
        {getSupplyQuery.isLoading && (
          <>
            <Spinner animation="border" />
            <span> / </span>
            <Spinner animation="border" />
          </>
        )}
        {getSupplyQuery.isSuccess &&
          `${fmtNumber(getSupplyQuery.data.minted)} / ${fmtNumber(
            getSupplyQuery.data.total
          )}`}
        {getSupplyQuery.isError && '-'}
      </h3>

      {!active && <div>Please connect your wallet to view.</div>}
    </Section>
  )
}

export default Component
