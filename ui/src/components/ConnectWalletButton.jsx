import * as React from 'react'
import { Button, Spinner } from 'react-bootstrap'
// import { useGetWalletQuery } from './ContractApi'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import GlobalStoreContext from './Connect'
import { injected } from '../hooks/web3'

const FixedWidthButton = styled(Button)`
  min-width: 180px;
`

const shortFormAccountNum = (account) => {
  const firstHalf = account.address.substring(0, 4)
  const lastHalf = account.address.substring(38)
  return `${firstHalf}...${lastHalf}`
}

export const ConnectWalletButton = () => {
  const { user, activatingConnector, setActivatingConnector } = React.useContext(GlobalStoreContext)
  const { connector, activate, active, deactivate } = useWeb3React()

  const activating = activatingConnector === injected
  const connected = connector === injected

  const onClickButton = () => {
    if (!(user && active)) {
      setActivatingConnector(injected)
      activate(injected, undefined, true)
    } else {
      deactivate()
    }
  }

  // const getWalletQuery = useGetWalletQuery()
  return (
    <FixedWidthButton
      variant="outline-primary"
      className="px-3"
      onClick={onClickButton}
    >
      {activating && connected && !user
        ? (
          <Spinner animation="border" size="sm" />
        )
        : (
          (user && active)
            ? shortFormAccountNum(user)
            : 'Connect Wallet'
        )}
    </FixedWidthButton>
  )
}
