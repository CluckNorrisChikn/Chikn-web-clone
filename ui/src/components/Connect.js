import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector'
import axios from 'axios'
import { Contract, utils } from 'ethers'
import React from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import ChickenRun from '../../contract/Chicken_Fuji.json'
import { isProd } from './Common'

const axiosClient = axios.create({
  baseURL: isProd ? '/' : 'https://chickenrun-git-dev-mountainpass.vercel.app'
})

export const getErrorMessage = (error, deactivate) => {
  const { constructor: { name } = {} } = error
  const errorName = name || typeof error
  let errorMessage = null
  if (error.response && error.response.data && error.response.data.message) {
    errorMessage = error.response.data.message
  } else {
    errorMessage = error.message
  }
  console.error(`${errorName} - ${errorMessage}`)

  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
  } else if (error instanceof UnsupportedChainIdError) {
    return 'You are connected to an unsupported network. Please connect to the Avalanche Mainnet network'
  } else if (error instanceof UserRejectedRequestErrorInjected) {
    return 'Please authorize this website to access your Avalanche account.'
  } else if (errorMessage.startsWith('call revert exception')) {
    return 'Contract not found. Please check you are connected to the Avalanche Mainnet network'
  } else if (errorMessage.startsWith('underlying network changed')) {
    if (typeof deactivate === 'function') deactivate()
    return 'Underlying network changed. Please reconnect your wallet.'
  } else {
    return 'An unknown error occurred. ' + errorMessage
  }
}

// shortern the transactionHash
export const toShort = (value, factor = 5) => {
  const slice = Math.round(value.length / factor)
  return `${value.substring(0, slice)}...${value.substring(value.length - slice, value.length)}`
}

const TIMEOUT_1_MIN = 60 * 1000

export const KEYS = {
  CONTRACT: () => ['contract'],
  CONTRACT_CURRENTSUPPLY: () => ['supply'],
  CONTRACT_TOKEN: (tokenId) => ['token', tokenId],
  RECENT_ACTIVITY: () => ['recent_activity'],
  MARKET: () => ['market'],
  WALLET: () => ['wallet'],
  WALLET_TOKEN: () => ['wallet', 'wallet_token'],
  WALLET_BALANCE: () => ['wallet', 'wallet_balance'],
  TRANSACTION: () => ['transaction']
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
  return useQuery(KEYS.CONTRACT_TOKEN(tokenId), async () => axiosClient.get(`/api/contract/tokens/${tokenId}`).then(res => res.data), {
    cacheTime: TIMEOUT_1_MIN * 30,
    staleTime: TIMEOUT_1_MIN * 30,
    retry: 0
  })
}

/**
 * Get's latest contract activity.
 */
