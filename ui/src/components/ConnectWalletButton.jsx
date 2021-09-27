import * as React from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { useGetWalletQuery } from './Api'
import styled from 'styled-components'

const FixedWidthButton = styled(Button)`
  min-width: 180px;
`

export const ConnectWalletButton = () => {
  const getWalletQuery = useGetWalletQuery()
  return (
    <FixedWidthButton
      disabled={getWalletQuery.isFetching}
      variant="outline-primary"
      className="px-3"
    >
      {getWalletQuery.isFetching
        ? (
        <Spinner animation="border" size="sm" />
          )
        : (
            'Connect Wallet'
          )}
    </FixedWidthButton>
  )
}
