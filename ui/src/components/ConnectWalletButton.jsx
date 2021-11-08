import * as React from 'react'
import { Button } from 'react-bootstrap'
import { useQueryClient } from 'react-query'
import styled from 'styled-components'
import { injected } from '../hooks/web3'
import { KEYS, useWeb3Contract } from './Connect'
import GenericToast from './GenericToast'
import siteConfig from '../../site-config'
import {
  AVALANCHE_TESTNET_PARAMS,
  AVALANCHE_MAINNET_PARAMS
} from '../utils/network'
import { isProd } from '../components/Common'

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
        // too chatty... disabling for now - Nick
        // setNotification({
        //   title: 'Wallet connected',
        //   body: 'Wallet connected successfully.',
        //   show: true,
        //   autoHide: true,
        //   style: 'success'
        // })
      })
      .catch((err) => {
        const { stack } = err
        console.error(
          `Wallet connect error: '${err.constructor?.name}' - ${err.message}`,
          { stack }
        )
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
      setTimeout(() => {
        queryClient.resetQueries(KEYS.WALLET())
        queryClient.resetQueries(KEYS.TOKEN())
      }, 500)
    }
  }

  // Feature: On hover, show a red "Disconnect" button

  const [buttonText, setButtonText] = React.useState('Connect Wallet')

  const onHover = (isHover = false) => {
    if (isHover && account) {
      setButtonText('Disconnect')
    } else {
      setButtonText(account ? shortFormAccountNum(account) : 'Connect Wallet')
    }
  }

  React.useEffect(() => {
    setButtonText(account ? shortFormAccountNum(account) : 'Connect Wallet')
  }, [account, setButtonText])

  const addAvalancheNetwork = () => {
    injected.getProvider().then((provider) => {
      console.log('provider injection', provider)
      provider
        .request({
          method: 'wallet_addEthereumChain',
          params: [isProd ? AVALANCHE_MAINNET_PARAMS : AVALANCHE_TESTNET_PARAMS]
        })
        .catch((error) => {
          console.log('Unable to push wallet', error)
        })
    })
    setNotification({
      title: '',
      body: '',
      style: 'success',
      autoHide: false,
      show: false
    })
  }

  return (
    <>
      {/* notification */}
      <GenericToast
        title={notification.title}
        show={notification.show}
        setShow={(show) => setNotification((ps) => ({ ...ps, show }))}
        autoHide={notification.autoHide}
        className={`bg-${notification.style}`}
      >
        <div>{notification.body}</div>
        {notification.style === 'danger' &&
          notification.body.includes('Unsupported chain') && (
          <div className="d-flex justify-content-center pt-3">
            <Button onClick={addAvalancheNetwork}>SWITCH TO MAINNET</Button>
          </div>
        )}
      </GenericToast>

      {/* button */}
      <FixedWidthButton
        variant="primary"
        className="px-3"
        style={{ minWidth: '182px' }}
        onClick={onClickButton}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        disabled={!siteConfig.featureToggles.connectWalledEnabled}
      >
        {buttonText}
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
