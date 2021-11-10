import * as React from 'react'
import { Spinner } from 'react-bootstrap'
import { ChiknText, fmtNumber, Section } from '../Common'
import { useGetSupplyQuery, useWeb3Contract } from '../Connect'

const Component = ({ type = 'public' }) => {
  const { active } = useWeb3Contract()
  const getSupplyQuery = useGetSupplyQuery()
  const { data: { minted, gbminted, gbMintLimit, publicMintLimit } = {} } =
    getSupplyQuery

  // local properties
  const isGBMint = type === 'gb'
  const maxAllocation = isGBMint ? gbMintLimit : publicMintLimit
  const mintedCount = isGBMint ? gbminted : minted
  // const remainingChikn = isGBMint
  //   ? gbMintLimit - gbminted
  //   : publicMintLimit - minted

  return (
    <Section className="bg-light">
      {active && (
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
            `${fmtNumber(mintedCount)} / ${fmtNumber(maxAllocation)}`}
          {getSupplyQuery.isError && '-'}
        </h3>
      )}

      {!active && <div>Please connect your wallet to view.</div>}
    </Section>
  )
}

export default Component
