import * as React from 'react'
import { Button } from 'react-bootstrap'
import { useQueryClient } from 'react-query'
import styled from 'styled-components'
import { injected } from '../hooks/web3'
import { KEYS, useWeb3Contract } from './Connect'
import GenericToast from './GenericToast'

const FixedWidthButton = styled(Button)`
  min-width: 180px;
`

const isBrowser = () => typeof window !== 'undefined'

// local storage

const LOCAL_STORAGE_KEYS_CONNECTED = 'connected'

const setUserHasConnected = (hasConnected) => {
  if (isBrowser) {
    console.debug(
      `wallet: storing user has connected -> ${hasConnected ? 'Y' : 'N'}`
    )
    if (hasConnected) {
      window.localStorage.setItem(LOCAL_STORAGE_KEYS_CONNECTED, 'Y')
    } else {
      window.localStorage.removeItem(LOCAL_STORAGE_KEYS_CONNECTED)
    }
  }
}
const getUserWasConnectedWhenLastSeen = () => {
  if (isBrowser) {
    const value = window.localStorage.getItem(LOCAL_STORAGE_KEYS_CONNECTED)
    console.debug('storage: connected = ' + value)
    return value === 'Y'
  }
  return false
}

// util

const shortFormAccountNum = (account) => {
  const firstHalf = account.substring(0, 4)
  const lastHalf = account.substring(38)
  return `${firstHalf}...${lastHalf}`
}

const connectToWallet = async (activate) => {
  try {
    await activate(
      injected,
      (e) => console.error('wallet: error encountered #1', e),
      true
    )
    setUserHasConnected(true)
  } catch (err) {
    console.error('wallet: error encountered #2', err)
    setUserHasConnected(false)
    throw err
  }
}

export const ConnectWalletButton = () => {
  const queryClient = useQueryClient()
  const { active, error, account, activate, deactivate } = useWeb3Contract()

  const [notification, setNotification] = React.useState({
    title: '',
    body: '',
    style: 'success',
    autoHide: false,
    show: false
  })

  const connectToWalletWithNotification = (activate) => {
    connectToWallet(activate)
      .then(() => {
        setNotification({
          title: 'Wallet connected',
          body: 'Wallet connected successfully.',
          show: true,
          autoHide: true,
          style: 'success'
        })
      })
      .catch((err) => {
        setNotification({
          title: 'Wallet connect error',
          body: err.message,
          show: true,
          style: 'danger'
        })
      })
  }

  // TODO NICE TO HAVE - auto connect on initial page load - bug: currently reconnected when user disconnects
  // React.useEffect(() => {
  //   // if activate function exists, and user not already active, and the user was active when last seen... try to reconnect.
  //   if (activate && !active && getUserWasConnectedWhenLastSeen) {
  //     console.debug('wallet: reconnecting wallet on initialisation...')
  //     connectToWalletWithNotification(activate)
  //   }
  // }, [activate, active])

  const onClickButton = () => {
    if (!active) {
      connectToWalletWithNotification(activate)
    } else {
      setUserHasConnected(false)
      deactivate()
      setNotification({
        title: 'Wallet disconnected',
        body: 'Wallet successfully disconnected',
        show: true,
        autoHide: true,
        style: 'success'
      })
      // give wallet state time to clear (and propagate)...
      setTimeout(() => queryClient.resetQueries(KEYS.WALLET()), 500)
    }
  }

  return (
    <>
      {/* notification */}
      <GenericToast
        title={notification.title}
        show={notification.show}
        setShow={(show) => setNotification((ps) => ({ ...ps, show }))}
        autoHide={notification.autoHide}
        className={`bg-${notification.style} text-white`}
      >
        {notification.body}
      </GenericToast>

      {/* button */}
      <FixedWidthButton
        variant="outline-primary"
        className="px-3"
        onClick={onClickButton}
        disabled={error}
        title={error?.message}
      >
        {account ? shortFormAccountNum(account) : 'Connect Wallet'}
      </FixedWidthButton>
    </>
  )
}

// TODO Offer them option to add this to their meta mask network?

// import {
//   KEYS,
//   useGetContractQuery,
//   useGetUserWalletAddressQuery
// } from '../components/Connect'
// import { useQueryClient } from 'react-query'
// import {
//   AVALANCHE_TESTNET_PARAMS,
//   AVALANCHE_MAINNET_PARAMS
// } from '../utils/network'

// const addAvalancheNetwork = () => {
//   injected.getProvider().then(provider => {
//     console.log('prorivder injection', provider)
//     provider
//       .request({
//         method: 'wallet_addEthereumChain',
//         params: [AVALANCHE_TESTNET_PARAMS]
//       })
//       .catch((error) => {
//         console.log('Unable to push wallet', error)
//       })
//   })
// }
