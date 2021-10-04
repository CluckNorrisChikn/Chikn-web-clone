import * as React from 'react'
import { Spinner } from 'react-bootstrap'
import { ChiknText, fmtNumber, Section } from '../Common'
import { useGetSupplyQuery } from '../Connect'

const Component = () => {
  const getSupplyQuery = useGetSupplyQuery()
  return (
    <Section className="bg-light">
      <h3>
        <ChiknText /> Minted:{' '}
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
    </Section>
  )
}

export default Component
