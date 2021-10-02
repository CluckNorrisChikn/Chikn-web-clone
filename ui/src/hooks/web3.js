import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 43114, 43113, 43112]
})

export const useEagerConnect = () => {
  const { activate, active, connector } = useWeb3React()

  const [tried, setTried] = useState(false)

  useEffect(() => {
    if (connector === injected) {
      injected.isAuthorized().then((isAuthorized) => {
        if (isAuthorized) {
          activate(injected, undefined, true).catch(() => {
            setTried(true)
          })
        } else {
          setTried(true)
        }
      })
    }
  }, [activate, connector])

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true)
    }
  }, [tried, active])

  return tried
}

export const useInactiveListener = (suppress = false) => {
  const { active, error } = useWeb3React()

  useEffect(() => {
    const { ethereum } = window
    if (ethereum) ethereum.autoRefreshOnNetworkChange = true
  }, [active, error, suppress])
}
