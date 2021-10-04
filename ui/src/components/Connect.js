import React from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector'
import ChickenRun from '../../contract/Chicken_Fuji.json'
//  TODO: use mainnet contract
import { BigNumber, Contract, utils, Event } from 'ethers'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import axios from 'axios'

const axiosClient = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/' : 'https://chickenrun-git-dev-mountainpass.vercel.app'
})

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

// shortern the transactionHash
export const toShort = (value, factor = 5) => {
  const slice = Math.round(value.length / factor)
  return `${value.substring(0, slice)}...${value.substring(value.length - slice, value.length)}`
}

const TIMEOUT_1_MIN = 60 * 1000

const MINT_PRICE = '2'

export const KEYS = {
  CONTRACT: () => ['CONTRACT'],
  CONTRACT_CURRENTSUPPLY: () => ['supply'],
  CONTRACT_TOKEN: (tokenId) => ['token', tokenId],
  WALLET: () => ['WALLET'],
  WALLET_TOKEN: () => ['WALLET', 'WALLET_TOKEN'],
  WALLET_BALANCE: () => ['WALLET', 'WALLET_BALANCE'],
  TRANSACTION: () => ['TRANSACTION']
}

/**
 * Get's the minted / total count of tokens.
 */
export const useGetSupplyQuery = () => {
  return useQuery(KEYS.CONTRACT_CURRENTSUPPLY(), async () => axiosClient.get('/api/contract/supply').then(res => res.data), {
    cacheTime: TIMEOUT_1_MIN,
    staleTime: TIMEOUT_1_MIN
  })
}
/**
 * Get's metadata for the given token.
 */
export const useGetTokenQuery = (tokenId) => {
  return useQuery(KEYS.CONTRACT_TOKEN(), async () => axiosClient.get(`/api/contract/tokens/${tokenId}`).then(res => res.data), {
    cacheTime: TIMEOUT_1_MIN * 30,
    staleTime: TIMEOUT_1_MIN * 30,
    retry: 0
  })
}

// export const getWalletTokensQuery = () => {
//   return useQuery()
// }

/**
 * @returns {}
 */
export const useWeb3Contract = () => {
  const [state, setState] = React.useState({})
  const web3react = useWeb3React()

  React.useEffect(() => {
    console.debug('watch contract', web3react)
    let contract
    if (web3react.library) {
      const { abi, address } = ChickenRun
      contract = new Contract(address, abi, web3react.library.getSigner())
    }
    setState({ ...web3react, contract })
  }, [web3react])

  return state
}

export const useGetContractQuery = () => ({})
export const getContractQuery = () => ({})

export const useGetUserWalletAddressQuery = () => {
  const { library, account, error } = useWeb3React()
  const queryClient = useQueryClient()

  const [enabledContract, setEnableContract] = React.useState(false)
  const [currentAddress, setCurrentAddress] = React.useState(null)

  React.useEffect(() => {
    if (currentAddress !== account) {
      setEnableContract(typeof library !== 'undefined' && typeof account !== 'undefined')
    }
  }, [library, account, currentAddress, queryClient])

  return useQuery(
    KEYS.WALLET(),
    async () => {
      let errorMessage = null
      try {
        if (error) {
          errorMessage = getErrorMessage(error)
        }
        setCurrentAddress(account)
        setEnableContract(false) // reset this to false
        return new Promise((resolve, reject) => {
          if (errorMessage) reject(errorMessage)
          resolve({
            isAuthenticated: true,
            user: { address: account || '' }
          })
        })
      } catch (err) {
        console.error('Error getting user wallet address', err)
        setEnableContract(false) // reset this to false
        return new Promise((resolve, reject) => {
          reject(errorMessage)
        })
      }
    },
    {
      enabled: enabledContract
    }
  )
}

export const useGetWalletBalanceQuery = () => {
  const { library, account, error } = useWeb3React()

  const [enabledContract, setEnableContract] = React.useState(false)
  const [currentAddress, setCurrentAddress] = React.useState(null)

  React.useEffect(() => {
    if (currentAddress !== account) {
      setEnableContract(typeof library !== 'undefined')
    }
  }, [library, account, currentAddress])

  return useQuery(
    KEYS.WALLET_BALANCE(),
    async () => {
      let errorMessage = null
      let balance = null
      try {
        if (error) {
          errorMessage = getErrorMessage(error)
        } else {
          balance = utils.formatEther(await library.getBalance(account || ''))
        }
        setCurrentAddress(account)
        setEnableContract(false) // reset this to false

        return new Promise((resolve, reject) => {
          if (errorMessage) reject(errorMessage)
          resolve({
            balance: balance.toString()
          })
        })
      } catch (err) {
        console.error('Error getting user wallet balance', err)
        setEnableContract(false) // reset this to false
        return new Promise((resolve, reject) => {
          reject(errorMessage)
        })
      }
    },
    {
      enabled: enabledContract
    }
  )
}

const isUndef = o => typeof o === 'undefined'

export const useGetWalletTokensQuery = (contract, account, enabled = true) => {
  return useQuery(
    KEYS.WALLET_TOKEN(),
    async () => {
      console.debug('refetching wallet tokens', { contract, account, enabled })
      const tokensIds = []
      const ownedTokensEvents = contract.filters.Transfer(null, account)
      const results = await contract.queryFilter(ownedTokensEvents, 0, 'latest')
      console.debug('wallet tokens', results)

      // TODO go through all the tx on the block - sounds expensive, no? - Nick
      await Promise.all(
        results.map(async current => {
          const ownerToken = await contract.ownerOf(current.args.tokenId)
          if (ownerToken === account) {
            /** @type {BigNumber} */
            const tokenId = current.args?.tokenId
            tokensIds.push(tokenId.toNumber())
          }
        })
      )
      return tokensIds
    },
    {
      enabled: !isUndef(contract) && !isUndef(account) && enabled,
      cacheTime: TIMEOUT_1_MIN * 30,
      staleTime: TIMEOUT_1_MIN * 30,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false
    }
  )
}

export const useMintTokenMutation = () => {
  const useContract = useGetContractQuery()
  const [enabledContract, setEnableContract] = React.useState(false)
  const queryClient = useQueryClient()

  React.useEffect(() => {
    setEnableContract(useContract.isSuccess)
  }, [useContract])

  return useMutation(async (tokenURI) => {
    const { contract } = useContract.isSuccess ? useContract.data : {}
    console.debug(`Minting token with the ${tokenURI}`)
    const tx = await contract.mint(tokenURI, { value: utils.parseUnits(MINT_PRICE, 'ether') })
    console.log('long tx', tx)
    return new Promise((resolve, reject) => {
      resolve({
        ...tx
      })
    })
  }, {
    enabled: enabledContract,
    onSuccess: async (data) => {
      console.log('Tx mint request', data)

      // cancel anything in tranaction queue
      await queryClient.cancelQueries(KEYS.TRANSACTION())
      queryClient.setQueryData(KEYS.TRANSACTION(), data)
    }
  })
}

// create a place holder transaction so that any mutation can push the transaction to
export const useStoreWorkingTxQuery = (currentTx) => {
  return useQuery(
    KEYS.TRANSACTION(),
    () => {
      return new Promise((resolve, reject) => {
        resolve({})
      })
    })
}
