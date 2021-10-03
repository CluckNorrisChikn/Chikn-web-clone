import * as React from 'react'
import { Button, Spinner } from 'react-bootstrap'
// import { useGetWalletQuery } from './ContractApi'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { KEYS, useGetContractQuery, useGetUserWalletAddressQuery } from '../components/Connect'
import { injected } from '../hooks/web3'
import { useQueryClient } from 'react-query'
import { AVALANCHE_TESTNET_PARAMS, AVALANCHE_MAINNET_PARAMS } from '../utils/network'

const FixedWidthButton = styled(Button)`
  min-width: 180px;
`

const shortFormAccountNum = (account) => {
  const firstHalf = account.address.substring(0, 4)
  const lastHalf = account.address.substring(38)
  return `${firstHalf}...${lastHalf}`
}

export const ConnectWalletButton = () => {
  const queryClient = useQueryClient()
  const { library, activate, active, deactivate } = useWeb3React()

  const useContract = useGetContractQuery()
  const useUserWallet = useGetUserWalletAddressQuery()

  const { data: { user = null } = {} } = useUserWallet

  React.useEffect(() => {
    if (library) {
      queryClient.resetQueries(KEYS.CONTRACT())
    }
  }, [library, queryClient])

  const onClickButton = async() => {
    // no contract
    if (!user || !active) {
      await activate(injected, undefined, true)
    } else {
      deactivate()
    }
  }

  // Offer them option to add this to their meta mask network?
  const addAvalancheNetwork = () => {
    injected.getProvider().then(provider => {
      console.log('prorivder injection', provider)
      provider
        .request({
          method: 'wallet_addEthereumChain',
          params: [AVALANCHE_TESTNET_PARAMS]
        })
        .catch((error) => {
          console.log('Unable to push wallet', error)
        })
    })
  }

  // const getWalletQuery = useGetWalletQuery()
  return (
    <FixedWidthButton
      variant="outline-primary"
      className="px-3"
      onClick={onClickButton}
    >
      {
        useContract.isFetching || useUserWallet.isFetching
          ? (
            <Spinner animation="border" size="sm" />
          )
          : (useUserWallet.isSuccess && active
            ? shortFormAccountNum(user)
            : 'Connect Wallet')
      }
    </FixedWidthButton>
  )
}