export const useGetRecentActivityQuery = () => {
  return useQuery(KEYS.RECENT_ACTIVITY(), async () => axiosClient.get('/api/contract/recentActivity').then(res => res.data), {
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

// export const useGetUserWalletAddressQuery = () => {
//   const { library, account, error } = useWeb3React()
//   const queryClient = useQueryClient()

//   const [enabledContract, setEnableContract] = React.useState(false)
//   const [currentAddress, setCurrentAddress] = React.useState(null)

//   React.useEffect(() => {
//     if (currentAddress !== account) {
//       setEnableContract(typeof library !== 'undefined' && typeof account !== 'undefined')
//     }
//   }, [library, account, currentAddress, queryClient])

//   return useQuery(
//     KEYS.WALLET(),
//     async () => {
//       let errorMessage = null
//       try {
//         if (error) {
//           errorMessage = getErrorMessage(error)
//         }
//         setCurrentAddress(account)
//         setEnableContract(false) // reset this to false
//         return new Promise((resolve, reject) => {
//           if (errorMessage) reject(errorMessage)
//           resolve({
//             isAuthenticated: true,
//             user: { address: account || '' }
//           })
//         })
//       } catch (err) {
//         console.error('Error getting user wallet address', err)
//         setEnableContract(false) // reset this to false
//         return new Promise((resolve, reject) => {
//           reject(errorMessage)
//         })
//       }
//     },
//     {
//       enabled: enabledContract
//     }
//   )
// }

export const useGetWalletBalanceQuery = (library, account, enabled = true) => {
  return useQuery(
    KEYS.WALLET_BALANCE(),
    async () => {
      const balance = utils.formatEther(await library.getBalance(account || ''))
      return new Promise((resolve, reject) => {
        resolve({
          balance: balance.toString()
        })
      })
    },
    {
      enabled: !isUndef(account) && enabled,
      cacheTime: TIMEOUT_1_MIN * 10,
      staleTime: TIMEOUT_1_MIN * 10,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false
    }
  )
}

const isUndef = o => typeof o === 'undefined'

export const useGetAllTokensForSaleQuery = (contract, account, enabled = true) => {
  return useQuery(
    KEYS.MARKET(),
    async () => {
      console.debug('refetching tokens for sale', { contract, account, enabled })
      const tokensIds = []
      const tokenCount = await contract.totalSupply()
      for (let i = 1; i <= tokenCount.toNumber(); i++) {
        tokensIds.push({
          tokenId: i
        })
        // const token = await contract.allChickenRun(i)
        // tokensIds.push({
        //   currentOwner: token.currentOwner,
        //   forSale: token.forSale,
        //   mintedBy: token.mintedBy,
        //   numberOfTransfers: token.numberOfTransfers.toNumber(),
        //   perchHeight: token.perchHeight.toNumber(),
        //   previousPrice: utils.formatEther(token.previousPrice),
        //   price: utils.formatEther(token.price),
        //   tokenId: token.tokenId.toNumber()
        // })
      }
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

export const useGetWalletTokensQuery = (contract, account, enabled = true) => {
  return useQuery(
    KEYS.WALLET_TOKEN(),
    async () => {
      console.debug('refetching wallet tokens', { contract, account, enabled })
      const tokensIds = []
      const tokenCount = await contract.balanceOf(account)

      // const ownedTokensEvents = contract.filters.Transfer(null, account)
      // const results = await contract.queryFilter(ownedTokensEvents, 0, 'latest')
      // console.debug('wallet tokens', results)

      // // TODO go through all the tx on the block - sounds expensive, no? - Nick
      // await Promise.all(
      //   results.map(async current => {
      //     const ownerToken = await contract.ownerOf(current.args.tokenId)
      //     if (ownerToken === account) {
      //       /** @type {BigNumber} */
      //       const tokenId = current.args?.tokenId
      //       tokensIds.push(tokenId.toNumber())
      //     }
      //   })
      // )
      for (let i = 0; i < tokenCount.toNumber(); i++) {
        const token = await contract.tokenOfOwnerByIndex(account, i)
        tokensIds.push(token.toNumber())
      }
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

export const useMintTokenMutation = (contract, enabled = true) => {
  const queryClient = useQueryClient()
  return useMutation(async ({ countOfChickens, totalPrice }) => {
    return new Promise((resolve, reject) => {
      contract.mint(countOfChickens, { value: utils.parseUnits(totalPrice, 'ether') })
        .then((tx) => {
          console.log('mint tx', tx)
          resolve({
            ...tx
          })
        })
        .catch((err) => {
          console.log('error', err)
          reject(err)
        })
    })
  }, {
    enabled: !isUndef(contract) && enabled,
    onSuccess: async (data) => {
      console.log('Tx mint request', data)
      // cancel anything in tranaction queue
      await queryClient.cancelQueries(KEYS.TRANSACTION())
      queryClient.setQueryData(KEYS.TRANSACTION(), data)
    }
  })
}

export const useSetTokenSalePriceMutation = (contract, enabled = true) => {
  const queryClient = useQueryClient()
  return useMutation(async ({ tokenId, newPrice, isForSale }) => {
    return new Promise((resolve, reject) => {
      const ethPrice = utils.parseUnits(newPrice.toString(), 'ether')
      contract.setPriceForSale(tokenId, ethPrice, isForSale)
        .then((tx) => {
          console.log('Set sale price tx', tx)
          resolve({
            ...tx
          })
        })
        .catch((err) => {
          console.log('set sale price error', err)
          reject(err)
        })
    })
  }, {
    enabled: !isUndef(contract) && enabled,
    onSuccess: async (data) => {
      // cancel anything in tranaction queue
      await queryClient.cancelQueries(KEYS.TRANSACTION())
      queryClient.setQueryData(KEYS.TRANSACTION(), data)
    }
  })
}

export const useBuyTokenMutation = (contract, enabled = true) => {
  const queryClient = useQueryClient()
  return useMutation(async ({ tokenId, salePrice }) => {
    return new Promise((resolve, reject) => {
      contract.buyToken(tokenId, { value: utils.parseUnits(salePrice.toString(), 'ether') })
        .then((tx) => {
          console.log('Buy token tx', tx)
          resolve({
            ...tx
          })
        })
        .catch((err) => {
          console.log('Buy token error', err)
          reject(err)
        })
    })
  }, {
    enabled: !isUndef(contract) && enabled,
    onSuccess: async (data) => {
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
