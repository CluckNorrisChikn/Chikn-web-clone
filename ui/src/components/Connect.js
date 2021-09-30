import React from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector'
import ChickenRun from '../../contract/Chicken_Fuji.json'
import { BigNumber, Contract, utils, Event } from 'ethers'
import { useEagerConnect, useInactiveListener } from '../hooks/web3'

const defaultState = {
  isAuthenticated: false,
  contract: undefined,
  contractDetails: {
    name: null,
    symbol: null,
    address: null
  },
  user: undefined,
  tokensOnSale: [],
  avaxPrice: '0.0',
  activatingConnector: undefined,
  transaction: undefined,
  library: undefined,
  setAuthenticated: () => { },
  setContract: () => { },
  setUser: () => { },
  setTokensOnSale: () => { },
  setAvaxPrice: () => { },
  setActivatingConnector: () => { },
  setTransaction: () => { },
  getUserTokens: () => { },
  buyToken: () => { },
  updateTokensSalePrice: () => { },
  setTokenSale: () => { }
}

export const GlobalStoreContext = React.createContext(defaultState)

// Connector as GlobalContext Provider
export const ConnectStoreProvider = ({ children }) => {
  const [state, setState] = React.useState(() => {
    console.debug('GlobalContext #1 - setting wallet connect')
    return {
      isAuthenticated: false,
      contract: undefined,
      contractDetails: {
        name: null,
        symbol: null,
        address: null
      },
      user: undefined,
      tokensOnSale: [],
      avaxPrice: '0.0',
      activatingConnector: undefined,
      transaction: undefined,
      library: undefined,
      setAuthenticated: (authenticated) => setState(ps => ({ ...ps, isAuthenticated: authenticated })),
      setContract: async (library) => {
        try {
          if (!library) throw new Error('No Web3 Found')
          const abi = ChickenRun.abi
          const address = ChickenRun.address
          const contract = new Contract(address, abi, library.getSigner())
          const name = await contract.name()
          const symbol = await contract.symbol()
          setState(ps => ({
            ...ps,
            library,
            contract,
            contractDetails: {
              name,
              symbol,
              address
            }
          }))
        } catch (err) {
          console.error('Error setting contract - likely no contract found', err)
        }
      },
      setUser: async (contract, user, library, getUserTokens, address) => {
        try {
          if (!library) throw new Error('No Web3 Found')
          if (!contract) throw new Error('No contract found')
          if (!user && !address) throw new Error('No user found')

          const balance = utils.formatEther(await library.getBalance(address || user?.address || ''))
          const ownedTokens = await getUserTokens(contract, library, user, address || user?.address)
          setState(ps => ({
            ...ps,
            isAuthenticated: true,
            user: { address: address || user?.address || '', balance, ownedTokens }
          }))
        } catch (err) {
          console.error('Error setting user', err)
        }
      },
      // setTokensOnSale : (tokenOnSale) =>{}
      setActivatingConnector: (activatingConnector) => {
        setState(ps => ({
          ...ps,
          activatingConnector
        }))
      },
      setTransaction: (transaction) => {
        setState(ps => ({
          ...ps,
          transaction
        }))
      },
      getUserTokens: async (contract, library, user, address) => {
        try {
          if (!library) throw new Error('No Web3 Found')
          if (!contract) throw new Error('No contract found')
          if (!user?.address && !address) throw new Error('No user found')

          const userAddress = address || user?.address
          const ownedTokensEvents = contract.filters.Transfer(null, userAddress)
          const results = await contract.queryFilter(ownedTokensEvents, 0, 'latest')
          console.log('results', results)

          const ownedTokens = new Map()

          await Promise.all(
            results.map(async current => {
              const ownerToken = await contract.ownerOf(current.args.tokenId)

              if (ownerToken === userAddress) {
                const { tokenId, tokenURI, price, numberOfTransfers, forSale } = await contract.allChickenRun(current.args?.tokenId)

                // TODO: check new contract for new attribute
                // lastSalePrice, perchHeight
                ownedTokens.set(tokenURI, {
                  tokenId,
                  price,
                  numberOfTransfers,
                  forSale
                })
              }
            })
          )

          return Array.from(ownedTokens).map(([_, token]) => token)
        } catch (err) {
          console.error('Error getting user tokens', err)
          return []
        }
      }
    }
  })

  const { library, chainId, account, error } = useWeb3React()

  // get the state function
  const { contract, user, getUserTokens, setContract, setUser, activatingConnector } = state

  const getErrorMessage = (error) => {
    console.log(error)

    if (error instanceof NoEthereumProviderError) {
      return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
    } else if (error instanceof UnsupportedChainIdError) {
      return "You're connected to an unsupported network. Please connect to Fuji network" // TODO: change the name to mainnet
    } else if (
      error instanceof UserRejectedRequestErrorInjected
    ) {
      return 'Please authorize this website to access your AVAX account.'
    } else {
      console.error(error)
      return 'An unknown error occurred. Check the console for more details.'
    }
  }

  React.useEffect(() => {
    if (contract && account) {
      setUser(contract, user, library, getUserTokens, account)
    }
    // eslint-disable-next-line
  }, [contract, account])

  React.useEffect(() => {
    if (!chainId || !account || !library) return
    const update = async () => {
      try {
        await setContract(library, chainId)
      } catch (e) {
        console.log('failed to setup user and contract', e)
      }
    }

    update()
    // eslint-disable-next-line
  }, [chainId, account, library])

  const triedEager = useEagerConnect()
  useInactiveListener(!triedEager || !!activatingConnector)

  return (
    <GlobalStoreContext.Provider value={state}>
      {error
        ? (
          <div>
            <div>❌ Something is not right</div>
            <span>{getErrorMessage(error)}</span>
          </div>
        )
        : (
          children
        )
      }
    </GlobalStoreContext.Provider>
  )
}

export default GlobalStoreContext
